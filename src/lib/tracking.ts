/**
 * Shipment tracking service.
 *
 * Accepts real-world carrier tracking numbers — CargoNova (CRG-…), UPS (1Z…),
 * DHL Express (JD…/JVGL…), FedEx, USPS, ISO container numbers (CNTR…)— plus
 * generic letter+digit codes, and resolves every well-formed number to a
 * realistic shipment (deterministic per ID, dates relative to today).
 *
 * When the number matches a live fleet unit (shipments on the live map), the
 * lookup returns that unit's actual voyage — same vessel, same ports, same
 * cargo, drawn on the real sea lane. Swap `lookupShipment` for a real TMS /
 * tracking API later without touching any UI code.
 */

import { seaRoutes } from "@/data/sea-routes";
import { ports, distKm } from "@/data/ports";
import { computeLiveFleet, type LiveUnit } from "@/lib/fleet";

export type ShipmentStatus =
  | "pending"
  | "picked_up"
  | "in_transit"
  | "customs"
  | "out_for_delivery"
  | "delivered";

export type Carrier =
  | "cargonova"
  | "dhl"
  | "ups"
  | "fedex"
  | "usps"
  | "generic";

export type TrackingCheckpoint = {
  label: string;
  location: string;
  timestamp: string;
  status: ShipmentStatus;
  note?: string;
  /** Explicitly marks the step as completed (needed when several steps share a status). */
  done?: boolean;
};

export type Shipment = {
  id: string;
  carrier: Carrier;
  carrierName: string;
  mode: "ocean" | "road";
  status: ShipmentStatus;
  origin: string;
  destination: string;
  currentCheckpoint: string;
  eta: string;
  progress: number; // 0–100
  route: string[];
  checkpoints: TrackingCheckpoint[];
  cargo: {
    description: string;
    weight: string;
    service: string;
    vehicle: string;
  };
  /** Present for ocean shipments: the vessel and the real sea lane to draw. */
  voyage?: {
    vessel: string;
    flag?: string;
    mmsi?: string;
    routeName: string;
    route: [number, number][];
  };
};

/* ── Tracking number validation & carrier detection ──────── */

/**
 * Accept any of the common carrier formats (after uppercasing/trimming):
 *  - CRG-582941 / MAD3456789 / JVGL0004567  (2–8 letters + 4–14 digits)
 *  - 1Z999AA10123456784                     (UPS)
 *  - JD01460000360067008                    (DHL Express)
 *  - 9611020987653101234567                 (USPS / FedEx, pure digits)
 *  - 12–34 char alphanumeric codes with letters (generic carriers)
 */
export function isValidTrackingCode(raw: string): boolean {
  const code = raw.trim().toUpperCase().replace(/\s+/g, "");
  if (code.length < 6 || code.length > 34) return false;
  if (/^[A-Z]{2,8}-?\d{4,14}$/.test(code)) return true;
  if (/^\d{8,24}$/.test(code)) return true;
  if (/^1Z[A-Z0-9]{16}$/.test(code)) return true;
  if (/^JD\d{18}$/.test(code)) return true;
  if (/^[A-Z0-9]{12,34}$/.test(code)) {
    const letters = (code.match(/[A-Z]/g) ?? []).length;
    const digits = (code.match(/\d/g) ?? []).length;
    return letters >= 2 && digits >= 4;
  }
  return false;
}

export function detectCarrier(code: string): Carrier {
  if (/^1Z[A-Z0-9]/.test(code)) return "ups";
  if (/^(JD|JVGL|JJD)/.test(code)) return "dhl";
  if (/^LP\d/.test(code)) return "dhl";
  if (/^(CRG|CN\d)/.test(code)) return "cargonova";
  if (/^\d{20,24}$/.test(code) && code.startsWith("9")) return "usps";
  if (/^\d{12,16}$/.test(code)) return "fedex";
  if (/^\d{8,11}$/.test(code)) return "generic";
  if (/^[A-Z]{2,8}-?\d{4,14}$/.test(code)) return "generic";
  return "generic";
}

export function carrierDisplayName(carrier: Carrier): string {
  switch (carrier) {
    case "cargonova":
      return "CargoNova Logistics";
    case "dhl":
      return "DHL Express";
    case "ups":
      return "UPS";
    case "fedex":
      return "FedEx";
    case "usps":
      return "USPS";
    default:
      return "International Carrier";
  }
}

/* ── Date helpers (relative to today) ────────────────────── */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function at(daysFromToday: number, hour: number, minute = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function fmtDay(d: Date): string {
  return `${MONTHS_LONG[d.getMonth()]} ${d.getDate()}`;
}

function fmtTs(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${MONTHS[d.getMonth()]} ${d.getDate()} · ${hh}:${mm}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

/** ETA label that reads naturally: "Today, 14:30" / "August 18". */
function etaLabel(d: Date, today: Date): string {
  if (isSameDay(d, today)) return `Today, ${String(d.getHours()).padStart(2, "0")}:30`;
  if (isSameDay(d, at(1, 12))) return "Tomorrow";
  return fmtDay(d);
}

/* ── Realistic network data ───────────────────────────────── */

type City = { city: string; country: string; hub: string };

const LOCATIONS: City[] = [
  { city: "Berlin", country: "Germany", hub: "Berlin Logistics Park" },
  { city: "Hamburg", country: "Germany", hub: "Hamburg Terminal" },
  { city: "Munich", country: "Germany", hub: "Munich Cargo Terminal" },
  { city: "Amsterdam", country: "Netherlands", hub: "Amsterdam Hub" },
  { city: "Rotterdam", country: "Netherlands", hub: "Rotterdam Distribution Centre" },
  { city: "Paris", country: "France", hub: "Paris Hub" },
  { city: "Milan", country: "Italy", hub: "Milan Hub" },
  { city: "Vienna", country: "Austria", hub: "Vienna Hub" },
  { city: "Warsaw", country: "Poland", hub: "Warsaw Hub" },
  { city: "Prague", country: "Czechia", hub: "Prague Hub" },
  { city: "Copenhagen", country: "Denmark", hub: "Copenhagen Hub" },
  { city: "Zurich", country: "Switzerland", hub: "Zurich Hub" },
  { city: "Barcelona", country: "Spain", hub: "Barcelona Hub" },
  { city: "Bucharest", country: "Romania", hub: "Bucharest Hub" },
  { city: "Istanbul", country: "Türkiye", hub: "Istanbul Logistics Hub" },
  { city: "Tbilisi", country: "Georgia", hub: "Tbilisi Hub" },
];

const CARRIER_NETWORKS: Record<Carrier, City[]> = {
  cargonova: LOCATIONS,
  ups: [
    { city: "Louisville", country: "USA", hub: "UPS Worldport, Louisville" },
    { city: "Memphis", country: "USA", hub: "UPS Memphis Hub" },
    { city: "Dallas", country: "USA", hub: "UPS Dallas Regional Hub" },
    { city: "Chicago", country: "USA", hub: "UPS Chicago Hub" },
    { city: "Newark", country: "USA", hub: "UPS Newark Gateway" },
    { city: "Atlanta", country: "USA", hub: "UPS Atlanta Hub" },
    { city: "Los Angeles", country: "USA", hub: "UPS LA Gateway" },
    { city: "Seattle", country: "USA", hub: "UPS Seattle Hub" },
    { city: "Miami", country: "USA", hub: "UPS Miami Gateway" },
    { city: "Denver", country: "USA", hub: "UPS Denver Hub" },
  ],
  fedex: [
    { city: "Memphis", country: "USA", hub: "FedEx SuperHub, Memphis" },
    { city: "Indianapolis", country: "USA", hub: "FedEx Indianapolis Hub" },
    { city: "Oakland", country: "USA", hub: "FedEx Oakland Hub" },
    { city: "Newark", country: "USA", hub: "FedEx Newark Gateway" },
    { city: "Dallas", country: "USA", hub: "FedEx Dallas Hub" },
    { city: "Chicago", country: "USA", hub: "FedEx Chicago Hub" },
    { city: "Miami", country: "USA", hub: "FedEx Miami Gateway" },
    { city: "Phoenix", country: "USA", hub: "FedEx Phoenix Hub" },
  ],
  usps: [
    { city: "New York", country: "USA", hub: "NY International Distribution Center" },
    { city: "Chicago", country: "USA", hub: "Chicago International Service Center" },
    { city: "Los Angeles", country: "USA", hub: "LA International Distribution Center" },
    { city: "Miami", country: "USA", hub: "Miami International Service Center" },
    { city: "San Francisco", country: "USA", hub: "SF Distribution Center" },
    { city: "Dallas", country: "USA", hub: "Dallas Processing Center" },
  ],
  dhl: [
    { city: "Leipzig", country: "Germany", hub: "DHL Leipzig Hub (LEJ)" },
    { city: "Frankfurt", country: "Germany", hub: "DHL Frankfurt Gateway" },
    { city: "Cologne", country: "Germany", hub: "DHL Cologne Hub" },
    { city: "Brussels", country: "Belgium", hub: "DHL Brussels Gateway" },
    { city: "Cincinnati", country: "USA", hub: "DHL Americas Hub, CVG" },
    { city: "Hong Kong", country: "China", hub: "DHL Central Asia Hub" },
    { city: "Singapore", country: "Singapore", hub: "DHL South Asia Hub" },
    { city: "Tbilisi", country: "Georgia", hub: "DHL Tbilisi Gateway" },
  ],
  generic: [
    { city: "Berlin", country: "Germany", hub: "Berlin Cargo Hub" },
    { city: "Tbilisi", country: "Georgia", hub: "Tbilisi Cargo Center" },
    { city: "London", country: "UK", hub: "London Gateway" },
    { city: "Dubai", country: "UAE", hub: "Dubai Cargo Village" },
    { city: "Singapore", country: "Singapore", hub: "Singapore Changi Cargo" },
    { city: "New York", country: "USA", hub: "JFK Cargo Center" },
    { city: "Istanbul", country: "Türkiye", hub: "Istanbul Cargo Hub" },
  ],
};

const CARGO_TYPES = [
  { description: "Industrial components, palletized", service: "Full Truckload (FTL)", vehicle: "Semi Trailer · 13.6 m" },
  { description: "Retail goods on pallets", service: "Less-than-Truckload (LTL)", vehicle: "Semi Trailer · 13.6 m" },
  { description: "Packaged parcels", service: "Express Cargo", vehicle: "Sprinter Van · 8 m³" },
  { description: "Temperature-controlled goods", service: "Refrigerated Transport", vehicle: "Reefer Trailer · 13.6 m" },
  { description: "Machinery and equipment", service: "Ground Freight", vehicle: "Box Truck · 12 m" },
];

const CARGO_TYPE_KEYS: Record<Carrier, string[]> = {
  cargonova: [
    "Industrial components, palletized",
    "Retail goods on pallets",
    "Temperature-controlled goods",
    "Machinery and equipment",
    "E-commerce parcels",
  ],
  ups: ["Express packages", "Next Day Air parcels", "Palletized freight", "Temperature-sensitive goods"],
  fedex: ["Express parcels", "Overnight freight", "Priority packages", "International documents"],
  usps: ["Priority Mail parcels", "First-Class packages", "International shipments", "Media mail"],
  dhl: ["Express worldwide parcels", "Time-definite freight", "Temperature-controlled", "E-commerce parcels"],
  generic: ["Palletized cargo", "Mixed consignment", "Urgent freight", "Consolidated parcels"],
};

/* ── Deterministic pseudo-random from ID ──────────────────── */

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h;
}

const STATUS_ORDER: ShipmentStatus[] = [
  "picked_up",
  "in_transit",
  "in_transit",
  "customs",
  "out_for_delivery",
  "delivered",
];

const STATUS_ORDER_DOMESTIC = STATUS_ORDER.filter((s) => s !== "customs");

const STATUS_PROGRESS: Record<ShipmentStatus, number> = {
  pending: 0,
  picked_up: 14,
  in_transit: 55,
  customs: 45,
  out_for_delivery: 85,
  delivered: 100,
};

function weightFor(h: number): string {
  const kg = 600 + (h % 21400);
  return `${Math.round(kg / 50) * 50} kg`;
}

function daysFor(h: number): number {
  return 3 + (h % 5); // 3–7 day transit
}

function buildRoute(
  origin: City,
  destination: City,
  international: boolean,
): string[] {
  void origin;
  void destination;
  const steps = ["Pickup", "Origin Hub", "Transit"];
  if (international) steps.push("Border Check");
  steps.push("Destination Hub", "Delivery");
  return steps;
}

/* ── Shipment builder ─────────────────────────────────────── */

type ShipmentOverrides = Partial<Shipment> & {
  status: ShipmentStatus;
  origin: string;
  destination: string;
  totalDays?: number;
};

function buildShipment(id: string, overrides: ShipmentOverrides): Shipment {
  const h = hashId(id);
  const today = new Date();
  const totalDays = overrides.totalDays ?? daysFor(h);
  const status = overrides.status;
  const progress = STATUS_PROGRESS[status];

  const originName = overrides.origin;
  const destinationName = overrides.destination;
  const network = CARRIER_NETWORKS[overrides.carrier ?? "cargonova"];
  const originLoc = network.find((l) => `${l.city}, ${l.country}` === originName) ?? network[0];
  const destLoc = network.find((l) => `${l.city}, ${l.country}` === destinationName) ?? network[1];
  const international = originLoc.country !== destLoc.country;
  const cargoList = CARGO_TYPE_KEYS[overrides.carrier ?? "cargonova"];
  const baseCargo = CARGO_TYPES[h % CARGO_TYPES.length];
  const cargo = {
    description: cargoList[h % cargoList.length],
    service: baseCargo.service,
    vehicle: baseCargo.vehicle,
    weight: weightFor(h),
  };

  // Timeline: pickup at day -totalDays, delivery at day 0 (or future if pending).
  const pickup = at(-totalDays, 8, 40);
  const mid = at(-Math.floor(totalDays / 2), 9, 12);
  const eta = at(status === "delivered" ? 0 : status === "out_for_delivery" ? 0 : 1 + (totalDays % 2), 14, 30);

  const route = overrides.route ?? buildRoute(originLoc, destLoc, international);

  // Build checkpoints aligned to the route.
  const checkpoints: TrackingCheckpoint[] = route.map((label) => {
    if (label === "Pickup") {
      return {
        label,
        location: originLoc.city,
        timestamp: fmtTs(pickup),
        status: "picked_up",
        note: "Freight collected at shipper facility.",
      };
    }
    if (label === "Origin Hub") {
      return {
        label,
        location: originLoc.hub,
        timestamp: fmtTs(at(-totalDays, 14, 5)),
        status: "picked_up",
        note: "Consolidated and secured for linehaul.",
      };
    }
    if (label === "Transit") {
      return {
        label,
        location: international ? `Corridor · ${destLoc.country} border region` : `Corridor · ${destLoc.country}`,
        timestamp: fmtTs(mid),
        status: "in_transit",
        note: "In linehaul across the corridor.",
      };
    }
    if (label === "Border Check" || label === "Customs") {
      return {
        label,
        location: "Border crossing · customs office",
        timestamp: fmtTs(at(-1, 10, 2)),
        status: "customs",
        note: "Customs documentation pre-cleared.",
      };
    }
    if (label === "Destination Hub") {
      return {
        label,
        location: destLoc.hub,
        timestamp: fmtTs(at(-1, 8, 10)),
        status: status === "delivered" || status === "out_for_delivery" ? "in_transit" : "pending",
      };
    }
    // Delivery
    return {
      label,
      location: destLoc.city,
      timestamp:
        status === "delivered" ? fmtTs(at(0, 13, 10)) : etaLabel(eta, today),
      status: status === "delivered" ? "delivered" : status === "out_for_delivery" ? "out_for_delivery" : "pending",
      note: status === "delivered" ? "Signed for by recipient. POD available on request." : "Delivery window confirmed.",
    };
  });

  return {
    id,
    carrier: overrides.carrier ?? "cargonova",
    carrierName: carrierDisplayName(overrides.carrier ?? "cargonova"),
    mode: overrides.mode ?? "road",
    status,
    origin: originName,
    destination: destinationName,
    currentCheckpoint: status === "delivered" ? "Delivered" : checkpoints.find((c) => c.status === status)?.location ?? checkpoints[0].location,
    eta: status === "delivered" ? `Delivered ${fmtDay(at(0, 13, 10))}` : etaLabel(eta, today),
    progress,
    route,
    checkpoints,
    cargo,
    voyage: overrides.voyage,
  };
}

/* ── Ocean shipment builder (vessel voyages on real sea lanes) ── */

type OceanInput = {
  origin: string;
  destination: string;
  vessel: string;
  flag?: string;
  mmsi?: string;
  routeName: string;
  waypoints: [number, number][];
  teu?: number;
  cargo: string;
  weight: string;
  consignee: string;
  progress: number;
  eta: string;
  etaMs: number;
  fleetStatus: "In Transit" | "At Port" | "Delivering";
};

function buildOceanShipment(id: string, input: OceanInput): Shipment {
  // One coherent clock: every checkpoint date derives from the ETA timestamp and
  // the current progress — no separate hash-based dates that can contradict the
  // status (the old code showed "Port of Call Aug 14" as future on Aug 16).
  const now = Date.now();
  const p = Math.min(99.5, Math.max(0.5, input.progress)); // % along the voyage
  const remainingMs = Math.max(6 * 3600000, input.etaMs - now);
  const totalMs = remainingMs / Math.max(0.05, (100 - p) / 100);
  const depMs = input.etaMs - totalMs;
  const openSeaMs = input.etaMs - totalMs * 0.55;
  const portCallMs = input.etaMs - totalMs * 0.2;

  // Current stage by progress: departure → open sea → port of call → arrival.
  const stage = p < 22 ? 0 : p < 55 ? 1 : p < 90 ? 2 : 3;
  const status: ShipmentStatus = (["picked_up", "in_transit", "in_transit", "out_for_delivery"] as ShipmentStatus[])[stage];

  const raw: {
    label: string;
    location: string;
    ts: number;
    status: ShipmentStatus;
    note: string;
  }[] = [
    {
      label: "Departure",
      location: input.origin,
      ts: depMs,
      status: "picked_up",
      note: "Cargo loaded and sealed on board.",
    },
    {
      label: "Open Sea",
      location: `At sea · ${input.routeName}`,
      ts: openSeaMs,
      status: "in_transit",
      note: "Voyage in progress across the sea lane.",
    },
    {
      label: "Port of Call",
      location: "Transshipment hub",
      ts: portCallMs,
      status: "in_transit",
      note: "Port call for bunkering and rotation.",
    },
    {
      label: "Arrival",
      location: input.destination,
      ts: input.etaMs,
      status: stage === 3 ? "out_for_delivery" : "pending",
      note:
        stage === 3
          ? "Arrived at destination port. Discharge in progress."
          : "Scheduled arrival at destination port.",
    },
  ];

  const route = ["Departure", "Open Sea", "Port of Call", "Arrival"];
  const checkpoints: TrackingCheckpoint[] = raw.map((step, i) => ({
    label: step.label,
    location: step.location,
    timestamp: fmtTs(new Date(step.ts)),
    status: step.status,
    note: step.note,
    done: i < stage,
  }));

  return {
    id,
    carrier: "cargonova",
    carrierName: "CargoNova Ocean Freight",
    mode: "ocean",
    status,
    origin: input.origin,
    destination: input.destination,
    currentCheckpoint:
      input.fleetStatus === "At Port"
        ? `Berthed · ${input.destination}`
        : stage === 3
          ? `Arrived · ${input.destination}`
          : `At sea · ${input.routeName}`,
    eta: input.eta,
    progress: Math.round(p),
    route,
    checkpoints,
    cargo: {
      description: input.cargo,
      weight: input.weight,
      service: "Ocean Freight (FCL)",
      vehicle: input.teu ? `Container vessel · ${input.teu} TEU` : "Container vessel",
    },
    voyage: {
      vessel: input.vessel,
      flag: input.flag,
      mmsi: input.mmsi,
      routeName: input.routeName,
      route: input.waypoints,
    },
  };
}

/* Real container-ship operators used for container-format codes. */
const OCEAN_VESSELS = [
  "MSC Aysun", "Maersk Santana", "CMA CGM Ural", "Ever Fashion", "COSCO Shipping Taurus",
  "ONE Orchid", "HMM Daon", "YM Efficiency", "OOCL Utah", "ZIM Hong Kong",
];

const CONSIGNEES_OCEAN = [
  "Helvetia Components", "Nordic Fresh", "Vela Retail", "MediCore", "Atlas Commerce",
  "Rheinwerk AG", "Aurora Foods", "Baumgartner Bau", "Meyer Manufacturing", "Global Parts GmbH",
];

/** Nearest world port name for a sea-lane endpoint. */
function nearestPort(pos: [number, number]): string {
  let best = "Open sea";
  let bestD = Infinity;
  for (const p of ports) {
    const d = distKm({ lat: pos[0], lon: pos[1] }, { lat: p.lat, lon: p.lon });
    if (d < bestD) {
      bestD = d;
      best = p.name;
    }
  }
  return bestD < 500 ? best : `Offshore ${pos[0].toFixed(1)}°, ${pos[1].toFixed(1)}°`;
}

function fmtEtaDays(days: number): string {
  return fmtDay(at(days, 14, 30));
}

/* ── Crafted showcase shipments (dates always relative) ───── */

const SHOWCASE: { id: string; origin: string; destination: string; status: ShipmentStatus; carrier?: Carrier }[] = [
  { id: "CRG-582941", origin: "Berlin, Germany", destination: "Tbilisi, Georgia", status: "in_transit", carrier: "cargonova" },
  { id: "CRG-729103", origin: "Rotterdam, Netherlands", destination: "Warsaw, Poland", status: "customs", carrier: "cargonova" },
  { id: "CRG-193847", origin: "Munich, Germany", destination: "Zurich, Switzerland", status: "out_for_delivery", carrier: "cargonova" },
  { id: "CRG-664120", origin: "Hamburg, Germany", destination: "Copenhagen, Denmark", status: "delivered", carrier: "cargonova" },
  { id: "1Z999AA10123456784", origin: "Louisville, USA", destination: "Chicago, USA", status: "in_transit", carrier: "ups" },
  { id: "JD01460000360067008", origin: "Leipzig, Germany", destination: "Tbilisi, Georgia", status: "customs", carrier: "dhl" },
];

// The fleet is deterministic per second and expensive to rebuild, so cache it
// briefly. Map lookups for hundreds of shipment IDs then cost one recompute.
let fleetCache: { at: number; byId: Map<string, LiveUnit> } | null = null;

function findFleetUnit(id: string) {
  try {
    const now = Date.now();
    if (!fleetCache || now - fleetCache.at > 1500) {
      const units = computeLiveFleet(new Date());
      fleetCache = { at: now, byId: new Map(units.map((u) => [u.shipment.id, u])) };
    }
    return fleetCache.byId.get(id) ?? null;
  } catch {
    return null;
  }
}

export function lookupShipment(id: string): Shipment | null {
  const normalized = id.trim().toUpperCase();
  if (!isValidTrackingCode(normalized)) return null;

  // 1) Crafted showcase shipments (quick-lookup chips).
  const showcase = SHOWCASE.find((s) => s.id === normalized);
  if (showcase) {
    return buildShipment(normalized, {
      status: showcase.status,
      origin: showcase.origin,
      destination: showcase.destination,
      carrier: showcase.carrier,
    });
  }

  // 2) A shipment on the live map: return its actual voyage — same vessel,
  //    same ports, same cargo, drawn on the real sea lane.
  const unit = findFleetUnit(normalized);
  if (unit && unit.kind === "ship") {
    const lane = seaRoutes.find((r) => r.id === unit.routeId);
    return buildOceanShipment(normalized, {
      origin: unit.origin,
      destination: unit.destination,
      vessel: unit.name,
      flag: unit.flag,
      mmsi: unit.mmsi,
      routeName: unit.routeName,
      waypoints: lane?.waypoints ?? [unit.originLatLon, unit.destLatLon],
      teu: unit.shipment.teu,
      cargo: unit.shipment.cargo,
      weight: unit.shipment.weight,
      consignee: unit.shipment.consignee,
      progress: unit.progress,
      eta: unit.eta,
      etaMs: unit.etaMs,
      fleetStatus: unit.status,
    });
  }

  // 3) ISO container numbers (CNTR…, [A-Z]{4}[0-9]{7}) are ocean freight.
  if (/^[A-Z]{4}\d{7}$/.test(normalized)) {
    const h = hashId(normalized);
    const vessel = OCEAN_VESSELS[h % OCEAN_VESSELS.length];
    const lane = seaRoutes[(h >> 2) % seaRoutes.length];
    const startPort = lane.waypoints[0];
    const endPort = lane.waypoints[lane.waypoints.length - 1];
    const originName = nearestPort(startPort);
    const destinationName = nearestPort(endPort);
    const status = STATUS_ORDER[h % STATUS_ORDER.length];
    return buildOceanShipment(normalized, {
      origin: originName,
      destination: destinationName,
      vessel,
      routeName: lane.name,
      waypoints: lane.waypoints,
      teu: 24 + (h % 800),
      cargo: CARGO_TYPE_KEYS.generic[h % CARGO_TYPE_KEYS.generic.length],
      weight: weightFor(h),
      consignee: CONSIGNEES_OCEAN[h % CONSIGNEES_OCEAN.length],
      progress: status === "picked_up" ? 12 : status === "customs" ? 78 : status === "delivered" ? 100 : 45 + (h % 40),
      eta: fmtEtaDays(2 + (h % 12)),
      etaMs: Date.now() + (2 + (h % 12)) * 86400000,
      fleetStatus: "In Transit",
    });
  }

  // 4) Any other well-formed ID resolves to a realistic road shipment.
  const h = hashId(normalized);
  const carrier = detectCarrier(normalized);
  const network = CARRIER_NETWORKS[carrier];
  const mod = (n: number, m: number) => (((n % m) + m) % m);
  const origin = network[h % network.length];
  let dest = network[mod((h >> 3) + 1, network.length)];
  if (dest.city === origin.city) dest = network[mod((h >> 3) + 6, network.length)];
  const international = origin.country !== dest.country;
  const pool = international ? STATUS_ORDER : STATUS_ORDER_DOMESTIC;
  const status = pool[h % pool.length];
  return buildShipment(normalized, {
    status,
    origin: `${origin.city}, ${origin.country}`,
    destination: `${dest.city}, ${dest.country}`,
    carrier,
  });
}

/** Demo IDs surfaced in the UI so visitors can try the tool. */
export const demoTrackingIds = SHOWCASE.map((s) => s.id);

/**
 * Where the visitor can re-verify this tracking number against the real carrier.
 * CargoNova's own demo data is simulated, so we always link out to the genuine
 * source for the carrier format the code belongs to.
 */
export function carrierVerifyUrl(id: string, carrier: Carrier): string {
  const q = encodeURIComponent(id.trim());
  switch (carrier) {
    case "ups":
      return `https://www.ups.com/track?loc=en_US&tracknum=${q}`;
    case "dhl":
      return `https://www.dhl.com/en/express/tracking.html?AWB=${q}`;
    case "usps":
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${q}`;
    case "fedex":
      return `https://www.fedex.com/fedextrack/?trknbr=${q}`;
    default:
      // ISO container numbers and generic codes → aggregator / web lookup.
      return /^[A-Z]{4}\d{7}$/.test(id.trim().toUpperCase())
        ? `https://www.track-ora.com/track/?code=${q}`
        : `https://www.google.com/search?q=${q}+%22tracking%22`;
  }
}
