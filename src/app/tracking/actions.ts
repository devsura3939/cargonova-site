"use server";

import { lookupShipment, type Shipment } from "@/lib/tracking";
import { trackingSchema } from "@/lib/validations";
import { delay } from "@/lib/utils";

export type LookupResult =
  | { ok: true; shipment: Shipment }
  | { ok: false; error: "not_found" | "invalid" };

/**
 * Tracking lookup. Currently backed by the mocked service in lib/tracking;
 * replace `lookupShipment` with a real TMS/API call without changing this
 * contract.
 */
export async function lookupTrackingAction(rawId: string): Promise<LookupResult> {
  // Simulated latency so the loading state is visible; remove with a real API.
  await delay(700);

  const parsed = trackingSchema.safeParse(rawId);
  if (!parsed.success) return { ok: false, error: "invalid" };

  const shipment = lookupShipment(parsed.data);
  if (!shipment) return { ok: false, error: "not_found" };

  return { ok: true, shipment };
}
