import type { Metadata } from "next";
import { TranslatedPageHero } from "@/components/shared/TranslatedPageHero";
import { Section } from "@/components/shared/Section";
import { CTASection } from "@/components/sections/CTASection";
import { FleetExplorer } from "@/components/fleet/FleetExplorer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Our Fleet",
  description:
    "Sprinter vans, box trucks, semi trailers, reefer units, flatbeds, and lowbeds — modern, telematics-equipped vehicles for every kind of freight.",
  path: "/fleet",
});

export default function FleetPage() {
  return (
    <>
      <TranslatedPageHero
        crumbKey="nav.fleet"
        crumbPath="/fleet"
        eyebrowKey="pg.fleet.eyebrow"
        titleKey="pg.fleet.title"
        descKey="pg.fleet.sub"
      />
      <Section variant="light">
        <FleetExplorer />
      </Section>
      <CTASection />
    </>
  );
}
