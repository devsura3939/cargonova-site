import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
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
      <PageHero
        crumb={[{ name: "Fleet", path: "/fleet" }]}
        eyebrow="Our fleet"
        title="Modern equipment for every kind of freight"
        description="Every vehicle runs with telematics, scheduled maintenance, and drivers trained on securing your cargo correctly. Filter by service type to find the right unit."
      />
      <Section variant="light">
        <FleetExplorer />
      </Section>
      <CTASection />
    </>
  );
}
