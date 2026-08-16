"use client";

import { useEffect, useRef, useState } from "react";
import type * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { hubs, corridors, corridorPath, type Corridor } from "@/data/routes";
import { useTheme } from "@/lib/theme";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const TIER_COLOR: Record<string, string> = {
  major: "#1677FF",
  regional: "#2ED3E6",
  gateway: "#FF8A3D",
};

export function NetworkMap({
  className,
  activeCorridorId,
  onSelectCorridor,
}: {
  className?: string;
  activeCorridorId?: string | null;
  onSelectCorridor?: (id: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const linesRef = useRef<Map<string, L.Polyline>>(new Map());
  const markersRef = useRef<L.Marker[]>([]);
  const { theme } = useTheme();
  const { t } = useLang();
  const [hovered, setHovered] = useState<string | null>(null);
  const dark = theme === "dark";

  const activeRef = useRef<string | null>(activeCorridorId ?? null);
  const hoveredRef = useRef<string | null>(hovered);
  useEffect(() => {
    activeRef.current = activeCorridorId ?? null;
  }, [activeCorridorId]);
  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  const resizeRef = useRef<(() => void) | null>(null);

  /* ── Bootstrap map (leaflet imported lazily — SSR-safe) ── */
  useEffect(() => {
    let cancelled = false;
    void import("leaflet").then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: [50.5, 15],
        zoom: 5,
        minZoom: 3,
        maxZoom: 9,
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: false,
        worldCopyJump: true,
      });
      mapRef.current = map;

      const tile = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>', subdomains: "abcd" },
      ).addTo(map);
      tileRef.current = tile;

      // Hub markers with labels
      for (const hub of hubs) {
        const color = TIER_COLOR[hub.tier];
        const icon = L.divIcon({
          className: "",
          html: `<div class="network-hub" style="--hub:${color}">
              <span class="network-hub__dot"></span>
              <span class="network-hub__label">${hub.city}</span>
            </div>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });
        const marker = L.marker([hub.lat, hub.lon], { icon, keyboard: true, title: hub.name })
          .addTo(map)
          .bindTooltip(hub.name, { direction: "top", offset: [0, -12], className: "network-tooltip" });
        markersRef.current.push(marker);
      }

      // Corridor lines
      for (const c of corridors) {
        const pts = corridorPath(c).map((h) => [h.lat, h.lon] as [number, number]);
        const line = L.polyline(pts, {
          color: "#1677FF",
          weight: 2,
          opacity: 0.6,
          dashArray: "6 8",
          lineCap: "round",
        }).addTo(map);
        line.on("click", () => {
          const id = activeRef.current === c.id ? null : c.id;
          onSelectCorridor?.(id);
        });
        line.on("mouseover", () => setHovered(c.id));
        line.on("mouseout", () => setHovered((h) => (h === c.id ? null : h)));
        linesRef.current.set(c.id, line);
      }

      const bounds = L.latLngBounds(hubs.map((h) => [h.lat, h.lon] as [number, number]));
      map.fitBounds(bounds.pad(0.18), { animate: false });
      map.getContainer().style.cursor = "default";

      const resize = () => map.invalidateSize();
      resizeRef.current = resize;
      window.addEventListener("resize", resize);
    });

    return () => {
      cancelled = true;
      if (resizeRef.current) window.removeEventListener("resize", resizeRef.current);
      resizeRef.current = null;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        tileRef.current = null;
        linesRef.current.clear();
        markersRef.current = [];
      }
    };
  }, [onSelectCorridor]);

  /* ── Theme tiles ─────────────────────────────────────── */
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

  /* ── Style lines by active / hovered corridor ────────── */
  useEffect(() => {
    for (const [id, line] of linesRef.current) {
      const active = activeRef.current === id;
      const hover = hoveredRef.current === id;
      const dimmed = activeRef.current && !active;
      line.setStyle({
        color: active ? "#FF8A3D" : hover ? "#2ED3E6" : "#1677FF",
        weight: active ? 4 : hover ? 3.5 : 2,
        opacity: dimmed ? 0.15 : active ? 1 : hover ? 0.9 : 0.55,
        dashArray: active || hover ? undefined : "6 8",
      });
      line.bringToFront();
    }
  }, [activeCorridorId, hovered]);

  const active = activeCorridorId ? corridors.find((c) => c.id === activeCorridorId) ?? null : null;

  return (
    <div className={cn("relative w-full overflow-hidden rounded-2xl border border-soft", className)}>
      <div ref={containerRef} className="h-[380px] w-full sm:h-[440px]" aria-label="CargoNova logistics network map across Europe" />

      {/* Active corridor legend */}
      {active ? (
        <div className="pointer-events-none absolute left-3 top-3 rounded-xl border border-soft bg-surface/95 px-4 py-2.5 shadow-card backdrop-blur">
          <p className="text-xs font-bold text-strong">{active.label}</p>
          <p className="mt-0.5 text-[11px] text-muted">
            {t("cov.transit")} {active.transitDays}
          </p>
        </div>
      ) : null}

      {/* Hint */}
      <div className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-soft bg-surface/90 px-3 py-1.5 text-[10px] font-medium text-muted shadow-card backdrop-blur">
        {t("cov.mapHint")}
      </div>
    </div>
  );
}

export type { Corridor };
