"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NetworkMap } from "@/components/map/NetworkMap";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { corridors, getHub } from "@/data/routes";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Deterministic per-corridor load percentage (stable across renders). */
function loadPct(i: number): number {
  return 46 + ((i * 17 + 3) % 53);
}

const RAIL_IDS = new Set(["c3", "c5"]);

export function CoverageSection() {
  const [active, setActive] = useState<string | null>(corridors[0]?.id ?? null);
  const { t } = useLang();

  return (
    <section className="border-b border-white/10 bg-ink-950">
      <div className="mx-auto max-w-[80rem] px-5 py-16 sm:px-8 lg:py-24">
        <SectionHeading
          index="02"
          eyebrow={t("cov.eyebrow")}
          align="split"
          dark
          title={
            <>
              {t("net.title1")} <span className="text-fog-500">{t("net.title2")}</span>
            </>
          }
          description={t("net.lead")}
          action={
            <Link
              href="/coverage"
              className="group inline-flex items-center gap-2 border border-white/15 px-4 py-3 text-[13px] text-fog-200 transition-colors duration-150 hover:border-white/35 hover:text-fog-50"
            >
              {t("cov.explore")}
              <ArrowRight className="h-3.5 w-3.5 text-signal transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-12 grid gap-px bg-white/[0.06] lg:grid-cols-[1.5fr_1fr]">
          {/* Map */}
          <div className="bg-ink-900 p-2.5 sm:p-3.5">
            <NetworkMap activeCorridorId={active} onSelectCorridor={setActive} />
          </div>

          {/* Departure board */}
          <div className="bg-ink-900">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <p className="label text-fog-500">{t("net.depBoard")}</p>
              <p className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-fog-600">
                {t("net.next7")}
              </p>
            </div>
            <ul className="max-h-[560px] overflow-y-auto">
              {corridors.map((lane, i) => {
                const from = getHub(lane.from)!;
                const to = getHub(lane.to)!;
                const isActive = active === lane.id;
                const mode = RAIL_IDS.has(lane.id) ? "rail" : "road";
                const load = loadPct(i);
                return (
                  <li key={lane.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(lane.id)}
                      onFocus={() => setActive(lane.id)}
                      onClick={() => setActive(isActive ? null : lane.id)}
                      aria-pressed={isActive}
                      className={cn(
                        "group flex w-full items-center gap-3 border-b border-white/[0.07] px-4 py-3 text-left transition-colors duration-150",
                        isActive ? "bg-white/[0.04]" : "hover:bg-white/[0.03]",
                      )}
                    >
                      <span className="w-[74px] shrink-0 font-mono text-[11.5px] text-fog-50 tnum">
                        {from.id.toUpperCase()}–{to.id.toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] text-fog-300">
                          {from.city} → {to.city}
                        </span>
                        <span className="mt-0.5 block font-mono text-[9.5px] uppercase tracking-[0.12em] text-fog-600">
                          {lane.transitDays} · {mode}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="mt-0.5 flex items-center justify-end gap-1.5">
                          <span className="block h-[3px] w-10 bg-white/10">
                            <span
                              className={cn("block h-full", isActive ? "bg-signal-400" : "bg-signal")}
                              style={{ width: `${load}%` }}
                            />
                          </span>
                          <span className="font-mono text-[9px] text-fog-600 tnum">{load}%</span>
                        </span>
                      </span>
                      <ArrowRight
                        className={cn(
                          "h-3.5 w-3.5 shrink-0 transition-colors duration-150",
                          isActive ? "text-signal" : "text-fog-600 group-hover:text-signal",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
            <Link
              href="/quote"
              className="block px-4 py-3 font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.12em] text-fog-600 transition-colors duration-150 hover:text-signal"
            >
              {t("net.selectHint")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
