import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, AlertTriangle, Lightbulb, Check } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/shared/Reveal";
import { CTASection } from "@/components/sections/CTASection";
import { ServiceIcon } from "@/components/icons/ServiceIcon";
import { industries } from "@/data/industries";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

/** Service slugs used in industry data, mapped to display names. */
const serviceNames: Record<string, string> = {
  "ground-freight": "Ground Freight",
  "full-truckload": "Full Truckload",
  ltl: "Less-than-Truckload",
  express: "Express Cargo",
  refrigerated: "Refrigerated Transport",
  oversized: "Oversized Cargo",
  warehousing: "Warehousing",
  "business-logistics": "Business Logistics",
};

export const metadata: Metadata = buildMetadata({
  title: "Industries We Serve",
  description:
    "Industry-specific logistics for manufacturing, retail, construction, automotive, food & beverage, e-commerce, healthcare, and industrial equipment.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        crumb={[{ name: "Industries", path: "/industries" }]}
        eyebrow="Industries"
        title="Logistics built around your industry's pressure points"
        description="Every industry has a failure mode that costs money. We design transport programs around the problem your supply chain actually faces — then measure against it."
      />

      <Section variant="light">
        <Container>
          <div className="space-y-16 lg:space-y-20">
            {industries.map((industry, i) => {
              const flip = i % 2 === 1;
              return (
                <div
                  key={industry.slug}
                  className={cn(
                    "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
                  )}
                >
                  {/* Graphic panel */}
                  <Reveal className={cn(flip && "lg:order-2")}>
                    <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-10 text-white shadow-lift">
                      <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />
                      <div className="pointer-events-none absolute inset-0 bg-grid-dark" />
                      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-electric-500/20 blur-[80px]" />
                      <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-inset ring-white/15">
                        <ServiceIcon name={industry.icon} className="h-8 w-8 text-cyan-400" />
                      </span>
                      <h2 className="relative mt-6 font-display text-3xl font-extrabold tracking-tight">
                        {industry.name}
                      </h2>
                      <p className="relative mt-3 text-sm leading-relaxed text-navy-200">
                        {industry.challenge}
                      </p>
                      <div className="relative mt-8 flex flex-wrap gap-2">
                        {industry.services.map((s) => (
                          <Link
                            key={s}
                            href={`/services/${s}`}
                            className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-inset ring-white/15 transition-colors hover:bg-electric-500"
                          >
                            {serviceNames[s]}
                          </Link>
                        ))}
                      </div>
                      <p className="relative mt-8 border-t border-white/10 pt-5 text-sm font-semibold text-cyan-400">
                        Outcome: {industry.benefit}
                      </p>
                    </div>
                  </Reveal>

                  {/* Copy */}
                  <Reveal delay={0.1} className={cn(flip && "lg:order-1")}>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-electric-600">
                      The problem
                    </p>
                    <p className="mt-3 flex gap-3 text-lg font-medium leading-relaxed text-navy-900">
                      <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-orange-500" />
                      {industry.problem}
                    </p>
                    <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-electric-600">
                      The solution
                    </p>
                    <p className="mt-3 flex gap-3 text-pretty leading-relaxed text-slate">
                      <Lightbulb className="mt-1 h-5 w-5 shrink-0 text-electric-500" />
                      {industry.solution}
                    </p>
                    <ul className="mt-8 space-y-2.5">
                      {industry.services.map((s) => (
                        <li key={s} className="flex items-center gap-2.5 text-sm font-semibold text-navy-800">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-electric-100 text-electric-600">
                            <Check className="h-3 w-3" />
                          </span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </div>
              );
            })}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-20 flex flex-col items-center justify-between gap-5 rounded-3xl border border-navy-100 bg-mist p-8 text-center sm:flex-row sm:text-left">
              <div>
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-navy-900">
                  Your industry isn't here?
                </h2>
                <p className="mt-1.5 text-sm text-slate">
                  We design programs for niche supply chains too. Tell us how your freight flows.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-navy-850 px-6 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
              >
                Talk to logistics team
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
