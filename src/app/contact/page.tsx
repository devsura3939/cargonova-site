import type { Metadata } from "next";
import { Phone, MapPin, Clock, Headset, BadgeDollarSign, Building2 } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/shared/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { CTASection } from "@/components/sections/CTASection";
import { brand } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Contact the CargoNova logistics team: sales and quotes, logistics support, office location in Berlin, and business hours.",
  path: "/contact",
});

const DETAILS = [
  {
    icon: BadgeDollarSign,
    title: "Sales & Quotes",
    lines: [
      { label: "Email", value: brand.contact.salesEmail, href: `mailto:${brand.contact.salesEmail}` },
      { label: "Phone", value: brand.contact.phone, href: brand.contact.phoneHref },
    ],
    note: "New quotes confirmed within 4 business hours.",
  },
  {
    icon: Headset,
    title: "Logistics Support",
    lines: [
      { label: "Email", value: brand.contact.supportEmail, href: `mailto:${brand.contact.supportEmail}` },
      { label: "Phone", value: brand.contact.phone, href: brand.contact.phoneHref },
    ],
    note: "24/7 for active shipments and exceptions.",
  },
  {
    icon: Building2,
    title: "Head Office",
    lines: [
      { label: "Address", value: brand.contact.address, href: undefined },
      { label: "Hours", value: brand.contact.hours, href: undefined },
    ],
    note: "Visits by appointment.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumb={[{ name: "Contact", path: "/contact" }]}
        eyebrow="Contact"
        title="Talk to a logistics team that answers"
        description="Quotes, active shipments, or a question about your network — reach the right desk directly."
      />

      <Section variant="light">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
            {/* Form */}
            <Reveal>
              <div className="rounded-3xl border border-navy-100 bg-white p-7 shadow-card sm:p-9">
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-navy-900">
                  Send us a message
                </h2>
                <p className="mt-2 text-sm text-slate">
                  The right department gets it automatically — no phone trees.
                </p>
                <div className="mt-7">
                  <ContactForm />
                </div>
              </div>
            </Reveal>

            {/* Details */}
            <div className="space-y-5">
              {DETAILS.map((d, i) => (
                <Reveal key={d.title} delay={0.06 * i}>
                  <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-card">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-electric-100 text-electric-600">
                        <d.icon className="h-5 w-5" />
                      </span>
                      <h3 className="font-display text-lg font-bold text-navy-900">{d.title}</h3>
                    </div>
                    <dl className="mt-4 space-y-2">
                      {d.lines.map((line) => (
                        <div key={line.label} className="flex items-baseline justify-between gap-4 text-sm">
                          <dt className="shrink-0 text-slate">{line.label}</dt>
                          <dd className="text-right">
                            {line.href ? (
                              <a
                                href={line.href}
                                className="font-semibold text-navy-900 transition-colors hover:text-electric-600"
                              >
                                {line.value}
                              </a>
                            ) : (
                              <span className="font-semibold text-navy-900">{line.value}</span>
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-3 rounded-xl bg-mist px-3.5 py-2.5 text-xs text-navy-700">{d.note}</p>
                  </div>
                </Reveal>
              ))}

              {/* Map card */}
              <Reveal delay={0.2}>
                <div className="relative overflow-hidden rounded-3xl border border-navy-100 bg-navy-900 p-6 text-white">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />
                  <div className="pointer-events-none absolute inset-0 bg-grid-dark" />
                  <div className="relative flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-inset ring-white/15">
                      <MapPin className="h-5 w-5 text-cyan-400" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold">Find us in Berlin</h3>
                      <p className="mt-1.5 flex items-start gap-2 text-sm text-navy-200">
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-navy-300" />
                        {brand.contact.hours}
                      </p>
                      <p className="mt-2 flex items-start gap-2 text-sm text-navy-200">
                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-navy-300" />
                        {brand.contact.phone}
                      </p>
                    </div>
                  </div>
                  {/* Stylized map */}
                  <div className="relative mt-5 h-40 overflow-hidden rounded-2xl border border-white/10 bg-navy-950/60">
                    <svg viewBox="0 0 400 160" className="h-full w-full" aria-hidden="true">
                      <path d="M-10 130 C 80 100, 120 40, 200 60 S 340 30, 420 50" stroke="rgba(46,211,230,0.35)" strokeWidth="10" strokeLinecap="round" fill="none" />
                      <path d="M-10 130 C 80 100, 120 40, 200 60 S 340 30, 420 50" stroke="#2ED3E6" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" fill="none" className="route-line" />
                      <circle cx="200" cy="60" r="8" fill="rgba(22,119,255,0.25)" />
                      <circle cx="200" cy="60" r="4" fill="#1677FF" />
                      <circle cx="60" cy="110" r="4" fill="#FF8A3D" />
                      <circle cx="340" cy="40" r="4" fill="#FF8A3D" />
                      <g opacity="0.4" fill="#1e4578">
                        <rect x="150" y="30" width="100" height="60" rx="6" />
                        <rect x="120" y="90" width="140" height="20" rx="4" />
                      </g>
                    </svg>
                    <span className="absolute left-3 top-3 rounded-lg bg-navy-900/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      Kurfürstendamm 21
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
