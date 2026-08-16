import { Suspense } from "react";
import type { Metadata } from "next";
import { TrackingPageContent } from "@/components/tracking/TrackingPageContent";
import { CTASection } from "@/components/sections/CTASection";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Track Shipment",
  description:
    "Track your CargoNova shipment in real time: current status, checkpoint history, ETA, and delivery progress — no login required.",
  path: "/tracking",
});

export default function TrackingPage() {
  return (
    <>
      <Suspense>
        <TrackingPageContent />
      </Suspense>
      <CTASection />
    </>
  );
}
