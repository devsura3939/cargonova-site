import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/shared/Reveal";
import { brand } from "@/lib/constants";

export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <>
      <PageHero
        crumb={[{ name: title, path: "" }]}
        eyebrow="Legal"
        title={title}
        description={`Last updated: ${updated}. This page applies to ${brand.name}.`}
        compact
      />
      <Section variant="light">
        <Container className="max-w-3xl">
          <Reveal>
            <div className="space-y-10">
              {sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-navy-900">
                    {section.heading}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {section.body.map((paragraph, i) => (
                      <p key={i} className="text-pretty text-sm leading-relaxed text-slate sm:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
