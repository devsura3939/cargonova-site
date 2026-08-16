"use client";

import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/shared/Reveal";
import { brand } from "@/lib/constants";
import { useLang } from "@/lib/i18n";

export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
}) {
  const { t } = useLang();

  return (
    <>
      <PageHero
        crumb={[{ name: title, path: "" }]}
        eyebrow={t("legal.eyebrow")}
        title={title}
        description={`${t("legal.lastUpdated")}: ${updated}. ${t("legal.appliesTo")} ${brand.name}.`}
        compact
      />
      <Section variant="light">
        <Container className="max-w-3xl">
          <Reveal>
            <div className="space-y-10">
              {sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-strong">
                    {section.heading}
                  </h2>
                  {section.body.map((paragraph, i) => (
                    <p key={i} className="mt-3 leading-relaxed text-muted">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
