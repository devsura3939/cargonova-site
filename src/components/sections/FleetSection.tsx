"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Scale, Box, Ruler, Check } from "lucide-react";
import { fleet } from "@/data/fleet";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { useLang } from "@/lib/i18n";

const HIGHLIGHTS = fleet.slice(0, 3);

export function FleetSection() {
  const { t } = useLang();
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

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {HIGHLIGHTS.map((vehicle, i) => (
          <Reveal key={vehicle.slug} delay={0.08 * i}>
            <Link
              href="/fleet"
              className="group block h-full overflow-hidden rounded-3xl border border-soft bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              {/* Vehicle visual */}
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={vehicle.image}
                  alt={`${vehicle.name} in the CargoNova fleet`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-900/35 to-navy-900/15" />
                <span className="absolute left-4 top-4 rounded-full bg-navy-950/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white ring-1 ring-inset ring-white/20 backdrop-blur">
                  {vehicle.category}
                </span>
                <span className="absolute bottom-3 right-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-inset ring-white/25 backdrop-blur">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
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
                  <h3 className="font-display text-xl font-bold text-strong">{vehicle.name}</h3>
                  <ArrowUpRight className="h-4 w-4 text-navy-200 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-electric-500" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 border-y border-soft py-3.5 text-center">
                  <div>
                    <p className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
                      <Scale className="h-3 w-3" /> Payload
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-strong">{vehicle.payload}</p>
                  </div>
                  <div>
                    <p className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
                      <Box className="h-3 w-3" /> Volume
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-strong">{vehicle.volume}</p>
                  </div>
                  <div>
                    <p className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
                      <Ruler className="h-3 w-3" /> Length
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-strong">{vehicle.dimensions.split("×")[0]}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted">{vehicle.ideal}</p>
                <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                  {vehicle.available ? t("fleet.available") : t("fleet.onRequest")}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.15}>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl border border-soft bg-surface p-7 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-electric-100 text-electric-600 sm:flex">
              <Check className="h-5 w-5" />
            </span>
            <p className="text-pretty text-ink">{t("fleet.recommend")}</p>
          </div>
          <Link
            href="/quote"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-navy-850 px-6 text-sm font-semibold text-white transition-colors hover:bg-navy-700 dark:bg-electric-500 dark:hover:bg-electric-400"
          >
            {t("fleet.getRecommendation")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
