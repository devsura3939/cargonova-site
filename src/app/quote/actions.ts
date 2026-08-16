"use server";

import { submitQuoteRequest } from "@/lib/quote";
import type { QuoteInput } from "@/lib/validations";

export type SubmitQuoteResult =
  | { ok: true; reference: string }
  | { ok: false; error: string };

export async function submitQuoteAction(input: QuoteInput): Promise<SubmitQuoteResult> {
  const result = await submitQuoteRequest(input);
  if (result.ok) return { ok: true, reference: result.reference };
  return { ok: false, error: result.error };
}
