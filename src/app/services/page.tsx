import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { CTASection } from "@/components/sections/CTASection";
import { ServiceIcon } from "@/components/icons/ServiceIcon";
import { services } from "@/data/services";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Freight Services",
  description:
    "Ground freight, FTL, LTL, express cargo, refrigerated transport, oversized cargo, warehousing, and managed business logistics.",
  path: "/services",
});

const ACCENT: Record<string, string> = {
  blue: "from-electric-500 to-navy-700",
  cyan: "from-cyan-500 to-navy-700",
  orange: "from-orange-500 to-navy-700",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumb={[{ name: "Services", path: "/services" }]}
        eyebrow="Services"
        title="Freight solutions built around your business"
        description="Eight core services that cover the full logistics lifecycle — from a single pallet to project-scale special transport. Every service runs on the same network, the same tracking, and the same accountable team."
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
                    {service.title}
                  </h2>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted sm:text-base">
                    {service.short}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {service.features.slice(0, 3).map((f) => (
                      <span
                        key={f}
                        className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-ink"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-electric-600 transition-colors group-hover:text-electric-500">
                    View service
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
              Not sure which service fits?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-muted sm:text-lg">
              Most shipments fit one of two patterns: full loads move fastest on FTL,
              partial loads cost least on LTL. Everything else is a conversation worth
              having.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { title: "24+ pallets", text: "Full Truckload — dedicated vehicle, direct route." },
                { title: "1–15 pallets", text: "Less-than-Truckload — pay for the space you use." },
                { title: "Time-critical", text: "Express Cargo — dedicated vehicle, priority lane." },
              ].map((tip) => (
                <div key={tip.title} className="rounded-2xl border border-soft bg-surface-muted/70 p-6 text-center">
                  <Check className="mx-auto h-5 w-5 text-electric-500" />
                  <p className="mt-3 font-display text-base font-bold text-strong">{tip.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{tip.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-muted">
              Still unsure?{" "}
              <Link href="/quote" className="font-semibold text-electric-600 underline decoration-electric-300 underline-offset-4 hover:text-electric-500">
                Request a quote
              </Link>{" "}
              and our planners will recommend the right option.
            </p>
          </Reveal>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
