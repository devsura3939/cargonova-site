/**
 * Live data integrations — free, no API key, fetched client-side:
 *
 *  - OpenSky Network (ADS-B): real aircraft positions worldwide.
 *  - Open-Meteo: real current weather (temperature, wind) at any coordinate.
 *
 * Both services are anonymous/free. To stay inside their rate limits we cache
 * responses in sessionStorage and never poll faster than the TTLs below.
 * Every function degrades gracefully: a failure returns null and the UI shows
 * "simulation only" rather than crashing.
 */

export type Aircraft = {
  icao24: string;
  callsign: string; // trimmed, e.g. "TVF98NQ"
  originCountry: string;
  lat: number;
  lon: number;
  altitudeM: number;
  velocityMs: number; // ground speed, m/s
  headingDeg: number;
  onGround: boolean;
  lastSeen: number;
};

export type LiveWeather = {
  lat: number;
  lon: number;
  tempC: number;
  windKmh: number;
  windDirDeg: number;
  code: number;
};

/**
 * OpenSky blocks cross-origin browser calls (CORS is locked to its own
 * origin), so aircraft positions come from a REAL ADS-B snapshot fetched
 * server-side at build time (`scripts/fetch-aircraft-snapshot.mjs`, hooked
 * into `prebuild`) and shipped in `public/data/aircraft-snapshot.json`.
 * Every rebuild/deploy refreshes it. Same-origin fetch = no CORS, no key.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const AIRCRAFT_CACHE_KEY = "cargonova.aircraft.v1";
const AIRCRAFT_TTL_MS = 12 * 60 * 1000;

const WEATHER_CACHE_KEY = "cargonova.weather.v1";
const WEATHER_TTL_MS = 10 * 60 * 1000;

let snapshotAtMs: number | null = null;

/** When the shipped ADS-B snapshot was fetched (ms epoch), or null. */
export function aircraftSnapshotAt(): number | null {
  return snapshotAtMs;
}

function readCache<T>(key: string, ttl: number): { data: T; at: number } | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { data: T; at: number };
    if (Date.now() - parsed.at > ttl) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, data: T) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, at: Date.now() }));
  } catch {
    /* storage full / unavailable — non-fatal */
  }
}

type SnapshotAircraft = {
  i: string; // icao24
  c: string; // callsign
  o: string; // origin country
  la: number; // lat
  lo: number; // lon
  a: number; // altitude m
  v: number; // velocity m/s
  h: number; // heading deg
};

const inFlight = new Map<string, Promise<Aircraft[] | null>>();

/** Real aircraft airborne over Europe/Caucasus/Asia — from the build-time ADS-B snapshot. */
export async function fetchAircraft(): Promise<Aircraft[] | null> {
  const cached = readCache<Aircraft[]>(AIRCRAFT_CACHE_KEY, AIRCRAFT_TTL_MS);
  if (cached) return cached.data;

  if (!inFlight.has("aircraft")) {
    const p = (async () => {
      try {
        const res = await fetch(`${BASE_PATH}/data/aircraft-snapshot.json`, {
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return null;
        const json = (await res.json()) as { fetchedAt?: number; aircraft?: SnapshotAircraft[] };
        if (!Array.isArray(json.aircraft)) return null;
        snapshotAtMs = json.fetchedAt ?? null;
        const out: Aircraft[] = json.aircraft.map((s) => ({
          icao24: s.i,
          callsign: s.c,
          originCountry: s.o,
          lat: s.la,
          lon: s.lo,
          altitudeM: s.a,
          velocityMs: s.v,
          headingDeg: s.h,
          onGround: false,
          lastSeen: json.fetchedAt ?? Date.now(),
        }));
        writeCache(AIRCRAFT_CACHE_KEY, out);
        return out;
      } catch {
        return null;
      } finally {
        inFlight.delete("aircraft");
      }
    })();
    inFlight.set("aircraft", p);
  }
  return inFlight.get("aircraft")!;
}

/* ── Weather (Open-Meteo, free & unlimited for non-commercial use) ── */

export const WEATHER_POINTS: { id: string; name: string; lat: number; lon: number }[] = [
  { id: "tbs", name: "Tbilisi", lat: 41.69, lon: 44.8 },
  { id: "batu", name: "Batumi", lat: 41.65, lon: 41.64 },
  { id: "ist", name: "Istanbul", lat: 41.01, lon: 28.98 },
  { id: "ber", name: "Berlin", lat: 52.52, lon: 13.41 },
  { id: "rot", name: "Rotterdam", lat: 51.92, lon: 4.48 },
  { id: "ams", name: "Amsterdam", lat: 52.37, lon: 4.9 },
  { id: "bcn", name: "Barcelona", lat: 41.39, lon: 2.17 },
  { id: "milan", name: "Milan", lat: 45.46, lon: 9.19 },
  { id: "warsaw", name: "Warsaw", lat: 52.23, lon: 21.01 },
  { id: "baku", name: "Baku", lat: 40.41, lon: 49.87 },
  { id: "yerevan", name: "Yerevan", lat: 40.18, lon: 44.51 },
  { id: "almaty", name: "Almaty", lat: 43.24, lon: 76.95 },
];

export async function fetchWeather(): Promise<LiveWeather[] | null> {
  const cached = readCache<LiveWeather[]>(WEATHER_CACHE_KEY, WEATHER_TTL_MS);
  if (cached) return cached.data;
  try {
    const lats = WEATHER_POINTS.map((p) => p.lat).join(",");
    const lons = WEATHER_POINTS.map((p) => p.lon).join(",");
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code`;
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!res.ok) return null;
    // Multi-point responses come back as a top-level array, one entry per
    // location, each with its own `current` block.
    type WeatherRow = {
      latitude?: number;
      longitude?: number;
      current?: { temperature_2m?: number; wind_speed_10m?: number; wind_direction_10m?: number; weather_code?: number };
    };
    const json = (await res.json()) as { current?: WeatherRow[] } | WeatherRow[];
    const rows: WeatherRow[] | null = Array.isArray(json)
      ? json
      : Array.isArray(json.current)
        ? json.current
        : null;
    if (!rows) return null;
    const out: LiveWeather[] = rows
      .map((r, i) => ({
        lat: WEATHER_POINTS[i]?.lat ?? r.latitude ?? 0,
        lon: WEATHER_POINTS[i]?.lon ?? r.longitude ?? 0,
        tempC: Math.round(r.current?.temperature_2m ?? 0),
        windKmh: Math.round(r.current?.wind_speed_10m ?? 0),
        windDirDeg: r.current?.wind_direction_10m ?? 0,
        code: r.current?.weather_code ?? 0,
      }))
      .filter((w) => w.tempC !== 0 || w.windKmh !== 0);
    writeCache(WEATHER_CACHE_KEY, out);
    return out;
  } catch {
    return null;
  }
}

/* ── Flight-number helpers (used by the tracking page) ─────────── */

/** "TK1984", "LH452", "THY1984" — IATA (2L) or ICAO (3L) prefix + digits. */
export function isFlightNumber(code: string): boolean {
  const c = code.trim().toUpperCase().replace(/\s+/g, "");
  if (c.length < 3 || c.length > 8) return false;
  return /^[A-Z]{2}\d{1,4}$/.test(c) || /^[A-Z]{3}\d{1,4}$/.test(c);
}

/** Strip the airline prefix: "TK1984" → "1984". */
export function flightNumberPart(code: string): string {
  return code.trim().toUpperCase().replace(/^[A-Z]+/, "");
}

export type LiveFlight = Aircraft & {
  /** e.g. "TK" from "TK1984". */
  airlineCode: string;
  airlineName: string;
};

/** Search the cached live-aircraft snapshot for a real flight by callsign. */
export async function findLiveFlight(callsign: string): Promise<LiveFlight | null> {
  const target = callsign.trim().toUpperCase().replace(/\s+/g, "");
  if (!isFlightNumber(target)) return null;
  const craft = await fetchAircraft();
  if (!craft) return null;
  const match =
    craft.find((a) => a.callsign === target) ??
    // Some feeds append a trailing digit/letter (squawk variations).
    craft.find((a) => a.callsign.startsWith(target) && a.callsign.length <= target.length + 1);
  if (!match) return null;
  const airlineCode = target.replace(/^\d/, "").match(/^[A-Z]{2,3}/)?.[0] ?? "";
  return { ...match, airlineCode, airlineName: airlineName(airlineCode) };
}

/** FlightRadar24 lookup URL — free, no key, the canonical re-check source. */
export function flightRadarUrl(callsign: string): string {
  return `https://www.flightradar24.com/${encodeURIComponent(callsign.trim().toUpperCase())}`;
}

/** Friendly airline name for common 2-letter IATA codes. */
const AIRLINES: Record<string, string> = {
  TK: "Turkish Airlines",
  LH: "Lufthansa",
  THY: "Turkish Airlines",
  DLH: "Lufthansa",
  AZ: "ITA Airways",
  AF: "Air France",
  KL: "KLM",
  BA: "British Airways",
  SU: "Aeroflot",
  AY: "Finnair",
  LO: "LOT Polish",
  SK: "SAS",
  OS: "Austrian",
  LX: "SWISS",
  A3: "Aegean",
  RO: "TAROM",
  OU: "Croatia Airlines",
  TK1: "Turkish Airlines",
  EK: "Emirates",
  QR: "Qatar Airways",
  EY: "Etihad",
  SV: "Saudia",
  W5: "Mahan Air",
  IR: "Iran Air",
  G9: "Air Arabia",
  PC: "Pegasus",
  XQ: "SunExpress",
  HY: "Uzbekistan Airways",
  KC: "Air Astana",
  AHY: "Azerbaijan Airlines",
  J2: "Azerbaijan Airlines",
  RMO: "Armenia Airways",
  A9: "Georgian Airways",
  NZG: "Airzena Georgian",
  QG: "Vanilla Air",
  FV: "Rossiya",
  S7: "S7 Airlines",
  UT: "UTair",
  TK2: "Turkish Airlines",
  BT: "Air Baltic",
  EW: "Eurowings",
  U2: "easyJet",
  FR: "Ryanair",
  VY: "Vueling",
  IB: "Iberia",
  TP: "TAP Air Portugal",
  SN: "Brussels Airlines",
  JP: "Adria Airways",
  D8: "Norwegian",
  DY: "Norwegian",
  W6: "Wizz Air",
  KQ: "Kenya Airways",
  ET: "Ethiopian Airlines",
  MS: "EgyptAir",
  AT: "Royal Air Maroc",
  TU: "Tunisair",
  CX: "Cathay Pacific",
  SQ: "Singapore Airlines",
  MH: "Malaysia Airlines",
  TG: "Thai Airways",
  NH: "ANA",
  JL: "Japan Airlines",
  OZ: "Asiana",
  KE: "Korean Air",
  CA: "Air China",
  MU: "China Eastern",
  CZ: "China Southern",
  HU: "Hainan Airlines",
  BR: "EVA Air",
  CI: "China Airlines",
  PR: "Philippine Airlines",
  QF: "Qantas",
  NZ: "Air New Zealand",
  AA: "American Airlines",
  UA: "United Airlines",
  DL: "Delta Air Lines",
  FX: "FedEx Express",
  FDX: "FedEx Express",
  "5X": "UPS Airlines",
  UPS: "UPS Airlines",
  BOX: "AeroLogic",
  GEC: "Lufthansa Cargo",
  CWC: "Cargolux",
  ICV: "Cargolux Italia",
  ABD: "AirBridgeCargo",
  BCS: "European Air Transport (DHL)",
  DHK: "DHL Air",
  QY: "European Air Transport (DHL)",
  "3S": "AeroLogic",
  EK2: "Emirates SkyCargo",
  K4: "Kalitta Air",
  CKS: "Kalitta Air",
  ATN: "Air Transport International",
  GTI: "Atlas Air",
  PAC: "Polar Air Cargo",
  ABY: "AirBridgeCargo",
  Y8: "Suparna Airlines",
  CK: "China Cargo Airlines",
  KZ: "Nippon Cargo Airlines",
  NCA: "Nippon Cargo Airlines",
  PO: "Polar Air Cargo",
  SOO: "Southern Air",
};

export function airlineName(code: string): string {
  return AIRLINES[code] ?? AIRLINES[code.slice(0, 2)] ?? "Airline";
}

/** Whether the airline prefix looks like a dedicated cargo operator. */
export function isCargoAirline(code: string): boolean {
  return /^(FX|5X|UPS|FDX|BOX|GEC|CWC|ICV|ABD|BCS|DHK|QY|3S|K4|CKS|ATN|GTI|PAC|PO|SOO|ABY|Y8|CK|KZ|NCA)$/.test(
    code.toUpperCase(),
  );
}
