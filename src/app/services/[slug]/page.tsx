import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, Truck, MessageCircleQuestion } from "lucide-react";
import { services, getService } from "@/data/services";
import { ServiceIcon } from "@/components/icons/ServiceIcon";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/shared/Reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/sections/CTASection";
import { buildMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.title,
    description: service.short,
    path: `/services/${slug}`,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const index = services.findIndex((s) => s.slug === slug);
  const next = services[(index + 1) % services.length];
  const prev = services[(index - 1 + services.length) % services.length];

  const jsonLd = [
    serviceJsonLd(service.title, service.description, `/services/${slug}`),
    breadcrumbJsonLd([
      { name: "Services", path: "/services" },
      { name: service.title, path: `/services/${slug}` },
    ]),
    faqJsonLd(service.faqs),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        crumb={[
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${slug}` },
        ]}
        eyebrow="Service"
        title={service.title}
        description={service.description}
      >
        <div className="flex flex-wrap gap-3">
          {service.features.slice(0, 4).map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-1.5 text-xs font-semibold text-navy-100 backdrop-blur"
            >
              <Check className="h-3.5 w-3.5 text-cyan-400" />
              {f}
            </span>
          ))}
        </div>
      </PageHero>

      {/* Overview */}
      <Section variant="light">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <Reveal>
              <h2 className="text-balance font-display text-3xl font-extrabold tracking-tight text-strong sm:text-4xl">
                Why {service.title.toLowerCase()} with CargoNova
              </h2>
              <div className="mt-6 space-y-5">
                {service.benefits.map((b) => (
                  <div key={b.title} className="flex gap-4">
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-electric-100 text-electric-600">
                      <Check className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-strong">{b.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted sm:text-base">{b.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h3 className="mt-12 font-display text-2xl font-bold text-strong">How it works</h3>
              <ol className="mt-6 grid gap-6 sm:grid-cols-2">
                {service.process.map((p) => (
                  <li
                    key={p.step}
                    className="relative rounded-2xl border border-soft bg-surface-muted/70 p-5"
                  >
                    <span className="font-mono text-xs font-bold text-electric-600">{p.step}</span>
                    <h4 className="mt-1.5 font-display text-base font-bold text-strong">{p.title}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.text}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          {/* Side rail */}
          <div className="space-y-6">
            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-3xl border border-soft bg-surface shadow-card">
                <div className="bg-navy-900 p-6 text-white">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-inset ring-white/15">
                    <ServiceIcon name={service.icon} className="h-6 w-6 text-cyan-400" />
                  </span>
                  <h3 className="mt-4 font-display text-xl font-bold">Suitable cargo</h3>
                </div>
                <ul className="divide-y divide-navy-100 p-2">
                  {service.suitableCargo.map((c) => (
                    <li key={c} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-navy-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="rounded-3xl border border-soft bg-surface p-6 shadow-card">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-strong">
                  <Truck className="h-5 w-5 text-electric-500" />
                  Fleet options
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {service.fleet.map((f) => (
                    <li key={f} className="flex items-center justify-between rounded-xl bg-surface-muted px-4 py-2.5 text-sm">
                      <span className="font-semibold text-navy-800">{f}</span>
                      <span className="text-xs font-medium text-emerald-600">Available</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-7 text-white">
                <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-electric-500/25 blur-[60px]" />
                <h3 className="relative font-display text-lg font-bold">Ready to move {service.short.toLowerCase().replace(/\.$/, "")}?</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-navy-200">
                  Get a confirmed quote within 4 business hours.
                </p>
                <Button asChild size="lg" className="relative mt-5 w-full">
                  <Link href={`/quote?service=${slug}`}>
                    Request a Quote
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section variant="mist">
        <div className="mx-auto max-w-3xl">
          <Reveal className="text-center">
            <h2 className="text-balance font-display text-3xl font-extrabold tracking-tight text-strong sm:text-4xl">
              {service.title} — common questions
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className="mt-10 rounded-3xl border border-soft bg-surface px-6 shadow-card sm:px-8">
              {service.faqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-8 flex items-center justify-center gap-2 text-sm text-muted">
              <MessageCircleQuestion className="h-4 w-4 text-electric-500" />
              More questions?{" "}
              <Link href="/contact" className="font-semibold text-electric-600 underline decoration-electric-300 underline-offset-4 hover:text-electric-500">
                Talk to our logistics team
              </Link>
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Prev / next */}
      <section className="bg-surface py-16">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href={`/services/${prev.slug}`}
              className="group flex items-center gap-4 rounded-2xl border border-soft bg-surface-muted/60 p-5 transition-all duration-300 hover:border-electric-300 hover:bg-surface hover:shadow-card"
            >
              <ArrowLeft className="h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-electric-500" />
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wide text-muted">Previous</span>
                <span className="mt-0.5 block font-display font-bold text-strong">{prev.title}</span>
              </span>
            </Link>
            <Link
              href={`/services/${next.slug}`}
              className="group flex items-center justify-end gap-4 rounded-2xl border border-soft bg-surface-muted/60 p-5 text-right transition-all duration-300 hover:border-electric-300 hover:bg-surface hover:shadow-card"
            >
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wide text-muted">Next</span>
                <span className="mt-0.5 block font-display font-bold text-strong">{next.title}</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-electric-500" />
            </Link>
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
