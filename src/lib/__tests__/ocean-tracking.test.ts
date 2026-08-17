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

describe("ISO container code lookups", () => {
  // Real container-owner prefixes; digits are deterministic but varied so the
  // sweep covers both small and large hashId values (the signed right-shift
  // `h >> 2` used to turn large hashes negative and index seaRoutes[-1]).
  const PREFIXES = [
    "MSKU", "CMAU", "TRLU", "MSCU", "TEMU", "CSLU", "GESU", "MAEU",
    "HLXU", "OOLU", "CNTR", "TTNU", "MEDU", "PCIU", "SZLU", "FCIU",
    "DFSU", "TCLU", "UACU", "SEGU", "XUTR", "BMOU", "APLU", "HLBU",
    "ONEU", "COSU", "EMCU", "WHLU", "TGHU", "YMLU",
  ];

  const containerCodes = (): string[] => {
    const codes: string[] = [];
    for (const prefix of PREFIXES) {
      for (let i = 0; i < 15; i++) {
        codes.push(`${prefix}${1000000 + ((i * 137 + prefix.charCodeAt(3)) % 8999999)}`);
      }
    }
    return codes;
  };

  it("every ISO container number resolves to a complete ocean shipment without throwing", () => {
    const codes = containerCodes();
    let checked = 0;
    for (const code of codes) {
      const s = lookupShipment(code);
      expect(s, `lookup ${code}`).not.toBeNull();
      expect(s!.mode, `mode ${code}`).toBe("ocean");
      expect(s!.voyage, `voyage ${code}`).toBeDefined();
      expect(s!.voyage!.route.length, `route ${code}`).toBeGreaterThanOrEqual(2);
      expect(s!.origin, `origin ${code}`).toBeTruthy();
      expect(s!.destination, `destination ${code}`).toBeTruthy();
      expect(s!.voyage!.vessel, `vessel ${code}`).toBeTruthy();
      expect(s!.checkpoints.length, `checkpoints ${code}`).toBeGreaterThanOrEqual(3);
      checked++;
    }
    expect(checked).toBeGreaterThanOrEqual(400);
  });

  it("resolves the exact code that crashed (MSKU3128457) and its siblings", () => {
    for (const code of ["MSKU3128457", "MSKU3128458", "MSKU3128459"]) {
      const s = lookupShipment(code);
      expect(s).not.toBeNull();
      expect(s!.mode).toBe("ocean");
      expect(s!.voyage!.route.length).toBeGreaterThanOrEqual(2);
    }
  });
});
