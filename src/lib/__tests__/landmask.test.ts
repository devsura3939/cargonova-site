import { describe, expect, it } from "vitest";
import { isWater } from "@/lib/landmask";
import { seaRoutes, truckCorridors } from "@/data/sea-routes";
import { ports } from "@/data/ports";

function densify(waypoints: [number, number][], stepKm = 40): [number, number][] {
  const out: [number, number][] = [waypoints[0]];
  const toRad = (d: number) => (d * Math.PI) / 180;
  for (let i = 1; i < waypoints.length; i++) {
    const a = waypoints[i - 1];
    const b = waypoints[i];
    // Walk longitude the short way across the antimeridian (165°E → -175°W
    // goes through 180°, not back across Eurasia).
    let dLon = b[1] - a[1];
    if (dLon > 180) dLon -= 360;
    if (dLon < -180) dLon += 360;
    const dLat = toRad(b[0] - a[0]);
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(toRad(dLon) / 2) ** 2;
    const d = 2 * 6371 * Math.asin(Math.sqrt(h));
    const n = Math.max(1, Math.ceil(d / stepKm));
    for (let k = 1; k <= n; k++) {
      const f = k / n;
      let lon = a[1] + dLon * f;
      if (lon > 180) lon -= 360;
      if (lon < -180) lon += 360;
      out.push([a[0] + (b[0] - a[0]) * f, lon]);
    }
  }
  return out;
}

describe("landmask", () => {
  it("classifies known land/water points", () => {
    expect(isWater(52.5, 13.4)).toBe(false); // Berlin — land
    expect(isWater(41.7, 44.8)).toBe(false); // Tbilisi — land
    expect(isWater(30, -40)).toBe(true); // mid-Atlantic
    expect(isWater(0, -150)).toBe(true); // mid-Pacific
    expect(isWater(43, 34)).toBe(true); // Black Sea
    expect(isWater(-34.5, 60)).toBe(true); // southern Indian Ocean
  });

  it("every sea-route point is over water (no ships on land)", () => {
    const violations: string[] = [];
    for (const route of seaRoutes) {
      for (const [lat, lon] of densify(route.waypoints)) {
        if (!isWater(lat, lon)) {
          violations.push(`${route.id} @ ${lat.toFixed(2)},${lon.toFixed(2)}`);
        }
      }
    }
    expect(violations.slice(0, 25)).toEqual([]);
  });

  it("truck corridor points are on land or coastal", () => {
    const violations: string[] = [];
    for (const c of truckCorridors) {
      for (const [lat, lon] of densify(c.waypoints, 30)) {
        if (isWater(lat, lon)) {
          // Allow coastal cells: any of the 8 neighbours being land is fine.
          let coastal = false;
          for (const dLat of [-1, 0, 1]) {
            for (const dLon of [-1, 0, 1]) {
              if (dLat === 0 && dLon === 0) continue;
              if (!isWater(lat + dLat, lon + dLon)) coastal = true;
            }
          }
          if (!coastal) violations.push(`${c.id} @ ${lat.toFixed(2)},${lon.toFixed(2)}`);
        }
      }
    }
    expect(violations.slice(0, 25)).toEqual([]);
  });

  it("all ports sit at or near the coast", () => {
    const offshore: string[] = [];
    for (const p of ports) {
      // A port is fine if its own cell is water or any neighbour is water.
      let coastal = isWater(p.lat, p.lon);
      for (const dLat of [-1, 0, 1]) {
        for (const dLon of [-1, 0, 1]) {
          if (isWater(p.lat + dLat, p.lon + dLon)) coastal = true;
        }
      }
      if (!coastal) offshore.push(`${p.id} (${p.name}) @ ${p.lat},${p.lon}`);
    }
    expect(offshore.slice(0, 25)).toEqual([]);
  });
});
