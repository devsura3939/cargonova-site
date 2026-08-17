"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { computeLiveFleet, type LiveUnit } from "@/lib/fleet";
import { ports } from "@/data/ports";
import { seaRoutes } from "@/data/sea-routes";
import { airports, borderCrossings } from "@/data/real-infra";
import {
  fetchAircraft,
  fetchWeather,
  aircraftSnapshotAt,
  flightRadarUrl,
  airlineName,
  isCargoAirline,
  type Aircraft,
  type LiveWeather,
  WEATHER_POINTS,
} from "@/lib/live-data";
import { useTheme } from "@/lib/theme";
import { useLang } from "@/lib/i18n";
import { cn, formatEtaLang } from "@/lib/utils";
import {
  X,
  Ship,
  Truck,
  Plane,
  Anchor,
  Navigation,
  Search,
  ExternalLink,
  Radar,
  PackageSearch,
  Activity,
  Thermometer,
  Wind,
  Satellite,
  Landmark,
  Waves,
} from "lucide-react";

const SHIP_COLOR = "#2ED3E6";
const TRUCK_COLOR = "#FF8A3D";
const PORT_COLOR = "#7fb4ff";
const AIR_COLOR = "#C084FC";
const AIRPORT_COLOR = "#A78BFA";
const BORDER_COLOR = "#FBBF24";
const STATS_INTERVAL = 2000;

type Filter = "all" | "ship" | "truck" | "port" | "air";

type FeedEvent = { id: number; kind: string; actor: string; target: string; at: number };

const KIND_COLOR: Record<string, string> = {
  departed: "#2ED3E6",
  berthed: "#7fb4ff",
  midway: "#FF8A3D",
  arrived: "#10b981",
  delivering: "#FF8A3D",
};

const WIND_DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

function windLabel(kmh: number, dirDeg: number): string {
  const idx = Math.round(((dirDeg % 360) + 360) % 360 / 45) % 8;
  return `${kmh} ${WIND_DIRS[idx]}`;
}

type DrawState = {
  units: LiveUnit[];
  aircraft: Aircraft[];
  selectedId: string | null;
  hoverId: string | null;
  searchIds: Set<string>;
  filter: Filter;
  dark: boolean;
  now: number;
};

/* ── Canvas overlay layer ─────────────────────────────────── */

class FleetCanvasLayer extends L.Layer {
  private _owner!: L.Map;
  private _container!: HTMLCanvasElement;
  private _ctx!: CanvasRenderingContext2D;
  private _lastPos = new Map<string, [number, number]>();
  state: DrawState = {
    units: [],
    aircraft: [],
    selectedId: null,
    hoverId: null,
    searchIds: new Set(),
    filter: "all",
    dark: true,
    now: Date.now(),
  };

  onAdd(map: L.Map) {
    this._owner = map;
    this._container = L.DomUtil.create("canvas", "fleet-canvas") as HTMLCanvasElement;
    this._container.style.position = "absolute";
    this._container.style.pointerEvents = "none";
    this._container.style.zIndex = "400";
    map.getPanes().overlayPane.appendChild(this._container);
    this._ctx = this._container.getContext("2d")!;
    map.on("move zoom resize viewreset", this._onMove, this);
    this._reset();
    this._draw();
    return this;
  }

  onRemove(map: L.Map) {
    map.getPanes().overlayPane.removeChild(this._container);
    map.off("move zoom resize viewreset", this._onMove, this);
    return this;
  }

  private _onMove = () => {
    this._reset();
    this._draw();
  };

  private _reset() {
    const topLeft = this._owner.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this._container, topLeft);
    const size = this._owner.getSize();
    const dpr = window.devicePixelRatio || 1;
    this._container.width = Math.round(size.x * dpr);
    this._container.height = Math.round(size.y * dpr);
    this._container.style.width = `${size.x}px`;
    this._container.style.height = `${size.y}px`;
    this._ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  project(lat: number, lon: number): [number, number] {
    const p = this._owner.latLngToContainerPoint([lat, lon]);
    return [p.x, p.y];
  }

  hitTest(x: number, y: number): { kind: "unit"; unit: LiveUnit } | { kind: "air"; craft: Aircraft } | null {
    let best: { kind: "unit"; unit: LiveUnit } | { kind: "air"; craft: Aircraft } | null = null;
    let bestD = Infinity;
    const limit = 20;
    for (const u of this.state.units) {
      if (this.state.filter === "ship" && u.kind !== "ship") continue;
      if (this.state.filter === "truck" && u.kind !== "truck") continue;
      if (this.state.filter === "port" && u.status !== "At Port" && u.status !== "Delivering") continue;
      if (this.state.filter === "air") continue;
      const [px, py] = this.project(u.lat, u.lon);
      const d = Math.hypot(px - x, py - y);
      if (d < limit && d < bestD) {
        bestD = d;
        best = { kind: "unit", unit: u };
      }
    }
    if (this.state.filter === "ship" || this.state.filter === "truck" || this.state.filter === "port") {
      return best;
    }
    for (const a of this.state.aircraft) {
      const [px, py] = this.project(a.lat, a.lon);
      const d = Math.hypot(px - x, py - y);
      if (d < 12 && d < bestD) {
        bestD = d;
        best = { kind: "air", craft: a };
      }
    }
    return best;
  }

  setState(partial: Partial<DrawState>) {
    this.state = { ...this.state, ...partial };
    if (this._owner) this._draw();
  }

  /* ── Drawing ──────────────────────────────────────────── */

  private _draw() {
    const ctx = this._ctx;
    if (!ctx) return;
    const { units, dark, filter, selectedId, hoverId, searchIds, now } = this.state;
    const size = this._owner.getSize();
    ctx.clearRect(0, 0, size.x, size.y);
    const zoom = this._owner.getZoom();

    const inView = (lat: number, lon: number) => {
      const b = this._owner.getBounds();
      return lat >= b.getSouth() - 4 && lat <= b.getNorth() + 4 && lon >= b.getWest() - 6 && lon <= b.getEast() + 6;
    };

    /* Routes — faint lanes */
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const route of seaRoutes) {
      if (!inView(route.waypoints[0][0], route.waypoints[0][1]) && !inView(route.waypoints[route.waypoints.length - 1][0], route.waypoints[route.waypoints.length - 1][1])) continue;
      ctx.beginPath();
      let started = false;
      for (const [lat, lon] of route.waypoints) {
        const [x, y] = this.project(lat, lon);
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = dark ? "rgba(46,211,230,0.10)" : "rgba(22,119,255,0.16)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    /* Ports */
    if (zoom >= 2.5) {
      for (const p of ports) {
        if (!inView(p.lat, p.lon)) continue;
        const [x, y] = this.project(p.lat, p.lon);
        const r = p.tier === "mega" ? 3.4 : p.tier === "major" ? 2.6 : 2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = p.tier === "mega" ? PORT_COLOR : dark ? "rgba(127,180,255,0.55)" : "rgba(22,119,255,0.5)";
        ctx.fill();
        const label = p.tier !== "regional" && zoom >= 3.2;
        if (label) {
          ctx.font = "600 10px Inter, system-ui, sans-serif";
          ctx.fillStyle = dark ? "rgba(160,196,235,0.85)" : "rgba(30,64,120,0.8)";
          ctx.fillText(p.name, x + 5, y + 3);
        }
      }
    }

    /* Airports — real cargo-relevant aerodromes */
    if (zoom >= 3) {
      for (const ap of airports) {
        if (!inView(ap.lat, ap.lon)) continue;
        const [x, y] = this.project(ap.lat, ap.lon);
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = ap.cargo ? AIRPORT_COLOR : dark ? "rgba(167,139,250,0.55)" : "rgba(109,40,217,0.45)";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(0, 0, ap.cargo ? 5 : 3.6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = ap.cargo ? AIRPORT_COLOR : "transparent";
        if (ap.cargo) {
          ctx.beginPath();
          ctx.arc(0, 0, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        if (zoom >= 4.2) {
          ctx.font = "600 9.5px Inter, system-ui, sans-serif";
          ctx.fillStyle = dark ? "rgba(196,181,253,0.9)" : "rgba(91,33,182,0.85)";
          ctx.fillText(ap.iata, x + 7, y + 3);
        }
      }
    }

    /* Border checkpoints — real crossings on our corridors */
    if (zoom >= 4.2) {
      for (const b of borderCrossings) {
        if (!inView(b.lat, b.lon)) continue;
        const [x, y] = this.project(b.lat, b.lon);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = BORDER_COLOR;
        ctx.fillRect(-2.2, -2.2, 4.4, 4.4);
        ctx.restore();
        if (zoom >= 5) {
          ctx.font = "600 9px Inter, system-ui, sans-serif";
          ctx.fillStyle = dark ? "rgba(251,191,36,0.95)" : "rgba(146,64,14,0.9)";
          ctx.fillText(b.name, x + 6, y + 3);
        }
      }
    }

    /* Units */
    const visible = units.filter((u) => {
      if (filter === "ship" && u.kind !== "ship") return false;
      if (filter === "truck" && u.kind !== "truck") return false;
      if (filter === "port" && u.status !== "At Port" && u.status !== "Delivering") return false;
      return inView(u.lat, u.lon);
    });

    /* Trails from last-frame positions */
    for (const u of visible) {
      const prev = this._lastPos.get(u.id);
      if (!prev) continue;
      const [x, y] = this.project(u.lat, u.lon);
      const color = u.kind === "ship" ? SHIP_COLOR : TRUCK_COLOR;
      ctx.beginPath();
      ctx.moveTo(prev[0], prev[1]);
      ctx.lineTo(x, y);
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.globalAlpha = 1;
      this._lastPos.set(u.id, [x, y]);
    }
    for (const u of visible) {
      if (!this._lastPos.has(u.id)) {
        const [x, y] = this.project(u.lat, u.lon);
        this._lastPos.set(u.id, [x, y]);
      }
    }
    // Clean stale trail entries
    if (this._lastPos.size > units.length * 2) {
      const ids = new Set(units.map((u) => u.id));
      for (const id of this._lastPos.keys()) if (!ids.has(id)) this._lastPos.delete(id);
    }

    for (const u of visible) {
      const [x, y] = this.project(u.lat, u.lon);
      const isSel = u.id === selectedId;
      const isHover = u.id === hoverId;
      const isMatch = searchIds.has(u.id);
      const atRest = u.status === "At Port" || u.status === "Delivering";
      const color = u.kind === "ship" ? SHIP_COLOR : TRUCK_COLOR;

      // Search pulse ring
      if (isMatch) {
        const pulse = 6 + 3 * Math.sin(now / 280);
        ctx.beginPath();
        ctx.arc(x, y, 12 + pulse, 0, Math.PI * 2);
        ctx.strokeStyle = dark ? "rgba(255,255,255,0.8)" : "rgba(11,31,58,0.7)";
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      // Selection ring
      if (isSel) {
        ctx.beginPath();
        ctx.arc(x, y, 13, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.9;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, 16.5, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.25;
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else if (isHover) {
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      const s = (isSel ? 1.35 : isHover ? 1.18 : 1) * (u.kind === "ship" ? 7 : 6);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((u.heading * Math.PI) / 180);
      ctx.globalAlpha = atRest ? 0.75 : 1;
      if (u.kind === "ship") {
        // Ship glyph: hull arrow with wake notch
        ctx.shadowColor = color;
        ctx.shadowBlur = isSel ? 12 : 6;
        ctx.fillStyle = atRest ? "#8fb8d9" : color;
        ctx.beginPath();
        ctx.moveTo(s, 0);
        ctx.lineTo(-s * 0.72, s * 0.55);
        ctx.lineTo(-s * 0.3, 0);
        ctx.lineTo(-s * 0.72, -s * 0.55);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fillRect(-s * 0.75, -s * 0.16, s * 0.5, s * 0.32);
      } else {
        // Truck glyph: cab + box
        ctx.shadowColor = color;
        ctx.shadowBlur = isSel ? 10 : 5;
        ctx.fillStyle = color;
        ctx.fillRect(-s, -s * 0.42, s * 1.35, s * 0.84);
        ctx.fillRect(s * 0.35, -s * 0.42, s * 0.6, s * 0.6);
        ctx.shadowBlur = 0;
        ctx.fillStyle = dark ? "#0b1325" : "#ffffff";
        ctx.beginPath();
        ctx.arc(-s * 0.45, s * 0.48, s * 0.3, 0, Math.PI * 2);
        ctx.arc(s * 0.75, s * 0.48, s * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Labels
      if (isSel) {
        ctx.font = "700 12px Inter, system-ui, sans-serif";
        ctx.fillStyle = dark ? "#ffffff" : "#0b1f3a";
        ctx.fillText(u.name, x + 11, y - 9);
        ctx.font = "600 10px ui-monospace, monospace";
        ctx.fillStyle = color;
        ctx.fillText(u.shipment.id, x + 11, y + 4);
      } else if (isHover && zoom >= 2.6) {
        ctx.font = "600 11px Inter, system-ui, sans-serif";
        ctx.fillStyle = dark ? "#e6f3ff" : "#0b1f3a";
        ctx.fillText(u.name, x + 9, y - 6);
      }
    }

    /* Aircraft — real ADS-B positions from OpenSky Network */
    if (filter !== "ship" && filter !== "truck" && filter !== "port") {
      for (const a of this.state.aircraft) {
        if (!inView(a.lat, a.lon)) continue;
        const [x, y] = this.project(a.lat, a.lon);
        const isSelA = a.callsign === selectedId;
        const isHoverA = a.callsign === hoverId;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((a.headingDeg * Math.PI) / 180);
        ctx.globalAlpha = 0.95;
        ctx.shadowColor = AIR_COLOR;
        ctx.shadowBlur = isSelA ? 14 : 6;
        ctx.fillStyle = isCargoAirline(a.callsign.replace(/\d+$/, "")) ? "#F0ABFC" : AIR_COLOR;
        // Paper-plane glyph: fuselage + swept wings
        ctx.beginPath();
        ctx.moveTo(5.2, 0);
        ctx.lineTo(1.4, -2.1);
        ctx.lineTo(-2.6, -1.2);
        ctx.lineTo(-1, 0);
        ctx.lineTo(-2.6, 1.2);
        ctx.lineTo(1.4, 2.1);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.restore();
        if (isSelA) {
          ctx.font = "700 12px Inter, system-ui, sans-serif";
          ctx.fillStyle = dark ? "#ffffff" : "#0b1f3a";
          ctx.fillText(a.callsign, x + 10, y - 8);
          ctx.font = "600 10px ui-monospace, monospace";
          ctx.fillStyle = AIR_COLOR;
          ctx.fillText(`${Math.round((a.altitudeM / 0.3048) / 100) * 100} ft`, x + 10, y + 5);
        } else if (isHoverA && zoom >= 3) {
          ctx.font = "600 11px Inter, system-ui, sans-serif";
          ctx.fillStyle = dark ? "#f3e8ff" : "#3b0764";
          ctx.fillText(a.callsign, x + 8, y - 5);
        }
      }
    }
  }
}

/* ── Component ───────────────────────────────────────────── */

type Selection = { kind: "unit"; unit: LiveUnit } | { kind: "air"; craft: Aircraft };

export function LiveWorldMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<FleetCanvasLayer | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const { theme } = useTheme();
  const { t, lang } = useLang();
  const [filter, setFilter] = useState<Filter>("all");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [fleet, setFleet] = useState<LiveUnit[]>([]);
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [weather, setWeather] = useState<LiveWeather[] | null>(null);
  const [liveSource, setLiveSource] = useState<"loading" | "adsb" | "sim">("loading");
  const [snapshotAt, setSnapshotAt] = useState<number | null>(null);
  const [aisOpen, setAisOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [query, setQuery] = useState("");
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [feed, setFeed] = useState<FeedEvent[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const feedSeqRef = useRef(0);
  const prevUnitsRef = useRef<Map<string, { status: string; bucket: number }>>(new Map());

  const selectedId = selection ? (selection.kind === "unit" ? selection.unit.id : selection.craft.callsign) : null;

  // 1s tick for countdowns / "updated Xs ago" labels.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeAgo = (ms: number) => {
    if (ms < 0) ms = 0;
    const s = Math.round(ms / 1000);
    if (s < 60) return s <= 2 ? t("map.justNow") : `${s}${t("map.secondsAgo")}`;
    return `${Math.floor(s / 60)}${t("map.minutesAgo")}`;
  };

  const etaCountdown = (etaMs: number, nowMs: number) => {
    const left = etaMs - nowMs;
    if (left <= 0) return "—";
    const d = Math.floor(left / 86400000);
    const h = Math.floor((left % 86400000) / 3600000);
    const m = Math.floor((left % 3600000) / 60000);
    if (lang === "ka") {
      const parts: string[] = [];
      if (d) parts.push(`${d}დ`);
      if (h) parts.push(`${h}სთ`);
      if (!d && m) parts.push(`${m}წთ`);
      return parts.length ? parts.join(" ") : `${m}წთ`;
    }
    if (d) return `in ${d}d ${h}h`;
    if (h) return `in ${h}h ${m}m`;
    return `in ${m}m`;
  };

  const dark = theme === "dark";
  const selectedIdRef = useRef<string | null>(selectedId);
  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  /* ── Map bootstrap ─────────────────────────────────── */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [24, 20],
      zoom: 2.4,
      minZoom: 2,
      maxZoom: 9,
      zoomControl: true,
      attributionControl: true,
      worldCopyJump: true,
    });
    mapRef.current = map;

    const tile = L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' },
    ).addTo(map);
    tileRef.current = tile;

    const layer = new FleetCanvasLayer();
    layer.addTo(map);
    layerRef.current = layer;

    // Selection via click hit-test; empty click deselects.
    map.on("click", (e: L.LeafletMouseEvent) => {
      const hit = layer.hitTest(e.containerPoint.x, e.containerPoint.y);
      setSelection(hit);
    });
    map.on("mousemove", (e: L.LeafletMouseEvent) => {
      const hit = layer.hitTest(e.containerPoint.x, e.containerPoint.y);
      setHoverId(hit ? (hit.kind === "unit" ? hit.unit.id : hit.craft.callsign) : null);
      map.getContainer().style.cursor = hit ? "pointer" : "";
    });

    // Real aircraft (OpenSky ADS-B) + real weather (Open-Meteo).
    let alive = true;
    const loadAircraft = async () => {
      if (!alive) return;
      const craft = await fetchAircraft();
      if (!alive) return;
      if (craft) {
        setAircraft(craft);
        setSnapshotAt(aircraftSnapshotAt());
        setLiveSource("adsb");
        layerRef.current?.setState({ aircraft: craft });
      } else {
        setLiveSource((s) => (s === "adsb" ? s : "sim"));
      }
    };
    const loadWeather = async () => {
      if (!alive) return;
      const w = await fetchWeather();
      if (alive && w) setWeather(w);
    };
    loadAircraft();
    loadWeather();
    return () => {
      alive = false;
    };

    const resize = () => map.invalidateSize();
    window.addEventListener("resize", resize);
    const raf = requestAnimationFrame(() => map.invalidateSize());

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
      map.remove();
      mapRef.current = null;
      tileRef.current = null;
      layerRef.current = null;
    };
  }, []);

  /* ── Theme-aware tiles ─────────────────────────────── */
  useEffect(() => {
    const tile = tileRef.current;
    if (!tile) return;
    tile.setUrl(
      dark
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    );
    tile.options.subdomains = dark ? "abcd" : "abc";
  }, [dark]);

  /* ── Live loop: compute each frame, draw, sync stats ── */
  useEffect(() => {
    let raf = 0;
    let lastStats = 0;
    const loop = (nowMs: number) => {
      const now = new Date();
      const units = computeLiveFleet(now);
      const layer = layerRef.current;
      if (layer) {
        layer.setState({
          units,
          selectedId: selectedIdRef.current,
          hoverId,
          filter,
          dark,
          now: nowMs,
        });
      }
      if (nowMs - lastStats > STATS_INTERVAL) {
        lastStats = nowMs;
        setFleet(units);
        setLastUpdate(now);

        // Detect status / milestone changes → rolling live-event feed.
        const prev = prevUnitsRef.current;
        const next = new Map<string, { status: string; bucket: number }>();
        const fresh: FeedEvent[] = [];
        for (const u of units) {
          const bucket = Math.min(9, Math.floor(u.progress * 10));
          next.set(u.id, { status: u.status, bucket });
          const p = prev.get(u.id);
          if (!p) continue;
          const push = (kind: string, actor: string, target: string) => {
            feedSeqRef.current += 1;
            fresh.push({ id: feedSeqRef.current, kind, actor, target, at: Date.now() });
          };
          if (p.status !== u.status) {
            if (u.status === "At Port" || u.status === "Delivering") push("berthed", u.name, u.destination);
            else push("departed", u.name, u.origin);
          } else if (bucket > p.bucket) {
            if (p.bucket <= 1 && bucket >= 2) push("departed", u.name, u.origin);
            else if (p.bucket < 5 && bucket >= 5) push("midway", u.name, u.routeName);
            else if (p.bucket < 9 && bucket >= 9) push("arrived", u.name, u.destination);
          }
        }
        prevUnitsRef.current = next;
        if (fresh.length) setFeed((f) => [...fresh, ...f].slice(0, 12));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [filter, hoverId, dark]);

  /* ── Keep layer selection in sync (panel interactions) ── */
  useEffect(() => {
    layerRef.current?.setState({ selectedId });
  }, [selectedId]);

  const counts = useMemo(
    () => ({
      ship: fleet.filter((u) => u.kind === "ship").length,
      truck: fleet.filter((u) => u.kind === "truck").length,
      port: fleet.filter((u) => u.status === "At Port" || u.status === "Delivering").length,
      air: aircraft.length,
    }),
    [fleet, aircraft],
  );

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const unitHits = fleet
      .filter((u) => u.name.toLowerCase().includes(q) || u.shipment.id.toLowerCase().includes(q) || (u.plate ?? "").toLowerCase().includes(q) || u.origin.toLowerCase().includes(q) || u.destination.toLowerCase().includes(q))
      .slice(0, 5)
      .map((u) => ({ kind: "unit" as const, unit: u }));
    const airHits = aircraft
      .filter((a) => a.callsign.toLowerCase().includes(q) || airlineName(a.callsign.replace(/\d+$/, "")).toLowerCase().includes(q))
      .slice(0, 3)
      .map((a) => ({ kind: "air" as const, craft: a }));
    return [...unitHits, ...airHits].slice(0, 7);
  }, [query, fleet, aircraft]);

  const closePanel = useCallback(() => setSelection(null), []);

  const flyToSelection = useCallback((s: Selection) => {
    setSelection(s);
    setQuery("");
    const [lat, lon] = s.kind === "unit" ? [s.unit.lat, s.unit.lon] : [s.craft.lat, s.craft.lon];
    mapRef.current?.flyTo([lat, lon], Math.max(mapRef.current.getZoom(), 4), { duration: 0.8 });
  }, []);

  // Focus search matches on the canvas
  useEffect(() => {
    layerRef.current?.setState({
      searchIds: new Set(searchResults.map((h) => (h.kind === "unit" ? h.unit.id : h.craft.callsign))),
    });
  }, [searchResults]);

  const filterPills: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: counts.ship + counts.truck + counts.air },
    { id: "ship", label: "Ships", count: counts.ship },
    { id: "truck", label: "Trucks", count: counts.truck },
    { id: "air", label: "Aircraft", count: counts.air },
    { id: "port", label: "At port", count: counts.port },
  ];

  const weatherAt = (name: string) => weather?.find((w) => {
    const p = WEATHER_POINTS.find((pt) => pt.name === name);
    return p ? Math.abs(w.lat - p.lat) < 0.5 && Math.abs(w.lon - p.lon) < 0.5 : false;
  });

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-soft bg-surface-muted shadow-lift">
      <div ref={containerRef} className="absolute inset-0 z-0" aria-label="Live logistics map" />

      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] flex flex-wrap items-start justify-between gap-3 p-3 sm:p-4">
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 rounded-2xl border border-soft bg-surface/90 p-1.5 shadow-card backdrop-blur">
          {filterPills.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
                filter === f.id
                  ? "bg-electric-500 text-white shadow-glow"
                  : "text-ink hover:bg-surface-hover",
              )}
            >
              {t(`map.${f.id}` as never)} ({f.count})
            </button>
          ))}
        </div>

        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-2xl border border-soft bg-surface/90 px-3.5 py-2 shadow-card backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-xs font-bold tracking-wide text-ink">
              {liveSource === "adsb" ? t("map.liveAdsb") : liveSource === "loading" ? t("map.connecting") : t("map.liveSim")}
            </span>
            <span className="hidden text-xs text-muted sm:inline">
              {liveSource === "adsb" && snapshotAt
                ? `${t("map.snapshot")} ${timeAgo(now - snapshotAt)}`
                : lastUpdate
                  ? `${t("map.updated")} ${timeAgo(now - lastUpdate.getTime())}`
                  : ""}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setAisOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-soft bg-surface/90 px-3.5 py-2 text-xs font-bold text-ink shadow-card backdrop-blur transition-colors hover:border-electric-400 hover:text-electric-600 dark:hover:text-electric-400"
          >
            <Waves className="h-3.5 w-3.5 text-cyan-500" />
            {t("map.liveAis")}
          </button>
        </div>
      </div>

      {/* Live events feed */}
      <div className="pointer-events-none absolute bottom-20 left-3 z-[500] hidden w-72 sm:block">
        <div className="overflow-hidden rounded-2xl border border-soft bg-surface/92 shadow-lift backdrop-blur">
          <div className="flex items-center justify-between border-b border-soft px-3.5 py-2">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
              <Activity className="h-3 w-3 text-emerald-500" />
              {t("map.feed")}
            </p>
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500">
              <span className="h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
            </span>
          </div>
          <ul className="max-h-44 space-y-0 overflow-y-auto p-1.5">
            {feed.filter((e) => now - e.at < 180000).length === 0 ? (
              <li className="px-2.5 py-2 text-[11px] text-muted">{t("map.feedEmpty")}</li>
            ) : (
              feed
                .filter((e) => now - e.at < 180000)
                .map((e) => (
                  <li key={e.id} className="flex items-start gap-2 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-surface-hover">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: KIND_COLOR[e.kind] ?? "#2ED3E6" }}
                    />
                    <p className="min-w-0 flex-1 text-[11px] leading-snug text-ink">
                      <span className="font-semibold text-strong">{e.actor}</span>{" "}
                      <span className="text-muted">{t(`map.verb.${e.kind}` as never)}</span>{" "}
                      <span className="font-medium text-strong">{e.target}</span>
                    </p>
                    <span className="shrink-0 font-mono text-[9px] text-muted">{timeAgo(now - e.at)}</span>
                  </li>
                ))
            )}
          </ul>
        </div>
      </div>

      {/* Search */}
      <div className="pointer-events-auto absolute left-3 top-16 z-[500] w-[calc(100%-1.5rem)] max-w-sm sm:left-4 sm:top-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("map.searchPlaceholder")}
            aria-label={t("map.searchPlaceholder")}
            className="h-11 w-full rounded-2xl border border-soft bg-surface/95 pl-10 pr-4 text-sm font-medium text-strong shadow-card backdrop-blur placeholder:text-muted focus:border-electric-500 focus:outline-none focus:ring-4 focus:ring-electric-500/15"
          />
          {searchResults.length > 0 ? (
            <div className="absolute inset-x-0 top-full z-10 mt-1.5 overflow-hidden rounded-2xl border border-soft bg-surface shadow-lift">
              {searchResults.map((hit) => {
                const isUnit = hit.kind === "unit";
                const name = isUnit ? hit.unit.name : hit.craft.callsign;
                const sub = isUnit ? `${hit.unit.origin} → ${hit.unit.destination}` : `${airlineName(hit.craft.callsign.replace(/\d+$/, ""))} · ${hit.craft.originCountry}`;
                const code = isUnit ? hit.unit.shipment.id : `${Math.round((hit.craft.altitudeM / 0.3048) / 100) * 100} ft`;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => flyToSelection(hit)}
                    onMouseEnter={() => setHoverId(name)}
                    onMouseLeave={() => setHoverId(null)}
                    className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-surface-hover"
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        background: isUnit
                          ? hit.unit.kind === "ship"
                            ? "rgba(46,211,230,0.14)"
                            : "rgba(255,138,61,0.14)"
                          : "rgba(192,132,252,0.14)",
                        color: isUnit ? (hit.unit.kind === "ship" ? SHIP_COLOR : TRUCK_COLOR) : AIR_COLOR,
                      }}
                    >
                      {isUnit ? (hit.unit.kind === "ship" ? <Anchor className="h-3.5 w-3.5" /> : <Truck className="h-3.5 w-3.5" />) : <Plane className="h-3.5 w-3.5" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-strong">{name}</span>
                      <span className="block truncate text-xs text-muted">{sub}</span>
                    </span>
                    <span className="shrink-0 font-mono text-[10px] font-bold text-electric-600 dark:text-electric-400">
                      {code}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      {/* Legend */}
      <div className="pointer-events-none absolute bottom-3 left-3 z-[500] hidden rounded-2xl border border-soft bg-surface/90 px-3.5 py-2.5 shadow-card backdrop-blur sm:block">
        <div className="flex flex-col gap-1.5 text-xs">
          <span className="flex items-center gap-2 text-muted">
            <Ship className="h-3.5 w-3.5" style={{ color: SHIP_COLOR }} /> {t("map.ocean")} · {counts.ship}
          </span>
          <span className="flex items-center gap-2 text-muted">
            <Truck className="h-3.5 w-3.5" style={{ color: TRUCK_COLOR }} /> {t("map.road")} · {counts.truck}
          </span>
          <span className="flex items-center gap-2 text-muted">
            <Plane className="h-3.5 w-3.5" style={{ color: AIR_COLOR }} /> {t("map.air")} · {counts.air}
          </span>
          <span className="flex items-center gap-2 text-muted">
            <span className="flex h-3.5 w-3.5 items-center justify-center">
              <span className="h-2.5 w-2.5 rounded-full border" style={{ borderColor: AIRPORT_COLOR }} />
            </span>
            {t("map.airports")}
          </span>
          <span className="flex items-center gap-2 text-muted">
            <span className="h-2 w-2 rotate-45" style={{ background: BORDER_COLOR }} /> {t("map.borders")}
          </span>
          <span className="mt-1 border-t border-soft pt-1.5 text-[10px] leading-snug text-muted">
            {t("map.clickHint")}
          </span>
        </div>
      </div>

      {/* Info panel — fleet unit */}
      {selection?.kind === "unit" ? (() => {
        const selected = selection.unit;
        return (
        <div className="absolute inset-x-3 bottom-3 top-40 z-[600] mx-auto flex max-w-md flex-col overflow-hidden rounded-2xl border border-soft bg-surface shadow-lift sm:inset-x-auto sm:bottom-3 sm:left-auto sm:right-3 sm:top-16 sm:max-w-sm">
          <div
            className="flex items-start justify-between gap-3 px-5 py-4 text-white"
            style={{ background: selected.kind === "ship" ? "linear-gradient(135deg,#083344,#0b1f3a)" : "linear-gradient(135deg,#431407,#1c1917)" }}
          >
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                {selected.kind === "ship" ? (
                  <>
                    <Anchor className="h-3 w-3" /> {selected.flag} · {selected.cls}
                  </>
                ) : (
                  <>
                    <Truck className="h-3 w-3" /> {selected.cls}
                  </>
                )}
              </p>
              <h2 className="mt-1 truncate font-display text-lg font-extrabold tracking-tight">{selected.name}</h2>
              <p className="mt-0.5 text-xs text-navy-300">{selected.type}</p>
            </div>
            <button
              type="button"
              onClick={closePanel}
              aria-label="Close shipment details"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {/* Voyage */}
            <div className="flex items-center gap-2 text-sm">
              <span className="min-w-0 flex-1 truncate font-semibold text-strong">{selected.origin}</span>
              <Navigation className="h-3.5 w-3.5 shrink-0 rotate-45 text-electric-500" />
              <span className="min-w-0 flex-1 truncate text-right font-semibold text-strong">{selected.destination}</span>
            </div>
            <p className="mt-1 text-center text-[10px] font-semibold uppercase tracking-wide text-muted">{selected.routeName}</p>
            <div className="mt-2 rounded-2xl border border-soft bg-surface-muted/60 p-3.5 text-xs">
              <div className="mt-0 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-soft">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${selected.progress}%`, background: selected.kind === "ship" ? SHIP_COLOR : TRUCK_COLOR }}
                  />
                </div>
                <span className="font-mono text-[11px] font-bold text-strong">{selected.progress}%</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <span className="text-muted">{t("map.speed")}</span>
                <span className="text-right font-semibold text-strong">{selected.speedText}</span>
                <span className="text-muted">{t("map.status")}</span>
                <span className="text-right font-semibold text-strong">{t(`map.${selected.status === "In Transit" ? "inTransit" : selected.status === "At Port" ? "atPort" : "delivering"}` as never)}</span>
                <span className="text-muted">{t("map.eta")}</span>
                <span className="text-right font-semibold text-strong">{formatEtaLang(selected.etaMs, lang)}</span>
                <span className="text-muted">{t("map.etaIn")}</span>
                <span className="text-right font-semibold text-strong">{etaCountdown(selected.etaMs, now)}</span>
                <span className="text-muted">{t("map.distLeft")}</span>
                <span className="text-right font-semibold text-strong">
                  {Math.max(0, Math.round(selected.routeKm * (1 - selected.progress / 100))).toLocaleString("en-US")} km
                </span>
                {selected.kind === "ship" ? (
                  <>
                    <span className="text-muted">{t("map.imo")}</span>
                    <span className="text-right font-mono font-semibold text-strong">{selected.imo}</span>
                    <span className="text-muted">{t("map.mmsi")}</span>
                    <span className="text-right font-mono font-semibold text-strong">{selected.mmsi}</span>
                  </>
                ) : null}
                {selected.tempC !== undefined ? (
                  <>
                    <span className="flex items-center gap-1 text-muted">
                      <Thermometer className="h-3 w-3 text-cyan-500" /> {t("map.temp")}
                    </span>
                    <span className="text-right font-semibold text-strong">{selected.tempC} °C</span>
                  </>
                ) : null}
              </div>
            </div>

            {/* Shipment */}
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">{t("map.onBoard")}</p>
            <div className="mt-2 rounded-2xl border border-soft bg-surface-muted/60 p-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-bold text-electric-600 dark:text-electric-400">{selected.shipment.id}</span>
                <span className="rounded-full bg-electric-100 px-2.5 py-0.5 text-[10px] font-bold text-electric-600 dark:bg-electric-500/15 dark:text-electric-400">
                  {selected.kind === "ship" && selected.shipment.teu ? `${selected.shipment.teu} TEU` : selected.shipment.pallets ? `${selected.shipment.pallets} pallets` : "—"}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-strong">{selected.shipment.cargo}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-muted">
                <span>{selected.shipment.weight}</span>
                <span className="truncate pl-3">→ {selected.shipment.consignee}</span>
              </div>
              <Link
                href={`/tracking?code=${selected.shipment.id}`}
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-electric-500 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-electric-400"
              >
                <PackageSearch className="h-3.5 w-3.5" />
                {t("map.trackShipment")}
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            <p className="mt-4 flex items-center gap-1.5 rounded-xl bg-surface-muted px-3 py-2.5 text-[10px] leading-relaxed text-muted">
              <Radar className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
              <span className="min-w-0 flex-1">{t("map.feedNote")}</span>
              {lastUpdate ? (
                <span className="shrink-0 font-mono text-[9px] text-muted">
                  {t("map.updated")} {timeAgo(now - lastUpdate.getTime())}
                </span>
              ) : null}
            </p>
          </div>
        </div>
        );
      })() : selection?.kind === "air" ? (() => {
        const craft = selection.craft;
        const airline = airlineName(craft.callsign.replace(/\d+$/, ""));
        const cargo = isCargoAirline(craft.callsign.replace(/\d+$/, ""));
        const altFt = Math.round((craft.altitudeM / 0.3048) / 100) * 100;
        const speedKmh = Math.round(craft.velocityMs * 3.6);
        return (
          <div className="absolute inset-x-3 bottom-3 top-40 z-[600] mx-auto flex max-w-md flex-col overflow-hidden rounded-2xl border border-soft bg-surface shadow-lift sm:inset-x-auto sm:bottom-3 sm:left-auto sm:right-3 sm:top-16 sm:max-w-sm">
            <div
              className="flex items-start justify-between gap-3 px-5 py-4 text-white"
              style={{ background: "linear-gradient(135deg,#2e1065,#1e1b4b)" }}
            >
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-purple-300">
                  <Plane className="h-3 w-3" /> {t("map.realFlight")} · OpenSky ADS-B
                </p>
                <h2 className="mt-1 font-mono text-lg font-extrabold tracking-tight">{craft.callsign}</h2>
                <p className="mt-0.5 text-xs text-navy-300">
                  {airline} · {craft.originCountry}
                </p>
              </div>
              <button
                type="button"
                onClick={closePanel}
                aria-label="Close flight details"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold"
                  style={{ background: cargo ? "rgba(240,171,252,0.15)" : "rgba(192,132,252,0.12)", color: cargo ? "#F0ABFC" : "#C084FC" }}
                >
                  <Plane className="h-3 w-3" />
                  {cargo ? t("map.cargoFlight") : t("map.passengerFlight")}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold text-emerald-500">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  {t("map.airborne")}
                </span>
              </div>

              <div className="mt-3 rounded-2xl border border-soft bg-surface-muted/60 p-3.5 text-xs">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <span className="text-muted">{t("map.flAlt")}</span>
                  <span className="text-right font-mono font-semibold text-strong">{altFt.toLocaleString("en-US")} ft</span>
                  <span className="text-muted">{t("map.flSpeed")}</span>
                  <span className="text-right font-mono font-semibold text-strong">{speedKmh} km/h</span>
                  <span className="text-muted">{t("map.flHeading")}</span>
                  <span className="text-right font-mono font-semibold text-strong">{Math.round(craft.headingDeg)}°</span>
                  <span className="text-muted">{t("map.flOrigin")}</span>
                  <span className="text-right font-semibold text-strong">{craft.originCountry}</span>
                  <span className="text-muted">{t("map.flPos")}</span>
                  <span className="text-right font-mono font-semibold text-strong">
                    {craft.lat.toFixed(2)}, {craft.lon.toFixed(2)}
                  </span>
                </div>
              </div>

              <a
                href={flightRadarUrl(craft.callsign)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-purple-500 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-purple-400"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {t("map.trackFlight")}
              </a>

              <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-surface-muted px-3 py-2.5 text-[10px] leading-relaxed text-muted">
                <Satellite className="h-3.5 w-3.5 shrink-0 text-purple-400" />
                <span className="min-w-0 flex-1">{t("map.adsbNote")}</span>
              </p>
            </div>
          </div>
        );
      })() : null}

      {/* Live weather — real conditions from Open-Meteo */}
      {!selection && weather ? (
        <div className="pointer-events-none absolute bottom-3 right-3 z-[500] hidden w-64 rounded-2xl border border-soft bg-surface/90 p-3 shadow-card backdrop-blur sm:block">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
            <Wind className="h-3 w-3 text-cyan-500" /> {t("map.liveWeather")}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
            {["Tbilisi", "Istanbul", "Berlin", "Rotterdam"].map((city) => {
              const w = weatherAt(city);
              if (!w) return null;
              return (
                <div key={city} className="flex items-center justify-between gap-1 text-[11px]">
                  <span className="text-muted">{city}</span>
                  <span className="font-mono font-bold text-strong">
                    {w.tempC}° · {windLabel(w.windKmh, w.windDirDeg)}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-2 border-t border-soft pt-1.5 text-[9px] leading-snug text-muted">{t("map.weatherNote")}</p>
        </div>
      ) : null}

      {/* Mobile hint */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-[500] -translate-x-1/2 rounded-full border border-soft bg-surface/90 px-4 py-2 text-xs font-medium text-muted shadow-card backdrop-blur sm:hidden">
        {t("map.mobileHint")}
      </div>

      {/* Real AIS vessels — MarineTraffic free live-map embed */}
      {aisOpen ? (
        <div className="absolute inset-0 z-[700] flex items-center justify-center bg-navy-950/60 p-3 backdrop-blur-sm">
          <div className="relative flex h-[85%] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-soft bg-surface shadow-lift">
            <div className="flex items-center justify-between gap-3 border-b border-soft px-4 py-3">
              <p className="flex items-center gap-2 text-sm font-bold text-strong">
                <Waves className="h-4 w-4 text-cyan-500" /> {t("map.liveAisTitle")}
              </p>
              <button
                type="button"
                onClick={() => setAisOpen(false)}
                aria-label="Close live AIS"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-soft text-ink transition-colors hover:bg-surface-hover"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <iframe
              src="https://www.marinetraffic.com/en/ais/home/centerx:24/centery:40/zoom:4/mmsi:0/embed:true"
              title="MarineTraffic live vessel map"
              className="h-full w-full border-0"
              allowFullScreen
            />
            <p className="border-t border-soft px-4 py-2 text-[10px] text-muted">{t("map.aisNote")}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
