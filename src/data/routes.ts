/**
 * Coverage network — demo data structured so real geographic data can be
 * plugged in later. Coordinates are placeholder positions on a normalized
 * 0–100 (x, y) canvas for the SVG map; a real map provider (Mapbox) would
 * supply lon/lat instead.
 */

export type Hub = {
  id: string;
  name: string;
  city: string;
  x: number;
  y: number;
  tier: "major" | "regional" | "gateway";
  countries: string[];
};

export type Corridor = {
  id: string;
  from: string;
  to: string;
  via: string[];
  label: string;
  transitDays: string;
};

export const hubs: Hub[] = [
  { id: "ber", name: "Berlin Logistics Park", city: "Berlin", x: 52, y: 22, tier: "major", countries: ["Germany"] },
  { id: "ham", name: "Hamburg Terminal", city: "Hamburg", x: 44, y: 14, tier: "major", countries: ["Germany"] },
  { id: "mun", name: "Munich Cargo Terminal", city: "Munich", x: 57, y: 32, tier: "regional", countries: ["Germany"] },
  { id: "ams", name: "Amsterdam Hub", city: "Amsterdam", x: 30, y: 12, tier: "gateway", countries: ["Netherlands"] },
  { id: "rot", name: "Rotterdam Distribution Centre", city: "Rotterdam", x: 27, y: 18, tier: "gateway", countries: ["Netherlands"] },
  { id: "par", name: "Paris Hub", city: "Paris", x: 25, y: 34, tier: "major", countries: ["France"] },
  { id: "mil", name: "Milan Hub", city: "Milan", x: 44, y: 46, tier: "regional", countries: ["Italy"] },
  { id: "vie", name: "Vienna Hub", city: "Vienna", x: 62, y: 34, tier: "regional", countries: ["Austria"] },
  { id: "war", name: "Warsaw Hub", city: "Warsaw", x: 70, y: 20, tier: "major", countries: ["Poland"] },
  { id: "pra", name: "Prague Hub", city: "Prague", x: 60, y: 27, tier: "regional", countries: ["Czechia"] },
  { id: "ist", name: "Istanbul Logistics Hub", city: "Istanbul", x: 80, y: 52, tier: "gateway", countries: ["Türkiye"] },
  { id: "tbs", name: "Tbilisi Hub", city: "Tbilisi", x: 92, y: 58, tier: "gateway", countries: ["Georgia"] },
  { id: "cph", name: "Copenhagen Hub", city: "Copenhagen", x: 46, y: 6, tier: "regional", countries: ["Denmark"] },
  { id: "zrh", name: "Zurich Hub", city: "Zurich", x: 40, y: 38, tier: "regional", countries: ["Switzerland"] },
  { id: "bcn", name: "Barcelona Hub", city: "Barcelona", x: 14, y: 52, tier: "regional", countries: ["Spain"] },
  { id: "buk", name: "Bucharest Hub", city: "Bucharest", x: 78, y: 40, tier: "regional", countries: ["Romania"] },
];

export const corridors: Corridor[] = [
  { id: "c1", from: "ber", to: "tbs", via: ["pra", "ist"], label: "Caucasus Corridor", transitDays: "5–6 days" },
  { id: "c2", from: "ams", to: "war", via: ["ber"], label: "East–West Corridor", transitDays: "2 days" },
  { id: "c3", from: "rot", to: "ist", via: ["vie", "buk"], label: "Southeast Corridor", transitDays: "4 days" },
  { id: "c4", from: "par", to: "mil", via: [], label: "Alpine Corridor", transitDays: "1–2 days" },
  { id: "c5", from: "cph", to: "zrh", via: ["ham", "ber", "mun"], label: "Nordic–South Corridor", transitDays: "2–3 days" },
  { id: "c6", from: "bcn", to: "ber", via: ["par"], label: "Iberian Corridor", transitDays: "2–3 days" },
];

export const regions = [
  { id: "dach", name: "DACH Region", note: "Daily scheduled lanes between Germany, Austria, and Switzerland." },
  { id: "benelux", name: "Benelux", note: "Gateway connections through Rotterdam and Amsterdam ports." },
  { id: "scandinavia", name: "Scandinavia", note: "Nordic corridor with ferry connections via Denmark." },
  { id: "csee", name: "CEE & Balkans", note: "Eastern European lanes to Poland, Czechia, Romania, and the Balkans." },
  { id: "iberia", name: "Iberia", note: "Peninsula coverage via Barcelona and Madrid connections." },
  { id: "caucasus", name: "Caucasus & Middle East", note: "International corridor via Istanbul to Georgia and beyond." },
];

export function getHub(id: string): Hub | undefined {
  return hubs.find((h) => h.id === id);
}

export function corridorPath(c: Corridor): Hub[] {
  const ids = [c.from, ...c.via, c.to];
  return ids.map((id) => getHub(id)!).filter(Boolean);
}
