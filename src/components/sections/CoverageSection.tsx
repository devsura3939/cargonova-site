"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NetworkMap } from "@/components/map/NetworkMap";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { regions } from "@/data/routes";
import { useLang } from "@/lib/i18n";

export function CoverageSection() {
  const [active, setActive] = useState<string | null>(null);
  const { t } = useLang();

  return (
    <Section variant="light" id="coverage">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
        <div>
          <SectionHeading
            eyebrow={t("cov.eyebrow")}
            title={t("cov.title")}
            description={t("cov.sub")}
          />
          <Reveal delay={0.1}>
            <ul className="mt-8 space-y-4">
              {regions.slice(0, 4).map((region) => (
                <li key={region.id} className="flex gap-3.5">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-electric-500" />
                  <div>
                    <p className="font-semibold text-strong">{region.name}</p>
                    <p className="text-sm leading-relaxed text-muted">{region.note}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              href="/coverage"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-electric-600 transition-colors hover:text-electric-500"
            >
              {t("cov.explore")}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="relative">
          <div className="rounded-3xl border border-soft bg-surface-muted p-4 shadow-card sm:p-6">
            <NetworkMap
              activeCorridorId={active}
              onSelectCorridor={setActive}
              className="[&_svg]:block"
            />
            <p className="mt-3 px-2 text-center text-xs text-muted">{t("cov.note")}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
