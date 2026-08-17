"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft, Truck, MessageCircleQuestion } from "lucide-react";
import { ServiceIcon } from "@/components/icons/ServiceIcon";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/shared/Reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { ServiceCategory } from "@/types";
import { useLang } from "@/lib/i18n";
import { useDataT } from "@/lib/data-i18n";

export function ServiceDetailBody({
  service,
  slug,
  prev,
  next,
}: {
  service: ServiceCategory;
  slug: string;
  prev: { slug: string; title: string };
  next: { slug: string; title: string };
}) {
  const { t, lang } = useLang();
  const { serviceTitle } = useDataT();
  const isKa = lang === "ka";
  const k = service.ka;
  const benefits = isKa && k ? k.benefits : service.benefits;
  const process = isKa && k ? service.process.map((p, i) => ({ step: p.step, ...k.process[i] })) : service.process;
  const suitableCargo = isKa && k ? k.suitableCargo : service.suitableCargo;
  const faqs = isKa && k ? k.faqs : service.faqs;

  return (
    <>
      {/* Overview */}
      <Section variant="light">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <Reveal>
              <h2 className="text-balance font-display text-[28px] font-semibold leading-[1.06] tracking-[-0.025em] text-strong sm:text-4xl dark:text-fog-50">
                {t("pg.svc.why")} {serviceTitle(slug)} {t("pg.svc.withCargoNova")}
              </h2>
              <div className="mt-8 border-y border-soft dark:border-white/10">
                {benefits.map((b, i) => (
                  <div
                    key={b.title}
                    className="flex gap-5 border-b border-soft py-5 last:border-b-0 dark:border-white/10 sm:gap-7"
                  >
                    <span className="mt-0.5 shrink-0 font-mono text-[10px] tracking-[0.14em] text-signal">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-[17px] font-semibold text-strong dark:text-fog-50">{b.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted sm:text-[15px]">{b.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h3 className="mt-14 font-display text-2xl font-semibold tracking-[-0.02em] text-strong dark:text-fog-50">
                {t("pg.svc.how")}
              </h3>
              <ol className="mt-7 grid gap-px border border-soft bg-soft sm:grid-cols-2 dark:border-white/10 dark:bg-white/[0.08]">
                {process.map((p) => (
                  <li key={p.step} className="bg-surface p-6 dark:bg-ink-950">
                    <span className="font-mono text-[10px] tracking-[0.14em] text-signal">{p.step}</span>
                    <h4 className="mt-3 font-display text-base font-semibold text-strong dark:text-fog-50">{p.title}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.text}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          {/* Side rail */}
          <div className="space-y-6">
            <Reveal delay={0.1}>
              <div className="border border-soft dark:border-white/10">
                <div className="relative overflow-hidden bg-ink-950 p-6 text-fog-50">
                  <div className="pointer-events-none absolute inset-0 bg-noise opacity-30" />
                  <div className="pointer-events-none absolute inset-0 bg-grid-dark" />
                  <span className="relative inline-flex h-11 w-11 items-center justify-center border border-white/10 bg-white/[0.05] text-signal-400">
                    <ServiceIcon name={service.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="relative mt-4 font-display text-lg font-semibold">{t("pg.svc.suitableCargo")}</h3>
                </div>
                <ul className="divide-y divide-soft bg-surface dark:divide-white/[0.08] dark:bg-ink-950">
                  {suitableCargo.map((c) => (
                    <li
                      key={c}
                      className="flex items-center gap-3 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-ink dark:text-fog-300"
                    >
                      <span className="h-1 w-1 shrink-0 bg-signal" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="border border-soft bg-surface dark:border-white/10 dark:bg-ink-950">
                <h3 className="flex items-center gap-2 border-b border-soft p-6 pb-4 font-display text-lg font-semibold text-strong dark:border-white/10 dark:text-fog-50">
                  <Truck className="h-5 w-5 text-signal" />
                  {t("pg.svc.fleetOptions")}
                </h3>
                <ul className="divide-y divide-soft dark:divide-white/[0.08]">
                  {service.fleet.map((f) => (
                    <li key={f} className="flex items-center justify-between px-6 py-3 text-sm">
                      <span className="font-medium text-ink dark:text-fog-200">{f}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-status-ok">
                        {t("pg.svc.available")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="relative overflow-hidden border border-white/10 bg-ink-950 p-7 text-fog-50">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-30" />
                <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-signal/20 blur-[70px]" />
                <p className="relative label text-signal">CargoNova</p>
                <h3 className="relative mt-3 font-display text-lg font-semibold">
                  {t("pg.svc.ready")} {serviceTitle(slug)}?
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-fog-500">
                  {t("pg.svc.quoteWithin")}
                </p>
                <Button asChild size="lg" className="relative mt-5 w-full">
                  <Link href={`/quote?service=${slug}`}>
                    {t("pg.svc.requestQuote")}
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
            <h2 className="text-balance font-display text-3xl font-semibold tracking-[-0.025em] text-strong sm:text-4xl dark:text-fog-50">
              {serviceTitle(slug)} — {t("pg.svc.questions")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className="mt-10 border border-soft bg-surface px-6 dark:border-white/10 dark:bg-ink-950 sm:px-8">
              {faqs.map((faq) => (
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
              {t("pg.svc.moreQuestions")}{" "}
              <Link href="/contact" className="font-semibold text-electric-600 underline decoration-electric-300 underline-offset-4 hover:text-electric-500">
                {t("pg.svc.talkTeam")}
              </Link>
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Prev / next */}
      <section className="bg-surface py-16">
        <Container>
          <div className="grid gap-px border border-soft bg-soft sm:grid-cols-2 dark:border-white/10 dark:bg-white/[0.08]">
            <Link
              href={`/services/${prev.slug}`}
              className="group flex items-center gap-4 bg-surface p-6 transition-colors duration-150 hover:bg-surface-hover dark:bg-ink-950 dark:hover:bg-white/[0.04]"
            >
              <ArrowLeft className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-signal" />
              <span>
                <span className="label block text-muted">{t("pg.svc.previous")}</span>
                <span className="mt-1 block font-display text-base font-semibold text-strong dark:text-fog-50">
                  {serviceTitle(prev.slug)}
                </span>
              </span>
            </Link>
            <Link
              href={`/services/${next.slug}`}
              className="group flex items-center justify-end gap-4 bg-surface p-6 text-right transition-colors duration-150 hover:bg-surface-hover dark:bg-ink-950 dark:hover:bg-white/[0.04]"
            >
              <span>
                <span className="label block text-muted">{t("pg.svc.next")}</span>
                <span className="mt-1 block font-display text-base font-semibold text-strong dark:text-fog-50">
                  {serviceTitle(next.slug)}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-signal" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
