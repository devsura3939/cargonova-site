"use client";

import { useState } from "react";
import { MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { NetworkMap } from "@/components/map/NetworkMap";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { corridors, regions, getHub } from "@/data/routes";
import { cn } from "@/lib/utils";
import { useDataT } from "@/lib/data-i18n";

export function CoverageExplorer() {
  const [active, setActive] = useState<string | null>(null);
  const { regionNote } = useDataT();

  return (
    <>
      {/* Interactive map */}
      <Section variant="light">
        <SectionHeading
          eyebrow="Network map"
          title="Explore the network"
          description="Hover a corridor or select one below to trace its route through our hub network."
        />
        <Reveal delay={0.1} className="mt-10">
          <div className="rounded-3xl border border-navy-100 bg-mist p-4 shadow-card sm:p-8 dark:border-white/10">
            <NetworkMap
              activeCorridorId={active}
              onSelectCorridor={setActive}
              className="[&_svg]:block"
            />
          </div>
        </Reveal>

        <div className="mt-8 flex flex-wrap gap-2.5">
          {corridors.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(active === c.id ? null : c.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200",
                active === c.id
                  ? "bg-electric-500 text-white shadow-glow"
                  : "border border-soft bg-surface text-ink hover:border-electric-400 hover:text-electric-600 dark:hover:text-electric-400",
              )}
            >
              <MapPin className="h-4 w-4" />
              {c.label}
              <span className="text-xs font-medium opacity-70">{c.transitDays}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Corridor table + regions */}
      <Section variant="mist">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <SectionHeading
              eyebrow="International corridors"
              title="Transit times our planners commit to"
              description="Published transit days per corridor, updated quarterly from actual performance. Deviations are the exception, and you'll hear about them first."
            />
            <Reveal delay={0.1}>
              <div className="mt-10 overflow-hidden rounded-3xl border border-soft bg-surface shadow-card">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-soft bg-surface-muted text-xs font-bold uppercase tracking-wide text-muted">
                      <th className="px-6 py-4">Corridor</th>
                      <th className="px-6 py-4">Via</th>
                      <th className="px-6 py-4 text-right">Transit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100">
                    {corridors.map((c) => {
                      const path = [
                        getHub(c.from)?.city,
                        ...c.via.map((v) => getHub(v)?.city),
                        getHub(c.to)?.city,
                      ].filter(Boolean);
                      return (
                        <tr
                          key={c.id}
                          className={cn(
                            "cursor-pointer transition-colors hover:bg-electric-100/40",
                            active === c.id && "bg-electric-100/60",
                          )}
                          onClick={() => setActive(active === c.id ? null : c.id)}
                        >
                          <td className="px-6 py-4 font-semibold text-strong">{c.label}</td>
                          <td className="px-6 py-4 text-muted">{path.join(" → ")}</td>
                          <td className="px-6 py-4 text-right font-bold text-electric-600">{c.transitDays}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>

          <div>
            <SectionHeading eyebrow="Service regions" title="Where we operate daily" />
            <div className="mt-10 space-y-4">
              {regions.map((region, i) => (
                <Reveal key={region.id} delay={0.05 * i}>
                  <div className="flex gap-4 rounded-2xl border border-soft bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-electric-100 text-electric-600">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="font-display font-bold text-strong">{region.name}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{regionNote(region.id)}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Quote band */}
      <Section variant="light">
        <Reveal>
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <h2 className="text-balance font-display text-3xl font-extrabold tracking-tight text-strong sm:text-4xl">
              Not on a listed corridor?
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-muted sm:text-lg">
              Our network extends beyond these lanes through vetted partners. Ask us about
              your route — if it's movable by road, we'll price it.
            </p>
            <Link
              href="/quote"
              className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-electric-500 px-8 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-electric-400"
            >
              Request a route quote
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
