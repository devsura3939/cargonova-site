import { describe, expect, it } from "vitest";
import { lookupShipment, demoTrackingIds } from "@/lib/tracking";
import { trackingSchema } from "@/lib/validations";

describe("lookupShipment", () => {
  it("finds a known showcase shipment by id", () => {
    const shipment = lookupShipment("CRG-582941");
    expect(shipment).not.toBeNull();
    expect(shipment?.id).toBe("CRG-582941");
    expect(shipment?.status).toBe("in_transit");
    expect(shipment?.route.length).toBeGreaterThan(2);
  });

  it("is case-insensitive and trims input", () => {
    expect(lookupShipment("  crg-729103 ")).not.toBeNull();
  });

  it("resolves ANY well-formed unknown id to a realistic shipment (deterministic)", () => {
    const first = lookupShipment("CRG-999999");
    const second = lookupShipment("CRG-999999");
    expect(first).not.toBeNull();
    expect(first?.id).toBe("CRG-999999");
    expect(first?.origin).not.toBe(first?.destination);
    expect(first?.checkpoints.length).toBe(first?.route.length);
    // Deterministic: same ID always produces the same shipment.
    expect(second?.origin).toBe(first?.origin);
    expect(second?.destination).toBe(first?.destination);
    expect(second?.status).toBe(first?.status);
  });

  it("produces consistent progress and ETA for every status", () => {
    for (const status of ["picked_up", "in_transit", "customs", "out_for_delivery", "delivered"]) {
      const shipment = lookupShipment(`CRG-${100000 + status.length * 11111}`);
      expect(shipment).not.toBeNull();
      expect(shipment!.progress).toBeGreaterThanOrEqual(0);
      expect(shipment!.progress).toBeLessThanOrEqual(100);
      expect(shipment!.eta.length).toBeGreaterThan(0);
    }
  });

  it("returns null for malformed input", () => {
    expect(lookupShipment("hello")).toBeNull();
    expect(lookupShipment("")).toBeNull();
    expect(lookupShipment("CRG-123")).toBeNull(); // too few digits
    expect(lookupShipment("XYZ-123456")).toBeNull();
  });

  it("every demo id resolves to a shipment", () => {
    for (const id of demoTrackingIds) {
      expect(lookupShipment(id)).not.toBeNull();
    }
  });
});

describe("trackingSchema", () => {
  it("accepts valid tracking numbers", () => {
    expect(trackingSchema.safeParse("CRG-582941").success).toBe(true);
    expect(trackingSchema.safeParse(" crg-193847 ").success).toBe(true);
  });

  it("rejects invalid tracking numbers", () => {
    expect(trackingSchema.safeParse("CRG-12").success).toBe(false);
    expect(trackingSchema.safeParse("ABC-123456").success).toBe(false);
    expect(trackingSchema.safeParse("582941").success).toBe(false);
  });
});
