/**
 * Shipment tracking service.
 *
 * Demo mode is intentionally "alive": every well-formed tracking number
 * resolves to a realistic shipment (deterministic per ID, timestamps relative
 * to today), so the product can be evaluated end-to-end. Swap `lookupShipment`
 * for a real TMS / tracking API later without touching any UI code.
 */

export type ShipmentStatus =
  | "pending"
  | "picked_up"
  | "in_transit"
  | "customs"
  | "out_for_delivery"
  | "delivered";

export type TrackingCheckpoint = {
  label: string;
  location: string;
  timestamp: string;
  status: ShipmentStatus;
  note?: string;
};

export type Shipment = {
  id: string;
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
};

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

const LOCATIONS = [
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

const CARGO_TYPES = [
  { description: "Industrial components, palletized", service: "Full Truckload (FTL)", vehicle: "Semi Trailer · 13.6 m" },
  { description: "Retail goods on pallets", service: "Less-than-Truckload (LTL)", vehicle: "Semi Trailer · 13.6 m" },
  { description: "Packaged parcels", service: "Express Cargo", vehicle: "Sprinter Van · 8 m³" },
  { description: "Temperature-controlled goods", service: "Refrigerated Transport", vehicle: "Reefer Trailer · 13.6 m" },
  { description: "Machinery and equipment", service: "Ground Freight", vehicle: "Box Truck · 12 m" },
];

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

const STATUS_NOTE: Record<ShipmentStatus, string> = {
  pending: "Documentation in progress.",
  picked_up: "Freight collected at shipper facility.",
  in_transit: "In linehaul across the corridor.",
  customs: "Documentation under review — release expected within 24 h.",
  out_for_delivery: "Vehicle on route. Delivery window confirmed.",
  delivered: "Signed for by recipient. POD available on request.",
};

function weightFor(h: number): string {
  const kg = 600 + (h % 21400);
  return `${Math.round(kg / 50) * 50} kg`;
}

function daysFor(h: number): number {
  return 3 + (h % 5); // 3–7 day transit
}

function buildRoute(
  origin: (typeof LOCATIONS)[number],
  destination: (typeof LOCATIONS)[number],
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
  const originLoc = LOCATIONS.find((l) => `${l.city}, ${l.country}` === originName) ?? LOCATIONS[0];
  const destLoc = LOCATIONS.find((l) => `${l.city}, ${l.country}` === destinationName) ?? LOCATIONS[1];
  const international = originLoc.country !== destLoc.country;
  const baseCargo = overrides.cargo ?? CARGO_TYPES[h % CARGO_TYPES.length];
  const cargo = { ...baseCargo, weight: weightFor(h) };

  // Timeline: pickup at day -totalDays, delivery at day 0 (or future if pending).
  const pickup = at(-totalDays, 8, 40);
  const mid = at(-Math.floor(totalDays / 2), 9, 12);
  const eta = at(status === "delivered" ? 0 : status === "out_for_delivery" ? 0 : 1 + (totalDays % 2), 14, 30);

  const route = overrides.route ?? buildRoute(originLoc, destLoc, international);

  // Build checkpoints aligned to the route.
  const checkpoints: TrackingCheckpoint[] = route.map((label, i) => {
    const last = i === route.length - 1;
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
        location: `Corridor · ${destLoc.country} border region`,
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
    status,
    origin: originName,
    destination: destinationName,
    currentCheckpoint: status === "delivered" ? "Delivered" : checkpoints.find((c) => c.status === status)?.location ?? checkpoints[0].location,
    eta: status === "delivered" ? `Delivered ${fmtDay(at(0, 13, 10))}` : etaLabel(eta, today),
    progress,
    route,
    checkpoints,
    cargo,
  };
}

/* ── Crafted showcase shipments (dates always relative) ───── */

const SHOWCASE: { id: string; origin: string; destination: string; status: ShipmentStatus }[] = [
  { id: "CRG-582941", origin: "Berlin, Germany", destination: "Tbilisi, Georgia", status: "in_transit" },
  { id: "CRG-729103", origin: "Rotterdam, Netherlands", destination: "Warsaw, Poland", status: "customs" },
  { id: "CRG-193847", origin: "Munich, Germany", destination: "Zurich, Switzerland", status: "out_for_delivery" },
  { id: "CRG-664120", origin: "Hamburg, Germany", destination: "Copenhagen, Denmark", status: "delivered" },
];

export function lookupShipment(id: string): Shipment | null {
  const normalized = id.trim().toUpperCase();
  if (!/^CRG-\d{4,8}$/.test(normalized)) return null;

  const showcase = SHOWCASE.find((s) => s.id === normalized);
  if (showcase) {
    return buildShipment(normalized, {
      status: showcase.status,
      origin: showcase.origin,
      destination: showcase.destination,
    });
  }

  // Any other well-formed ID resolves to a realistic generated shipment.
  const h = hashId(normalized);
  const origin = LOCATIONS[h % LOCATIONS.length];
  let dest = LOCATIONS[((h >> 3) % LOCATIONS.length) + 1] ?? LOCATIONS[1];
  if (dest.city === origin.city) dest = LOCATIONS[((h >> 3) + 5) % LOCATIONS.length];
  const international = origin.country !== dest.country;
  const pool = international ? STATUS_ORDER : STATUS_ORDER_DOMESTIC;
  const status = pool[h % pool.length];
  return buildShipment(normalized, {
    status,
    origin: `${origin.city}, ${origin.country}`,
    destination: `${dest.city}, ${dest.country}`,
  });
}

/** Demo IDs surfaced in the UI so visitors can try the tool. */
export const demoTrackingIds = SHOWCASE.map((s) => s.id);
