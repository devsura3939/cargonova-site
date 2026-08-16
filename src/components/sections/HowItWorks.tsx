"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ClipboardList, Map, Truck, PackageCheck } from "lucide-react";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { useLang } from "@/lib/i18n";

const STEPS = [
  {
    icon: ClipboardList,
    number: "01",
    titleKey: "how.step1t" as const,
    textKey: "how.step1d" as const,
  },
  {
    icon: Map,
    number: "02",
    titleKey: "how.step2t" as const,
    textKey: "how.step2d" as const,
  },
  {
    icon: Truck,
    number: "03",
    titleKey: "how.step3t" as const,
    textKey: "how.step3d" as const,
  },
  {
    icon: PackageCheck,
    number: "04",
    titleKey: "how.step4t" as const,
    textKey: "how.step4d" as const,
  },
];

export function HowItWorks() {
  const reduceMotion = useReducedMotion();
  const { t } = useLang();

  return (
    <Section variant="dark" id="how-it-works">
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-30" />
      <div className="relative">
        <SectionHeading
          dark
          align="center"
          eyebrow={t("how.eyebrow")}
          title={t("how.title")}
          description={t("how.sub")}
        />

        <div className="relative mt-16">
          {/* Connecting line (desktop) */}
          {!reduceMotion ? (
            <svg
              viewBox="0 0 1200 60"
              fill="none"
              aria-hidden="true"
              preserveAspectRatio="none"
              className="pointer-events-none absolute left-0 top-7 hidden h-14 w-full lg:block"
            >
              <line x1="60" y1="30" x2="1140" y2="30" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
              <motion.line
                x1="60"
                y1="30"
                x2="1140"
                y2="30"
                stroke="url(#hiw-gradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.4, delay: 0.2, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="hiw-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop stopColor="#1677FF" />
                  <stop offset="1" stopColor="#2ED3E6" />
                </linearGradient>
              </defs>
            </svg>
          ) : null}

          <ol className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((step, i) => (
              <Reveal key={step.number} delay={0.1 * i}>
                <li className="group relative flex flex-col lg:items-center lg:text-center">
                  <div className="relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/8 ring-1 ring-inset ring-white/15 transition-all duration-300 group-hover:ring-cyan-400/50">
                    <step.icon className="h-6 w-6 text-cyan-400" strokeWidth={1.75} />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-electric-500 font-mono text-[10px] font-bold text-white">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">{t(step.titleKey)}</h3>
                  <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-navy-200 lg:mx-auto">
                    {t(step.textKey)}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
