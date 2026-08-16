"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Shipment } from "@/lib/tracking";
import { cityByName } from "@/lib/geo";
import { useTheme } from "@/lib/theme";

/** Spherical interpolation between two lat/lng — great-circle route. */
function slerp(a: { lat: number; lng: number }, b: { lat: number; lng: number }, t: number): [number, number] {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (d: number) => (d * 180) / Math.PI;
  const φ1 = toRad(a.lat);
  const λ1 = toRad(a.lng);
  const φ2 = toRad(b.lat);
  const λ2 = toRad(b.lng);
  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((φ2 - φ1) / 2) ** 2 +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2,
      ),
    );
  if (d < 1e-6) return [a.lat, a.lng];
  const A = Math.sin((1 - t) * d) / Math.sin(d);
  const B = Math.sin(t * d) / Math.sin(d);
  const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
  const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
  const z = A * Math.sin(φ1) + B * Math.sin(φ2);
  return [toDeg(Math.atan2(z, Math.sqrt(x * x + y * y))), toDeg(Math.atan2(y, x))];
}

function pinIcon(color: string, glyph: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="width:30px;height:30px;transform:translate(-50%,-100%);filter:drop-shadow(0 3px 5px rgb(8 17 31/0.45))">
      <svg viewBox="0 0 24 24" width="30" height="30"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Z" fill="${color}"/><circle cx="12" cy="9" r="2.6" fill="#ffffff"/></svg>
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:12px;color:#fff;font-weight:800">${glyph}</div>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
}

function liveIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="width:22px;height:22px;transform:translate(-50%,-50%)">
      <div style="position:absolute;inset:-8px;border-radius:999px;background:${color};opacity:.25;animation:route-ping 1.8s cubic-bezier(0,0,.2,1) infinite"></div>
      <svg viewBox="0 0 24 24" width="22" height="22" style="filter:drop-shadow(0 2px 3px rgb(8 17 31/0.5))"><rect x="2" y="6" width="14" height="10" rx="2" fill="${color}"/><rect x="16" y="9" width="6" height="7" rx="1.5" fill="${color}"/><circle cx="7" cy="17.5" r="2.5" fill="#0b1f3a"/><circle cx="18" cy="17.5" r="2.5" fill="#0b1f3a"/></svg>
    </div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

export function RouteMap({ shipment }: { shipment: Shipment }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const { theme } = useTheme();
  const dark = theme === "dark";

  const originCity = shipment.origin.split(",")[0]?.trim() ?? "";
  const destCity = shipment.destination.split(",")[0]?.trim() ?? "";
  const origin = cityByName(originCity);
  const dest = cityByName(destCity);
  const resolvable = Boolean(origin && dest);

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !origin || !dest) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false,
    });
    mapRef.current = map;

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

    const a = { lat: origin.lat, lng: origin.lon };
    const b = { lat: dest.lat, lng: dest.lon };

    // Route polyline (great circle, 48 samples).
    const pts: [number, number][] = [];
    for (let i = 0; i <= 48; i++) pts.push(slerp(a, b, i / 48));
    L.polyline(pts, { color: "#1677FF", weight: 3, opacity: 0.85, dashArray: "1 10" }).addTo(map);
    L.polyline(pts, { color: "#2ED3E6", weight: 5, opacity: 0.18 }).addTo(map);

    L.marker([a.lat, a.lng], { icon: pinIcon("#10b981", "A"), title: shipment.origin }).addTo(map);
    L.marker([b.lat, b.lng], { icon: pinIcon("#ff8a3d", "B"), title: shipment.destination }).addTo(map);

    // Checkpoint dots at resolvable locations.
    for (const cp of shipment.checkpoints) {
      const loc = cp.location.split(",")[0]?.trim() ?? "";
      const firstToken = loc.split(/[\s·]+/)[0];
      const city = cityByName(loc) ?? cityByName(firstToken);
      if (city && `${city.name}` !== originCity && `${city.name}` !== destCity) {
        L.circleMarker([city.lat, city.lon], {
          radius: 4,
          color: "#0e5fd8",
          weight: 1,
          fillColor: "#ffffff",
          fillOpacity: 1,
        })
          .addTo(map)
          .bindTooltip(`${cp.label} · ${cp.location}`, { direction: "top", offset: [0, -4] });
      }
    }

    // Live position marker.
    const p = Math.min(100, Math.max(0, shipment.progress)) / 100;
    const [plat, plon] = slerp(a, b, p);
    L.marker([plat, plon], { icon: liveIcon("#1677ff"), zIndexOffset: 1000, title: "Live position" })
      .addTo(map)
      .bindTooltip(`Live position · ${shipment.progress}% complete`, { direction: "top" });

    map.fitBounds(L.latLngBounds([a, b]).pad(0.18), { maxZoom: 9 });

    const resize = () => map.invalidateSize();
    window.addEventListener("resize", resize);
    const raf = requestAnimationFrame(() => map.invalidateSize());

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
      map.remove();
      mapRef.current = null;
    };
  }, [origin?.id, dest?.id, shipment.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Swap to dark tiles when theme changes.
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

  if (!resolvable) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-soft bg-surface-muted/60 text-sm text-muted">
        Route preview unavailable for {shipment.origin} → {shipment.destination}.
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-soft bg-surface-muted shadow-card">
      <div ref={containerRef} className="h-72 w-full sm:h-80" aria-label={`Route map for ${shipment.id}`} />
      <div className="pointer-events-none absolute left-3 top-3 rounded-xl border border-soft bg-surface/90 px-3 py-2 shadow-card backdrop-blur">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-500 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-electric-500" />
          </span>
          Live position
        </p>
        <p className="mt-0.5 font-mono text-xs font-semibold text-strong">
          {shipment.origin} → {shipment.destination}
        </p>
      </div>
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-surface/90 px-2.5 py-1 font-mono text-[11px] font-bold text-strong shadow-card backdrop-blur">
        {shipment.progress}% complete
      </div>
    </div>
  );
}
