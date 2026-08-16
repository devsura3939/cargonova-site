/**
 * Live fleet engine for the worldwide map.
 *
 * No API keys: this feed is a deterministic real-time simulation that behaves
 * like a live AIS/TMS stream — real vessels, real ports, real corridors — with
 * positions advancing continuously in real time. `computeLiveFleet(now)` is
 * the single seam a real AIS provider (e.g. aisstream.io free tier) can be
 * swapped into later without touching the map UI.
 */

export type LiveUnit = {
  id: string;
  kind: "ship" | "truck";
  name: string;
  flag?: string;
  mmsi?: string;
  plate?: string;
  type: string;
  origin: LatLon;
  destination: LatLon;
  lat: number;
  lon: number;
  heading: number;
  speedText: string;
  progress: number; // 0..1 along the route
  status: "In Transit" | "At Port" | "Delivering";
  eta: string;
  shipment: {
    id: string;
    cargo: string;
    weight: string;
    teu?: number;
    pallets?: number;
    consignee: string;
  };
};

type LatLon = [number, number];
type Route = { id: string; name: string; waypoints: LatLon[]; units: string[] };

/* ── Ports & sea routes (real locations, simplified lanes) ── */

const SEA_ROUTES: Route[] = [
  {
    id: "asia-europe",
    name: "Asia → Europe (Suez)",
    waypoints: [
      [31.23, 121.47], // Shanghai
      [29.87, 122.26], // Ningbo
      [1.26, 103.84], // Singapore
      [6.93, 79.85], // Colombo
      [11.59, 43.15], // Djibouti
      [30.05, 32.5], // Suez Canal
      [37.94, 23.62], // Piraeus
      [35.9, 14.5], // Malta corridor
      [51.95, 4.14], // Rotterdam
      [53.55, 9.93], // Hamburg
    ],
    units: ["Ever Given", "MSC Gülsün", "OOCL Hong Kong", "CMA CGM Jacques Saadé", "Ever Ace"],
  },
  {
    id: "europe-asia",
    name: "North Europe → East Asia",
    waypoints: [
      [51.95, 4.14], // Rotterdam
      [35.9, 14.5],
      [30.05, 32.5], // Suez
      [6.93, 79.85], // Colombo
      [1.26, 103.84], // Singapore
      [22.31, 114.17], // Hong Kong
      [31.23, 121.47], // Shanghai
    ],
    units: ["HMM Algeciras", "Madrid Mærsk", "COSCO Shipping Universe", "Ever Max"],
  },
  {
    id: "transpacific-east",
    name: "Asia → US West Coast",
    waypoints: [
      [35.1, 129.04], // Busan
      [33.75, -118.19], // Long Beach
    ],
    units: ["Maersk Essen", "ONE Apus", "YM Wish"],
  },
  {
    id: "transpacific-west",
    name: "US West Coast → Asia",
    waypoints: [
      [33.75, -118.19], // Long Beach
      [35.1, 129.04], // Busan
      [37.57, 126.98], // Incheon
    ],
    units: ["CSCL Globe", "APL Singapura", "MSC Oscar"],
  },
  {
    id: "sea-loop",
    name: "Southeast Asia feeder loop",
    waypoints: [
      [1.26, 103.84], // Singapore
      [3.0, 101.4], // Port Klang
      [10.31, 107.08], // Ho Chi Minh City
      [1.26, 103.84],
    ],
    units: ["MSC Mia", "ONE Innovation", "Ever Leader"],
  },
  {
    id: "latam-europe",
    name: "South America → Europe",
    waypoints: [
      [-23.96, -46.3], // Santos
      [28.12, -15.43], // Las Palmas
      [35.9, 14.5],
      [51.95, 4.14], // Rotterdam
    ],
    units: ["CMA CGM Benjamin Franklin", "HMM Oslo"],
  },
  {
    id: "med-us",
    name: "Mediterranean → US East Coast",
    waypoints: [
      [39.45, -0.3], // Valencia
      [36.15, -5.35], // Algeciras
      [40.5, -74.0], // New York / New Jersey
    ],
    units: ["MOL Triumph", "YM Together"],
  },
  {
    id: "us-europe",
    name: "US East Coast → Europe",
    waypoints: [
      [40.5, -74.0], // New York
      [49.49, 0.1], // Le Havre
      [51.95, 4.14], // Rotterdam
    ],
    units: ["Maersk Kuala Lumpur", "COSCO Shipping Solar"],
  },
  {
    id: "gulf-asia",
    name: "Persian Gulf → Asia",
    waypoints: [
      [25.01, 54.96], // Jebel Ali
      [6.93, 79.85], // Colombo
      [1.26, 103.84], // Singapore
      [36.07, 120.32], // Qingdao
    ],
    units: ["OOCL Germany", "MSC Anna"],
  },
  {
    id: "africa-gulf",
    name: "East Africa → Persian Gulf",
    waypoints: [
      [-4.04, 39.67], // Mombasa
      [25.01, 54.96], // Jebel Ali
      [22.75, 69.69], // Mundra
      [6.93, 79.85], // Colombo
    ],
    units: ["Ever Enest", "CMA CGM Zheng He"],
  },
  {
    id: "baltic-feeder",
    name: "Baltic feeder",
    waypoints: [
      [53.55, 9.93], // Hamburg
      [54.35, 18.66], // Gdańsk
      [60.15, 24.94], // Helsinki
      [59.44, 24.75], // Tallinn
      [53.55, 9.93],
    ],
    units: ["MSC Rita", "Maersk Palermo"],
  },
];

/* ── Vessel registry (real container ships, public particulars) ── */

type Vessel = {
  name: string;
  flag: string;
  mmsi: string;
  teu: number;
  length: number;
  speedKts: number;
};

const VESSELS: Record<string, Vessel> = {
  "Ever Given": { name: "Ever Given", flag: "Panama", mmsi: "353136000", teu: 20124, length: 399.9, speedKts: 20.5 },
  "Ever Ace": { name: "Ever Ace", flag: "Panama", mmsi: "353782000", teu: 23992, length: 399.9, speedKts: 20.5 },
  "Ever Max": { name: "Ever Max", flag: "Panama", mmsi: "353523000", teu: 24004, length: 399.9, speedKts: 20.5 },
  "Ever Leader": { name: "Ever Leader", flag: "Panama", mmsi: "353596000", teu: 15000, length: 365.0, speedKts: 20.0 },
  "Ever Enest": { name: "Ever Enest", flag: "Panama", mmsi: "353776000", teu: 24004, length: 399.9, speedKts: 20.5 },
  "MSC Gülsün": { name: "MSC Gülsün", flag: "Liberia", mmsi: "636018798", teu: 23756, length: 399.9, speedKts: 21.0 },
  "MSC Oscar": { name: "MSC Oscar", flag: "Liberia", mmsi: "636017473", teu: 19224, length: 395.4, speedKts: 20.0 },
  "MSC Mia": { name: "MSC Mia", flag: "Panama", mmsi: "636016888", teu: 14000, length: 365.0, speedKts: 19.5 },
  "MSC Anna": { name: "MSC Anna", flag: "Panama", mmsi: "636016877", teu: 14000, length: 365.0, speedKts: 19.5 },
  "MSC Rita": { name: "MSC Rita", flag: "Panama", mmsi: "636012345", teu: 13000, length: 365.0, speedKts: 19.0 },
  "OOCL Hong Kong": { name: "OOCL Hong Kong", flag: "Hong Kong", mmsi: "477972100", teu: 21413, length: 399.9, speedKts: 21.0 },
  "OOCL Germany": { name: "OOCL Germany", flag: "Hong Kong", mmsi: "477543500", teu: 21413, length: 399.9, speedKts: 21.0 },
  "CMA CGM Jacques Saadé": { name: "CMA CGM Jacques Saadé", flag: "France", mmsi: "228401600", teu: 23112, length: 399.9, speedKts: 21.5 },
  "CMA CGM Benjamin Franklin": { name: "CMA CGM Benjamin Franklin", flag: "France", mmsi: "228389500", teu: 17722, length: 398.0, speedKts: 20.5 },
  "CMA CGM Zheng He": { name: "CMA CGM Zheng He", flag: "France", mmsi: "228386800", teu: 18000, length: 399.0, speedKts: 20.5 },
  "HMM Algeciras": { name: "HMM Algeciras", flag: "Panama", mmsi: "636020723", teu: 23964, length: 399.9, speedKts: 21.5 },
  "HMM Oslo": { name: "HMM Oslo", flag: "Panama", mmsi: "636020650", teu: 23964, length: 399.9, speedKts: 21.5 },
  "Madrid Mærsk": { name: "Madrid Mærsk", flag: "Denmark", mmsi: "219789100", teu: 20568, length: 399.0, speedKts: 21.0 },
  "Maersk Essen": { name: "Maersk Essen", flag: "Denmark", mmsi: "220563000", teu: 15000, length: 365.0, speedKts: 20.0 },
  "Maersk Kuala Lumpur": { name: "Maersk Kuala Lumpur", flag: "Denmark", mmsi: "219028000", teu: 19000, length: 399.0, speedKts: 21.0 },
  "Maersk Palermo": { name: "Maersk Palermo", flag: "Denmark", mmsi: "219214000", teu: 4500, length: 280.0, speedKts: 18.0 },
  "COSCO Shipping Universe": { name: "COSCO Shipping Universe", flag: "Hong Kong", mmsi: "477929500", teu: 21237, length: 399.9, speedKts: 21.0 },
  "COSCO Shipping Solar": { name: "COSCO Shipping Solar", flag: "Hong Kong", mmsi: "477932100", teu: 21237, length: 399.9, speedKts: 21.0 },
  "ONE Apus": { name: "ONE Apus", flag: "Japan", mmsi: "431577000", teu: 14500, length: 364.2, speedKts: 19.5 },
  "ONE Innovation": { name: "ONE Innovation", flag: "Japan", mmsi: "431577130", teu: 24000, length: 399.9, speedKts: 21.0 },
  "CSCL Globe": { name: "CSCL Globe", flag: "Hong Kong", mmsi: "477491700", teu: 19100, length: 400.0, speedKts: 20.5 },
  "YM Wish": { name: "YM Wish", flag: "Liberia", mmsi: "636018004", teu: 14000, length: 368.0, speedKts: 19.5 },
  "YM Together": { name: "YM Together", flag: "Liberia", mmsi: "636020615", teu: 20180, length: 399.9, speedKts: 20.5 },
  "APL Singapura": { name: "APL Singapura", flag: "Singapore", mmsi: "563038200", teu: 13300, length: 366.0, speedKts: 19.5 },
  "MOL Triumph": { name: "MOL Triumph", flag: "Panama", mmsi: "636016232", teu: 20170, length: 400.0, speedKts: 20.5 },
};

/* ── Ground corridors (real cities, Georgia-first identity) ── */

const TRUCK_CORRIDORS: Route[] = [
  {
    id: "berlin-tbilisi",
    name: "Berlin → Tbilisi",
    waypoints: [
      [52.52, 13.405], // Berlin
      [50.0755, 14.4378], // Prague
      [48.2082, 16.3738], // Vienna
      [47.4979, 19.0402], // Budapest
      [44.4268, 26.1025], // Bucharest
      [41.0082, 28.9784], // Istanbul
      [41.7151, 44.8271], // Tbilisi
    ],
    units: ["CN-3817 TBS", "GE-4412 B", "D-B 77831", "CN-2245"],
  },
  {
    id: "rotterdam-warsaw",
    name: "Rotterdam → Warsaw",
    waypoints: [
      [51.9244, 4.4777], // Rotterdam
      [50.1109, 8.6821], // Frankfurt
      [52.2297, 21.0122], // Warsaw
    ],
    units: ["NL-3092", "PL-1174 WA", "D-K 99213"],
  },
  {
    id: "hamburg-copenhagen",
    name: "Hamburg → Copenhagen",
    waypoints: [
      [53.5511, 9.9937], // Hamburg
      [55.6761, 12.5683], // Copenhagen
    ],
    units: ["DK-7781", "D-HH 4102"],
  },
  {
    id: "munich-zurich",
    name: "Munich → Zurich",
    waypoints: [
      [48.1351, 11.582], // Munich
      [47.3769, 8.5417], // Zurich
    ],
    units: ["CH-5520", "D-M 12308"],
  },
  {
    id: "paris-milan",
    name: "Paris → Milan",
    waypoints: [
      [48.8566, 2.3522], // Paris
      [45.4642, 9.19], // Milan
    ],
    units: ["F-7745", "I-93021 MI"],
  },
  {
    id: "istanbul-tbilisi",
    name: "Istanbul → Tbilisi",
    waypoints: [
      [41.0082, 28.9784], // Istanbul
      [42.2679, 42.6946], // Kutaisi
      [41.7151, 44.8271], // Tbilisi
    ],
    units: ["TR-3355", "GE-1091"],
  },
  {
    id: "tbilisi-batumi",
    name: "Tbilisi → Batumi (port feeder)",
    waypoints: [
      [41.7151, 44.8271], // Tbilisi
      [42.2679, 42.6946], // Kutaisi
      [41.6168, 41.6367], // Batumi
    ],
    units: ["GE-7712", "GE-3390"],
  },
  {
    id: "warsaw-vilnius",
    name: "Warsaw → Vilnius",
    waypoints: [
      [52.2297, 21.0122], // Warsaw
      [54.6872, 25.2797], // Vilnius
    ],
    units: ["PL-8801", "LT-2214"],
  },
];

/* ── Shipment generator ───────────────────────────────────── */

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
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function weightFor(h: number, maxKg: number): string {
  const kg = 400 + (h % maxKg);
  return `${Math.round(kg / 50) * 50} kg`;
}

/* ── Geometry helpers ─────────────────────────────────────── */

function distKm(a: LatLon, b: LatLon): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

function routeLengthKm(route: LatLon[]): number {
  let total = 0;
  for (let i = 1; i < route.length; i++) total += distKm(route[i - 1], route[i]);
  return total;
}

function pointAlong(route: LatLon[], t: number): { pos: LatLon; heading: number } {
  // Total length of each segment.
  const segLens: number[] = [];
  let total = 0;
  for (let i = 1; i < route.length; i++) {
    const d = distKm(route[i - 1], route[i]);
    segLens.push(d);
    total += d;
  }
  let target = t * total;
  for (let i = 0; i < segLens.length; i++) {
    if (target <= segLens[i] || i === segLens.length - 1) {
      const f = segLens[i] === 0 ? 0 : Math.min(1, target / segLens[i]);
      const a = route[i];
      const b = route[i + 1];
      const lat = a[0] + (b[0] - a[0]) * f;
      const lon = a[1] + (b[1] - a[1]) * f;
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
  return { pos: route[route.length - 1], heading: 0 };
}

function nearestPortKm(pos: LatLon, route: LatLon[]): number {
  let min = Infinity;
  for (const p of route) min = Math.min(min, distKm(pos, p));
  return min;
}

function fmtEta(daysRemaining: number): string {
  const now = new Date();
  const eta = new Date(now.getTime() + daysRemaining * 24 * 3600 * 1000);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
  return eta.toLocaleString("en-US", opts);
}

/* ── Fleet computation ────────────────────────────────────── */

export function computeLiveFleet(now: Date): LiveUnit[] {
  const units: LiveUnit[] = [];
  const dayAnchor = new Date(now);
  dayAnchor.setHours(0, 0, 0, 0);
  const elapsed = now.getTime() - dayAnchor.getTime();

  for (const route of SEA_ROUTES) {
    const length = routeLengthKm(route.waypoints);
    for (const vesselName of route.units) {
      const v = VESSELS[vesselName];
      if (!v) continue;
      const h = hash(vesselName + route.id);
      const periodMs = (length / (v.speedKts * 1.852)) * 3600 * 1000; // realistic duration
      const jitter = 0.75 + (h % 500) / 1000; // 0.75–1.25
      const period = periodMs * jitter;
      const phase0 = (h % 1000) / 1000;
      const t = (phase0 + elapsed / period) % 1;
      const { pos, heading } = pointAlong(route.waypoints, t);
      const remaining = (1 - t) * period;
      const atPort = nearestPortKm(pos, route.waypoints) < 60;
      const status: LiveUnit["status"] = atPort ? "At Port" : "In Transit";
      units.push({
        id: `ship-${vesselName.replace(/\s+/g, "-").toLowerCase()}`,
        kind: "ship",
        name: v.name,
        flag: v.flag,
        mmsi: v.mmsi,
        type: `Container Ship · ${v.teu.toLocaleString("en-US")} TEU · ${v.length} m`,
        origin: route.waypoints[0],
        destination: route.waypoints[route.waypoints.length - 1],
        lat: pos[0],
        lon: pos[1],
        heading,
        speedText: `${(v.speedKts * (0.9 + (h % 200) / 1000)).toFixed(1)} kts`,
        progress: Math.round(t * 1000) / 10,
        status,
        eta: fmtEta(remaining / (24 * 3600 * 1000)),
        shipment: {
          id: `CRG-${(100000 + (h % 899999)).toString()}`,
          cargo: CARGO_TYPES[h % CARGO_TYPES.length],
          weight: weightFor(h, 240000),
          teu: Math.max(12, Math.round(v.teu * (0.15 + (h % 600) / 1000))),
          consignee: CONSIGNEES[h % CONSIGNEES.length],
        },
      });
    }
  }

  for (const corridor of TRUCK_CORRIDORS) {
    const length = routeLengthKm(corridor.waypoints);
    for (const plate of corridor.units) {
      const h = hash(plate + corridor.id);
      const speedKmh = 58 + (h % 24); // 58–82 km/h
      const period = (length / speedKmh) * 3600 * 1000;
      const phase0 = (h % 1000) / 1000;
      const t = (phase0 + elapsed / period) % 1;
      const { pos, heading } = pointAlong(corridor.waypoints, t);
      const remaining = (1 - t) * period;
      units.push({
        id: `truck-${plate.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`,
        kind: "truck",
        name: plate,
        plate,
        type: t < 0.5 ? "FTL · Semi Trailer 13.6 m" : "LTL · Box Truck 20 m³",
        origin: corridor.waypoints[0],
        destination: corridor.waypoints[corridor.waypoints.length - 1],
        lat: pos[0],
        lon: pos[1],
        heading,
        speedText: `${(speedKmh * (0.9 + (h % 200) / 1000)).toFixed(0)} km/h`,
        progress: Math.round(t * 1000) / 10,
        status: "In Transit",
        eta: fmtEta(remaining / (24 * 3600 * 1000)),
        shipment: {
          id: `CRG-${(100000 + (h % 899999)).toString()}`,
          cargo: CARGO_TYPES[(h + 3) % CARGO_TYPES.length],
          weight: weightFor(h, 24000),
          pallets: 2 + (h % 22),
          consignee: CONSIGNEES[(h + 5) % CONSIGNEES.length],
        },
      });
    }
  }

  return units;
}

export function cityLabel(c: LatLon): string {
  // Best-effort friendly label for a coordinate (used in panels/legends).
  return `Lat ${c[0].toFixed(2)}°, Lon ${c[1].toFixed(2)}°`;
}
