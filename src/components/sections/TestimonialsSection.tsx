"use client";

import { Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";

export function TestimonialsSection() {
  const [featured, ...rest] = testimonials;

  return (
    <Section variant="mist" id="testimonials">
      <SectionHeading
        align="center"
        eyebrow="Client outcomes"
        title="Results our customers measure in their own KPIs"
        description="Enterprise logistics is judged by numbers. These are the numbers our clients report after moving freight with CargoNova."
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
          <Reveal key={t.company} delay={0.06 * i}>
            <figure className="flex h-full flex-col rounded-3xl border border-navy-100 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <blockquote className="flex-1 text-pretty text-sm leading-relaxed text-ink">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center justify-between gap-4 border-t border-navy-100 pt-5">
                <div>
                  <p className="text-sm font-bold text-navy-900">{t.person}</p>
                  <p className="text-xs text-slate">
                    {t.role} · {t.company}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-display text-lg font-extrabold text-electric-600">{t.metric}</p>
                  <p className="max-w-24 text-[9px] font-semibold uppercase tracking-wide text-slate">
                    {t.metricLabel}
                  </p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-slate">
        Placeholder case studies for demo purposes — replace with customer-approved references.
      </p>
    </Section>
  );
}
