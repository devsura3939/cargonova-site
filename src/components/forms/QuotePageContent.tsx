"use client";

import { useSearchParams } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { QuotePageHero } from "@/components/forms/QuotePageHero";
import type { QuoteInput } from "@/lib/validations";

export function QuotePageContent() {
  const searchParams = useSearchParams();

  const str = (v: string | null) => (v ? v : undefined);
  const weightRaw = str(searchParams.get("weight"));
  const weight =
    weightRaw && !Number.isNaN(Number(weightRaw)) ? Number(weightRaw) : undefined;

  const prefill: Partial<QuoteInput> = {
    pickupCity: str(searchParams.get("pickupCity")),
    destinationCity: str(searchParams.get("destinationCity")),
    cargoType: str(searchParams.get("cargoType")),
    transportDate: str(searchParams.get("transportDate")),
    weight,
  };

  return (
    <>
      <QuotePageHero />
      <Section variant="mist">
        <Container>
          <QuoteForm prefill={prefill} />
        </Container>
      </Section>
    </>
  );
}
