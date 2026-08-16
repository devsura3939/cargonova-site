import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
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
      <PageHero
        crumb={[{ name: "Coverage", path: "/coverage" }]}
        eyebrow="Coverage & routes"
        title="One network. Six corridors. Thirty regions."
        description="Scheduled lanes across Europe's core corridors, gateway hubs at key ports, and an international corridor network extending beyond the EU."
      />
      <CoverageExplorer />
      <CTASection />
    </>
  );
}
