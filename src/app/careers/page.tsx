import type { Metadata } from "next";
import { MapPin, Clock3, Briefcase, GraduationCap, HeartPulse, Plane, TrendingUp, ShieldCheck, Banknote } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { CareerForm } from "@/components/forms/CareerForm";
import { CTASection } from "@/components/sections/CTASection";
import { jobs } from "@/data/jobs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  description:
    "Join CargoNova: operations, drivers, network planning, sales, and quality roles in Berlin — predictable routes, modern equipment, and a team that plans your week.",
  path: "/careers",
});

const BENEFITS = [
  { icon: Banknote, title: "Fair, transparent pay", text: "Clear salary bands and driver pay that includes planned hours — no surprises at the end of the month." },
  { icon: Plane, title: "Planned schedules", text: "We plan your week so you can plan your life. Predictable routes, fixed departure times, home time respected." },
  { icon: GraduationCap, title: "Training paid for", text: "CPC, ADR, and load-securing certifications funded and scheduled during work time." },
  { icon: HeartPulse, title: "Health & wellbeing", text: "Private health coverage for drivers and their families, plus a fatigue-management program that means what it says." },
  { icon: TrendingUp, title: "Real growth paths", text: "Drivers to dispatchers, planners to network leads — most of our leadership started in operations." },
  { icon: ShieldCheck, title: "Modern equipment", text: "Telematics-equipped vehicles, maintained on schedule, inspected before every dispatch." },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        crumb={[{ name: "Careers", path: "/careers" }]}
        eyebrow="Careers"
        title="Build a career where schedules are promises"
        description="We're a logistics company run by logistics people. Predictable routes, modern equipment, transparent pay, and a culture that treats drivers and planners as the business — because they are."
      />

      {/* Benefits */}
      <Section variant="light">
        <SectionHeading
          align="center"
          eyebrow="Why CargoNova"
          title="What working here actually looks like"
          description="The industry has a reputation for chaos. We're building the opposite, deliberately."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={0.05 * (i % 3)}>
              <div className="h-full rounded-3xl border border-navy-100 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-electric-100 text-electric-600">
                  <b.icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-navy-900">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Open roles */}
      <Section variant="mist">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <SectionHeading
              eyebrow="Open roles"
              title="Where we're hiring right now"
              description="New roles open as corridors grow. If nothing fits, an open application still reaches the right desk."
            />
            <div className="mt-10 space-y-4">
              {jobs.map((job, i) => (
                <Reveal key={job.slug} delay={0.04 * i}>
                  <div className="group rounded-3xl border border-navy-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-lg font-bold text-navy-900">{job.title}</h3>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-slate">
                          <span className="flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5" /> {job.department}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock3 className="h-3.5 w-3.5" /> {job.type}
                          </span>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                        Open
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate">{job.summary}</p>
                    <details className="group/details mt-4">
                      <summary className="cursor-pointer list-none text-sm font-semibold text-electric-600 transition-colors hover:text-electric-500">
                        What we're looking for
                        <span className="ml-1 inline-block transition-transform duration-200 group-open/details:rotate-180">▾</span>
                      </summary>
                      <ul className="mt-3 space-y-1.5 rounded-2xl bg-mist p-4 text-sm text-navy-800">
                        {job.requirements.map((req) => (
                          <li key={req} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-electric-500" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Application */}
          <div>
            <Reveal className="sticky top-24">
              <div className="rounded-3xl border border-navy-100 bg-white p-7 shadow-card sm:p-9">
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-navy-900">
                  Apply in two minutes
                </h2>
                <p className="mt-2 text-sm text-slate">
                  No cover-letter gymnastics. Tell us who you are and why you're interested —
                  we read everything.
                </p>
                <div className="mt-7">
                  <CareerForm />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Driver recruitment */}
      <Section variant="light">
        <Container className="max-w-4xl">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-8 text-center text-white sm:p-12">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />
              <div className="pointer-events-none absolute inset-0 bg-grid-dark" />
              <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-electric-500/25 blur-[80px]" />
              <div className="relative">
                <h2 className="text-balance font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Driver recruitment — what we promise you
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-pretty text-navy-200">
                  Fixed corridor routes, planned home time, modern equipment, and pay that
                  reflects the hours you actually drive. If you're a professional driver,
                  talk to us before your next contract.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  {["CE license", "CPC valid", "1+ year EU long-haul", "Clean record"].map((tag) => (
                    <span key={tag} className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-navy-100">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-8 text-sm text-navy-300">
                  Apply through the form above, or email{" "}
                  <a href="mailto:careers@cargonova.example.com" className="font-semibold text-white underline decoration-cyan-400/60 underline-offset-4">
                    careers@cargonova.example.com
                  </a>
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
