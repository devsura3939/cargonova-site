import type { Metadata } from "next";
import { TranslatedPageHero } from "@/components/shared/TranslatedPageHero";
import { CTASection } from "@/components/sections/CTASection";
import { CoverageExplorer } from "@/components/coverage/CoverageExplorer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Coverage & Routes",
  description:
    "Service regions, international corridors, and logistics hubs across Europe — DACH, Benelux, Scandinavia, CEE, Iberia, and the Caucasus corridor.",
  path: "/coverage",
});

export default function CoveragePage() {
  return (
    <>
      <TranslatedPageHero
        crumbKey="nav.coverage"
        crumbPath="/coverage"
        eyebrowKey="pg.coverage.eyebrow"
        titleKey="pg.coverage.title"
        descKey="pg.coverage.sub"
      />
      <CoverageExplorer />
      <CTASection />
    </>
  );
}
