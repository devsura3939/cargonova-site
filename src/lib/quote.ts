import { quoteSchema, type QuoteInput } from "@/lib/validations";

export type QuoteResult =
  | { ok: true; reference: string }
  | { ok: false; error: string };

/**
 * Persist a validated quote request.
 *
 * Current implementation is a dev-safe in-memory store so the frontend works
 * without a database. Replace the body of this function with a Prisma write
 * (QuoteRequest model) + Resend notification + CRM hook when credentials
 * are available.
 */
export async function submitQuoteRequest(input: QuoteInput): Promise<QuoteResult> {
  const parsed = quoteSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Some fields are invalid. Please review the form." };
  }

  const record = {
    id: `QT-${Date.now().toString(36).toUpperCase()}`,
    ...parsed.data,
    createdAt: new Date().toISOString(),
  };

  // In-memory persistence (dev-safe). Future: prisma.quoteRequest.create({ data: record })
  memoryStore.push(record);

  // Future: await resend.emails.send({ from, to: salesEmail, subject: "New quote request", react: <QuoteEmail /> })
  // Future: await crm.createLead(record)
  return { ok: true, reference: record.id };
}

// eslint-disable-next-line prefer-const -- kept mutable to mirror a real repository
let memoryStore: Array<Record<string, unknown>> = [];

/** Internal inspection hook for tests. */
export function _getStoredQuotes() {
  return memoryStore;
}
