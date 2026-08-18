"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Scale, Box, Ruler, Check } from "lucide-react";
import { fleet } from "@/data/fleet";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { useLang } from "@/lib/i18n";
import { useDataT } from "@/lib/data-i18n";

const HIGHLIGHTS = fleet.slice(0, 3);

export function FleetSection() {
  const { t } = useLang();
  const { fleetCategory, fleetIdeal } = useDataT();
  return (
    <Section variant="mist" id="fleet">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow={t("fleet.eyebrow")}
          title={t("fleet.title")}
          description={t("fleet.sub")}
        />
        <Reveal delay={0.1}>
          <Link
            href="/fleet"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-electric-600 transition-colors hover:text-electric-500"
          >
            {t("fleet.browse")}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-px bg-soft md:grid-cols-3 dark:bg-white/[0.08]">
        {HIGHLIGHTS.map((vehicle, i) => (
          <Reveal key={vehicle.slug} delay={0.08 * i} className="h-full">
            <Link
              href="/fleet"
              className="group block h-full bg-surface transition-colors duration-150 hover:bg-surface-hover dark:bg-ink-950 dark:hover:bg-white/[0.04]"
            >
              {/* Vehicle visual */}
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={vehicle.image}
                  alt={`${vehicle.name} in the BRB Enterprise fleet`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-900/40 to-ink-900/20" />
                <span className="absolute left-4 top-4 border border-white/15 bg-ink-950/75 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-fog-200 backdrop-blur">
                  {fleetCategory(vehicle.category)}
                </span>
                <span className="absolute bottom-3 right-4 flex h-8 w-8 items-center justify-center border border-white/15 bg-ink-950/60 text-fog-100 backdrop-blur">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                    <rect x="2" y="7" width="11" height="8" rx="1.5" />
                    <path d="M13 9h6l3 3.5V15h-9" />
                    <circle cx="7.5" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                </span>
              </div>

              {/* Specs */}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-xl font-semibold text-strong dark:text-fog-50">{vehicle.name}</h3>
                  <ArrowUpRight className="h-4 w-4 text-muted transition-all duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-px border-y border-soft bg-soft dark:border-white/10 dark:bg-white/[0.08]">
                  <div className="bg-surface px-2 py-3.5 text-center dark:bg-ink-950">
                    <p className="flex items-center justify-center gap-1 font-mono text-[8.5px] uppercase tracking-[0.1em] text-muted">
                      <Scale className="h-3 w-3" /> {t("fleet.label.payload")}
                    </p>
                    <p className="mt-1 font-mono text-[13px] font-semibold text-strong dark:text-fog-50">{vehicle.payload}</p>
                  </div>
                  <div className="bg-surface px-2 py-3.5 text-center dark:bg-ink-950">
                    <p className="flex items-center justify-center gap-1 font-mono text-[8.5px] uppercase tracking-[0.1em] text-muted">
                      <Box className="h-3 w-3" /> {t("fleet.label.volume")}
                    </p>
                    <p className="mt-1 font-mono text-[13px] font-semibold text-strong dark:text-fog-50">{vehicle.volume}</p>
                  </div>
                  <div className="bg-surface px-2 py-3.5 text-center dark:bg-ink-950">
                    <p className="flex items-center justify-center gap-1 font-mono text-[8.5px] uppercase tracking-[0.1em] text-muted">
                      <Ruler className="h-3 w-3" /> {t("fleet.label.length")}
                    </p>
                    <p className="mt-1 font-mono text-[13px] font-semibold text-strong dark:text-fog-50">
                      {vehicle.dimensions.split("×")[0]}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted">{fleetIdeal(vehicle.slug)}</p>
                <p className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-status-ok">
                  <span className="h-1.5 w-1.5 bg-status-ok" />
                  {vehicle.available ? t("fleet.available") : t("fleet.onRequest")}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.15}>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border border-soft bg-surface p-7 sm:flex-row sm:items-center dark:border-white/10">
          <div className="flex items-center gap-4">
            <span className="hidden h-10 w-10 shrink-0 items-center justify-center bg-signal/12 text-signal-600 sm:flex dark:text-signal-400">
              <Check className="h-5 w-5" />
            </span>
            <p className="text-pretty text-ink dark:text-fog-300">{t("fleet.recommend")}</p>
          </div>
          <Link
            href="/quote"
            className="inline-flex h-10 shrink-0 items-center gap-2 bg-signal px-5 text-[13px] font-medium text-ink-950 transition-colors hover:bg-signal-400"
          >
            {t("fleet.getRecommendation")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
