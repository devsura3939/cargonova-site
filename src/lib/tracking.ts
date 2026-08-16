/**
 * Mock tracking service.
 *
 * The lookup is intentionally isolated: swap `lookupShipment` for a call to
 * a real TMS / tracking API later without touching any UI code.
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

const DEMO_SHIPMENTS: Shipment[] = [
  {
    id: "CRG-582941",
    status: "in_transit",
    origin: "Berlin, Germany",
    destination: "Tbilisi, Georgia",
    currentCheckpoint: "Istanbul Logistics Hub",
    eta: "August 18",
    progress: 62,
    route: [
      "Pickup",
      "Origin Hub",
      "Transit",
      "Border Check",
      "Destination Hub",
      "Delivery",
    ],
    checkpoints: [
      {
        label: "Pickup",
        location: "Berlin, Germany",
        timestamp: "Aug 12 · 08:40",
        status: "picked_up",
        note: "Freight collected at shipper facility.",
      },
      {
        label: "Origin Hub",
        location: "Berlin Logistics Park",
        timestamp: "Aug 12 · 14:05",
        status: "picked_up",
        note: "Consolidated and secured for linehaul.",
      },
      {
        label: "Transit",
        location: "Corridor EU-4 · Romania",
        timestamp: "Aug 14 · 09:12",
        status: "in_transit",
        note: "In linehaul across the European corridor.",
      },
      {
        label: "Border Check",
        location: "Kapıkule Border Crossing",
        timestamp: "Estimated Aug 16",
        status: "customs",
        note: "Customs documentation pre-cleared.",
      },
      {
        label: "Destination Hub",
        location: "Tbilisi Logistics Hub",
        timestamp: "Estimated Aug 17",
        status: "pending",
      },
      {
        label: "Delivery",
        location: "Tbilisi, Georgia",
        timestamp: "Estimated Aug 18",
        status: "pending",
      },
    ],
    cargo: {
      description: "Industrial components, 6 pallets",
      weight: "4,200 kg",
      service: "Full Truckload (FTL)",
      vehicle: "Semi Trailer · 13.6 m",
    },
  },
  {
    id: "CRG-729103",
    status: "customs",
    origin: "Rotterdam, Netherlands",
    destination: "Warsaw, Poland",
    currentCheckpoint: "Customs Clearance",
    eta: "August 17",
    progress: 48,
    route: ["Pickup", "Origin Hub", "Transit", "Customs", "Destination Hub", "Delivery"],
    checkpoints: [
      {
        label: "Pickup",
        location: "Rotterdam, Netherlands",
        timestamp: "Aug 10 · 07:15",
        status: "picked_up",
        note: "Freight collected at the Port of Rotterdam.",
      },
      {
        label: "Origin Hub",
        location: "Rotterdam Distribution Centre",
        timestamp: "Aug 10 · 13:30",
        status: "picked_up",
      },
      {
        label: "Transit",
        location: "Corridor EU-2 · Germany",
        timestamp: "Aug 12 · 18:20",
        status: "in_transit",
      },
      {
        label: "Customs",
        location: "Frankfurt Customs Office",
        timestamp: "Aug 14 · 10:02",
        status: "customs",
        note: "Documents under review — expected release within 24 h.",
      },
      {
        label: "Destination Hub",
        location: "Warsaw Logistics Hub",
        timestamp: "Estimated Aug 16",
        status: "pending",
      },
      {
        label: "Delivery",
        location: "Warsaw, Poland",
        timestamp: "Estimated Aug 17",
        status: "pending",
      },
    ],
    cargo: {
      description: "Retail goods, 14 pallets",
      weight: "9,800 kg",
      service: "Less-than-Truckload (LTL)",
      vehicle: "Semi Trailer · 13.6 m",
    },
  },
  {
    id: "CRG-193847",
    status: "out_for_delivery",
    origin: "Munich, Germany",
    destination: "Zurich, Switzerland",
    currentCheckpoint: "Out for Delivery",
    eta: "Today, 14:30",
    progress: 88,
    route: ["Pickup", "Origin Hub", "Transit", "Destination Hub", "Delivery"],
    checkpoints: [
      {
        label: "Pickup",
        location: "Munich, Germany",
        timestamp: "Aug 14 · 06:50",
        status: "picked_up",
      },
      {
        label: "Origin Hub",
        location: "Munich Cargo Terminal",
        timestamp: "Aug 14 · 11:25",
        status: "picked_up",
      },
      {
        label: "Transit",
        location: "A96 Express Corridor",
        timestamp: "Aug 14 · 15:40",
        status: "in_transit",
        note: "Express corridor — priority lane.",
      },
      {
        label: "Destination Hub",
        location: "Zurich Logistics Hub",
        timestamp: "Aug 15 · 08:10",
        status: "in_transit",
      },
      {
        label: "Delivery",
        location: "Zurich, Switzerland",
        timestamp: "Estimated today, 14:30",
        status: "out_for_delivery",
        note: "Vehicle on route. Delivery window 14:00 – 16:00.",
      },
    ],
    cargo: {
      description: "Medical equipment, 3 crates",
      weight: "1,150 kg",
      service: "Express Cargo",
      vehicle: "Sprinter Van · 8 m³",
    },
  },
  {
    id: "CRG-664120",
    status: "delivered",
    origin: "Hamburg, Germany",
    destination: "Copenhagen, Denmark",
    currentCheckpoint: "Delivered",
    eta: "Delivered Aug 12",
    progress: 100,
    route: ["Pickup", "Origin Hub", "Transit", "Destination Hub", "Delivery"],
    checkpoints: [
      {
        label: "Pickup",
        location: "Hamburg, Germany",
        timestamp: "Aug 11 · 07:30",
        status: "picked_up",
      },
      {
        label: "Origin Hub",
        location: "Hamburg Terminal",
        timestamp: "Aug 11 · 12:00",
        status: "picked_up",
      },
      {
        label: "Transit",
        location: "Fehmarn Belt Route",
        timestamp: "Aug 11 · 19:45",
        status: "in_transit",
      },
      {
        label: "Destination Hub",
        location: "Copenhagen Hub",
        timestamp: "Aug 12 · 08:20",
        status: "in_transit",
      },
      {
        label: "Delivery",
        location: "Copenhagen, Denmark",
        timestamp: "Aug 12 · 13:10",
        status: "delivered",
        note: "Signed for by recipient. POD available on request.",
      },
    ],
    cargo: {
      description: "Furniture, 4 pallets",
      weight: "2,600 kg",
      service: "Full Truckload (FTL)",
      vehicle: "Box Truck · 12 m",
    },
  },
];

export function lookupShipment(id: string): Shipment | null {
  const normalized = id.trim().toUpperCase();
  if (!/^CRG-\d{4,8}$/.test(normalized)) return null;
  return DEMO_SHIPMENTS.find((s) => s.id === normalized) ?? null;
}

/** Demo IDs surfaced in the UI so visitors can try the tool. */
export const demoTrackingIds = DEMO_SHIPMENTS.map((s) => s.id);
