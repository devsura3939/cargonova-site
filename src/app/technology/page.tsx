import type { Metadata } from "next";
import { TranslatedPageHero } from "@/components/shared/TranslatedPageHero";
import { TechnologyBody } from "@/components/technology/TechnologyBody";
import { CTASection } from "@/components/sections/CTASection";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Technology Platform",
  description:
    "Live tracking, smart routing, fleet telemetry, ETA prediction, digital documentation, and a central operations dashboard for your entire freight program.",
  path: "/technology",
});

export default function TechnologyPage() {
  return (
    <>
      <TranslatedPageHero
        crumbKey="nav.technology"
        crumbPath="/technology"
        eyebrowKey="pg.technology.eyebrow"
        titleKey="pg.technology.title"
        descKey="pg.technology.sub"
      />
      <TechnologyBody />
      <CTASection />
    </>
  );
}
