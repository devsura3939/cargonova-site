import { Suspense } from "react";
import type { Metadata } from "next";
import { QuotePageContent } from "@/components/forms/QuotePageContent";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Get a Quote",
  description:
    "Request a freight quote in under two minutes: route, cargo, and timing. Confirmed pricing within 4 business hours — 60 minutes for urgent loads.",
  path: "/quote",
});

export default function QuotePage() {
  return (
    <Suspense>
      <QuotePageContent />
    </Suspense>
  );
}
