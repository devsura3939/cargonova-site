"use client";

import { corridors, getHub } from "@/data/routes";

/** Deterministic per-corridor load percentage so the board looks alive but stable. */
function loadPct(i: number): number {
  return 46 + ((i * 17 + 3) % 53); // 46…98
}

/** Corridors marked as rail/intermodal for the legend. */
const RAIL_IDS = new Set(["c3", "c5"]);

const ITEMS = corridors.map((c, i) => {
  const from = getHub(c.from)!;
  const to = getHub(c.to)!;
  const mode = RAIL_IDS.has(c.id) ? "rail" : "road";
  return `${from.id.toUpperCase()} → ${to.id.toUpperCase()} · ${from.city.toUpperCase()}–${to.city.toUpperCase()} · ${mode.toUpperCase()} · ${c.transitDays.toUpperCase()} · LOAD ${loadPct(i)}%`;
});

export function OpsTicker() {
  return (
    <div className="group relative overflow-hidden py-3" aria-label="Live corridor departures">
      <div className="flex w-max animate-ticker gap-8 group-hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-8" aria-hidden={copy === 1}>
            {ITEMS.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="flex items-center gap-2.5 whitespace-nowrap font-mono text-[10.5px] uppercase tracking-[0.14em] text-fog-600"
              >
                <span className="h-1 w-1 shrink-0 bg-signal" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
