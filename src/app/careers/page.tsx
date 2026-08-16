import type { Metadata } from "next";
import { TranslatedPageHero } from "@/components/shared/TranslatedPageHero";
import { CareersBody } from "@/components/careers/CareersBody";
import { CTASection } from "@/components/sections/CTASection";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  description:
    "Join CargoNova: operations, drivers, network planning, sales, and quality roles in Berlin — predictable routes, modern equipment, and a team that plans your week.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <>
      <TranslatedPageHero
        crumbKey="nav.careers"
        crumbPath="/careers"
        eyebrowKey="pg.careers.eyebrow"
        titleKey="pg.careers.title"
        descKey="pg.careers.sub"
      />
      <CareersBody />
      <CTASection />
    </>
  );
}
