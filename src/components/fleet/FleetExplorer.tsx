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

const CATEGORY_LABEL: Record<string, string> = {
  express: "Express",
  standard: "Standard",
  refrigerated: "Refrigerated",
  heavy: "Heavy Cargo",
};

export function FleetExplorer() {
  const [active, setActive] = useState<string>("all");

  const visible = useMemo(
    () => (active === "all" ? fleet : fleet.filter((v) => v.category === active)),
    [active],
  );

  return (
    <Container>
      {/* Filters */}
      <Reveal>
        <div role="tablist" aria-label="Filter fleet by category" className="flex flex-wrap gap-2">
          {fleetCategories.map((cat) => (
            <button
              key={cat.slug}
              role="tab"
              aria-selected={active === cat.slug}
              onClick={() => setActive(cat.slug)}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200",
                active === cat.slug
                  ? "bg-navy-850 text-white shadow-card"
                  : "border border-soft bg-surface text-ink hover:border-electric-400 hover:text-electric-600 dark:hover:text-electric-400",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Vehicles */}
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((vehicle, i) => (
          <Reveal key={vehicle.slug} delay={0.05 * (i % 3)}>
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-soft bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              {/* Visual */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={vehicle.image}
                  alt={`${vehicle.name} in the CargoNova fleet`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-900/35 to-navy-900/15" />
                <span className="absolute left-4 top-4 rounded-full bg-navy-950/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white ring-1 ring-inset ring-white/20 backdrop-blur">
                  {CATEGORY_LABEL[vehicle.category]}
                </span>
                <span className="absolute bottom-3 right-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-inset ring-white/25 backdrop-blur">
                  <FleetIcon name={vehicle.icon} className="h-5 w-5" />
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-strong">{vehicle.name}</h2>
                  <FleetIcon name={vehicle.icon} className="h-6 w-6 text-electric-500" />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-mist p-3 text-center">
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
                      <Ruler className="h-3 w-3" /> Dimensions
                    </p>
                    <p className="mt-0.5 text-xs font-bold leading-tight text-strong">{vehicle.dimensions}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">Ideal for</p>
                  <p className="mt-1 text-sm leading-relaxed text-navy-800">{vehicle.ideal}</p>
                </div>

                <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {vehicle.features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs font-medium text-muted">
                      <Check className="h-3 w-3 shrink-0 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-center justify-between border-t border-soft pt-4">
                  <p
                    className={cn(
                      "flex items-center gap-2 text-xs font-semibold",
                      vehicle.available ? "text-emerald-600" : "text-orange-500",
                    )}
                  >
                    <span
                      className={cn("h-2 w-2 rounded-full", vehicle.available ? "bg-emerald-500" : "bg-orange-500")}
                    />
                    {vehicle.available ? "Available for booking" : "Booking on request"}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-300">
                    <ShieldCheck className="h-3.5 w-3.5" /> Telematics
                  </span>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-soft bg-surface-muted p-8 text-center text-sm text-muted">
          No vehicles in this category right now — check back soon or{" "}
          <Link href="/contact" className="font-semibold text-electric-600">
            contact us
          </Link>
          .
        </p>
      ) : null}

      {/* Maintenance note */}
      <Reveal delay={0.1}>
        <div className="mt-14 flex flex-col items-start justify-between gap-4 rounded-3xl border border-soft bg-surface-muted p-7 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-electric-100 text-electric-600 sm:flex">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <p className="text-sm leading-relaxed text-navy-800 sm:text-base">
              <span className="font-semibold">Every vehicle is inspected before dispatch</span> —
              tires, brakes, temperature units, and securing equipment checked against a
              documented checklist. If it isn't road-ready, it doesn't roll.
            </p>
          </div>
          <Link
            href="/quote"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-navy-850 px-6 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
          >
            Tell us what you're shipping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </Container>
  );
}
