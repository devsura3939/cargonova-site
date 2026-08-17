"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, Scale, Box, Ruler, ShieldCheck, Check } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { FleetIcon } from "@/components/icons/FleetIcon";
import { fleet, fleetCategories } from "@/data/fleet";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { useDataT } from "@/lib/data-i18n";

export function FleetExplorer() {
  const [active, setActive] = useState<string>("all");
  const { t, tPhrase } = useLang();
  const { fleetCategory, fleetIdeal } = useDataT();

  const visible = useMemo(
    () => (active === "all" ? fleet : fleet.filter((v) => v.category === active)),
    [active],
  );

  return (
    <Container>
      {/* Filters */}
      <Reveal>
        <div
          role="tablist"
          aria-label="Filter fleet by category"
          className="flex flex-wrap gap-1 border border-soft p-1 dark:border-white/10"
        >
          {fleetCategories.map((cat) => (
            <button
              key={cat.slug}
              role="tab"
              aria-selected={active === cat.slug}
              onClick={() => setActive(cat.slug)}
              className={cn(
                "px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-150",
                active === cat.slug
                  ? "bg-ink-950 text-fog-50 dark:bg-white/10"
                  : "text-muted hover:text-strong dark:hover:text-fog-50",
              )}
            >
              {fleetCategory(cat.slug)}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Vehicles */}
      <div className="mt-10 grid gap-px bg-soft md:grid-cols-2 xl:grid-cols-3 dark:bg-white/[0.08]">
        {visible.map((vehicle, i) => (
          <Reveal key={vehicle.slug} delay={0.05 * (i % 3)} className="h-full">
            <article className="group flex h-full flex-col bg-surface transition-colors duration-150 hover:bg-surface-hover dark:bg-ink-950 dark:hover:bg-white/[0.04]">
              {/* Visual */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={vehicle.image}
                  alt={`${vehicle.name} in the CargoNova fleet`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-900/40 to-ink-900/20" />
                <span className="absolute left-4 top-4 border border-white/15 bg-ink-950/75 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-fog-200 backdrop-blur">
                  {fleetCategory(vehicle.category)}
                </span>
                <span className="absolute bottom-3 right-4 flex h-8 w-8 items-center justify-center border border-white/15 bg-ink-950/60 text-fog-100 backdrop-blur">
                  <FleetIcon name={vehicle.icon} className="h-4 w-4" />
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-semibold text-strong dark:text-fog-50">
                    {tPhrase(vehicle.name)}
                  </h2>
                  <FleetIcon name={vehicle.icon} className="h-5 w-5 text-signal" />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-px border-y border-soft bg-soft dark:border-white/10 dark:bg-white/[0.08]">
                  <div className="bg-surface px-2 py-3 text-center dark:bg-ink-950">
                    <p className="flex items-center justify-center gap-1 font-mono text-[8.5px] uppercase tracking-[0.1em] text-muted">
                      <Scale className="h-3 w-3" /> {t("fleet.label.payload")}
                    </p>
                    <p className="mt-1 font-mono text-[13px] font-semibold text-strong dark:text-fog-50">{vehicle.payload}</p>
                  </div>
                  <div className="bg-surface px-2 py-3 text-center dark:bg-ink-950">
                    <p className="flex items-center justify-center gap-1 font-mono text-[8.5px] uppercase tracking-[0.1em] text-muted">
                      <Box className="h-3 w-3" /> {t("fleet.label.volume")}
                    </p>
                    <p className="mt-1 font-mono text-[13px] font-semibold text-strong dark:text-fog-50">{vehicle.volume}</p>
                  </div>
                  <div className="bg-surface px-2 py-3 text-center dark:bg-ink-950">
                    <p className="flex items-center justify-center gap-1 font-mono text-[8.5px] uppercase tracking-[0.1em] text-muted">
                      <Ruler className="h-3 w-3" /> {t("fleet.label.dimensions")}
                    </p>
                    <p className="mt-1 font-mono text-[11px] font-semibold leading-tight text-strong dark:text-fog-50">{vehicle.dimensions}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="label text-muted">{t("fleet.idealFor")}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink dark:text-fog-300">{fleetIdeal(vehicle.slug)}</p>
                </div>

                <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {vehicle.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted"
                    >
                      <Check className="h-3 w-3 shrink-0 text-status-ok" />
                      {tPhrase(f)}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-center justify-between border-t border-soft pt-4 dark:border-white/10">
                  <p
                    className={cn(
                      "flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em]",
                      vehicle.available ? "text-status-ok" : "text-status-warn",
                    )}
                  >
                    <span
                      className={cn("h-1.5 w-1.5", vehicle.available ? "bg-status-ok" : "bg-status-warn")}
                    />
                    {vehicle.available ? t("fleet.available") : t("fleet.onRequest")}
                  </p>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    <ShieldCheck className="h-3.5 w-3.5" /> {tPhrase("Telematics")}
                  </span>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 border border-dashed border-soft p-8 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-muted dark:border-white/15">
          {t("fleet.empty")}{" "}
          <Link href="/contact" className="text-signal-600 dark:text-signal-400">
            {t("fleet.contactUs")}
          </Link>
          .
        </p>
      ) : null}

      {/* Maintenance note */}
      <Reveal delay={0.1}>
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border border-soft bg-surface-muted p-7 sm:flex-row sm:items-center dark:border-white/10">
          <div className="flex items-center gap-4">
            <span className="hidden h-11 w-11 shrink-0 items-center justify-center bg-signal/12 text-signal-600 sm:flex dark:text-signal-400">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <p className="text-sm leading-relaxed text-ink dark:text-fog-300 sm:text-[15px]">
              <span className="font-semibold text-strong dark:text-fog-50">{t("fleet.inspectedTitle")}</span>{" "}
              {t("fleet.inspectedText")}
            </p>
          </div>
          <Link
            href="/quote"
            className="inline-flex h-10 shrink-0 items-center gap-2 border border-ink-900 bg-ink-900 px-5 text-[13px] font-medium text-fog-50 transition-colors hover:bg-ink-850 dark:border-white/15 dark:bg-white/[0.06] dark:hover:bg-white/10"
          >
            {t("fleet.tellUs")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </Container>
  );
}
