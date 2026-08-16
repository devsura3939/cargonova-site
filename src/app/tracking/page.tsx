import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { TrackingForm } from "@/components/tracking/TrackingForm";
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
      <PageHero
        crumb={[{ name: "Tracking", path: "/tracking" }]}
        eyebrow="Shipment tracking"
        title="Track your shipment in real time"
        description="Enter your tracking number to see exactly where your cargo is, what happened at every checkpoint, and when it arrives."
      >
        <TrackingForm />
      </PageHero>

      <Section variant="light">
        <Container className="max-w-4xl">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { title: "Live status", text: "Position and status updated continuously from vehicle telemetry and scan events." },
              { title: "Checkpoint history", text: "Every pickup, hub, border, and delivery step — timestamped and documented." },
              { title: "No login required", text: "Anyone with the tracking number can check. Portal access adds full history." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-navy-100 bg-mist/70 p-6">
                <h2 className="font-display font-bold text-navy-900">{item.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate">{item.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
