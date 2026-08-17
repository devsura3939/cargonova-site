/**
 * Real-world transport infrastructure for the live map: cargo-relevant
 * airports and road/rail border checkpoints with accurate coordinates.
 *
 * Coordinates are the published positions of real facilities (OpenStreetMap
 * / public airport data, ODbL). They make the map feel grounded — these are
 * actual places our network would route through, not fictional points.
 */

export type Airport = {
  iata: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  /** Cargo relevance: freight hub vs regular international airport. */
  cargo: boolean;
};

export type BorderCrossing = {
  id: string;
  name: string;
  countries: string;
  lat: number;
  lon: number;
  mode: "road" | "rail" | "road+rail";
};

export const airports: Airport[] = [
  // ── Caucasus & Central Asia (home region) ──
  { iata: "TBS", name: "Tbilisi International", city: "Tbilisi", country: "Georgia", lat: 41.6692, lon: 44.9547, cargo: true },
  { iata: "BUS", name: "Batumi International", city: "Batumi", country: "Georgia", lat: 41.6103, lon: 41.5994, cargo: false },
  { iata: "KUT", name: "Kutaisi International", city: "Kutaisi", country: "Georgia", lat: 42.1766, lon: 42.4826, cargo: false },
  { iata: "EVN", name: "Zvartnots International", city: "Yerevan", country: "Armenia", lat: 40.1473, lon: 44.3959, cargo: true },
  { iata: "GYD", name: "Heydar Aliyev International", city: "Baku", country: "Azerbaijan", lat: 40.4675, lon: 50.0467, cargo: true },
  { iata: "ALA", name: "Almaty International", city: "Almaty", country: "Kazakhstan", lat: 43.352, lon: 77.0405, cargo: true },
  { iata: "TAS", name: "Islam Karimov Tashkent", city: "Tashkent", country: "Uzbekistan", lat: 41.2579, lon: 69.2812, cargo: true },
  // ── Europe ──
  { iata: "IST", name: "Istanbul Airport", city: "Istanbul", country: "Türkiye", lat: 41.2753, lon: 28.7519, cargo: true },
  { iata: "SAW", name: "Sabiha Gökçen International", city: "Istanbul", country: "Türkiye", lat: 40.8986, lon: 29.3092, cargo: true },
  { iata: "BER", name: "Berlin Brandenburg", city: "Berlin", country: "Germany", lat: 52.3667, lon: 13.5033, cargo: true },
  { iata: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany", lat: 50.0379, lon: 8.5622, cargo: true },
  { iata: "LEJ", name: "Leipzig/Halle (DHL Hub)", city: "Leipzig", country: "Germany", lat: 51.4239, lon: 12.2364, cargo: true },
  { iata: "AMS", name: "Amsterdam Schiphol", city: "Amsterdam", country: "Netherlands", lat: 52.3105, lon: 4.7683, cargo: true },
  { iata: "LGG", name: "Liège Airport (Cargo)", city: "Liège", country: "Belgium", lat: 50.6374, lon: 5.4432, cargo: true },
  { iata: "LUX", name: "Luxembourg Findel", city: "Luxembourg", country: "Luxembourg", lat: 49.6266, lon: 6.2115, cargo: true },
  { iata: "CDG", name: "Paris Charles de Gaulle", city: "Paris", country: "France", lat: 49.0097, lon: 2.5479, cargo: true },
  { iata: "MXP", name: "Milan Malpensa", city: "Milan", country: "Italy", lat: 45.6306, lon: 8.7281, cargo: true },
  { iata: "VIE", name: "Vienna International", city: "Vienna", country: "Austria", lat: 48.1103, lon: 16.5697, cargo: true },
  { iata: "ZRH", name: "Zurich Airport", city: "Zurich", country: "Switzerland", lat: 47.4647, lon: 8.5492, cargo: false },
  { iata: "CPH", name: "Copenhagen Kastrup", city: "Copenhagen", country: "Denmark", lat: 55.618, lon: 12.6508, cargo: false },
  { iata: "BCN", name: "Barcelona El Prat", city: "Barcelona", country: "Spain", lat: 41.2974, lon: 2.0833, cargo: true },
  { iata: "OTP", name: "Bucharest Otopeni", city: "Bucharest", country: "Romania", lat: 44.5712, lon: 26.0858, cargo: true },
  { iata: "PRG", name: "Václav Havel Prague", city: "Prague", country: "Czechia", lat: 50.1008, lon: 14.26, cargo: false },
  { iata: "WAW", name: "Warsaw Chopin", city: "Warsaw", country: "Poland", lat: 52.1657, lon: 20.9671, cargo: true },
  { iata: "KBP", name: "Kyiv Boryspil", city: "Kyiv", country: "Ukraine", lat: 50.345, lon: 30.8948, cargo: true },
  // ── Global freight hubs ──
  { iata: "MEM", name: "FedEx SuperHub Memphis", city: "Memphis", country: "USA", lat: 35.0424, lon: -89.9767, cargo: true },
  { iata: "CVG", name: "DHL Americas Hub", city: "Cincinnati", country: "USA", lat: 39.0489, lon: -84.6678, cargo: true },
  { iata: "SDF", name: "UPS Worldport", city: "Louisville", country: "USA", lat: 38.1741, lon: -85.7365, cargo: true },
  { iata: "DXB", name: "Dubai International", city: "Dubai", country: "UAE", lat: 25.2532, lon: 55.3657, cargo: true },
  { iata: "HKG", name: "Hong Kong International", city: "Hong Kong", country: "China", lat: 22.308, lon: 113.9185, cargo: true },
  { iata: "SIN", name: "Singapore Changi", city: "Singapore", country: "Singapore", lat: 1.3644, lon: 103.9915, cargo: true },
];

export const borderCrossings: BorderCrossing[] = [
  // ── Caucasus / Türkiye — the home corridors ──
  { id: "sarpi", name: "Sarpi", countries: "Georgia – Türkiye", lat: 41.522, lon: 41.551, mode: "road" },
  { id: "vale", name: "Vale", countries: "Georgia – Türkiye", lat: 41.616, lon: 42.872, mode: "road" },
  { id: "kartsakhi", name: "Kartsakhi", countries: "Georgia – Türkiye", lat: 41.395, lon: 43.298, mode: "road" },
  { id: "upper-lars", name: "Kazbegi (Upper Lars)", countries: "Georgia – Russia", lat: 42.653, lon: 44.64, mode: "road" },
  { id: "red-bridge", name: "Red Bridge (Tsiteli Khidi)", countries: "Georgia – Azerbaijan", lat: 41.337, lon: 45.076, mode: "road" },
  { id: "sadakhlo", name: "Sadakhlo", countries: "Georgia – Armenia", lat: 41.246, lon: 44.783, mode: "road" },
  { id: "goytapa", name: "Göytəpə (Astara)", countries: "Azerbaijan – Iran", lat: 38.45, lon: 48.87, mode: "road" },
  { id: "khorgos", name: "Khorgos", countries: "Kazakhstan – China", lat: 44.18, lon: 80.42, mode: "road+rail" },
  // ── Europe ──
  { id: "kapikule", name: "Kapıkule", countries: "Türkiye – Bulgaria", lat: 41.636, lon: 26.366, mode: "road" },
  { id: "pazarkule", name: "Pazarkule", countries: "Türkiye – Greece", lat: 41.657, lon: 26.337, mode: "road" },
  { id: "swiecko", name: "Świecko", countries: "Germany – Poland", lat: 52.312, lon: 14.594, mode: "road" },
  { id: "rozvadov", name: "Rozvadov", countries: "Germany – Czechia", lat: 49.643, lon: 12.54, mode: "road" },
  { id: "roszke", name: "Röszke", countries: "Hungary – Serbia", lat: 46.19, lon: 20.04, mode: "road" },
  { id: "giurgiu", name: "Giurgiu (Danube Bridge)", countries: "Romania – Bulgaria", lat: 43.9, lon: 26.007, mode: "road+rail" },
  { id: "korczowa", name: "Korczowa", countries: "Poland – Ukraine", lat: 49.95, lon: 23.05, mode: "road" },
  { id: "medyka", name: "Medyka", countries: "Poland – Ukraine", lat: 49.805, lon: 22.943, mode: "road+rail" },
  { id: "hallstat", name: "Hollóháza", countries: "Hungary – Slovakia", lat: 48.55, lon: 21.42, mode: "road" },
];
