import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { buildMetadata } from "@/lib/seo";
import type { QuoteInput } from "@/lib/validations";

export const metadata: Metadata = buildMetadata({
  title: "Get a Quote",
  description:
    "Request a freight quote in under two minutes: route, cargo, and timing. Confirmed pricing within 4 business hours — 60 minutes for urgent loads.",
  path: "/quote",
});

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);
  const weight = str(params.weight);

  const prefill: Partial<QuoteInput> = {
    pickupCity: str(params.pickupCity),
    destinationCity: str(params.destinationCity),
    cargoType: str(params.cargoType),
    transportDate: str(params.transportDate),
    weight: weight && !Number.isNaN(Number(weight)) ? Number(weight) : undefined,
  };

  return (
    <>
      <PageHero
        crumb={[{ name: "Quote", path: "/quote" }]}
        eyebrow="Get a quote"
        title="Tell us what you're shipping"
        description="Five short steps. A confirmed quote within 4 business hours — and 60 minutes for urgent loads. No commitment until you book."
      />
      <Section variant="mist">
        <Container>
          <QuoteForm prefill={prefill} />
        </Container>
      </Section>
    </>
  );
}
