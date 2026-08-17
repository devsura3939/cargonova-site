"use client";

import { useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { LANDMASS_D, LANDMASS_VIEWBOX, LANDMASS_PROJECT } from "@/data/landmass";
import { hubs, corridors, corridorPath, getHub, type Corridor, type Hub } from "@/data/routes";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const TIER_COLOR: Record<Hub["tier"], string> = {
  major: "#3f8fff",
  regional: "#2ed3e6",
  gateway: "#ff8a3d",
};

const TIER_KEY: Record<Hub["tier"], string> = {
  major: "cov.tierMajor",
  regional: "cov.tierRegional",
  gateway: "cov.tierGateway",
};

/** Manual label offsets so hub city names never collide on the 1000×769 canvas. */
const LABEL_OFFSET: Record<string, { dx: number; dy: number; anchor: "start" | "middle" | "end" }> = {
  ham: { dx: 9, dy: -5, anchor: "start" },
  ber: { dx: -8, dy: -8, anchor: "end" },
  ams: { dx: -8, dy: -16, anchor: "end" },
  rot: { dx: 9, dy: 10, anchor: "start" },
  pra: { dx: 9, dy: 5, anchor: "start" },
  vie: { dx: -8, dy: 6, anchor: "end" },
  mun: { dx: 9, dy: -8, anchor: "start" },
  zrh: { dx: -8, dy: 8, anchor: "end" },
  par: { dx: -10, dy: 8, anchor: "end" },
  mil: { dx: 11, dy: 12, anchor: "start" },
  war: { dx: 10, dy: -2, anchor: "start" },
  cph: { dx: 0, dy: -14, anchor: "middle" },
  ist: { dx: 0, dy: 17, anchor: "middle" },
  tbs: { dx: 11, dy: -4, anchor: "start" },
  bcn: { dx: 0, dy: 16, anchor: "middle" },
  buk: { dx: 10, dy: -4, anchor: "start" },
};

/** Project lat/lon onto the 1000×769 canvas (must match the generator script). */
function project(lat: number, lon: number): [number, number] {
  const { kx, lonMin, latMax, scale, offX, offY } = LANDMASS_PROJECT;
  return [(lon - lonMin) * kx * scale + offX, (latMax - lat) * scale + offY];
}

/** Catmull-Rom → cubic Bézier through the given points (smooth corridor curves). */
function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

type Tooltip = { kind: "corridor" | "hub"; id: string; x: number; y: number } | null;

export function NetworkMap({
  className,
  activeCorridorId,
  onSelectCorridor,
}: {
  className?: string;
  activeCorridorId?: string | null;
  onSelectCorridor?: (id: string | null) => void;
}) {
  const { t } = useLang();
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<Tooltip>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hubPos = useMemo(() => {
    const map = new Map<string, [number, number]>();
    for (const h of hubs) map.set(h.id, project(h.lat, h.lon));
    return map;
  }, []);

  const corridorGeo = useMemo(
    () =>
      corridors.map((c) => {
        const pts = corridorPath(c).map((h) => project(h.lat, h.lon));
        return { corridor: c, d: smoothPath(pts), pts };
      }),
    [],
  );

  const countries = useMemo(
    () => new Set(hubs.map((h) => h.countries[0] ?? "")).size,
    [],
  );

  const dimmed = activeCorridorId !== null && activeCorridorId !== undefined;
  const active = activeCorridorId ? corridors.find((c) => c.id === activeCorridorId) ?? null : null;

  const tooltipData = (() => {
    if (!tooltip) return null;
    if (tooltip.kind === "corridor") {
      const c = corridors.find((x) => x.id === tooltip.id);
      if (!c) return null;
      const via = corridorPath(c)
        .map((h) => h.city)
        .join(" → ");
      return { title: c.label, sub: `${t("cov.transit")} ${c.transitDays}`, via };
    }
    const h = getHub(tooltip.id);
    if (!h) return null;
    return { title: h.name, sub: `${h.city} · ${h.countries.join(", ")}`, via: t(TIER_KEY[h.tier] as never) };
  })();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tooltip) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip((tt) => (tt ? { ...tt, x: e.clientX - rect.left, y: e.clientY - rect.top } : tt));
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group/panel relative isolate overflow-hidden rounded-3xl border border-white/10 bg-[#050d1c] shadow-lift",
        "dark:border-white/10",
        className,
      )}
    >
      {/* Ambient ocean glow + grid */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-electric-500/14 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-grid-dark opacity-60 [background-size:36px_36px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#050d1c_92%)]" />
      </div>

      {/* Map */}
      <svg
        viewBox={LANDMASS_VIEWBOX}
        className="relative block h-auto w-full"
        role="img"
        aria-label={t("cov.eyebrow")}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id="nm-land" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#17365f" />
            <stop offset="100%" stopColor="#0e2442" />
          </linearGradient>
          <linearGradient id="nm-corridor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3f8fff" />
            <stop offset="55%" stopColor="#2ed3e6" />
            <stop offset="100%" stopColor="#5ee2ef" />
          </linearGradient>
        </defs>

        {/* Land silhouette */}
        <path
          d={LANDMASS_D}
          fill="url(#nm-land)"
          stroke="#7fb0e3"
          strokeOpacity={0.28}
          strokeWidth={0.6}
          strokeLinejoin="round"
        />

        {/* Corridors */}
        {corridorGeo.map(({ corridor: c, d }) => {
          const isHover = hovered === c.id;
          const isActive = activeCorridorId === c.id;
          const highlighted = isHover || isActive;
          const dim = dimmed && !isActive && !isHover;
          const mainColor = isActive ? "#ff8a3d" : isHover ? "#5ee2ef" : "#3f8fff";

          return (
            <g
              key={c.id}
              className="cursor-pointer"
              onMouseEnter={(e) => {
                setHovered(c.id);
                const rect = containerRef.current?.getBoundingClientRect();
                setTooltip({
                  kind: "corridor",
                  id: c.id,
                  x: rect ? e.clientX - rect.left : 60,
                  y: rect ? e.clientY - rect.top : 40,
                });
              }}
              onMouseLeave={() => {
                setHovered((h) => (h === c.id ? null : h));
                setTooltip((tt) => (tt?.kind === "corridor" && tt.id === c.id ? null : tt));
              }}
              onClick={() => onSelectCorridor?.(activeCorridorId === c.id ? null : c.id)}
            >
              {/* Invisible fat hit path for easy hovering */}
              <path d={d} fill="none" stroke="transparent" strokeWidth={16} />
              {/* Glow */}
              <path
                d={d}
                fill="none"
                stroke={mainColor}
                strokeWidth={highlighted ? 7 : 5}
                strokeOpacity={highlighted ? 0.28 : dim ? 0.02 : 0.1}
                strokeLinecap="round"
              />
              {/* Main line */}
              <path
                d={d}
                fill="none"
                stroke={mainColor}
                strokeWidth={highlighted ? 3 : 1.7}
                strokeOpacity={dim ? 0.08 : highlighted ? 1 : 0.5}
                strokeLinecap="round"
              />
              {/* Flowing dashes */}
              <path
                d={d}
                fill="none"
                stroke="#dff4ff"
                strokeWidth={highlighted ? 2 : 1.2}
                strokeOpacity={dim ? 0.05 : highlighted ? 0.95 : 0.5}
                className="netmap-dash"
                style={{ animationDuration: highlighted ? "0.9s" : "1.8s" }}
              />
              {/* Traveling packets */}
              {[0, 0.5].map((off) => (
                <circle
                  key={off}
                  r={2.6}
                  fill={isActive ? "#ffb27a" : "#b8e6ff"}
                  className="netmap-travel"
                  style={{
                    offsetPath: `path('${d}')`,
                    animationDelay: `${off * 3}s`,
                    animationDuration: highlighted ? "4s" : "9s",
                    opacity: dim ? 0 : highlighted ? 1 : 0.55,
                  }}
                />
              ))}
            </g>
          );
        })}

        {/* Hubs */}
        {hubs.map((h) => {
          const [x, y] = hubPos.get(h.id)!;
          const color = TIER_COLOR[h.tier];
          const off = LABEL_OFFSET[h.id] ?? { dx: 8, dy: -4, anchor: "start" as const };
          const isEndpoint = corridors.some(
            (c) => c.from === h.id || c.to === h.id || c.via.includes(h.id),
          );

          return (
            <g
              key={h.id}
              className="cursor-pointer"
              onMouseEnter={(e) => {
                const rect = containerRef.current?.getBoundingClientRect();
                setTooltip({
                  kind: "hub",
                  id: h.id,
                  x: rect ? e.clientX - rect.left : x,
                  y: rect ? e.clientY - rect.top : y,
                });
              }}
              onMouseLeave={() => setTooltip((tt) => (tt?.kind === "hub" && tt.id === h.id ? null : tt))}
            >
              <circle cx={x} cy={y} r={13} fill="transparent" />
              <circle
                cx={x}
                cy={y}
                r={3.4}
                fill={color}
                className="netmap-pulse"
                opacity={0.5}
              />
              <circle cx={x} cy={y} r={3.4} fill="none" stroke={color} strokeOpacity={0.45} strokeWidth={1.2} />
              <circle cx={x} cy={y} r={1.9} fill="#eaf4ff" />
              {/* Only label hub cities that sit on a corridor (keeps the canvas clean) */}
              {isEndpoint ? (
                <text
                  x={x + off.dx}
                  y={y + off.dy}
                  textAnchor={off.anchor}
                  className="select-none font-semibold"
                  fill="#bcd6f2"
                  fontSize={11}
                  style={{ paintOrder: "stroke", stroke: "#050d1c", strokeWidth: 3, letterSpacing: "0.02em" }}
                >
                  {h.city}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>

      {/* Top-left: live badge */}
      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-200">
          {t("cov.live")}
        </span>
      </div>

      {/* Active corridor card */}
      {active ? (
        <div className="absolute left-4 top-14 w-60 rounded-2xl border border-white/10 bg-[#0a1730]/90 p-3.5 shadow-card backdrop-blur-md">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-bold text-white">{active.label}</p>
            <button
              onClick={() => onSelectCorridor?.(null)}
              className="-mr-1 -mt-1 rounded-full p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-1 text-xs text-cyan-300">
            {t("cov.transit")} {active.transitDays}
          </p>
          <p className="mt-1.5 border-t border-white/10 pt-1.5 text-[11px] leading-relaxed text-slate-400">
            {corridorPath(active)
              .map((h) => h.city)
              .join(" → ")}
          </p>
        </div>
      ) : null}

      {/* Top-right: stats */}
      <div className="pointer-events-none absolute right-4 top-4 flex gap-1.5">
        {[
          { n: hubs.length, label: t("cov.hubs") },
          { n: corridors.length, label: t("cov.corridorsShort") },
          { n: countries, label: t("cov.countries") },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-center backdrop-blur-md"
          >
            <p className="font-mono text-sm font-bold leading-none text-white">{s.n}</p>
            <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.14em] text-slate-400">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom-left: tier legend */}
      <div className="pointer-events-none absolute bottom-4 left-4 hidden items-center gap-4 rounded-2xl border border-white/10 bg-[#0a1730]/80 px-4 py-2.5 backdrop-blur-md sm:flex">
        {(Object.keys(TIER_COLOR) as Hub["tier"][]).map((tier) => (
          <span key={tier} className="flex items-center gap-1.5 text-[10px] font-medium text-slate-300">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: TIER_COLOR[tier], boxShadow: `0 0 8px ${TIER_COLOR[tier]}` }}
            />
            {t(TIER_KEY[tier] as never)}
          </span>
        ))}
      </div>

      {/* Bottom-right: hint */}
      <div className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-white/10 bg-[#0a1730]/80 px-3 py-1.5 text-[10px] font-medium text-slate-300 backdrop-blur-md">
        {t("cov.mapHint")}
      </div>

      {/* Floating tooltip */}
      {tooltip && tooltipData ? (
        <div
          className="pointer-events-none absolute z-10 w-52 rounded-xl border border-white/12 bg-[#0c1d3a]/95 p-3 shadow-lift backdrop-blur-md"
          style={{
            left: Math.min(tooltip.x, 9999),
            top: tooltip.y,
            transform: `translate(${tooltip.x > 420 ? "calc(-100% - 14px)" : "14px"}, ${tooltip.y > 260 ? "calc(-100% - 8px)" : "-130%"})`,
          }}
        >
          <p className="text-xs font-bold text-white">{tooltipData.title}</p>
          <p className="mt-0.5 text-[11px] font-semibold text-cyan-300">{tooltipData.sub}</p>
          {tooltipData.via ? (
            <p className="mt-1.5 border-t border-white/10 pt-1.5 text-[10.5px] leading-relaxed text-slate-400">
              {tooltipData.via}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export type { Corridor };
