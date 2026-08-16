import type { Metadata } from "next";
import { TranslatedPageHero } from "@/components/shared/TranslatedPageHero";
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
      <TranslatedPageHero
        crumbKey="nav.insights"
        crumbPath="/blog"
        eyebrowKey="pg.blog.eyebrow"
        titleKey="pg.blog.title"
        descKey="pg.blog.sub"
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
