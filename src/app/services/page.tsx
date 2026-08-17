"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { TranslatedPageHero } from "@/components/shared/TranslatedPageHero";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { CTASection } from "@/components/sections/CTASection";
import { ServiceIcon } from "@/components/icons/ServiceIcon";
import { services } from "@/data/services";
import { useLang } from "@/lib/i18n";
import { useDataT } from "@/lib/data-i18n";
import { cn } from "@/lib/utils";

const ACCENT: Record<string, string> = {
  blue: "from-electric-500 to-navy-700",
  cyan: "from-cyan-500 to-navy-700",
  orange: "from-orange-500 to-navy-700",
};

/** Feature chip translation key, falling back to the raw string. */
const FEATURE_KEY: Record<string, Record<number, string>> = {
  "ground-freight": { 0: "svc.feat.ground-freight.0", 1: "svc.feat.ground-freight.1", 2: "svc.feat.ground-freight.2" },
  "full-truckload": { 0: "svc.feat.full-truckload.0", 1: "svc.feat.full-truckload.1", 2: "svc.feat.full-truckload.2" },
  ltl: { 0: "svc.feat.ltl.0", 1: "svc.feat.ltl.1", 2: "svc.feat.ltl.2" },
  express: { 0: "svc.feat.express.0", 1: "svc.feat.express.1", 2: "svc.feat.express.2" },
  refrigerated: { 0: "svc.feat.refrigerated.0", 1: "svc.feat.refrigerated.1", 2: "svc.feat.refrigerated.2" },
  oversized: { 0: "svc.feat.oversized.0", 1: "svc.feat.oversized.1", 2: "svc.feat.oversized.2" },
  warehousing: { 0: "svc.feat.warehousing.0", 1: "svc.feat.warehousing.1", 2: "svc.feat.warehousing.2" },
  "business-logistics": { 0: "svc.feat.business-logistics.0", 1: "svc.feat.business-logistics.1", 2: "svc.feat.business-logistics.2" },
};

export default function ServicesPage() {
  const { t } = useLang();
  const { serviceTitle, serviceShort } = useDataT();

  return (
    <>
      <TranslatedPageHero
        crumbKey="nav.services"
        crumbPath="/services"
        eyebrowKey="pg.services.eyebrow"
        titleKey="pg.services.title"
        descKey="pg.services.sub"
      />

      {/* Service categories */}
      <section className="bg-surface-muted py-20 sm:py-24">
        <Container>
          <div className="grid gap-px bg-soft md:grid-cols-2 dark:bg-white/[0.08]">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={0.05 * (i % 2)} className="h-full">
                <Link
                  href={`/services/${service.slug}`}
                  className="group relative flex h-full flex-col bg-surface p-8 transition-colors duration-150 hover:bg-surface-hover dark:bg-ink-950 dark:hover:bg-white/[0.04] sm:p-9"
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br opacity-[0.06] blur-2xl transition-opacity duration-500 group-hover:opacity-[0.12]",
                      ACCENT[service.accent],
                    )}
                  />
                  <div className="relative flex items-start justify-between">
                    <span className="font-mono text-[10px] tracking-[0.14em] text-signal">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted transition-all duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
                  </div>
                  <span className="relative mt-6 inline-flex h-11 w-11 items-center justify-center border border-soft bg-surface-muted text-signal-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-signal-400">
                    <ServiceIcon name={service.icon} className="h-5 w-5" />
                  </span>
                  <h2 className="relative mt-5 font-display text-xl font-semibold text-strong dark:text-fog-50">
                    {serviceTitle(service.slug)}
                  </h2>
                  <p className="relative mt-2.5 flex-1 text-sm leading-relaxed text-muted sm:text-[15px]">
                    {serviceShort(service.slug)}
                  </p>
                  <div className="relative mt-6 flex flex-wrap gap-1.5">
                    {service.features.slice(0, 3).map((f, fi) => (
                      <span
                        key={f}
                        className="border border-soft px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink dark:border-white/12 dark:text-fog-400"
                      >
                        {FEATURE_KEY[service.slug]?.[fi] ? t(FEATURE_KEY[service.slug][fi] as never) : f}
                      </span>
                    ))}
                  </div>
                  <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-signal-600 transition-colors group-hover:text-signal dark:text-signal-400">
                    {t("pg.services.viewService")}
                    <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* How to choose */}
      <section className="bg-surface py-20 sm:py-24">
        <Container className="max-w-4xl">
          <Reveal className="text-center">
            <h2 className="text-balance font-display text-3xl font-extrabold tracking-tight text-strong sm:text-4xl">
              {t("pg.services.notSure")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-muted sm:text-lg">
              {t("pg.services.notSureSub")}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 grid gap-px border border-soft bg-soft sm:grid-cols-3 dark:border-white/10 dark:bg-white/[0.08]">
              {[
                { title: t("pg.services.tip1t"), text: t("pg.services.tip1d") },
                { title: t("pg.services.tip2t"), text: t("pg.services.tip2d") },
                { title: t("pg.services.tip3t"), text: t("pg.services.tip3d") },
              ].map((tip, i) => (
                <div key={tip.title} className="bg-surface p-6 dark:bg-ink-950 sm:p-7">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-signal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-4 font-display text-base font-semibold text-strong dark:text-fog-50">{tip.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{tip.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              {t("pg.services.stillUnsure")}{" "}
              <Link href="/quote" className="text-signal-600 underline decoration-signal/40 underline-offset-4 hover:text-signal dark:text-signal-400">
                {t("pg.services.requestQuote")}
              </Link>{" "}
              {t("pg.services.planners")}
            </p>
          </Reveal>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
