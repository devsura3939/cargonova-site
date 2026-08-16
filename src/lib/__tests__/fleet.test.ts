import { describe, it, expect } from "vitest";
import { computeLiveFleet } from "@/lib/fleet";
import { isWater } from "@/lib/landmask";
import { lookupShipment } from "@/lib/tracking";

describe("fleet engine v2", () => {
  const units = computeLiveFleet(new Date());
  const ships = units.filter((u) => u.kind === "ship");
  const trucks = units.filter((u) => u.kind === "truck");

  it("spawns 190+ ships and 115+ trucks", () => {
    expect(ships.length).toBeGreaterThanOrEqual(190);
    expect(trucks.length).toBeGreaterThanOrEqual(115);
    console.log("total:", units.length, "ships:", ships.length, "trucks:", trucks.length);
  });

  it("keeps transit ships on water", () => {
    const onLand = ships.filter((u) => u.status === "In Transit" && !isWater(u.lat, u.lon));
    console.log("transit ships on land:", onLand.length, onLand.slice(0, 5).map((u) => `${u.name} ${u.lat.toFixed(1)},${u.lon.toFixed(1)}`));
    expect(onLand.length).toBe(0);
  });

  it("all shipment IDs resolve in the tracking service", () => {
    const bad = ships.filter((s) => lookupShipment(s.shipment.id) === null).length;
    expect(bad).toBe(0);
  });
});
