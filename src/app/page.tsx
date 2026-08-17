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
  title: "Ground Freight, FTL, LTL & Cargo Transport",
  description:
    "CargoNova Logistics moves your cargo across Europe with ground freight, FTL, LTL, express, refrigerated, and oversized transport — 98.7% on-time.",
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
