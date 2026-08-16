"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NetworkMap } from "@/components/map/NetworkMap";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { regions } from "@/data/routes";

export function CoverageSection() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <Section variant="light" id="coverage">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Coverage & routes"
            title="A network that reaches where your freight needs to go"
            description="Scheduled lanes across Europe's core corridors, gateway hubs at key ports, and an international corridor network that extends beyond the EU."
          />
          <Reveal delay={0.1}>
            <ul className="mt-8 space-y-4">
              {regions.slice(0, 4).map((region) => (
                <li key={region.id} className="flex gap-3.5">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-electric-500" />
                  <div>
                    <p className="font-semibold text-navy-900">{region.name}</p>
                    <p className="text-sm leading-relaxed text-slate">{region.note}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              href="/coverage"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-electric-600 transition-colors hover:text-electric-500"
            >
              Explore full coverage
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="relative">
          <div className="rounded-3xl border border-navy-100 bg-mist p-4 shadow-card sm:p-6">
            <NetworkMap
              activeCorridorId={active}
              onSelectCorridor={setActive}
              className="[&_svg]:block"
            />
            <p className="mt-3 px-2 text-center text-xs text-slate">
              Hover a corridor to highlight it. Demo data — real geographic coordinates plug in
              behind this component.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
