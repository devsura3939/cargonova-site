/**
 * Coverage network — real hub cities with geographic coordinates, structured
 * so real corridor data can be plugged in later. lon/lat drive the live map;
 * x/y are kept for the compact SVG fallback used on small screens.
 */

export type Hub = {
  id: string;
  name: string;
  city: string;
  lat: number;
  lon: number;
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
  { id: "ber", name: "Berlin Logistics Park", city: "Berlin", lat: 52.52, lon: 13.405, x: 52, y: 22, tier: "major", countries: ["Germany"] },
  { id: "ham", name: "Hamburg Terminal", city: "Hamburg", lat: 53.55, lon: 9.99, x: 44, y: 14, tier: "major", countries: ["Germany"] },
  { id: "mun", name: "Munich Cargo Terminal", city: "Munich", lat: 48.14, lon: 11.58, x: 57, y: 32, tier: "regional", countries: ["Germany"] },
  { id: "ams", name: "Amsterdam Hub", city: "Amsterdam", lat: 52.37, lon: 4.9, x: 30, y: 12, tier: "gateway", countries: ["Netherlands"] },
  { id: "rot", name: "Rotterdam Distribution Centre", city: "Rotterdam", lat: 51.92, lon: 4.48, x: 27, y: 18, tier: "gateway", countries: ["Netherlands"] },
  { id: "par", name: "Paris Hub", city: "Paris", lat: 48.86, lon: 2.35, x: 25, y: 34, tier: "major", countries: ["France"] },
  { id: "mil", name: "Milan Hub", city: "Milan", lat: 45.46, lon: 9.19, x: 44, y: 46, tier: "regional", countries: ["Italy"] },
  { id: "vie", name: "Vienna Hub", city: "Vienna", lat: 48.21, lon: 16.37, x: 62, y: 34, tier: "regional", countries: ["Austria"] },
  { id: "war", name: "Warsaw Hub", city: "Warsaw", lat: 52.23, lon: 21.01, x: 70, y: 20, tier: "major", countries: ["Poland"] },
  { id: "pra", name: "Prague Hub", city: "Prague", lat: 50.08, lon: 14.44, x: 60, y: 27, tier: "regional", countries: ["Czechia"] },
  { id: "ist", name: "Istanbul Logistics Hub", city: "Istanbul", lat: 41.01, lon: 28.98, x: 80, y: 52, tier: "gateway", countries: ["Türkiye"] },
  { id: "tbs", name: "Tbilisi Hub", city: "Tbilisi", lat: 41.72, lon: 44.83, x: 92, y: 58, tier: "gateway", countries: ["Georgia"] },
  { id: "cph", name: "Copenhagen Hub", city: "Copenhagen", lat: 55.68, lon: 12.57, x: 46, y: 6, tier: "regional", countries: ["Denmark"] },
  { id: "zrh", name: "Zurich Hub", city: "Zurich", lat: 47.38, lon: 8.54, x: 40, y: 38, tier: "regional", countries: ["Switzerland"] },
  { id: "bcn", name: "Barcelona Hub", city: "Barcelona", lat: 41.39, lon: 2.17, x: 14, y: 52, tier: "regional", countries: ["Spain"] },
  { id: "buk", name: "Bucharest Hub", city: "Bucharest", lat: 44.43, lon: 26.1, x: 78, y: 40, tier: "regional", countries: ["Romania"] },
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
