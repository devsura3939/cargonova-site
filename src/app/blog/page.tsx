import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { CTASection } from "@/components/sections/CTASection";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Insights & Guides",
  description:
    "Freight, supply chain, transportation, and warehousing insights from the CargoNova team — practical guides for logistics professionals.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <PageHero
        crumb={[{ name: "Insights", path: "/blog" }]}
        eyebrow="Insights"
        title="Practical logistics thinking"
        description="Corridor intelligence, service guides, and supply chain analysis from the team that runs freight every day."
      />
      <Section variant="light">
        <Container>
          <BlogExplorer />
        </Container>
      </Section>
      <CTASection />
    </>
  );
}
