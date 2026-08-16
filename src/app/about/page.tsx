import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Target, Eye, ShieldCheck, Award, Users, Truck, Network, Leaf, Scale, HeartHandshake } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { CTASection } from "@/components/sections/CTASection";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About CargoNova",
  description:
    "CargoNova Logistics is a Berlin-based ground freight and cargo transport company moving 10,000+ shipments a year across Europe with 98.7% on-time delivery.",
  path: "/about",
});

const VALUES = [
  {
    icon: Scale,
    title: "Commitments are contracts",
    text: "If we confirm a window, we defend it. When we can't, you hear it from us before it affects your operation — not after.",
  },
  {
    icon: ShieldCheck,
    title: "Safety before speed",
    text: "Every vehicle is inspected before dispatch, every driver is trained on securing your cargo, and every exception is reviewed.",
  },
  {
    icon: Network,
    title: "The network is the product",
    text: "We invest in corridors, hubs, and telematics rather than marketing claims. Reliability compounds when the network is dense.",
  },
  {
    icon: Leaf,
    title: "Efficiency is sustainability",
    text: "Fewer empty kilometers, better routing, and modern equipment reduce cost and emissions at the same time. We pursue both.",
  },
];

const LEADERSHIP = [
  { name: "Elena Varga", role: "Managing Director", note: "15 years in European road freight, previously network director at a top-10 EU carrier." },
  { name: "Jonas Keller", role: "Head of Operations", note: "Runs the control tower and corridor network from Berlin. Believes schedules are promises." },
  { name: "Priya Raman", role: "Chief Commercial Officer", note: "Builds logistics programs for mid-market and enterprise clients across Europe." },
  { name: "Marek Nowak", role: "Head of Fleet & Safety", note: "Owns vehicle readiness, driver programs, and the zero-compromise dispatch checklist." },
];

const NUMBERS = [
  { value: "10,000+", label: "shipments a year" },
  { value: "98.7%", label: "on-time delivery" },
  { value: "14", label: "owned and operated hubs" },
  { value: "240+", label: "vetted vehicles in network" },
  { value: "30+", label: "regions served" },
  { value: "24/7", label: "control tower coverage" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumb={[{ name: "About", path: "/about" }]}
        eyebrow="About us"
        title="A freight company built like a logistics operator"
        description="CargoNova was founded on a simple observation: in European road freight, the gap between what carriers promise and what they deliver is the real problem. We built the network, the technology, and the team to close it."
      />

      {/* Story */}
      <Section variant="light">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading eyebrow="Our story" title="Founded on corridor density, not ambition" />
              <Reveal delay={0.1}>
                <div className="mt-6 space-y-5 text-pretty leading-relaxed text-muted">
                  <p>
                    CargoNova started in 2012 with three trucks and one scheduled lane between
                    Berlin and Warsaw. The founding bet was that shippers didn't need more
                    promises — they needed a carrier that treated a schedule as a contract.
                  </p>
                  <p>
                    That lane grew into a corridor. The corridor grew into a network. Today we
                    move more than 10,000 shipments a year across 30+ regions, with 14 owned
                    hubs, a 240-vehicle vetted network, and a control tower that watches every
                    load around the clock.
                  </p>
                  <p>
                    The technology we run on — live tracking, smart routing, telemetry, and
                    digital documentation — exists for one reason: to make our delivery windows
                    hold. The platform is the tool; reliability is the product.
                  </p>
                </div>
              </Reveal>
            </div>
            {/* Numbers panel */}
            <Reveal delay={0.15}>
              <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-8 text-white shadow-lift sm:p-10">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />
                <div className="pointer-events-none absolute inset-0 bg-grid-dark" />
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-electric-500/25 blur-[80px]" />
                <div className="relative grid grid-cols-2 gap-6 sm:grid-cols-3">
                  {NUMBERS.map((n) => (
                    <div key={n.label}>
                      <p className="font-display text-3xl font-extrabold text-white">{n.value}</p>
                      <p className="mt-1 text-xs font-medium leading-snug text-navy-300">{n.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Mission / Vision */}
      <Section variant="dark">
        <div className="pointer-events-none absolute inset-0 bg-noise opacity-30" />
        <div className="relative grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm sm:p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-electric-500/20 text-electric-300">
                <Target className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-white">Mission</h2>
              <p className="mt-3 text-pretty leading-relaxed text-navy-200">
                To make freight predictable. We do that by running a dense network with
                committed schedules, measuring every delivery, and treating the exceptions
                — not the averages — as the real work.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm sm:p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400">
                <Eye className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-white">Vision</h2>
              <p className="mt-3 text-pretty leading-relaxed text-navy-200">
                A Europe where road freight is bought on service levels and measured in
                outcomes — where "logistics partner" means what it says, and supply chains
                stop losing money to delivery uncertainty.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Values */}
        <div className="relative mt-16">
          <SectionHeading dark align="center" eyebrow="What we stand for" title="Four values that survive contact with reality" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={0.06 * i}>
                <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/[0.06]">
                  <v.icon className="h-6 w-6 text-cyan-400" strokeWidth={1.75} />
                  <h3 className="mt-4 font-display text-lg font-bold text-white">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-200">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Operations + Leadership */}
      <Section variant="mist">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="How we operate" title="A control tower, not a dispatch board" />
              <Reveal delay={0.1}>
                <div className="mt-8 space-y-5">
                  {[
                    {
                      title: "Planned, then monitored",
                      text: "Every shipment is planned against corridor data before it moves, then watched by the control tower 24/7. Exceptions surface in minutes, not hours.",
                    },
                    {
                      title: "Measured, then published",
                      text: "On-time performance, damage rate, and exception response are tracked per corridor and reported monthly — internally and to our program clients.",
                    },
                    {
                      title: "Owned, end to end",
                      text: "A dedicated coordinator owns each shipment from booking to signed POD. No handoffs between departments, no 'not my desk' moments.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4 rounded-2xl border border-soft bg-surface p-5 shadow-card">
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-electric-500" />
                      <div>
                        <h3 className="font-display font-bold text-strong">{item.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <div>
              <SectionHeading eyebrow="Leadership" title="The team behind the network" />
              <div className="mt-8 space-y-4">
                {LEADERSHIP.map((person, i) => (
                  <Reveal key={person.name} delay={0.05 * i}>
                    <div className="flex items-start gap-4 rounded-2xl border border-soft bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy-900 font-display text-lg font-bold text-cyan-400">
                        {person.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                      <div>
                        <h3 className="font-display font-bold text-strong">{person.name}</h3>
                        <p className="text-xs font-semibold uppercase tracking-wide text-electric-600">{person.role}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted">{person.note}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Safety + certifications */}
      <Section variant="light">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-8 text-white shadow-lift sm:p-10">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />
                <div className="pointer-events-none absolute inset-0 bg-grid-dark" />
                <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-cyan-500/15 blur-[80px]" />
                <ShieldCheck className="relative h-8 w-8 text-cyan-400" />
                <h2 className="relative mt-5 font-display text-2xl font-extrabold tracking-tight">Safety, structured</h2>
                <ul className="relative mt-5 space-y-3 text-sm leading-relaxed text-navy-100">
                  {[
                    "Pre-dispatch inspection checklist on every vehicle — tires, brakes, temp units, securing gear",
                    "Drivers trained on load securing per cargo type, refreshed annually",
                    "Telematics monitoring of speed and driving behavior on every trip",
                    "Incident review with root-cause analysis on every exception",
                    "Defensive-driving and fatigue-management standards on long-haul lanes",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <div>
              <SectionHeading eyebrow="Certifications" title="Credentials we can show" />
              <Reveal delay={0.1}>
                <div className="mt-8 space-y-4">
                  {[
                    { icon: Award, title: "ISO 9001 — Quality management", note: "Certified quality processes across operations. (Placeholder — certification documents to be added.)" },
                    { icon: Truck, title: "GDP-aligned pharma handling", note: "Temperature-controlled procedures aligned with EU GDP for pharmaceutical cargo." },
                    { icon: Users, title: "ADR-trained drivers", note: "Hazmat-capable drivers and certified equipment for approved dangerous-goods lanes." },
                  ].map((cert) => (
                    <div key={cert.title} className="flex gap-4 rounded-2xl border border-soft bg-surface p-5 shadow-card">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-electric-100 text-electric-600">
                        <cert.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-display font-bold text-strong">{cert.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{cert.note}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 rounded-2xl bg-surface-muted p-4">
                    <HeartHandshake className="h-5 w-5 shrink-0 text-electric-500" />
                    <p className="text-xs leading-relaxed text-ink">
                      We only publish credentials we can document. Anything marked placeholder
                      on this page will be completed before it's presented to a customer.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA band */}
      <Section variant="light" className="pt-0">
        <Reveal>
          <div className="mx-auto flex max-w-3xl flex-col items-center rounded-3xl border border-soft bg-surface-muted p-10 text-center sm:p-12">
            <h2 className="text-balance font-display text-3xl font-extrabold tracking-tight text-strong sm:text-4xl">
              See how we operate on your freight
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-muted sm:text-lg">
              A quote, a lane test, or a full program review — the fastest way to judge a
              carrier is to give them one load.
            </p>
            <Link
              href="/quote"
              className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-electric-500 px-8 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-electric-400"
            >
              Request a quote
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </Section>

      <CTASection />
    </>
  );
}
