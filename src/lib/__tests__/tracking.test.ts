import { describe, expect, it } from "vitest";
import {
  lookupShipment,
  demoTrackingIds,
  isValidTrackingCode,
  detectCarrier,
  carrierVerifyUrl,
} from "@/lib/tracking";
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

  it("resolves generic carrier-style codes but rejects malformed input", () => {
    // Any carrier-style code (AAA-123456, 1Z…, JD…, etc.) resolves now.
    expect(lookupShipment("XYZ-123456")).not.toBeNull();
    expect(lookupShipment("hello")).toBeNull();
    expect(lookupShipment("")).toBeNull();
    expect(lookupShipment("CRG-123")).toBeNull(); // too few digits
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

  it("accepts real carrier tracking numbers (UPS / DHL / FedEx / USPS / generic)", () => {
    expect(trackingSchema.safeParse("1Z999AA10123456784").success).toBe(true); // UPS
    expect(trackingSchema.safeParse("JD01460000360067008").success).toBe(true); // DHL
    expect(trackingSchema.safeParse("9611803192397123456782").success).toBe(true); // USPS
    expect(trackingSchema.safeParse("ABC-123456").success).toBe(true); // generic carrier
  });

  it("rejects invalid tracking numbers", () => {
    expect(trackingSchema.safeParse("CRG-12").success).toBe(false); // too few digits
    expect(trackingSchema.safeParse("582941").success).toBe(false); // no carrier prefix
    expect(trackingSchema.safeParse("hello world!!").success).toBe(false);
  });
});

describe("air waybills (IATA AWB)", () => {
  it("accepts 123-45678901 style AWBs", () => {
    expect(isValidTrackingCode("123-45678901")).toBe(true);
    expect(isValidTrackingCode("020-22345678")).toBe(true);
    expect(detectCarrier("123-45678901")).toBe("awb");
    expect(carrierVerifyUrl("123-45678901", "awb")).toContain("cargo-db.com/air-waybill/12345678901");
  });

  it("resolves to a shipment like any other code", () => {
    expect(lookupShipment("123-45678901")).not.toBeNull();
  });
});
