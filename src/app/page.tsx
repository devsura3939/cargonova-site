import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { StatsSection } from "@/components/sections/StatsSection";
import { QuickQuote } from "@/components/sections/QuickQuote";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { CoverageSection } from "@/components/sections/CoverageSection";
import { TechnologySection } from "@/components/sections/TechnologySection";
import { FleetSection } from "@/components/sections/FleetSection";
import { IndustriesSection } from "@/components/sections/IndustriesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CTASection } from "@/components/sections/CTASection";
import { Container } from "@/components/shared/Container";
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
      <StatsSection />
      <section className="bg-white py-20 sm:py-24">
        <Container>
          <QuickQuote />
        </Container>
      </section>
      <ServicesOverview />
      <HowItWorks />
      <CoverageSection />
      <TechnologySection />
      <FleetSection />
      <IndustriesSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
