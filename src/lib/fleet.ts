/**
 * Live fleet engine for the worldwide map.
 *
 * No API keys: this feed is a deterministic real-time simulation that behaves
 * like a live AIS/TMS stream — real vessels, real ports, real sea lanes that
 * never cross land (every lane is validated against the 1° landmask in tests)
 * — with positions advancing continuously in real time. Ships sail their lane,
 * then dwell at the destination port before the next voyage; trucks run hourly
 * rotations between real cities. `computeLiveFleet(now)` is the single seam a
 * real AIS provider (e.g. aisstream.io free tier) can be swapped into later
 * without touching the map UI.
 */

import { seaRoutes, truckCorridors, type SeaRoute, type TruckCorridor } from "@/data/sea-routes";
import { ports, distKm, type Port } from "@/data/ports";

export type LatLon = [number, number];

export type UnitKind = "ship" | "truck";
export type UnitStatus = "In Transit" | "At Port" | "Delivering";
export type VesselClass = "container" | "mega-container" | "feeder" | "bulk" | "tanker" | "roro";

export type LiveUnit = {
  id: string;
  kind: UnitKind;
  name: string;
  flag?: string;
  mmsi?: string;
  imo?: string;
  plate?: string;
  cls: string;
  type: string;
  origin: string;
  destination: string;
  originLatLon: LatLon;
  destLatLon: LatLon;
  lat: number;
  lon: number;
  heading: number;
  speedText: string;
  progress: number; // 0..1 along the route
  status: UnitStatus;
  eta: string;
  etaMs: number;
  routeId: string;
  routeName: string;
  shipment: {
    id: string;
    cargo: string;
    weight: string;
    teu?: number;
    pallets?: number;
    consignee: string;
    vessel?: string;
  };
};

/* ── Vessel registry (real ships, public particulars) ────── */

type Vessel = {
  name: string;
  flag: string;
  mmsi: string;
  cls: VesselClass;
  teu: number;
  length: number;
  speedKts: number;
  dwt: string;
};

const V = (
  name: string,
  flag: string,
  mmsi: string,
  cls: VesselClass,
  teu: number,
  length: number,
  speedKts: number,
  dwt: string,
): Vessel => ({ name, flag, mmsi, cls, teu, length, speedKts, dwt });

const VESSELS: Vessel[] = [
  // ── Ultra-large container (18k–24k TEU) ──
  V("Ever Given", "Panama", "353136000", "mega-container", 20124, 399.9, 20.5, "199,000"),
  V("Ever Ace", "Panama", "353782000", "mega-container", 23992, 399.9, 20.5, "235,000"),
  V("Ever Max", "Panama", "353523000", "mega-container", 24004, 399.9, 20.5, "235,000"),
  V("MSC Gülsün", "Liberia", "636018798", "mega-container", 23756, 399.9, 21.0, "228,000"),
  V("MSC Loreto", "Liberia", "636018900", "mega-container", 23656, 399.9, 21.0, "228,000"),
  V("OOCL Hong Kong", "Hong Kong", "477972100", "mega-container", 21413, 399.9, 21.0, "197,000"),
  V("OOCL Germany", "Hong Kong", "477543500", "mega-container", 21413, 399.9, 21.0, "197,000"),
  V("CMA CGM Jacques Saadé", "France", "228401600", "mega-container", 23112, 399.9, 21.5, "220,000"),
  V("CMA CGM Marco Polo", "France", "228386100", "mega-container", 16020, 396.0, 21.0, "187,000"),
  V("HMM Algeciras", "Panama", "636020723", "mega-container", 23964, 399.9, 21.5, "229,000"),
  V("HMM Oslo", "Panama", "636020650", "mega-container", 23964, 399.9, 21.5, "229,000"),
  V("Madrid Mærsk", "Denmark", "219789100", "mega-container", 20568, 399.0, 21.0, "194,000"),
  V("Mærsk Mc-Kinney Møller", "Denmark", "219632000", "mega-container", 18270, 399.0, 22.0, "194,000"),
  V("COSCO Shipping Universe", "Hong Kong", "477929500", "mega-container", 21237, 399.9, 21.0, "197,000"),
  V("COSCO Shipping Star", "Hong Kong", "477929600", "mega-container", 21237, 399.9, 21.0, "197,000"),
  V("ONE Apus", "Japan", "431577000", "mega-container", 14500, 364.2, 19.5, "140,000"),
  V("ONE Innovation", "Japan", "431577130", "mega-container", 24000, 399.9, 21.0, "229,000"),
  V("YM Wish", "Liberia", "636018004", "mega-container", 14000, 368.0, 19.5, "146,000"),
  V("YM Together", "Liberia", "636020615", "mega-container", 20180, 399.9, 20.5, "199,000"),
  V("CSCL Globe", "Hong Kong", "477491700", "mega-container", 19100, 400.0, 20.5, "188,000"),
  V("APL Singapura", "Singapore", "563038200", "mega-container", 13300, 366.0, 19.5, "132,000"),
  V("MOL Triumph", "Panama", "636016232", "mega-container", 20170, 400.0, 20.5, "199,000"),
  // ── Large container (10k–18k TEU) ──
  V("MSC Mia", "Panama", "636016888", "container", 14000, 365.0, 19.5, "140,000"),
  V("MSC Anna", "Panama", "636016877", "container", 14000, 365.0, 19.5, "140,000"),
  V("MSC Rita", "Panama", "636012345", "container", 13000, 365.0, 19.0, "135,000"),
  V("Maersk Essen", "Denmark", "220563000", "container", 15000, 365.0, 20.0, "156,000"),
  V("Maersk Kuala Lumpur", "Denmark", "219028000", "container", 19000, 399.0, 21.0, "190,000"),
  V("Maersk Eureka", "Denmark", "220049000", "container", 15200, 366.0, 20.0, "156,000"),
  V("Maersk Halifax", "Denmark", "220440000", "container", 16000, 366.0, 20.5, "160,000"),
  V("Ever Leader", "Panama", "353596000", "container", 15000, 365.0, 20.0, "155,000"),
  V("Ever Lotus", "Panama", "353588000", "container", 15000, 365.0, 20.0, "155,000"),
  V("CMA CGM Kerguelen", "France", "228389500", "container", 17722, 398.0, 20.5, "170,000"),
  V("CMA CGM Benjamin Franklin", "France", "228389501", "container", 17722, 398.0, 20.5, "170,000"),
  V("HMM Dublin", "Panama", "636019200", "container", 16000, 365.0, 21.0, "160,000"),
  V("HMM Gdansk", "Panama", "636019300", "container", 16000, 365.0, 21.0, "160,000"),
  V("ONE Columba", "Japan", "431577300", "container", 14000, 364.0, 19.5, "145,000"),
  V("ONE Aquila", "Japan", "431577400", "container", 14000, 364.0, 19.5, "145,000"),
  V("YM Mobility", "Liberia", "636019400", "container", 14000, 364.0, 19.5, "146,000"),
  V("COSCO Shipping Aries", "Hong Kong", "477930000", "container", 14000, 366.0, 20.0, "145,000"),
  V("COSCO Shipping Scorpio", "Hong Kong", "477930100", "container", 14000, 366.0, 20.0, "145,000"),
  V("OOCL Brussels", "Hong Kong", "477738200", "container", 13208, 363.5, 20.0, "145,000"),
  V("Yang Ming Wellhead", "Taiwan", "416004500", "container", 14000, 368.0, 19.5, "145,000"),
  // ── Feeder container (2k–8k TEU) ──
  V("Maersk Palermo", "Denmark", "219214000", "feeder", 4500, 280.0, 18.0, "55,000"),
  V("Maersk Surabaya", "Denmark", "219215000", "feeder", 4500, 280.0, 18.0, "55,000"),
  V("MSC Rosaria", "Panama", "636013500", "feeder", 5000, 294.0, 18.5, "58,000"),
  V("X-Press Odessa", "Liberia", "636013800", "feeder", 1800, 195.0, 16.5, "24,000"),
  V("X-Press Jhelum", "Liberia", "636013900", "feeder", 1800, 195.0, 16.5, "24,000"),
  V("Ever Speed", "Panama", "353510000", "feeder", 2800, 222.0, 17.5, "34,000"),
  V("Wan Hai 311", "Taiwan", "416003800", "feeder", 2600, 212.0, 17.5, "32,000"),
  V("SITC Davao", "Panama", "353488000", "feeder", 1800, 190.0, 16.0, "24,000"),
  V("Baltic Mermaid", "Cyprus", "209450000", "feeder", 1400, 175.0, 15.5, "19,000"),
  V("Black Sea Arrow", "Marshall Is.", "538007100", "feeder", 1600, 185.0, 16.0, "21,000"),
  V("Sea Leopard", "Panama", "353620000", "feeder", 2000, 200.0, 16.5, "27,000"),
  V("Tbilisi Star", "Georgia", "213003000", "feeder", 1500, 180.0, 16.0, "20,000"),
  V("Poti Express", "Georgia", "213003100", "feeder", 1500, 180.0, 16.0, "20,000"),
  V("Batumi Breeze", "Georgia", "213003200", "feeder", 1300, 170.0, 15.5, "18,000"),
  // ── Bulk carriers ──
  V("Berge Stahl", "Marshall Is.", "538003940", "bulk", 0, 342.0, 13.5, "364,000"),
  V("Berge Everest", "Marshall Is.", "538004000", "bulk", 0, 342.0, 13.5, "360,000"),
  V("Vale Brasil", "Marshall Is.", "538005900", "bulk", 0, 362.0, 14.5, "400,000"),
  V("Vale Rio de Janeiro", "Marshall Is.", "538006000", "bulk", 0, 362.0, 14.5, "400,000"),
  V("Shandong Da De", "Hong Kong", "477220000", "bulk", 0, 292.0, 14.0, "180,000"),
  V("Star Praslin", "Marshall Is.", "538006800", "bulk", 0, 292.0, 13.5, "180,000"),
  V("Pacific Integrity", "Panama", "353180000", "bulk", 0, 225.0, 12.5, "80,000"),
  V("Ocean Harvester", "Liberia", "636015500", "bulk", 0, 190.0, 12.0, "58,000"),
  V("NSU Unity", "Panama", "353200000", "bulk", 0, 225.0, 12.5, "82,000"),
  V("Frontier Falcon", "Marshall Is.", "538007700", "bulk", 0, 200.0, 12.5, "64,000"),
  V("Aquarius Leader", "Panama", "353210000", "bulk", 0, 295.0, 13.5, "180,000"),
  V("Cape Tainaro", "Marshall Is.", "538009000", "bulk", 0, 292.0, 13.5, "180,000"),
  V("Golden Ocean", "Liberia", "636016000", "bulk", 0, 295.0, 13.5, "180,000"),
  V("Sparrow Hawk", "Panama", "353220000", "bulk", 0, 225.0, 12.5, "82,000"),
  V("Minoan Hope", "Malta", "215700000", "bulk", 0, 180.0, 11.5, "38,000"),
  V("Aegean Breeze", "Malta", "215710000", "bulk", 0, 180.0, 11.5, "38,000"),
  // ── Tankers ──
  V("Almi Sky", "Greece", "241860000", "tanker", 0, 274.0, 13.0, "160,000"),
  V("Front Altair", "Marshall Is.", "538005600", "tanker", 0, 274.0, 13.0, "160,000"),
  V("Front Duchess", "Marshall Is.", "538005700", "tanker", 0, 274.0, 13.0, "160,000"),
  V("Eagle Vantage", "Marshall Is.", "538006200", "tanker", 0, 183.0, 12.0, "50,000"),
  V("Eagle Leona", "Marshall Is.", "538006300", "tanker", 0, 183.0, 12.0, "50,000"),
  V("Sonangol Cabinda", "Bahamas", "311001400", "tanker", 0, 274.0, 13.0, "160,000"),
  V("Maran Gas Apollo", "Greece", "241610000", "tanker", 0, 290.0, 14.0, "88,000"),
  V("BW Rhine", "Singapore", "563090000", "tanker", 0, 183.0, 12.0, "50,000"),
  V("STI Topaz", "Marshall Is.", "538007300", "tanker", 0, 183.0, 12.0, "50,000"),
  V("Seri Amanah", "Malaysia", "533130000", "tanker", 0, 274.0, 13.0, "160,000"),
  V("Sea Rose", "Liberia", "636016400", "tanker", 0, 250.0, 12.5, "120,000"),
  V("Wadi Safaga", "Egypt", "622100000", "tanker", 0, 183.0, 12.0, "50,000"),
  V("Yasa Jupiter", "Marshall Is.", "538008800", "tanker", 0, 274.0, 13.0, "160,000"),
  // ── Ro-Ro ──
  V("Tønsberg", "Norway", "259040000", "roro", 0, 200.0, 17.0, "19,000"),
  V("Tor Jentina", "Norway", "259050000", "roro", 0, 200.0, 17.0, "19,000"),
  V("Auto Achieve", "Panama", "353300000", "roro", 0, 199.0, 16.5, "19,000"),
  V("Auto Banner", "Panama", "353310000", "roro", 0, 199.0, 16.5, "19,000"),
  V("Grande Torino", "Italy", "247350000", "roro", 0, 218.0, 17.5, "21,000"),
  V("Morning Claire", "Bahamas", "311000800", "roro", 0, 218.0, 17.5, "21,000"),
  V("Salome", "Panama", "353320000", "roro", 0, 180.0, 16.0, "17,000"),
  V("Traviata", "Panama", "353330000", "roro", 0, 180.0, 16.0, "17,000"),
];

const CLASS_LABEL: Record<VesselClass, string> = {
  "mega-container": "Ultra-Large Container Vessel",
  container: "Container Ship",
  feeder: "Container Feeder",
  bulk: "Bulk Carrier",
  tanker: "Oil / Chemical Tanker",
  roro: "Ro-Ro Carrier",
};

/* ── Route metadata (precomputed once) ───────────────────── */

function routeLengthKm(route: LatLon[]): number {
  let total = 0;
  for (let i = 1; i < route.length; i++) total += distKm({ lat: route[i - 1][0], lon: route[i - 1][1] }, { lat: route[i][0], lon: route[i][1] });
  return total;
}

function nearestPortName(pos: LatLon): { name: string; port?: Port } {
  let best: Port | undefined;
  let bestD = Infinity;
  for (const p of ports) {
    const d = distKm({ lat: pos[0], lon: pos[1] }, { lat: p.lat, lon: p.lon });
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }
  if (best && bestD < 400) return { name: best.name, port: best };
  return { name: `${pos[0].toFixed(1)}°, ${pos[1].toFixed(1)}°` };
}

type RouteMeta = {
  id: string;
  name: string;
  lengthKm: number;
  start: string;
  end: string;
};

const SEA_META: RouteMeta[] = seaRoutes.map((r) => ({
  id: r.id,
  name: r.name,
  lengthKm: routeLengthKm(r.waypoints),
  start: nearestPortName(r.waypoints[0]).name,
  end: nearestPortName(r.waypoints[r.waypoints.length - 1]).name,
}));

const TRUCK_META: (TruckCorridor & { lengthKm: number })[] = truckCorridors.map((c) => ({
  ...c,
  lengthKm: routeLengthKm(c.waypoints),
}));

/* ── Deterministic helpers ───────────────────────────────── */

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function weightFor(h: number, maxKg: number): string {
  const kg = 400 + (h % maxKg);
  return `${Math.round(kg / 50) * 50} kg`;
}

/* ── Geometry ────────────────────────────────────────────── */

/** Segment lengths are cached per route array (called every animation frame). */
const SEG_CACHE = new WeakMap<LatLon[], { segs: number[]; total: number }>();

function segInfo(route: LatLon[]): { segs: number[]; total: number } {
  let c = SEG_CACHE.get(route);
  if (!c) {
    const segs: number[] = [];
    let total = 0;
    for (let i = 1; i < route.length; i++) {
      const d = distKm({ lat: route[i - 1][0], lon: route[i - 1][1] }, { lat: route[i][0], lon: route[i][1] });
      segs.push(d);
      total += d;
    }
    c = { segs, total };
    SEG_CACHE.set(route, c);
  }
  return c;
}

function pointAlong(route: LatLon[], t: number): { pos: LatLon; heading: number } {
  const n = route.length;
  if (n === 0) return { pos: [0, 0], heading: 0 };
  if (n === 1) return { pos: route[0], heading: 0 };
  const { segs: segLens, total } = segInfo(route);
  if (total === 0) return { pos: route[0], heading: 0 };
  let target = Math.min(1, Math.max(0, t)) * total;
  for (let i = 0; i < segLens.length; i++) {
    if (target <= segLens[i] || i === segLens.length - 1) {
      const f = segLens[i] === 0 ? 0 : Math.min(1, target / segLens[i]);
      const a = route[i];
      const b = route[i + 1];
      const lat = a[0] + (b[0] - a[0]) * f;
      // Interpolate across the antimeridian the short way (e.g. 165°E → -175°W
      // goes through 180°, not back through 40°E).
      let dLon = b[1] - a[1];
      if (dLon > 180) dLon -= 360;
      else if (dLon < -180) dLon += 360;
      let lon = a[1] + dLon * f;
      if (lon > 180) lon -= 360;
      else if (lon < -180) lon += 360;
      const toRad = (d: number) => (d * Math.PI) / 180;
      const toDeg = (d: number) => (d * 180) / Math.PI;
      const heading =
        (toDeg(
          Math.atan2(
            Math.sin(toRad(b[1] - a[1])) * Math.cos(toRad(b[0])),
            Math.cos(toRad(a[0])) * Math.sin(toRad(b[0])) -
              Math.sin(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.cos(toRad(b[1] - a[1])),
          ),
        ) +
          360) %
        360;
      return { pos: [lat, lon] as LatLon, heading };
    }
    target -= segLens[i];
  }
  return { pos: route[n - 1], heading: 0 };
}

/* ── Shipment generator ──────────────────────────────────── */

const CARGO_TYPES = [
  "Palletized consumer goods",
  "Industrial components",
  "Temperature-controlled food",
  "Textiles & apparel",
  "Automotive parts",
  "Machinery & equipment",
  "Pharmaceuticals (GDP)",
  "Electronics & displays",
  "E-commerce parcels",
  "Construction materials",
  "Steel coils & pipes",
  "Furniture & home goods",
];

const CONSIGNEES = [
  "Helvetia Components",
  "Nordic Fresh",
  "Vela Retail",
  "MediCore",
  "Atlas Commerce",
  "Rheinwerk AG",
  "Aurora Foods",
  "Baumgartner Bau",
  "Meyer Manufacturing",
  "Adria Trade",
  "Caucasus Foods",
  "Global Parts GmbH",
];

function shipmentFor(h: number, offset: number, kind: UnitKind) {
  return {
    id: `CRG-${(100000 + ((h + offset) % 899999)).toString()}`,
    cargo: CARGO_TYPES[(h + offset) % CARGO_TYPES.length],
    weight: weightFor(h + offset, kind === "ship" ? 260000 : 24000),
    consignee: CONSIGNEES[(h + offset) % CONSIGNEES.length],
  };
}

/* ── ETA formatting ──────────────────────────────────────── */

function fmtEta(daysRemaining: number): string {
  const eta = new Date(Date.now() + daysRemaining * 24 * 3600 * 1000);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
  return eta.toLocaleString("en-US", opts);
}

function fmtEtaHours(hoursRemaining: number): string {
  const eta = new Date(Date.now() + hoursRemaining * 3600 * 1000);
  const today = new Date();
  const sameDay = eta.toDateString() === today.toDateString();
  const time = eta.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return sameDay ? `Today ${time}` : eta.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ── Fleet computation ───────────────────────────────────── */

export function computeLiveFleet(now: Date): LiveUnit[] {
  const units: LiveUnit[] = [];
  const elapsedH = now.getTime() / 3600000;

  /* ── Ships: sail → dwell at destination port → sail again ── */
  for (let ri = 0; ri < seaRoutes.length; ri++) {
    const route: SeaRoute = seaRoutes[ri];
    const meta = SEA_META[ri];
    const { lengthKm } = meta;

    const usedOnRoute = new Set<string>();
    for (let si = 0; si < route.ships; si++) {
      const seed = hash(`${route.id}:${si}`);
      // Deterministic vessel pick, avoiding duplicates on the same route.
      const allowed = route.classes
        ? new Set(route.classes.flatMap((c) => (c === "container" ? ["mega-container", "container", "feeder"] : [c])))
        : null;
      let guard = 0;
      let idx = (seed + si * 13) % VESSELS.length;
      let v = VESSELS[idx];
      // Prefer a vessel of an allowed class (routes that carry cars use ro-ro, etc).
      while (guard++ < 12) {
        const candidate = VESSELS[idx];
        const classOk = !allowed || allowed.has(candidate.cls);
        if (classOk && !usedOnRoute.has(candidate.name)) {
          v = candidate;
          break;
        }
        idx = (idx + 1) % VESSELS.length;
        v = VESSELS[idx];
      }
      usedOnRoute.add(v.name);

      const sailingH = (lengthKm / (v.speedKts * 1.852)) * (0.85 + (seed % 400) / 1000);
      const dwellH = 5 + (seed % 34); // 5–38 h berthed
      const cycle = sailingH + dwellH;
      const phase0 = (seed % 997) / 997;
      const phase = (phase0 + elapsedH / cycle) % 1;
      const sailFrac = sailingH / cycle;

      let pos: LatLon;
      let heading: number;
      let status: UnitStatus;
      let progress: number;
      let speedText: string;

      if (phase < sailFrac) {
        const t = phase / sailFrac;
        const p = pointAlong(route.waypoints, t);
        pos = p.pos;
        heading = p.heading;
        status = "In Transit";
        progress = t;
        speedText = `${(v.speedKts * (0.92 + (seed % 180) / 1000)).toFixed(1)} kts`;
      } else {
        // Berthed at the destination approach — small stable jitter so ships
        // cluster around the port rather than stacking on one pixel.
        const angle = (seed % 628) / 100;
        const rad = (seed % 17) / 100;
        const end = route.waypoints[route.waypoints.length - 1];
        pos = [end[0] + Math.cos(angle) * rad * 0.4, end[1] + Math.sin(angle) * rad * 0.4];
        heading = 0;
        status = "At Port";
        progress = 1;
        speedText = "0.0 kts · berthed";
      }

      const remainingH = (1 - phase) * cycle;
      const eta = status === "At Port" ? `${fmtEta(remainingH / 24)} · departure` : fmtEta(remainingH / 24);

      const shipment = shipmentFor(seed, 11, "ship");
      units.push({
        id: `ship-${(route.id + "-" + v.name).replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}-${si}`,
        kind: "ship",
        name: v.name,
        flag: v.flag,
        mmsi: v.mmsi,
        cls: CLASS_LABEL[v.cls],
        type: v.cls === "bulk" || v.cls === "tanker"
          ? `${CLASS_LABEL[v.cls]} · ${v.dwt} DWT · ${v.length} m`
          : `${CLASS_LABEL[v.cls]} · ${v.teu.toLocaleString("en-US")} TEU · ${v.length} m`,
        origin: meta.start,
        destination: meta.end,
        originLatLon: route.waypoints[0],
        destLatLon: route.waypoints[route.waypoints.length - 1],
        lat: pos[0],
        lon: pos[1],
        heading,
        speedText,
        progress: Math.round(progress * 1000) / 10,
        status,
        eta,
        etaMs: Date.now() + remainingH * 3600000,
        routeId: route.id,
        routeName: route.name,
        shipment: {
          ...shipment,
          teu: v.cls === "bulk" || v.cls === "tanker" || v.cls === "roro"
            ? undefined
            : Math.max(12, Math.round((v.teu || 4000) * (0.12 + (seed % 700) / 1000))),
          vessel: v.name,
        },
      });
    }
  }

  /* ── Trucks: hourly rotations between real cities ── */
  for (let ci = 0; ci < truckCorridors.length; ci++) {
    const corridor = truckCorridors[ci];
    const meta = TRUCK_META[ci];
    const [originCity, destCity] = corridor.name.split(" → ");

    for (let ti = 0; ti < corridor.trucks; ti++) {
      const seed = hash(`${corridor.id}:${ti}`);
      const speedKmh = 52 + (seed % 26); // 52–78 km/h
      const sailingH = (meta.lengthKm / speedKmh) * (0.9 + (seed % 300) / 1000);
      const stopH = 1.5 + (seed % 4); // 1.5–5 h rest / loading
      const cycle = sailingH + stopH;
      const phase0 = (seed % 997) / 997;
      const phase = (phase0 + elapsedH / cycle) % 1;
      const sailFrac = sailingH / cycle;

      let pos: LatLon;
      let heading: number;
      let status: UnitStatus;
      let progress: number;
      let speedText: string;

      if (phase < sailFrac) {
        const t = phase / sailFrac;
        const p = pointAlong(corridor.waypoints, t);
        pos = p.pos;
        heading = p.heading;
        status = t > 0.92 ? "Delivering" : "In Transit";
        progress = t;
        speedText = `${Math.round(speedKmh * (0.9 + (seed % 200) / 1000))} km/h`;
      } else {
        const end = corridor.waypoints[corridor.waypoints.length - 1];
        const angle = (seed % 628) / 100;
        const rad = (seed % 11) / 100;
        pos = [end[0] + Math.cos(angle) * rad * 0.2, end[1] + Math.sin(angle) * rad * 0.2];
        heading = 0;
        status = "Delivering";
        progress = 1;
        speedText = "0 km/h · stopped";
      }

      const remainingH = (1 - phase) * cycle;
      const shipment = shipmentFor(seed, 5, "truck");
      units.push({
        id: `truck-${corridor.id}-${ti}`,
        kind: "truck",
        name: `${corridor.id.toUpperCase().slice(0, 3)}-${(1000 + ((seed + ti) % 8999)).toString()}`,
        plate: `${corridor.id.toUpperCase().slice(0, 3)} ${(100 + ((seed + ti) % 899)).toString()}`,
        cls: "Road Freight",
        type: ti % 3 === 0 ? "FTL · Semi Trailer 13.6 m" : ti % 3 === 1 ? "LTL · Box Truck 20 m³" : "Reefer Trailer 13.6 m",
        origin: originCity ?? "Origin",
        destination: destCity ?? "Destination",
        originLatLon: corridor.waypoints[0],
        destLatLon: corridor.waypoints[corridor.waypoints.length - 1],
        lat: pos[0],
        lon: pos[1],
        heading,
        speedText,
        progress: Math.round(progress * 1000) / 10,
        status,
        eta: fmtEtaHours(remainingH),
        etaMs: Date.now() + remainingH * 3600000,
        routeId: corridor.id,
        routeName: corridor.name,
        shipment: {
          ...shipment,
          pallets: 2 + (seed % 22),
        },
      });
    }
  }

  return units;
}
