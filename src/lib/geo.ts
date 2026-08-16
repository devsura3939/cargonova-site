/**
 * Geographic + pricing engine for the freight calculator.
 *
 * No external API: road distances are computed from real city coordinates
 * (haversine × road factor), and rates come from a transparent per-km model.
 * All numbers are indicative and clearly labeled as such on the UI.
 */

export type GeoCity = { id: string; name: string; nameKa: string; lat: number; lon: number };

export type GeoCountry = {
  code: string;
  name: string;
  nameKa: string;
  customsUnion: boolean;
  cities: GeoCity[];
};

export const COUNTRIES: GeoCountry[] = [
  {
    code: "GE",
    name: "Georgia",
    nameKa: "საქართველო",
    customsUnion: false,
    cities: [
      { id: "tbilisi", name: "Tbilisi", nameKa: "თბილისი", lat: 41.7151, lon: 44.8271 },
      { id: "batumi", name: "Batumi", nameKa: "ბათუმი", lat: 41.6168, lon: 41.6367 },
      { id: "kutaisi", name: "Kutaisi", nameKa: "ქუთაისი", lat: 42.2679, lon: 42.6946 },
      { id: "poti", name: "Poti", nameKa: "ფოთი", lat: 42.1462, lon: 41.6719 },
      { id: "rustavi", name: "Rustavi", nameKa: "რუსთავი", lat: 41.5495, lon: 44.9932 },
      { id: "gori", name: "Gori", nameKa: "გორი", lat: 41.986, lon: 44.1123 },
      { id: "zugdidi", name: "Zugdidi", nameKa: "ზუგდიდი", lat: 42.5083, lon: 41.8708 },
    ],
  },
  {
    code: "DE",
    name: "Germany",
    nameKa: "გერმანია",
    customsUnion: true,
    cities: [
      { id: "berlin", name: "Berlin", nameKa: "ბერლინი", lat: 52.52, lon: 13.405 },
      { id: "hamburg", name: "Hamburg", nameKa: "ჰამბურგი", lat: 53.5511, lon: 9.9937 },
      { id: "munich", name: "Munich", nameKa: "მიუნხენი", lat: 48.1351, lon: 11.582 },
      { id: "frankfurt", name: "Frankfurt", nameKa: "ფრანკფურტი", lat: 50.1109, lon: 8.6821 },
      { id: "cologne", name: "Cologne", nameKa: "კიოლნი", lat: 50.9375, lon: 6.9603 },
      { id: "leipzig", name: "Leipzig", nameKa: "ლაიფციგი", lat: 51.3397, lon: 12.3731 },
    ],
  },
  {
    code: "PL",
    name: "Poland",
    nameKa: "პოლონეთი",
    customsUnion: true,
    cities: [
      { id: "warsaw", name: "Warsaw", nameKa: "ვარშავა", lat: 52.2297, lon: 21.0122 },
      { id: "krakow", name: "Kraków", nameKa: "კრაკოვი", lat: 50.0647, lon: 19.945 },
      { id: "gdansk", name: "Gdańsk", nameKa: "გდანსკი", lat: 54.352, lon: 18.6466 },
      { id: "wroclaw", name: "Wrocław", nameKa: "ვროცლავი", lat: 51.1079, lon: 17.0385 },
    ],
  },
  {
    code: "NL",
    name: "Netherlands",
    nameKa: "ნიდერლანდები",
    customsUnion: true,
    cities: [
      { id: "amsterdam", name: "Amsterdam", nameKa: "ამსტერდამი", lat: 52.3676, lon: 4.9041 },
      { id: "rotterdam", name: "Rotterdam", nameKa: "როტერდამი", lat: 51.9244, lon: 4.4777 },
      { id: "eindhoven", name: "Eindhoven", nameKa: "ეინდჰოვენი", lat: 51.4416, lon: 5.4697 },
    ],
  },
  {
    code: "FR",
    name: "France",
    nameKa: "საფრანგეთი",
    customsUnion: true,
    cities: [
      { id: "paris", name: "Paris", nameKa: "პარიზი", lat: 48.8566, lon: 2.3522 },
      { id: "lyon", name: "Lyon", nameKa: "ლიონი", lat: 45.764, lon: 4.8357 },
      { id: "strasbourg", name: "Strasbourg", nameKa: "სტრასბურგი", lat: 48.5734, lon: 7.7521 },
    ],
  },
  {
    code: "IT",
    name: "Italy",
    nameKa: "იტალია",
    customsUnion: true,
    cities: [
      { id: "milan", name: "Milan", nameKa: "მილანი", lat: 45.4642, lon: 9.19 },
      { id: "rome", name: "Rome", nameKa: "რომი", lat: 41.9028, lon: 12.4964 },
      { id: "verona", name: "Verona", nameKa: "ვერონა", lat: 45.4384, lon: 10.9916 },
    ],
  },
  {
    code: "AT",
    name: "Austria",
    nameKa: "ავსტრია",
    customsUnion: true,
    cities: [
      { id: "vienna", name: "Vienna", nameKa: "ვენა", lat: 48.2082, lon: 16.3738 },
      { id: "linz", name: "Linz", nameKa: "ლინცი", lat: 48.3069, lon: 14.2858 },
      { id: "graz", name: "Graz", nameKa: "გრაცი", lat: 47.0707, lon: 15.4395 },
    ],
  },
  {
    code: "CH",
    name: "Switzerland",
    nameKa: "შვეიცარია",
    customsUnion: false,
    cities: [
      { id: "zurich", name: "Zurich", nameKa: "ციურიხი", lat: 47.3769, lon: 8.5417 },
      { id: "geneva", name: "Geneva", nameKa: "ჟენევა", lat: 46.2044, lon: 6.1432 },
      { id: "basel", name: "Basel", nameKa: "ბაზელი", lat: 47.5596, lon: 7.5886 },
    ],
  },
  {
    code: "CZ",
    name: "Czechia",
    nameKa: "ჩეხეთი",
    customsUnion: true,
    cities: [
      { id: "prague", name: "Prague", nameKa: "პრაღა", lat: 50.0755, lon: 14.4378 },
      { id: "brno", name: "Brno", nameKa: "ბრნო", lat: 49.1951, lon: 16.6068 },
    ],
  },
  {
    code: "DK",
    name: "Denmark",
    nameKa: "დანია",
    customsUnion: true,
    cities: [
      { id: "copenhagen", name: "Copenhagen", nameKa: "კოპენჰაგენი", lat: 55.6761, lon: 12.5683 },
      { id: "aarhus", name: "Aarhus", nameKa: "ორჰუსი", lat: 56.1629, lon: 10.2039 },
    ],
  },
  {
    code: "BE",
    name: "Belgium",
    nameKa: "ბელგია",
    customsUnion: true,
    cities: [
      { id: "brussels", name: "Brussels", nameKa: "ბრიუსელი", lat: 50.8503, lon: 4.3517 },
      { id: "antwerp", name: "Antwerp", nameKa: "ანტვერპენი", lat: 51.2194, lon: 4.4025 },
    ],
  },
  {
    code: "ES",
    name: "Spain",
    nameKa: "ესპანეთი",
    customsUnion: true,
    cities: [
      { id: "madrid", name: "Madrid", nameKa: "მადრიდი", lat: 40.4168, lon: -3.7038 },
      { id: "barcelona", name: "Barcelona", nameKa: "ბარსელონა", lat: 41.3874, lon: 2.1686 },
    ],
  },
  {
    code: "RO",
    name: "Romania",
    nameKa: "რუმინეთი",
    customsUnion: true,
    cities: [
      { id: "bucharest", name: "Bucharest", nameKa: "ბუქარესტი", lat: 44.4268, lon: 26.1025 },
      { id: "cluj", name: "Cluj-Napoca", nameKa: "კლუჟ-ნაპოკა", lat: 46.7712, lon: 23.6236 },
    ],
  },
  {
    code: "TR",
    name: "Türkiye",
    nameKa: "თურქეთი",
    customsUnion: false,
    cities: [
      { id: "istanbul", name: "Istanbul", nameKa: "სტამბოლი", lat: 41.0082, lon: 28.9784 },
      { id: "ankara", name: "Ankara", nameKa: "ანკარა", lat: 39.9334, lon: 32.8597 },
      { id: "trabzon", name: "Trabzon", nameKa: "ტრაბზონი", lat: 41.0027, lon: 39.7168 },
    ],
  },
  {
    code: "AM",
    name: "Armenia",
    nameKa: "სომხეთი",
    customsUnion: false,
    cities: [
      { id: "yerevan", name: "Yerevan", nameKa: "ერევანი", lat: 40.1792, lon: 44.4991 },
      { id: "gyumri", name: "Gyumri", nameKa: "გიუმრი", lat: 40.7896, lon: 43.8475 },
    ],
  },
  {
    code: "AZ",
    name: "Azerbaijan",
    nameKa: "აზერბაიჯანი",
    customsUnion: false,
    cities: [
      { id: "baku", name: "Baku", nameKa: "ბაქო", lat: 40.4093, lon: 49.8671 },
      { id: "ganja", name: "Ganja", nameKa: "განჯა", lat: 40.6828, lon: 46.3606 },
    ],
  },
  {
    code: "UA",
    name: "Ukraine",
    nameKa: "უკრაინა",
    customsUnion: false,
    cities: [
      { id: "kyiv", name: "Kyiv", nameKa: "კიევი", lat: 50.4501, lon: 30.5234 },
      { id: "lviv", name: "Lviv", nameKa: "ლვოვი", lat: 49.8397, lon: 24.0297 },
      { id: "odesa", name: "Odesa", nameKa: "ოდესა", lat: 46.4825, lon: 30.7233 },
    ],
  },
  {
    code: "BG",
    name: "Bulgaria",
    nameKa: "ბულგარეთი",
    customsUnion: true,
    cities: [
      { id: "sofia", name: "Sofia", nameKa: "სოფია", lat: 42.6977, lon: 23.3219 },
      { id: "plovdiv", name: "Plovdiv", nameKa: "პლოვდივი", lat: 42.1354, lon: 24.7453 },
    ],
  },
  {
    code: "GR",
    name: "Greece",
    nameKa: "საბერძნეთი",
    customsUnion: true,
    cities: [
      { id: "athens", name: "Athens", nameKa: "ათენი", lat: 37.9838, lon: 23.7275 },
      { id: "thessaloniki", name: "Thessaloniki", nameKa: "თესალონიკი", lat: 40.6401, lon: 22.9444 },
    ],
  },
  {
    code: "HU",
    name: "Hungary",
    nameKa: "უნგრეთი",
    customsUnion: true,
    cities: [
      { id: "budapest", name: "Budapest", nameKa: "ბუდაპეშტი", lat: 47.4979, lon: 19.0402 },
      { id: "debrecen", name: "Debrecen", nameKa: "დებრეცენი", lat: 47.5316, lon: 21.6273 },
    ],
  },
  {
    code: "SK",
    name: "Slovakia",
    nameKa: "სლოვაკეთი",
    customsUnion: true,
    cities: [
      { id: "bratislava", name: "Bratislava", nameKa: "ბრატისლავა", lat: 48.1486, lon: 17.1077 },
      { id: "kosice", name: "Košice", nameKa: "კოშიცე", lat: 48.7164, lon: 21.2611 },
    ],
  },
  {
    code: "RS",
    name: "Serbia",
    nameKa: "სერბეთი",
    customsUnion: false,
    cities: [
      { id: "belgrade", name: "Belgrade", nameKa: "ბელგრადი", lat: 44.7866, lon: 20.4489 },
      { id: "nis", name: "Niš", nameKa: "ნიში", lat: 43.3209, lon: 21.8958 },
    ],
  },
  {
    code: "LT",
    name: "Lithuania",
    nameKa: "ლიტვა",
    customsUnion: true,
    cities: [
      { id: "vilnius", name: "Vilnius", nameKa: "ვილნიუსი", lat: 54.6872, lon: 25.2797 },
      { id: "kaunas", name: "Kaunas", nameKa: "კაუნასი", lat: 54.8985, lon: 23.9036 },
    ],
  },
  {
    code: "LV",
    name: "Latvia",
    nameKa: "ლატვია",
    customsUnion: true,
    cities: [
      { id: "riga", name: "Riga", nameKa: "რიგა", lat: 56.9496, lon: 24.1052 },
    ],
  },
  {
    code: "EE",
    name: "Estonia",
    nameKa: "ესტონეთი",
    customsUnion: true,
    cities: [
      { id: "tallinn", name: "Tallinn", nameKa: "ტალინი", lat: 59.437, lon: 24.7536 },
    ],
  },
  {
    code: "MD",
    name: "Moldova",
    nameKa: "მოლდოვა",
    customsUnion: false,
    cities: [
      { id: "chisinau", name: "Chișinău", nameKa: "კიშინიოვი", lat: 47.0105, lon: 28.8638 },
    ],
  },
  {
    code: "SE",
    name: "Sweden",
    nameKa: "შვედეთი",
    customsUnion: true,
    cities: [
      { id: "stockholm", name: "Stockholm", nameKa: "სტოკჰოლმი", lat: 59.3293, lon: 18.0686 },
      { id: "gothenburg", name: "Gothenburg", nameKa: "გოტებორგი", lat: 57.7089, lon: 11.9746 },
    ],
  },
  {
    code: "FI",
    name: "Finland",
    nameKa: "ფინეთი",
    customsUnion: true,
    cities: [
      { id: "helsinki", name: "Helsinki", nameKa: "ჰელსინკი", lat: 60.1699, lon: 24.9384 },
    ],
  },
  {
    code: "NO",
    name: "Norway",
    nameKa: "ნორვეგია",
    customsUnion: false,
    cities: [
      { id: "oslo", name: "Oslo", nameKa: "ოსლო", lat: 59.9139, lon: 10.7522 },
    ],
  },
  {
    code: "GB",
    name: "United Kingdom",
    nameKa: "გაერთიანებული სამეფო",
    customsUnion: false,
    cities: [
      { id: "london", name: "London", nameKa: "ლონდონი", lat: 51.5074, lon: -0.1278 },
      { id: "manchester", name: "Manchester", nameKa: "მანჩესტერი", lat: 53.4808, lon: -2.2426 },
    ],
  },
  {
    code: "PT",
    name: "Portugal",
    nameKa: "პორტუგალია",
    customsUnion: true,
    cities: [
      { id: "lisbon", name: "Lisbon", nameKa: "ლისაბონი", lat: 38.7223, lon: -9.1393 },
      { id: "porto", name: "Porto", nameKa: "პორტუ", lat: 41.1579, lon: -8.6291 },
    ],
  },
  {
    code: "HR",
    name: "Croatia",
    nameKa: "ხორვატია",
    customsUnion: true,
    cities: [
      { id: "zagreb", name: "Zagreb", nameKa: "ზაგრები", lat: 45.815, lon: 15.9819 },
    ],
  },
  {
    code: "SI",
    name: "Slovenia",
    nameKa: "სლოვენია",
    customsUnion: true,
    cities: [
      { id: "ljubljana", name: "Ljubljana", nameKa: "ლუბლიანა", lat: 46.0569, lon: 14.5058 },
    ],
  },
  {
    code: "MK",
    name: "North Macedonia",
    nameKa: "ჩრდილოეთ მაკედონია",
    customsUnion: false,
    cities: [
      { id: "skopje", name: "Skopje", nameKa: "სკოპიე", lat: 41.9973, lon: 21.428 },
    ],
  },
  {
    code: "AL",
    name: "Albania",
    nameKa: "ალბანეთი",
    customsUnion: false,
    cities: [
      { id: "tirana", name: "Tirana", nameKa: "ტირანა", lat: 41.3275, lon: 19.8187 },
    ],
  },
];

export function getCountry(code: string): GeoCountry | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

export function getCity(countryCode: string, cityId: string): GeoCity | undefined {
  return getCountry(countryCode)?.cities.find((c) => c.id === cityId);
}

export function cityByName(name: string): GeoCity | undefined {
  const lower = name.trim().toLowerCase();
  for (const c of COUNTRIES) {
    const hit = c.cities.find((city) => city.name.toLowerCase() === lower);
    if (hit) return hit;
  }
  return undefined;
}

/* ── Distance (haversine × road factor, no API) ─────────── */

const EARTH_R = 6371;
const ROAD_FACTOR = 1.28;

function haversineKm(a: GeoCity, b: GeoCity): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_R * Math.asin(Math.sqrt(h));
}

export function roadKm(a: GeoCity, b: GeoCity): number {
  const raw = haversineKm(a, b) * ROAD_FACTOR;
  return Math.max(50, Math.round(raw / 10) * 10);
}

/* ── Pricing model (transparent, indicative) ─────────────── */

export type FreightMode =
  | "ftl"
  | "ltl"
  | "express"
  | "reefer"
  | "oversized"
  | "van"
  | "small";

export type Estimate = {
  km: number;
  transitDays: number;
  base: number;
  fuel: number;
  tolls: number;
  customs: number;
  permits: number;
  totalEur: number;
  totalGel: number;
  currencyRate: number;
  modeLabel: string;
};

export const GEL_RATE = 2.82; // indicative EUR→GEL

const MODE_RATE: Record<FreightMode, { perKm: number; min: number; tollPerKm: number }> = {
  ftl: { perKm: 1.02, min: 480, tollPerKm: 0.12 },
  ltl: { perKm: 0.105, min: 140, tollPerKm: 0.05 },
  express: { perKm: 1.55, min: 520, tollPerKm: 0.12 },
  reefer: { perKm: 1.22, min: 560, tollPerKm: 0.12 },
  oversized: { perKm: 1.85, min: 900, tollPerKm: 0.16 },
  van: { perKm: 0.55, min: 160, tollPerKm: 0.06 },
  small: { perKm: 0.78, min: 240, tollPerKm: 0.08 },
};

export function chooseMode(
  cargoType: string,
  pallets: number,
  weightKg: number,
): FreightMode {
  switch (cargoType) {
    case "ftl":
      return "ftl";
    case "ltl":
      return "ltl";
    case "express":
      return "express";
    case "reefer":
      return "reefer";
    case "oversized":
      return "oversized";
    default:
      if (weightKg > 0 && weightKg < 800) return "van";
      if (weightKg >= 800 && weightKg < 4500) return "small";
      return pallets >= 13 ? "ftl" : "ltl";
  }
}

export function estimateFreight(input: {
  originCountry: string;
  originCity: string;
  destCountry: string;
  destCity: string;
  cargoType: string;
  pallets: number;
  weightKg: number;
}): Estimate | null {
  const origin = getCity(input.originCountry, input.originCity);
  const dest = getCity(input.destCountry, input.destCity);
  if (!origin || !dest) return null;

  const km = roadKm(origin, dest);
  const originCountry = getCountry(input.originCountry);
  const destCountry = getCountry(input.destCountry);
  const international = input.originCountry !== input.destCountry;
  const crossBorder = !(originCountry?.customsUnion && destCountry?.customsUnion);

  const mode = chooseMode(input.cargoType, input.pallets, input.weightKg);
  const rate = MODE_RATE[mode];
  const distanceBase = mode === "ltl" ? km * (input.pallets || 6) : km;

  const base = Math.max(rate.min, Math.round(distanceBase * rate.perKm));
  const fuel = Math.round(base * 0.12);
  const tolls = Math.round(km * rate.tollPerKm);
  const customs = crossBorder && international ? 90 : 0;
  const permits = mode === "oversized" ? 180 : 0;
  const totalEur = Math.round((base + fuel + tolls + customs + permits) / 5) * 5;

  const transitDays = Math.max(1, Math.ceil(km / 550) + (international ? 1 : 0));

  return {
    km,
    transitDays,
    base,
    fuel,
    tolls,
    customs,
    permits,
    totalEur,
    totalGel: Math.round(totalEur * GEL_RATE),
    currencyRate: GEL_RATE,
    modeLabel: mode,
  };
}
