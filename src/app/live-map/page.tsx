import type { Metadata } from "next";
import { TranslatedPageHero } from "@/components/shared/TranslatedPageHero";
import { Container } from "@/components/shared/Container";
import { LiveMapMount } from "@/components/map/LiveMapMount";
import { CTASection } from "@/components/sections/CTASection";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Live Map — Worldwide Freight in Motion",
  description:
    "Watch ocean vessels and road freight move in real time across the world, and open any shipment for status, cargo, and ETA.",
  path: "/live-map",
});

export default function LiveMapPage() {
  return (
    <>
      <TranslatedPageHero
        crumbKey="nav.liveMap"
        crumbPath="/live-map"
        eyebrowKey="pg.liveMap.eyebrow"
        titleKey="pg.liveMap.title"
        descKey="pg.liveMap.sub"
        compact
      />
      <section className="bg-surface-muted px-3 pb-3 pt-0 sm:px-5">
        <Container className="max-w-none px-0 sm:px-0 lg:px-0">
          <div className="h-[calc(100dvh-13.5rem)] min-h-[520px] sm:h-[calc(100dvh-11rem)]">
            <LiveMapMount />
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
