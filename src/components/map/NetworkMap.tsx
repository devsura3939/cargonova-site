"use client";

import { useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { hubs, corridors, corridorPath, type Corridor } from "@/data/routes";
import { cn } from "@/lib/utils";

const S = 8; // scale factor from 0-100 coords to SVG space
const VIEW_W = 800;
const VIEW_H = 460;

function toSvg(x: number, y: number): [number, number] {
  return [x * S, y * S + 12];
}

const TIER_COLOR: Record<string, string> = {
  major: "#1677FF",
  regional: "#2ED3E6",
  gateway: "#FF8A3D",
};

export function NetworkMap({
  dark = false,
  className,
  activeCorridorId,
  onSelectCorridor,
}: {
  dark?: boolean;
  className?: string;
  activeCorridorId?: string | null;
  onSelectCorridor?: (id: string | null) => void;
}) {
  const reduceMotion = useReducedMotion();
  const [hoverHub, setHoverHub] = useState<string | null>(null);

  const curves = useMemo(
    () =>
      new Map(
        corridors.map((c) => {
          const pts = corridorPath(c);
          const d = pts
            .map((p, i) => {
              const [x, y] = toSvg(p.x, p.y);
              if (i === 0) return `M ${x} ${y}`;
              const [px, py] = toSvg(pts[i - 1].x, pts[i - 1].y);
              const mx = (px + x) / 2;
              return `C ${mx} ${py}, ${mx} ${y}, ${x} ${y}`;
            })
            .join(" ");
          return [c.id, d] as const;
        }),
      ),
    [],
  );

  const isActive = (id: string) => activeCorridorId === id;

  return (
    <div className={cn("relative w-full", className)}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-label="CargoNova logistics network map showing hubs and corridors across Europe"
        className="h-auto w-full"
      >
        {/* Stylized landmass hints */}
        <g opacity={dark ? 0.5 : 0.65} fill={dark ? "#1e4578" : "#dce7f5"}>
          <path d="M 120 60 C 180 30, 260 40, 300 80 C 340 120, 380 130, 420 110 C 480 80, 560 90, 600 130 L 620 200 C 600 240, 540 250, 480 230 C 430 212, 380 220, 340 250 C 300 285, 240 290, 200 260 C 160 230, 120 220, 100 180 C 85 140, 95 90, 120 60 Z" />
          <path d="M 640 120 C 700 110, 750 140, 760 200 C 770 260, 730 310, 680 320 C 630 330, 590 300, 585 250 C 580 200, 600 140, 640 120 Z" />
          <path d="M 100 300 C 140 280, 200 290, 230 330 C 260 370, 250 420, 210 440 C 170 460, 120 450, 95 410 C 75 370, 75 320, 100 300 Z" />
        </g>
        {/* Grid */}
        <g stroke={dark ? "rgba(255,255,255,0.05)" : "rgba(11,31,58,0.06)"} strokeWidth="1">
          {Array.from({ length: 7 }, (_, i) => (
            <line key={`v${i}`} x1={(i + 1) * 100} y1="0" x2={(i + 1) * 100} y2={VIEW_H} />
          ))}
          {Array.from({ length: 4 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={(i + 1) * 92} x2={VIEW_W} y2={(i + 1) * 92} />
          ))}
        </g>

        {/* Corridors */}
        {corridors.map((c) => {
          const active = isActive(c.id);
          const dimmed = activeCorridorId && !active;
          return (
            <g
              key={c.id}
              className="cursor-pointer"
              onClick={() => onSelectCorridor?.(active ? null : c.id)}
              onMouseEnter={() => onSelectCorridor?.(c.id)}
              onMouseLeave={() => onSelectCorridor?.(null)}
            >
              <path d={curves.get(c.id)} fill="none" stroke={dark ? "#10294d" : "#d6e3f2"} strokeWidth={active ? 10 : 8} strokeLinecap="round" opacity={dimmed ? 0.25 : 1} />
              <path
                d={curves.get(c.id)}
                fill="none"
                stroke={active ? "#FF8A3D" : "#1677FF"}
                strokeWidth={active ? 2.8 : 2}
                strokeLinecap="round"
                strokeDasharray="1 11"
                opacity={dimmed ? 0.15 : active ? 1 : 0.7}
                className={!reduceMotion ? "route-line" : undefined}
              />
              <circle r={active ? 7 : 5} fill="transparent">
                <title>{`${c.label}: ${c.transitDays} transit`}</title>
              </circle>
            </g>
          );
        })}

        {/* Hubs */}
        {hubs.map((hub) => {
          const [x, y] = toSvg(hub.x, hub.y);
          const color = TIER_COLOR[hub.tier];
          const dimmed = activeCorridorId && !corridors.some((c) => isActive(c.id) && (c.from === hub.id || c.to === hub.id || c.via.includes(hub.id)));
          return (
            <g
              key={hub.id}
              transform={`translate(${x} ${y})`}
              onMouseEnter={() => setHoverHub(hub.id)}
              onMouseLeave={() => setHoverHub(null)}
              className="cursor-pointer"
              opacity={dimmed ? 0.25 : 1}
            >
              {!reduceMotion ? (
                <circle
                  r={hoverHub === hub.id ? 16 : 12}
                  fill={color}
                  opacity={0.18}
                  style={{ transition: "r 250ms ease" }}
                />
              ) : (
                <circle r="12" fill={color} opacity="0.18" />
              )}
              <circle r="4.5" fill={color} stroke={dark ? "#08111f" : "#ffffff"} strokeWidth="2" />
              {hoverHub === hub.id ? (
                <g transform="translate(0 -22)" pointerEvents="none">
                  <rect x="-64" y="-22" width="128" height="30" rx="8" fill={dark ? "#0b1f3a" : "#ffffff"} stroke={dark ? "rgba(255,255,255,0.15)" : "#d6e3f2"} />
                  <text textAnchor="middle" y="-3" fontSize="11" fontWeight="700" fill={dark ? "#ffffff" : "#0b1f3a"}>
                    {hub.city}
                  </text>
                </g>
              ) : null}
              <text textAnchor="middle" y="20" fontSize="9.5" fontWeight="600" fill={dark ? "#7a9cc9" : "#7b8794"} letterSpacing="0.4">
                {hub.city}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Active corridor legend */}
      {activeCorridorId ? (
        <div className="pointer-events-none absolute left-3 top-3 rounded-xl border border-soft bg-surface/95 px-4 py-2.5 shadow-card backdrop-blur">
          <p className="text-xs font-bold text-strong">
            {corridors.find((c) => c.id === activeCorridorId)?.label}
          </p>
          <p className="mt-0.5 text-[11px] text-muted">
            Transit: {corridors.find((c) => c.id === activeCorridorId)?.transitDays}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export type { Corridor };
