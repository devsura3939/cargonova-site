"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
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
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={0.05 * (i % 2)}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-soft bg-surface p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br opacity-[0.07] blur-2xl transition-opacity duration-500 group-hover:opacity-[0.14]",
                      ACCENT[service.accent],
                    )}
                  />
                  <div className="flex items-start justify-between">
                    <span
                      className={cn(
                        "inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-card",
                        ACCENT[service.accent],
                      )}
                    >
                      <ServiceIcon name={service.icon} className="h-7 w-7" />
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-navy-200 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-electric-500" />
                  </div>
                  <h2 className="mt-6 font-display text-2xl font-bold text-strong">
                    {serviceTitle(service.slug)}
                  </h2>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted sm:text-base">
                    {serviceShort(service.slug)}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {service.features.slice(0, 3).map((f, fi) => (
                      <span
                        key={f}
                        className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-ink"
                      >
                        {FEATURE_KEY[service.slug]?.[fi] ? t(FEATURE_KEY[service.slug][fi] as never) : f}
                      </span>
                    ))}
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-electric-600 transition-colors group-hover:text-electric-500">
                    {t("pg.services.viewService")}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { title: t("pg.services.tip1t"), text: t("pg.services.tip1d") },
                { title: t("pg.services.tip2t"), text: t("pg.services.tip2d") },
                { title: t("pg.services.tip3t"), text: t("pg.services.tip3d") },
              ].map((tip) => (
                <div key={tip.title} className="rounded-2xl border border-soft bg-surface-muted/70 p-6 text-center">
                  <Check className="mx-auto h-5 w-5 text-electric-500" />
                  <p className="mt-3 font-display text-base font-bold text-strong">{tip.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{tip.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-muted">
              {t("pg.services.stillUnsure")}{" "}
              <Link href="/quote" className="font-semibold text-electric-600 underline decoration-electric-300 underline-offset-4 hover:text-electric-500">
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
