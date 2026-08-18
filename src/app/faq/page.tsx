import type { Metadata } from "next";
import { TranslatedPageHero } from "@/components/shared/TranslatedPageHero";
import { CTASection } from "@/components/sections/CTASection";
import { FaqExplorer } from "@/components/faq/FaqExplorer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "FAQ",
  description:
    "Answers about shipments, pricing, tracking, insurance, cargo requirements, and international transport with BRB Enterprise.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <TranslatedPageHero
        crumbKey="nav.faq"
        crumbPath="/faq"
        eyebrowKey="pg.faq.eyebrow"
        titleKey="pg.faq.title"
        descKey="pg.faq.sub"
      />
      <FaqExplorer />
      <CTASection />
    </>
  );
}
