import type { Metadata } from "next";
import { TranslatedPageHero } from "@/components/shared/TranslatedPageHero";
import { AboutBody } from "@/components/about/AboutBody";
import { CTASection } from "@/components/sections/CTASection";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About CargoNova",
  description:
    "CargoNova Logistics is a Berlin-based ground freight and cargo transport company moving 10,000+ shipments a year across Europe with 98.7% on-time delivery.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <TranslatedPageHero
        crumbKey="nav.about"
        crumbPath="/about"
        eyebrowKey="pg.about.eyebrow"
        titleKey="pg.about.title"
        descKey="pg.about.sub"
      />
      <AboutBody />
      <CTASection />
    </>
  );
}
