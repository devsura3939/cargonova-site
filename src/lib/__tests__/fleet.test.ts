import { describe, expect, it } from "vitest";
import { computeLiveFleet } from "@/lib/fleet";

describe("computeLiveFleet", () => {
  it("returns a live fleet of ships and trucks with shipments", () => {
    const fleet = computeLiveFleet(new Date("2026-08-16T12:00:00Z"));
    expect(fleet.length).toBeGreaterThan(30);
    const ships = fleet.filter((u) => u.kind === "ship");
    const trucks = fleet.filter((u) => u.kind === "truck");
    expect(ships.length).toBeGreaterThan(15);
    expect(trucks.length).toBeGreaterThan(5);
    for (const unit of fleet) {
      expect(unit.shipment.id).toMatch(/^CRG-\d{6}$/);
      expect(unit.lat).toBeGreaterThanOrEqual(-90);
      expect(unit.lat).toBeLessThanOrEqual(90);
      expect(unit.progress).toBeGreaterThanOrEqual(0);
      expect(unit.progress).toBeLessThanOrEqual(100);
    }
  });

  it("moves units in real time (positions advance with elapsed time)", () => {
    const t0 = new Date("2026-08-16T12:00:00Z");
    const t1 = new Date(t0.getTime() + 120_000); // +2 minutes
    const a = computeLiveFleet(t0);
    const b = computeLiveFleet(t1);
    expect(a.length).toBe(b.length);

    const moved = a.filter((unit) => {
      const next = b.find((u) => u.id === unit.id);
      if (!next) return false;
      return Math.abs(next.lat - unit.lat) > 1e-9 || Math.abs(next.lon - unit.lon) > 1e-9;
    });
    // Everyone moves — same id, later timestamp, different position.
    expect(moved.length).toBe(a.length);
  });

  it("keeps real vessels and corridors with valid headings", () => {
    const fleet = computeLiveFleet(new Date());
    const everGiven = fleet.find((u) => u.name === "Ever Given");
    expect(everGiven).toBeDefined();
    expect(everGiven?.type).toContain("20,124 TEU");
    expect(everGiven?.heading).toBeGreaterThanOrEqual(0);
    expect(everGiven?.heading).toBeLessThan(360);

    const truck = fleet.find((u) => u.kind === "truck" && u.name === "GE-4412 B");
    expect(truck).toBeDefined();
    expect(truck?.shipment.pallets).toBeGreaterThan(0);
  });
});
