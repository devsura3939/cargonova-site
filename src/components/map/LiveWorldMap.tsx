"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { computeLiveFleet, type LiveUnit } from "@/lib/fleet";
import { ports, type Port } from "@/data/ports";
import { seaRoutes } from "@/data/sea-routes";
import { useTheme } from "@/lib/theme";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  X,
  Ship,
  Truck,
  Anchor,
  Navigation,
  Search,
  ExternalLink,
  Radar,
  PackageSearch,
} from "lucide-react";

const SHIP_COLOR = "#2ED3E6";
const TRUCK_COLOR = "#FF8A3D";
const PORT_COLOR = "#7fb4ff";
const STATS_INTERVAL = 2000;

type Filter = "all" | "ship" | "truck" | "port";

type DrawState = {
  units: LiveUnit[];
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

  hitTest(x: number, y: number): LiveUnit | null {
    let best: LiveUnit | null = null;
    let bestD = Infinity;
    const limit = 20;
    for (const u of this.state.units) {
      if (this.state.filter === "ship" && u.kind !== "ship") continue;
      if (this.state.filter === "truck" && u.kind !== "truck") continue;
      if (this.state.filter === "port" && u.status !== "At Port" && u.status !== "Delivering") continue;
      const [px, py] = this.project(u.lat, u.lon);
      const d = Math.hypot(px - x, py - y);
      if (d < limit && d < bestD) {
        bestD = d;
        best = u;
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
  }
}

/* ── Component ───────────────────────────────────────────── */

export function LiveWorldMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<FleetCanvasLayer | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const { theme } = useTheme();
  const { t } = useLang();
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fleet, setFleet] = useState<LiveUnit[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [query, setQuery] = useState("");
  const [hoverId, setHoverId] = useState<string | null>(null);

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
      setSelectedId(hit ? hit.id : null);
    });
    map.on("mousemove", (e: L.LeafletMouseEvent) => {
      const hit = layer.hitTest(e.containerPoint.x, e.containerPoint.y);
      setHoverId(hit ? hit.id : null);
      map.getContainer().style.cursor = hit ? "pointer" : "";
    });

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

  const selected = useMemo(() => fleet.find((u) => u.id === selectedId) ?? null, [fleet, selectedId]);

  const counts = useMemo(
    () => ({
      ship: fleet.filter((u) => u.kind === "ship").length,
      truck: fleet.filter((u) => u.kind === "truck").length,
      port: fleet.filter((u) => u.status === "At Port" || u.status === "Delivering").length,
    }),
    [fleet],
  );

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return fleet
      .filter((u) => u.name.toLowerCase().includes(q) || u.shipment.id.toLowerCase().includes(q) || (u.plate ?? "").toLowerCase().includes(q) || u.origin.toLowerCase().includes(q) || u.destination.toLowerCase().includes(q))
      .slice(0, 7);
  }, [query, fleet]);

  const closePanel = useCallback(() => setSelectedId(null), []);

  const flyToUnit = useCallback((unit: LiveUnit) => {
    setSelectedId(unit.id);
    setQuery("");
    mapRef.current?.flyTo([unit.lat, unit.lon], Math.max(mapRef.current.getZoom(), 4), { duration: 0.8 });
  }, []);

  // Focus search matches on the canvas
  useEffect(() => {
    layerRef.current?.setState({ searchIds: new Set(searchResults.map((u) => u.id)) });
  }, [searchResults]);

  const filterPills: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: counts.ship + counts.truck },
    { id: "ship", label: "Ships", count: counts.ship },
    { id: "truck", label: "Trucks", count: counts.truck },
    { id: "port", label: "At port", count: counts.port },
  ];

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

        <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-soft bg-surface/90 px-3.5 py-2 shadow-card backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-xs font-bold tracking-wide text-ink">{t("map.live")}</span>
          <span className="hidden text-xs text-muted sm:inline">
            {lastUpdate ? `${lastUpdate.toLocaleTimeString("en-US", { hour12: false })} UTC` : "connecting…"}
          </span>
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
              {searchResults.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => flyToUnit(u)}
                  onMouseEnter={() => setHoverId(u.id)}
                  onMouseLeave={() => setHoverId(null)}
                  className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-surface-hover"
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: u.kind === "ship" ? "rgba(46,211,230,0.14)" : "rgba(255,138,61,0.14)", color: u.kind === "ship" ? SHIP_COLOR : TRUCK_COLOR }}
                  >
                    {u.kind === "ship" ? <Anchor className="h-3.5 w-3.5" /> : <Truck className="h-3.5 w-3.5" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-strong">{u.name}</span>
                    <span className="block truncate text-xs text-muted">
                      {u.origin} → {u.destination}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-[10px] font-bold text-electric-600 dark:text-electric-400">
                    {u.shipment.id}
                  </span>
                </button>
              ))}
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
          <span className="mt-1 border-t border-soft pt-1.5 text-[10px] leading-snug text-muted">
            {t("map.clickHint")}
          </span>
        </div>
      </div>

      {/* Info panel */}
      {selected ? (
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
                <span className="text-right font-semibold text-strong">{selected.eta}</span>
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
              {t("map.feedNote")}
            </p>
          </div>
        </div>
      ) : null}

      {/* Mobile hint */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-[500] -translate-x-1/2 rounded-full border border-soft bg-surface/90 px-4 py-2 text-xs font-medium text-muted shadow-card backdrop-blur sm:hidden">
        {t("map.mobileHint")}
      </div>
    </div>
  );
}
