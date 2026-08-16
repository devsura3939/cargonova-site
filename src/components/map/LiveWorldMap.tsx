"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { computeLiveFleet, type LiveUnit } from "@/lib/fleet";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { X, Ship, Truck, Anchor, Navigation } from "lucide-react";

const SHIP_COLOR = "#1677FF";
const TRUCK_COLOR = "#FF8A3D";
const REFRESH_MS = 2000;

type Filter = "all" | "ship" | "truck";

function markerIcon(unit: LiveUnit, selected: boolean): L.DivIcon {
  const color = unit.kind === "ship" ? SHIP_COLOR : TRUCK_COLOR;
  const glyph =
    unit.kind === "ship"
      ? `<path d="M12 2 L18 20 L12 16 L6 20 Z" fill="${color}"/><rect x="4" y="21" width="16" height="2" rx="1" fill="#ffffff" opacity="0.9"/>`
      : `<rect x="2" y="6" width="14" height="10" rx="2" fill="${color}"/><rect x="16" y="9" width="6" height="7" rx="1.5" fill="${color}"/><circle cx="7" cy="17.5" r="2.5" fill="#0b1f3a"/><circle cx="18" cy="17.5" r="2.5" fill="#0b1f3a"/>`;
  return L.divIcon({
    className: "",
    html: `<div class="fleet-marker${selected ? " fleet-marker--selected" : ""}" style="--fleet-color:${color};transform:translate(-50%,-50%)">
      <div class="fleet-marker__rot" style="transform:rotate(${unit.heading}deg)">
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">${glyph}</svg>
      </div>
      ${selected ? `<span class="fleet-marker__ping" style="background:${color}"></span>` : ""}
    </div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

export function LiveWorldMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const tileRef = useRef<L.TileLayer | null>(null);
  const { theme } = useTheme();
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fleet, setFleet] = useState<LiveUnit[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const dark = theme === "dark";

  /* ── Map bootstrap ─────────────────────────────────── */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const markers = markersRef.current;
    const map = L.map(containerRef.current, {
      center: [24, 18],
      zoom: 2.4,
      minZoom: 2,
      maxZoom: 12,
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

    const resize = () => map.invalidateSize();
    window.addEventListener("resize", resize);
    const raf = requestAnimationFrame(() => map.invalidateSize());

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
      markers.forEach((m) => m.remove());
      markers.clear();
      map.remove();
      mapRef.current = null;
      tileRef.current = null;
    };
  }, []);

  /* ── Theme-aware tiles ─────────────────────────────── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (tileRef.current) map.removeLayer(tileRef.current);
    const tile = L.tileLayer(
      dark
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        subdomains: dark ? "abcd" : undefined,
        attribution: dark
          ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    ).addTo(map);
    tileRef.current = tile;
  }, [dark]);

  /* ── Live feed loop ────────────────────────────────── */
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const units = computeLiveFleet(now);
      setFleet(units);
      setLastUpdate(now);
      const map = mapRef.current;
      if (!map) return;

      const seen = new Set<string>();
      for (const unit of units) {
        seen.add(unit.id);
        const existing = markersRef.current.get(unit.id);
        const latlng: L.LatLngExpression = [unit.lat, unit.lon];
        if (existing) {
          existing.setLatLng(latlng);
          const el = existing.getElement();
          const rot = el?.querySelector(".fleet-marker__rot") as HTMLElement | null;
          if (rot) rot.style.transform = `rotate(${unit.heading}deg)`;
        } else {
          const marker = L.marker(latlng, {
            icon: markerIcon(unit, unit.id === selectedId),
            keyboard: true,
            title: `${unit.name} · ${unit.shipment.id}`,
          }).addTo(map);
          marker.on("click", () => setSelectedId(unit.id));
          markersRef.current.set(unit.id, marker);
        }
      }
      // Rebuild selected marker icon so the ring follows selection changes.
      for (const [id, marker] of markersRef.current) {
        if (id === selectedId) {
          const unit = units.find((u) => u.id === id);
          if (unit) marker.setIcon(markerIcon(unit, true));
        }
      }
      // Remove stale markers (route changes / gone units).
      for (const [id, marker] of markersRef.current) {
        if (!seen.has(id)) {
          marker.remove();
          markersRef.current.delete(id);
        }
      }
    };
    tick();
    const interval = setInterval(tick, REFRESH_MS);
    return () => clearInterval(interval);
  }, [selectedId]);

  /* ── Filter visibility ─────────────────────────────── */
  useEffect(() => {
    for (const [id, marker] of markersRef.current) {
      const kind = id.startsWith("ship-") ? "ship" : "truck";
      const on = filter === "all" || filter === kind;
      if (on) {
        if (!mapRef.current?.hasLayer(marker)) marker.addTo(mapRef.current as L.Map);
      } else if (mapRef.current?.hasLayer(marker)) {
        marker.remove();
      }
    }
  }, [filter]);

  const selected = useMemo(() => fleet.find((u) => u.id === selectedId) ?? null, [fleet, selectedId]);

  const counts = useMemo(
    () => ({
      ship: fleet.filter((u) => u.kind === "ship").length,
      truck: fleet.filter((u) => u.kind === "truck").length,
    }),
    [fleet],
  );

  const closePanel = useCallback(() => setSelectedId(null), []);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-soft bg-surface-muted shadow-lift">
      <div ref={containerRef} className="absolute inset-0 z-0" aria-label="Live logistics map" />

      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] flex flex-wrap items-start justify-between gap-3 p-3 sm:p-4">
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 rounded-2xl border border-soft bg-surface/90 p-1.5 shadow-card backdrop-blur">
          {(
            [
              { id: "all", label: `All (${counts.ship + counts.truck})` },
              { id: "ship", label: `Ships (${counts.ship})` },
              { id: "truck", label: `Trucks (${counts.truck})` },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors",
                filter === f.id
                  ? "bg-electric-500 text-white shadow-glow"
                  : "text-ink hover:bg-surface-hover",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-soft bg-surface/90 px-3.5 py-2 shadow-card backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-xs font-bold tracking-wide text-ink">LIVE</span>
          <span className="hidden text-xs text-muted sm:inline">
            {lastUpdate ? `${lastUpdate.toLocaleTimeString("en-US", { hour12: false })} UTC` : "connecting…"}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="pointer-events-none absolute bottom-3 left-3 z-[500] hidden rounded-2xl border border-soft bg-surface/90 px-3.5 py-2.5 shadow-card backdrop-blur sm:block">
        <div className="flex flex-col gap-1.5 text-xs">
          <span className="flex items-center gap-2 text-muted">
            <Ship className="h-3.5 w-3.5" style={{ color: SHIP_COLOR }} /> Ocean freight · {counts.ship} vessels
          </span>
          <span className="flex items-center gap-2 text-muted">
            <Truck className="h-3.5 w-3.5" style={{ color: TRUCK_COLOR }} /> Road freight · {counts.truck} vehicles
          </span>
          <span className="mt-1 border-t border-soft pt-1.5 text-[10px] leading-snug text-muted">
            Click any vessel or truck to open its shipment.
          </span>
        </div>
      </div>

      {/* Info panel */}
      {selected ? (
        <div className="absolute inset-x-3 bottom-3 top-16 z-[600] mx-auto flex max-w-md flex-col overflow-hidden rounded-2xl border border-soft bg-surface shadow-lift sm:inset-x-auto sm:bottom-3 sm:left-auto sm:right-3 sm:top-16 sm:max-w-sm">
          <div
            className="flex items-start justify-between gap-3 px-5 py-4 text-white"
            style={{ background: selected.kind === "ship" ? "#0b1f3a" : "linear-gradient(135deg,#0b1f3a,#10294d)" }}
          >
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                {selected.kind === "ship" ? (
                  <>
                    <Anchor className="h-3 w-3" /> Vessel · {selected.flag}
                  </>
                ) : (
                  <>
                    <Truck className="h-3 w-3" /> Road vehicle
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
              <span className="min-w-0 flex-1 truncate font-semibold text-strong">
                {selected.origin ? "Origin → Destination" : "—"}
              </span>
            </div>
            <div className="mt-2 rounded-2xl border border-soft bg-surface-muted/60 p-3.5 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0 flex-1 truncate text-muted">
                  {selected.origin ? `Start · ${selected.origin[0].toFixed(1)}°, ${selected.origin[1].toFixed(1)}°` : "—"}
                </span>
                <Navigation className="h-3.5 w-3.5 shrink-0 rotate-45 text-electric-500" />
                <span className="min-w-0 flex-1 truncate text-right text-muted">
                  {selected.destination ? `${selected.destination[0].toFixed(1)}°, ${selected.destination[1].toFixed(1)}°` : "—"}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-soft">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${selected.progress}%`, background: selected.kind === "ship" ? SHIP_COLOR : TRUCK_COLOR }}
                  />
                </div>
                <span className="font-mono text-[11px] font-bold text-strong">{selected.progress}%</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <span className="text-muted">Speed</span>
                <span className="text-right font-semibold text-strong">{selected.speedText}</span>
                <span className="text-muted">Status</span>
                <span className="text-right font-semibold text-strong">{selected.status}</span>
                <span className="text-muted">ETA</span>
                <span className="text-right font-semibold text-strong">{selected.eta}</span>
              </div>
            </div>

            {/* Shipment */}
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Shipment on board</p>
            <div className="mt-2 rounded-2xl border border-soft bg-surface-muted/60 p-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-bold text-electric-600 dark:text-electric-400">{selected.shipment.id}</span>
                <span className="rounded-full bg-electric-100 px-2.5 py-0.5 text-[10px] font-bold text-electric-600 dark:bg-electric-500/15 dark:text-electric-400">
                  {selected.kind === "ship" ? `${selected.shipment.teu} TEU` : `${selected.shipment.pallets} pallets`}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-strong">{selected.shipment.cargo}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-muted">
                <span>{selected.shipment.weight}</span>
                <span className="truncate pl-3">→ {selected.shipment.consignee}</span>
              </div>
            </div>

            <p className="mt-4 rounded-xl bg-surface-muted px-3 py-2.5 text-[10px] leading-relaxed text-muted">
              Live demo feed — positions advance in real time. Connect a real AIS/TMS stream behind{" "}
              <code className="font-mono">computeLiveFleet()</code> when ready.
            </p>
          </div>
        </div>
      ) : null}

      {/* Mobile hint */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-[500] -translate-x-1/2 rounded-full border border-soft bg-surface/90 px-4 py-2 text-xs font-medium text-muted shadow-card backdrop-blur sm:hidden">
        Tap a marker to open shipment info
      </div>
    </div>
  );
}
