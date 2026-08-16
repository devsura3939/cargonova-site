import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { industries } from "@/data/industries";
import { ServiceIcon } from "@/components/icons/ServiceIcon";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";

export function IndustriesSection() {
  return (
    <Section variant="light" id="industries">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Industries we serve"
          title="Logistics designed around your industry's pressure points"
          description="We build transport programs around how your supply chain actually behaves — not a generic one-size-fits-all model."
        />
        <Reveal delay={0.1}>
          <Link
            href="/industries"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-electric-600 transition-colors hover:text-electric-500"
          >
            View industries
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {industries.map((industry, i) => (
          <Reveal key={industry.slug} delay={0.06 * (i % 4)}>
            <Link
              href="/industries"
              className="group relative flex h-full flex-col rounded-3xl border border-navy-100 bg-mist/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-electric-200 hover:bg-white hover:shadow-lift"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-navy-800 shadow-card ring-1 ring-navy-100 transition-all duration-300 group-hover:bg-electric-500 group-hover:text-white">
                  <ServiceIcon name={industry.icon} className="h-5 w-5" />
                </span>
                <ArrowUpRight className="h-4 w-4 text-navy-200 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-electric-500" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-navy-900">{industry.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">{industry.problem}</p>
              <p className="mt-4 flex flex-wrap gap-1.5">
                {industry.services.slice(0, 2).map((s) => (
                  <span key={s} className="rounded-full bg-electric-100/70 px-2.5 py-0.5 text-[11px] font-semibold text-electric-600">
                    {s}
                  </span>
                ))}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
