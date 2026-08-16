import { describe, expect, it } from "vitest";
import { lookupShipment, demoTrackingIds } from "@/lib/tracking";
import { trackingSchema } from "@/lib/validations";

describe("lookupShipment", () => {
  it("finds a known shipment by id", () => {
    const shipment = lookupShipment("CRG-582941");
    expect(shipment).not.toBeNull();
    expect(shipment?.id).toBe("CRG-582941");
    expect(shipment?.status).toBe("in_transit");
    expect(shipment?.route.length).toBeGreaterThan(2);
  });

  it("is case-insensitive and trims input", () => {
    expect(lookupShipment("  crg-729103 ")).not.toBeNull();
  });

  it("returns null for an unknown but well-formed id", () => {
    expect(lookupShipment("CRG-999999")).toBeNull();
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
