"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Globe2, MapPin } from "lucide-react";
import { NetworkMap } from "@/components/map/NetworkMap";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { corridors, regions } from "@/data/routes";
import { useLang } from "@/lib/i18n";
import { useDataT } from "@/lib/data-i18n";
import { cn } from "@/lib/utils";

export function CoverageSection() {
  const [active, setActive] = useState<string | null>(null);
  const { t } = useLang();
  const { regionNote } = useDataT();

  return (
    <Section variant="light" id="coverage">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-14">
        {/* Left — heading, regions, CTA */}
        <div>
          <SectionHeading
            eyebrow={t("cov.eyebrow")}
            title={t("cov.title")}
            description={t("cov.sub")}
          />

          <Reveal delay={0.1}>
            <ul className="mt-9 grid gap-3 sm:grid-cols-2">
              {regions.slice(0, 6).map((region, i) => (
                <li
                  key={region.id}
                  className="group flex items-start gap-3 rounded-2xl border border-soft bg-surface p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-electric-400/50 hover:shadow-card"
                >
                  <span className="relative mt-0.5 flex h-2.5 w-2.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-500/40" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-electric-500" />
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-bold text-strong">
                      <span className="truncate">{region.name}</span>
                      {i === 0 ? (
                        <span className="shrink-0 rounded-full bg-electric-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-electric-600">
                          HQ
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{regionNote(region.id)}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href="/coverage"
              className="group mt-8 inline-flex items-center gap-2 rounded-full border border-electric-500/30 bg-electric-100/60 px-5 py-2.5 text-sm font-semibold text-electric-600 transition-all duration-300 hover:bg-electric-500 hover:text-white hover:shadow-glow"
            >
              <Globe2 className="h-4 w-4" />
              {t("cov.explore")}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/* Right — the live network panel */}
        <Reveal delay={0.15}>
          <div className="relative">
            <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-electric-500/12 via-transparent to-cyan-500/12 blur-xl" />
            <NetworkMap
              activeCorridorId={active}
              onSelectCorridor={setActive}
              className="[&_svg]:block"
            />

            {/* Corridor quick-select */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {corridors.map((c) => {
                const on = active === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActive(on ? null : c.id)}
                    aria-pressed={on}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200",
                      on
                        ? "border-electric-500 bg-electric-500 text-white shadow-glow"
                        : "border-soft bg-surface text-ink hover:border-electric-400/60 hover:text-electric-600 dark:hover:text-electric-400",
                    )}
                  >
                    <MapPin className={cn("h-3 w-3", on ? "text-white" : "text-electric-500")} />
                    <span>{c.label}</span>
                    <span className={cn("text-[10px] font-medium", on ? "text-white/80" : "text-muted")}>
                      {c.transitDays}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
