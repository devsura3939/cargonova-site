"use client";

import { Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { useLang } from "@/lib/i18n";

export function TestimonialsSection() {
  const { t, lang } = useLang();
  const pick = (x: (typeof testimonials)[number]) => (lang === "ka" && x.ka ? { ...x, ...x.ka } : x);
  const [featured, ...rest] = testimonials.map(pick);

  return (
    <Section variant="mist" id="testimonials">
      <SectionHeading
        align="center"
        eyebrow={t("test.eyebrow")}
        title={t("test.title")}
        description={t("test.sub")}
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {/* Featured case study */}
        <Reveal className="lg:row-span-2">
          <figure className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-navy-900 p-8 text-white shadow-lift sm:p-10">
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-electric-500/25 blur-[80px]" />
            <div className="relative">
              <Quote className="h-8 w-8 text-cyan-400" />
              <blockquote className="mt-6 text-pretty text-lg font-medium leading-relaxed text-navy-100 sm:text-xl">
                “{featured.quote}”
              </blockquote>
            </div>
            <figcaption className="relative mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="font-display text-base font-bold">{featured.person}</p>
                <p className="text-sm text-navy-300">
                  {featured.role} · {featured.company}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl font-extrabold text-cyan-400">{featured.metric}</p>
                <p className="max-w-28 text-[10px] font-semibold uppercase tracking-wide text-navy-300">
                  {featured.metricLabel}
                </p>
              </div>
            </figcaption>
          </figure>
        </Reveal>

        {/* Standard cards */}
        {rest.map((t, i) => (
          <Reveal key={t.company + i} delay={0.06 * i}>
            <figure className="flex h-full flex-col rounded-3xl border border-soft bg-surface p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <blockquote className="flex-1 text-pretty text-sm leading-relaxed text-ink">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center justify-between gap-4 border-t border-soft pt-5">
                <div>
                  <p className="text-sm font-bold text-strong">{t.person}</p>
                  <p className="text-xs text-muted">
                    {t.role} · {t.company}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-display text-lg font-extrabold text-electric-600">{t.metric}</p>
                  <p className="max-w-24 text-[9px] font-semibold uppercase tracking-wide text-muted">
                    {t.metricLabel}
                  </p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted">{t("test.placeholder")}</p>
    </Section>
  );
}
