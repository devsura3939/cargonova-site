import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import { ServiceIcon } from "@/components/icons/ServiceIcon";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { cn } from "@/lib/utils";

const TINTS: Record<string, { bg: string; text: string; ring: string }> = {
  blue: { bg: "bg-electric-100/70", text: "text-electric-600", ring: "group-hover:ring-electric-500/30" },
  cyan: { bg: "bg-cyan-100/70", text: "text-navy-800", ring: "group-hover:ring-cyan-500/30" },
  orange: { bg: "bg-orange-100/70", text: "text-orange-500", ring: "group-hover:ring-orange-500/30" },
};

export function ServicesOverview() {
  const [featured, ...rest] = services;

  return (
    <Section variant="mist" id="services">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="What we move"
          title="Freight solutions for every load, every corridor"
          description="Eight core services covering the full logistics lifecycle — from a single pallet to project-scale special transport."
        />
        <Reveal delay={0.1}>
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-electric-600 transition-colors hover:text-electric-500"
          >
            Explore all services
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Featured card */}
        <Reveal className="sm:col-span-2 lg:row-span-2">
          <Link
            href={`/services/${featured.slug}`}
            className="group relative flex h-full min-h-105 flex-col justify-between overflow-hidden rounded-3xl bg-navy-900 p-8 text-white shadow-lift transition-all duration-300 hover:-translate-y-1 hover:shadow-glow sm:p-10"
          >
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />
            <div className="pointer-events-none absolute inset-0 bg-grid-dark" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-electric-500/25 blur-[90px] transition-opacity duration-500 group-hover:opacity-100" />
            <svg
              viewBox="0 0 400 120"
              fill="none"
              aria-hidden="true"
              className="pointer-events-none absolute bottom-8 left-8 right-8 h-30 w-[calc(100%-4rem)] opacity-60"
            >
              <path
                d="M10 90 C 90 70, 130 30, 210 40 S 350 30, 390 15"
                stroke="url(#svc-route)"
                strokeWidth="2.5"
                strokeDasharray="3 9"
                strokeLinecap="round"
                className="route-line"
              />
              <circle cx="10" cy="90" r="5" fill="#2ED3E6" />
              <circle cx="210" cy="40" r="4" fill="#1677FF" />
              <circle cx="390" cy="15" r="5" fill="#FF8A3D" />
              <defs>
                <linearGradient id="svc-route" x1="0" y1="0" x2="1" y2="0">
                  <stop stopColor="#2ED3E6" />
                  <stop offset="1" stopColor="#FF8A3D" />
                </linearGradient>
              </defs>
            </svg>

            <div className="relative">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-inset ring-white/15">
                <ServiceIcon name={featured.icon} className="h-7 w-7 text-cyan-400" />
              </span>
              <h3 className="mt-6 font-display text-3xl font-extrabold tracking-tight">
                {featured.title}
              </h3>
              <p className="mt-3 max-w-md text-pretty leading-relaxed text-navy-200">
                {featured.description}
              </p>
            </div>

            <div className="relative mt-10 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {featured.features.slice(0, 3).map((f) => (
                  <span key={f} className="rounded-full bg-white/8 px-3 py-1 text-xs font-medium text-navy-100 ring-1 ring-inset ring-white/10">
                    {f}
                  </span>
                ))}
              </div>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-inset ring-white/15 transition-all duration-300 group-hover:bg-electric-500 group-hover:ring-electric-500">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </Reveal>

        {/* Standard cards */}
        {rest.map((service, i) => {
          const tint = TINTS[service.accent];
          return (
            <Reveal key={service.slug} delay={0.05 * (i % 3)}>
              <Link
                href={`/services/${service.slug}`}
                className={cn(
                  "group relative flex h-full flex-col rounded-3xl border border-navy-100 bg-white p-7 shadow-card ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
                  tint.ring,
                )}
              >
                <div className="flex items-start justify-between">
                  <span className={cn("inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-inset ring-transparent transition-all duration-300 group-hover:scale-105", tint.bg, tint.text)}>
                    <ServiceIcon name={service.icon} className="h-6 w-6" />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-navy-200 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-electric-500" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-navy-900">{service.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">{service.short}</p>
                <span className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-electric-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Learn more
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
