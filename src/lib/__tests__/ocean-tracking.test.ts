import { describe, expect, it } from "vitest";
import { computeLiveFleet } from "@/lib/fleet";
import { lookupShipment } from "@/lib/tracking";

const parseTs = (s: string): number => {
  // "Aug 30 · 01:37" style
  const m = s.match(/([A-Z][a-z]+) (\d+) · (\d+):(\d+)/);
  if (!m) return NaN;
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const d = new Date(2026, months[m[1]], parseInt(m[2]), parseInt(m[3]), parseInt(m[4]));
  return d.getTime();
};

describe("ocean shipment timeline dates", () => {
  it("checkpoints are chronologically ordered and consistent with the live fleet", () => {
    const units = computeLiveFleet(new Date()).filter((u) => u.kind === "ship" && u.status === "In Transit");
    const now = Date.now();
    let checked = 0;

    for (const unit of units.slice(0, 40)) {
      const s = lookupShipment(unit.shipment.id);
      if (!s || s.mode !== "ocean") continue;
      const times = s.checkpoints.map((c) => parseTs(c.timestamp));
      const [dep, sea, port, arr] = times;
      checked++;

      // Departure in the past, arrival in the future.
      expect(dep).toBeLessThan(now);
      expect(arr).toBeGreaterThan(now);
      // Strictly chronological.
      expect(dep).toBeLessThan(sea);
      expect(sea).toBeLessThan(port);
      expect(port).toBeLessThan(arr);
      // The timeline's ETA matches the ETA shown in the summary card.
      expect(s.checkpoints[s.checkpoints.length - 1].timestamp).not.toMatch(/Tomorrow/);
      // An "upcoming" step (after the current one) must never be dated in the past.
      const currentIdx = s.checkpoints.findIndex((c, i) => !(c.done ?? i < s.checkpoints.findIndex((x) => x.status === s.status)));
      for (let i = currentIdx + 1; i < times.length; i++) {
        expect(times[i]).toBeGreaterThan(now);
      }
    }

    expect(checked).toBeGreaterThan(20);
  });
});
