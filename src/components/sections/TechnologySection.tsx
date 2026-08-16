"use client";

import Link from "next/link";
import { ArrowRight, Radar, Route, Gauge, Timer, FileCheck2, LayoutGrid } from "lucide-react";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { DashboardMockup } from "@/components/sections/DashboardMockup";
import { useLang } from "@/lib/i18n";

const FEATURES = [
  { icon: Radar, title: "Live Tracking", text: "Real-time GPS and scan-level visibility on every shipment." },
  { icon: Route, title: "Smart Routing", text: "Routes optimized against traffic, borders, and weather data." },
  { icon: Gauge, title: "Fleet Monitoring", text: "Vehicle telemetry with proactive maintenance alerts." },
  { icon: Timer, title: "ETA Prediction", text: "Arrival estimates refined continuously during transit." },
  { icon: FileCheck2, title: "Digital Documentation", text: "Paperwork, PODs, and reports in one searchable place." },
  { icon: LayoutGrid, title: "Operations Dashboard", text: "One control tower for every shipment in your program." },
];

export function TechnologySection() {
  const { t } = useLang();
  return (
    <Section variant="dark" id="technology">
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-30" />
      <div className="relative">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
          <div className="order-2 lg:order-1">
            <Reveal>
              <DashboardMockup />
            </Reveal>
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeading
              dark
              eyebrow={t("tech.eyebrow")}
              title={t("tech.title")}
              description={t("tech.sub")}
            />
            <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={0.05 * i}>
                  <div className="flex gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/8 ring-1 ring-inset ring-white/12">
                      <f.icon className="h-4.5 w-4.5 text-cyan-400" strokeWidth={1.75} />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white">{f.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-navy-200">{f.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <Link
                href="/technology"
                className="group mt-9 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
              >
                {t("tech.seeHow")}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
