"use client";

import { Users } from "lucide-react";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { useLang } from "@/lib/i18n";

export function TestimonialsSection() {
  const { t } = useLang();

  return (
    <Section variant="mist" id="customers">
      <SectionHeading
        align="center"
        eyebrow={t("test.eyebrow")}
        title={t("test.title")}
        description={t("test.sub")}
      />

      <Reveal delay={0.05}>
        <div className="mx-auto mt-12 max-w-2xl border border-dashed border-navy-200 bg-surface p-10 text-center dark:border-white/15 dark:bg-ink-900/60 sm:p-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[3px] border border-signal/30 bg-signal/5">
            <Users className="h-5 w-5 text-signal" aria-hidden="true" />
          </div>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-muted dark:text-fog-500">
            {t("test.placeholder")}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
