/**
 * Registry of major world ports (real locations, coordinates point to the
 * harbor approach / anchorage slightly offshore so vessels render on water).
 */
export type Port = {
  id: string;
  name: string;
  country: string;
  region: string;
  lat: number;
  lon: number;
  tier: "mega" | "major" | "regional";
};

export const ports: Port[] = [
  // ── East & Southeast Asia ──
  { id: "sha", name: "Shanghai", country: "China", region: "East Asia", lat: 31.2, lon: 122.4, tier: "mega" },
  { id: "nin", name: "Ningbo-Zhoushan", country: "China", region: "East Asia", lat: 29.9, lon: 122.4, tier: "mega" },
  { id: "szh", name: "Shenzhen", country: "China", region: "East Asia", lat: 22.5, lon: 114.2, tier: "mega" },
  { id: "hkg", name: "Hong Kong", country: "China", region: "East Asia", lat: 22.3, lon: 114.2, tier: "mega" },
  { id: "kao", name: "Kaohsiung", country: "Taiwan", region: "East Asia", lat: 22.6, lon: 120.3, tier: "major" },
  { id: "qin", name: "Qingdao", country: "China", region: "East Asia", lat: 36.0, lon: 120.4, tier: "major" },
  { id: "tia", name: "Tianjin", country: "China", region: "East Asia", lat: 38.9, lon: 118.1, tier: "major" },
  { id: "xam", name: "Xiamen", country: "China", region: "East Asia", lat: 24.4, lon: 118.2, tier: "major" },
  { id: "bus", name: "Busan", country: "South Korea", region: "East Asia", lat: 35.05, lon: 129.1, tier: "mega" },
  { id: "inc", name: "Incheon", country: "South Korea", region: "East Asia", lat: 37.4, lon: 126.5, tier: "major" },
  { id: "tky", name: "Tokyo", country: "Japan", region: "East Asia", lat: 35.6, lon: 139.9, tier: "mega" },
  { id: "yok", name: "Yokohama", country: "Japan", region: "East Asia", lat: 35.45, lon: 139.7, tier: "major" },
  { id: "kbe", name: "Kobe", country: "Japan", region: "East Asia", lat: 34.6, lon: 135.3, tier: "major" },
  { id: "sgp", name: "Singapore", country: "Singapore", region: "Southeast Asia", lat: 1.26, lon: 103.8, tier: "mega" },
  { id: "klg", name: "Port Klang", country: "Malaysia", region: "Southeast Asia", lat: 2.95, lon: 101.3, tier: "major" },
  { id: "tpp", name: "Tanjung Pelepas", country: "Malaysia", region: "Southeast Asia", lat: 1.36, lon: 103.5, tier: "major" },
  { id: "lab", name: "Laem Chabang", country: "Thailand", region: "Southeast Asia", lat: 13.05, lon: 100.9, tier: "major" },
  { id: "hcm", name: "Ho Chi Minh", country: "Vietnam", region: "Southeast Asia", lat: 10.3, lon: 107.0, tier: "major" },
  { id: "mnl", name: "Manila", country: "Philippines", region: "Southeast Asia", lat: 14.55, lon: 120.9, tier: "major" },
  { id: "jak", name: "Jakarta", country: "Indonesia", region: "Southeast Asia", lat: -6.05, lon: 106.9, tier: "major" },
  { id: "srb", name: "Surabaya", country: "Indonesia", region: "Southeast Asia", lat: -7.2, lon: 112.7, tier: "regional" },

  // ── Indian subcontinent & Middle East ──
  { id: "col", name: "Colombo", country: "Sri Lanka", region: "South Asia", lat: 6.95, lon: 79.85, tier: "mega" },
  { id: "nva", name: "Nhava Sheva", country: "India", region: "South Asia", lat: 18.95, lon: 72.95, tier: "major" },
  { id: "mun", name: "Mundra", country: "India", region: "South Asia", lat: 22.75, lon: 69.6, tier: "major" },
  { id: "chn", name: "Chennai", country: "India", region: "South Asia", lat: 13.1, lon: 80.4, tier: "major" },
  { id: "kol", name: "Kolkata", country: "India", region: "South Asia", lat: 21.6, lon: 88.2, tier: "regional" },
  { id: "jbl", name: "Jebel Ali", country: "UAE", region: "Middle East", lat: 25.0, lon: 55.0, tier: "mega" },
  { id: "dmm", name: "Dammam", country: "Saudi Arabia", region: "Middle East", lat: 26.5, lon: 50.2, tier: "major" },
  { id: "sal", name: "Salalah", country: "Oman", region: "Middle East", lat: 16.9, lon: 54.0, tier: "major" },
  { id: "krw", name: "Karachi", country: "Pakistan", region: "South Asia", lat: 24.8, lon: 66.95, tier: "major" },
  { id: "baa", name: "Bandar Abbas", country: "Iran", region: "Middle East", lat: 27.1, lon: 56.3, tier: "regional" },

  // ── Africa ──
  { id: "dji", name: "Djibouti", country: "Djibouti", region: "Africa", lat: 11.6, lon: 43.1, tier: "major" },
  { id: "suz", name: "Suez Canal", country: "Egypt", region: "Africa", lat: 30.0, lon: 32.5, tier: "mega" },
  { id: "ale", name: "Alexandria", country: "Egypt", region: "Africa", lat: 31.2, lon: 29.9, tier: "major" },
  { id: "mom", name: "Mombasa", country: "Kenya", region: "Africa", lat: -4.05, lon: 39.65, tier: "major" },
  { id: "dar", name: "Dar es Salaam", country: "Tanzania", region: "Africa", lat: -6.8, lon: 39.3, tier: "major" },
  { id: "dur", name: "Durban", country: "South Africa", region: "Africa", lat: -29.85, lon: 31.05, tier: "major" },
  { id: "cpt", name: "Cape Town", country: "South Africa", region: "Africa", lat: -33.9, lon: 18.4, tier: "major" },
  { id: "lag", name: "Lagos (Apapa)", country: "Nigeria", region: "Africa", lat: 6.4, lon: 3.35, tier: "major" },
  { id: "tem", name: "Tema", country: "Ghana", region: "Africa", lat: 5.62, lon: 0.02, tier: "regional" },
  { id: "abi", name: "Abidjan", country: "Côte d'Ivoire", region: "Africa", lat: 5.3, lon: -4.0, tier: "regional" },
  { id: "cas", name: "Casablanca", country: "Morocco", region: "Africa", lat: 33.6, lon: -7.6, tier: "regional" },

  // ── Europe (Atlantic & North Sea) ──
  { id: "rot", name: "Rotterdam", country: "Netherlands", region: "North Europe", lat: 51.95, lon: 4.1, tier: "mega" },
  { id: "ant", name: "Antwerp-Bruges", country: "Belgium", region: "North Europe", lat: 51.3, lon: 4.3, tier: "mega" },
  { id: "ham", name: "Hamburg", country: "Germany", region: "North Europe", lat: 53.9, lon: 8.9, tier: "mega" },
  { id: "brv", name: "Bremerhaven", country: "Germany", region: "North Europe", lat: 53.55, lon: 8.55, tier: "major" },
  { id: "lhv", name: "Le Havre", country: "France", region: "North Europe", lat: 49.45, lon: 0.1, tier: "major" },
  { id: "fxt", name: "Felixstowe", country: "United Kingdom", region: "North Europe", lat: 51.95, lon: 1.3, tier: "major" },
  { id: "lon", name: "London Gateway", country: "United Kingdom", region: "North Europe", lat: 51.5, lon: 0.5, tier: "major" },
  { id: "gdn", name: "Gdańsk", country: "Poland", region: "Baltic", lat: 54.4, lon: 18.65, tier: "major" },
  { id: "kla", name: "Klaipėda", country: "Lithuania", region: "Baltic", lat: 55.7, lon: 21.1, tier: "regional" },
  { id: "rig", name: "Riga", country: "Latvia", region: "Baltic", lat: 57.0, lon: 24.0, tier: "regional" },
  { id: "tal", name: "Tallinn", country: "Estonia", region: "Baltic", lat: 59.45, lon: 24.75, tier: "regional" },
  { id: "hel", name: "Helsinki", country: "Finland", region: "Baltic", lat: 60.15, lon: 24.95, tier: "regional" },
  { id: "got", name: "Gothenburg", country: "Sweden", region: "Baltic", lat: 57.7, lon: 11.9, tier: "regional" },
  { id: "osl", name: "Oslo", country: "Norway", region: "North Europe", lat: 59.9, lon: 10.7, tier: "regional" },
  { id: "cph", name: "Copenhagen", country: "Denmark", region: "North Europe", lat: 55.7, lon: 12.6, tier: "regional" },

  // ── Mediterranean & Black Sea ──
  { id: "pir", name: "Piraeus", country: "Greece", region: "Mediterranean", lat: 37.95, lon: 23.6, tier: "major" },
  { id: "ist", name: "Istanbul (Ambarli)", country: "Türkiye", region: "Mediterranean", lat: 41.0, lon: 28.9, tier: "major" },
  { id: "izt", name: "Izmir (Aliaga)", country: "Türkiye", region: "Mediterranean", lat: 38.8, lon: 26.9, tier: "regional" },
  { id: "val", name: "Valencia", country: "Spain", region: "Mediterranean", lat: 39.45, lon: -0.3, tier: "major" },
  { id: "bcn", name: "Barcelona", country: "Spain", region: "Mediterranean", lat: 41.3, lon: 2.2, tier: "major" },
  { id: "alg", name: "Algeciras", country: "Spain", region: "Mediterranean", lat: 36.1, lon: -5.4, tier: "major" },
  { id: "gen", name: "Genoa", country: "Italy", region: "Mediterranean", lat: 44.4, lon: 8.9, tier: "major" },
  { id: "gio", name: "Gioia Tauro", country: "Italy", region: "Mediterranean", lat: 38.4, lon: 15.9, tier: "major" },
  { id: "mar", name: "Marseille-Fos", country: "France", region: "Mediterranean", lat: 43.35, lon: 5.3, tier: "major" },
  { id: "con", name: "Constanța", country: "Romania", region: "Black Sea", lat: 44.15, lon: 28.65, tier: "major" },
  { id: "ode", name: "Odesa", country: "Ukraine", region: "Black Sea", lat: 46.45, lon: 30.75, tier: "major" },
  { id: "nov", name: "Novorossiysk", country: "Russia", region: "Black Sea", lat: 44.7, lon: 37.8, tier: "major" },
  { id: "pot", name: "Poti", country: "Georgia", region: "Black Sea", lat: 42.15, lon: 41.65, tier: "regional" },
  { id: "batu", name: "Batumi", country: "Georgia", region: "Black Sea", lat: 41.65, lon: 41.6, tier: "regional" },

  // ── North & South America ──
  { id: "nyk", name: "New York / New Jersey", country: "USA", region: "North America", lat: 40.5, lon: -74.0, tier: "mega" },
  { id: "sav", name: "Savannah", country: "USA", region: "North America", lat: 32.0, lon: -80.9, tier: "major" },
  { id: "chs", name: "Charleston", country: "USA", region: "North America", lat: 32.7, lon: -79.9, tier: "major" },
  { id: "nrf", name: "Norfolk", country: "USA", region: "North America", lat: 36.9, lon: -76.3, tier: "major" },
  { id: "bal", name: "Baltimore", country: "USA", region: "North America", lat: 39.2, lon: -76.5, tier: "major" },
  { id: "hou", name: "Houston", country: "USA", region: "North America", lat: 29.6, lon: -94.9, tier: "major" },
  { id: "nol", name: "New Orleans", country: "USA", region: "North America", lat: 29.9, lon: -90.0, tier: "major" },
  { id: "mia", name: "Miami", country: "USA", region: "North America", lat: 25.8, lon: -80.1, tier: "regional" },
  { id: "lob", name: "Los Angeles / Long Beach", country: "USA", region: "North America", lat: 33.75, lon: -118.25, tier: "mega" },
  { id: "oak", name: "Oakland", country: "USA", region: "North America", lat: 37.8, lon: -122.4, tier: "major" },
  { id: "sea", name: "Seattle / Tacoma", country: "USA", region: "North America", lat: 47.6, lon: -122.4, tier: "major" },
  { id: "vcr", name: "Vancouver", country: "Canada", region: "North America", lat: 49.25, lon: -123.15, tier: "major" },
  { id: "hfx", name: "Halifax", country: "Canada", region: "North America", lat: 44.65, lon: -63.55, tier: "regional" },
  { id: "ver", name: "Veracruz", country: "Mexico", region: "North America", lat: 19.2, lon: -96.1, tier: "regional" },
  { id: "man", name: "Manzanillo", country: "Mexico", region: "North America", lat: 19.05, lon: -104.3, tier: "major" },
  { id: "kin", name: "Kingston", country: "Jamaica", region: "Caribbean", lat: 17.95, lon: -76.8, tier: "major" },
  { id: "ctg", name: "Cartagena", country: "Colombia", region: "Caribbean", lat: 10.4, lon: -75.5, tier: "major" },
  { id: "balb", name: "Balboa / Panama", country: "Panama", region: "Caribbean", lat: 8.95, lon: -79.55, tier: "major" },
  { id: "snt", name: "Santos", country: "Brazil", region: "South America", lat: -23.95, lon: -46.3, tier: "major" },
  { id: "rio", name: "Rio de Janeiro", country: "Brazil", region: "South America", lat: -22.9, lon: -43.2, tier: "regional" },
  { id: "par", name: "Paranaguá", country: "Brazil", region: "South America", lat: -25.5, lon: -48.5, tier: "regional" },
  { id: "bue", name: "Buenos Aires", country: "Argentina", region: "South America", lat: -34.6, lon: -58.35, tier: "regional" },
  { id: "val", name: "Valparaíso", country: "Chile", region: "South America", lat: -33.0, lon: -71.6, tier: "regional" },
  { id: "cal", name: "Callao (Lima)", country: "Peru", region: "South America", lat: -12.05, lon: -77.15, tier: "major" },
  { id: "auk", name: "Auckland", country: "New Zealand", region: "Oceania", lat: -36.85, lon: 174.75, tier: "regional" },
  { id: "syd", name: "Sydney", country: "Australia", region: "Oceania", lat: -33.9, lon: 151.8, tier: "major" },
  { id: "mel", name: "Melbourne", country: "Australia", region: "Oceania", lat: -37.8, lon: 144.9, tier: "major" },
  { id: "fre", name: "Fremantle", country: "Australia", region: "Oceania", lat: -32.05, lon: 115.7, tier: "regional" },
];

export const portById: Record<string, Port> = Object.fromEntries(ports.map((p) => [p.id, p]));

/** Distance (km) between two points on a sphere. */
export function distKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
