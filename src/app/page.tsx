import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { ModeIndex } from "@/components/sections/ModeIndex";
import { CoverageSection } from "@/components/sections/CoverageSection";
import { ToolsPreview } from "@/components/sections/ToolsPreview";
import { Assurance } from "@/components/sections/Assurance";
import { FleetSection } from "@/components/sections/FleetSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CTASection } from "@/components/sections/CTASection";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Bridging Routes, Building Reach — Global Logistics",
  description:
    "BRB Enterprise — full-scale logistics company engineering optimal connection routes between businesses and geographies through integrated transportation, supply chain management, and analytical services.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <ClientLogos />
      <ModeIndex />
      <CoverageSection />
      <ToolsPreview />
      <Assurance />
      <FleetSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
