"use client";

import { Headset, BadgeDollarSign, Building2 } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/shared/Reveal";
import { ContactPageHero } from "@/components/forms/ContactPageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { CTASection } from "@/components/sections/CTASection";
import { brand } from "@/lib/constants";
import { useLang } from "@/lib/i18n";

export function ContactPageContent() {
  const { t } = useLang();

  const DETAILS = [
    {
      icon: BadgeDollarSign,
      title: t("contact.cardSales"),
      lines: [
        { label: t("contact.labelEmail"), value: brand.contact.salesEmail, href: `mailto:${brand.contact.salesEmail}` },
        { label: t("contact.labelPhone"), value: brand.contact.phone, href: brand.contact.phoneHref },
      ],
      note: t("contact.noteSales"),
    },
    {
      icon: Headset,
      title: t("contact.cardSupport"),
      lines: [
        { label: t("contact.labelEmail"), value: brand.contact.supportEmail, href: `mailto:${brand.contact.supportEmail}` },
        { label: t("contact.labelPhone"), value: brand.contact.phone, href: brand.contact.phoneHref },
      ],
      note: t("contact.noteSupport"),
    },
    {
      icon: Building2,
      title: t("contact.cardOffice"),
      lines: [
        { label: t("contact.labelAddress"), value: brand.contact.address, href: undefined },
        { label: t("contact.labelHours"), value: brand.contact.hours, href: undefined },
      ],
      note: t("contact.noteOffice"),
    },
  ];

  return (
    <>
      <ContactPageHero />

      <Section variant="light">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
            {/* Form */}
            <Reveal>
              <div className="rounded-3xl border border-soft bg-surface p-7 shadow-card sm:p-9">
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-strong">
                  {t("contact.sendTitle")}
                </h2>
                <p className="mt-2 text-sm text-muted">
                  {t("contact.sendSub")}
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
                  <div className="rounded-3xl border border-soft bg-surface p-6 shadow-card">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-electric-100 text-electric-600">
                        <d.icon className="h-5 w-5" />
                      </span>
                      <h3 className="font-display text-lg font-bold text-strong">{d.title}</h3>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm">
                      {d.lines.map((line) => (
                        <li key={line.label} className="flex items-start justify-between gap-3">
                          <span className="shrink-0 text-muted">{line.label}</span>
                          {line.href ? (
                            <a href={line.href} className="font-medium text-electric-600 hover:text-electric-500">
                              {line.value}
                            </a>
                          ) : (
                            <span className="text-right font-medium text-strong">{line.value}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 border-t border-soft pt-3 text-xs text-muted">{d.note}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
