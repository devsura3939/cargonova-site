import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import { FaqExplorer } from "@/components/faq/FaqExplorer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "FAQ",
  description:
    "Answers about shipments, pricing, tracking, insurance, cargo requirements, and international transport with CargoNova Logistics.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <PageHero
        crumb={[{ name: "FAQ", path: "/faq" }]}
        eyebrow="Help center"
        title="Answers before you need to ask"
        description="Shipping, pricing, tracking, insurance — the questions every logistics buyer asks, answered straight."
      />
      <FaqExplorer />
      <CTASection />
    </>
  );
}
