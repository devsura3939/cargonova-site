import type { ServiceCategory } from "@/types";

export const services: ServiceCategory[] = [
  {
    slug: "ground-freight",
    title: "Ground Freight",
    short: "Domestic and international road transportation with predictable delivery windows.",
    description:
      "Our ground freight network moves full and part loads across Europe's major corridors with fixed schedules, live visibility, and a single point of contact from pickup to delivery. Every shipment is planned against traffic, border, and weather data so your delivery window holds.",
    icon: "truck",
    accent: "blue",
    features: [
      "Fixed departure schedules on core corridors",
      "Live GPS visibility from pickup to POD",
      "Dedicated account manager per shipment",
      "Digital documentation and instant POD",
      "Cargo insurance available per shipment",
    ],
    benefits: [
      { title: "Predictable delivery windows", text: "ETA commitments backed by route data, not guesswork. 98.7% of our ground freight arrives within the promised window." },
      { title: "One contact, end to end", text: "A dedicated coordinator owns your shipment from booking to signed delivery receipt — no handoffs, no phone trees." },
      { title: "Full visibility", text: "Track your cargo in real time through the portal, with proactive alerts at every milestone." },
    ],
    suitableCargo: [
      "General palletized goods",
      "Industrial components",
      "Retail and wholesale stock",
      "Machinery and equipment",
      "Non-hazardous packaged goods",
    ],
    process: [
      { step: "01", title: "Book & confirm", text: "Share your cargo details, we confirm capacity and price within hours." },
      { step: "02", title: "Pickup", text: "Vehicle arrives within the agreed window; cargo is secured and documented." },
      { step: "03", title: "Linehaul", text: "Your freight travels on a planned corridor with live monitoring." },
      { step: "04", title: "Delivery & POD", text: "On-time delivery with signed proof of delivery in your portal the same day." },
    ],
    fleet: ["Semi Trailer · 13.6 m", "Box Truck · 12 m", "Curtainsider · 13.6 m"],
    faqs: [
      { question: "How far in advance should I book ground freight?", answer: "For standard ground freight we recommend booking 48 hours ahead. Express and same-day options are available on most corridors when capacity allows." },
      { question: "Is my cargo insured during transport?", answer: "Every shipment includes base carrier liability. We can arrange full cargo insurance up to declared value on request." },
      { question: "Do you handle customs for international routes?", answer: "Yes. For international ground freight we prepare and pre-clear documentation where possible, and coordinate with customs brokers at border crossings." },
    ],
  },
  {
    slug: "full-truckload",
    title: "Full Truckload (FTL)",
    short: "Dedicated vehicle capacity for large shipments that move faster, with zero transfers.",
    description:
      "When your cargo occupies a full vehicle, FTL gives you dedicated capacity, a direct route, and no intermediate handling. Your freight is loaded once, secured once, and moves on a direct line to destination — the fastest and safest way to move large volumes.",
    icon: "container",
    accent: "blue",
    features: [
      "Dedicated vehicle — no co-loading",
      "Direct routing with no hub transfers",
      "Priority scheduling and flexible pickup",
      "Choice of standard, curtainsider, or reefer",
      "Real-time location and ETA updates",
    ],
    benefits: [
      { title: "Speed without transfers", text: "A direct run from A to B removes the handling, waiting, and damage risk of hub-and-spoke networks." },
      { title: "Capacity when you need it", text: "Access to a vetted fleet across Europe, including weekends and peak season." },
      { title: "Lower handling risk", text: "Your cargo is loaded and unloaded only once, by trained crews at both ends." },
    ],
    suitableCargo: [
      "Full pallet loads (24–33 pallets)",
      "Bulk packaged goods",
      "Machinery and equipment",
      "Retail distribution loads",
      "Construction materials",
    ],
    process: [
      { step: "01", title: "Request capacity", text: "Tell us your load size, pickup and delivery window." },
      { step: "02", title: "Vehicle assigned", text: "We match a vetted vehicle and driver to your route." },
      { step: "03", title: "Direct transport", text: "Single loading, direct linehaul, continuous monitoring." },
      { step: "04", title: "Delivery", text: "Signed delivery with instant POD in your portal." },
    ],
    fleet: ["Semi Trailer · 24 pallets", "Curtainsider · 33 pallets", "Reefer Trailer · 26 pallets"],
    faqs: [
      { question: "How many pallets fit in a full truckload?", answer: "A standard 13.6 m semi trailer fits 33 Euro pallets (or 26 standard pallets). Curtainsiders and box trucks have slightly different capacities — we'll match the right vehicle to your load." },
      { question: "Can FTL be combined with warehousing?", answer: "Yes. Many clients combine FTL transport with our warehousing and distribution services for cross-docking and staged delivery." },
      { question: "What if my load is slightly under a full truck?", answer: "If your volume is close to full, an FTL quote is often still the fastest option. For smaller loads, our LTL service shares capacity at a lower cost." },
    ],
  },
  {
    slug: "ltl",
    title: "Less-than-Truckload (LTL)",
    short: "Cost-efficient shared cargo transportation for pallet and parcel freight.",
    description:
      "LTL lets you pay only for the space you use. Your pallets are consolidated with compatible freight on optimized routes, moving through our hub network with careful handling and complete tracking at every stop.",
    icon: "boxes",
    accent: "cyan",
    features: [
      "Per-pallet and per-m³ pricing",
      "Hub-and-spoke consolidation network",
      "Handling with barcode-level tracking",
      "Predictable transit times per corridor",
      "Delivery with liftgate and appointment options",
    ],
    benefits: [
      { title: "Pay for what you ship", text: "Shared capacity means you only pay for the floor space your freight occupies — ideal for 1–15 pallets." },
      { title: "Network coverage", text: "Access to destinations that would be uneconomical with a dedicated vehicle." },
      { title: "Protective handling", text: "Consolidated freight moves on standard pallets with stretch-wrap and damage-prevention protocols at every hub." },
    ],
    suitableCargo: [
      "1–15 pallets",
      "Packaged retail goods",
      "E-commerce distribution",
      "Spare parts and components",
      "Non-perishable consumer goods",
    ],
    process: [
      { step: "01", title: "Request", text: "Enter your pallet count and route for an instant estimate." },
      { step: "02", title: "Pickup", text: "We collect your freight within the agreed window." },
      { step: "03", title: "Consolidation", text: "Your pallets move through our hub network with scan-level tracking." },
      { step: "04", title: "Last mile", text: "Final-mile delivery with appointment or liftgate service as required." },
    ],
    fleet: ["Semi Trailer LTL lanes", "Box Truck feeder routes", "Sprinter Van express feeders"],
    faqs: [
      { question: "How is LTL pricing calculated?", answer: "Pricing is based on pallet count, weight, and the corridor. Volume-based rates (per m³) apply for non-palletized cargo. Requests are quoted in under 4 hours." },
      { question: "Will my freight be transferred between vehicles?", answer: "Yes — that is how shared capacity works. Your pallets are consolidated at hubs and reloaded on the correct lane, with scan-level tracking at every handoff." },
      { question: "What protection does LTL cargo get?", answer: "All LTL freight is handled on standard pallets, stretch-wrapped where needed, and monitored at every hub. Carrier liability and optional full-value insurance apply." },
    ],
  },
  {
    slug: "express",
    title: "Express Cargo",
    short: "Priority shipment delivery for freight that cannot wait.",
    description:
      "Same-day and next-day transport for time-critical cargo. Express moves on dedicated vehicles with priority corridors, direct routing, and proactive exception management — if something changes, you know before it matters.",
    icon: "zap",
    accent: "orange",
    features: [
      "Same-day and next-day options",
      "Dedicated vehicle, direct routing",
      "Priority handling at every hub",
      "Proactive exception alerts",
      "Two-hour pickup windows",
    ],
    benefits: [
      { title: "When hours matter", text: "Production lines, medical deliveries, and time-sensitive documents move on dedicated vehicles with direct routing." },
      { title: "Early warning", text: "Our control tower monitors your express shipment live and escalates exceptions within minutes, not hours." },
      { title: "Priority lanes", text: "Express freight gets priority loading and unloading at every facility it touches." },
    ],
    suitableCargo: [
      "Spare parts for production stops",
      "Medical devices and lab samples",
      "Critical documents and prototypes",
      "Same-day e-commerce",
      "Event and exhibition materials",
    ],
    process: [
      { step: "01", title: "Request", text: "Confirm availability in under 30 minutes, around the clock." },
      { step: "02", title: "Priority pickup", text: "Vehicle dispatched within your two-hour pickup window." },
      { step: "03", title: "Direct express run", text: "Non-stop or minimal-stop routing with live tracking." },
      { step: "04", title: "Confirmed delivery", text: "Delivery within the committed window, POD the same day." },
    ],
    fleet: ["Sprinter Van · 8 m³", "Box Truck · 12 m", "Dedicated express courier"],
    faqs: [
      { question: "How fast can express cargo really be?", answer: "Same-day is achievable within ~500 km when booked before midday. Next-day is standard across most of Europe. We confirm exact windows at booking." },
      { question: "Is express available at night and weekends?", answer: "Yes. Our express desk operates 24/7 and night/weekend dispatches are available on most corridors." },
      { question: "What makes express different from standard?", answer: "A dedicated vehicle, direct routing, priority handling, and a control tower that monitors the shipment continuously." },
    ],
  },
  {
    slug: "refrigerated",
    title: "Refrigerated Transport",
    short: "Temperature-controlled logistics with full cold-chain integrity.",
    description:
      "Refrigerated transport for food, pharmaceuticals, and any cargo that demands a controlled environment. Our reefer fleet maintains precise temperature ranges with continuous logging, alarms, and documented cold-chain data from pickup to delivery.",
    icon: "snowflake",
    accent: "cyan",
    features: [
      "Reefer trailers: -25°C to +25°C",
      "Continuous temperature logging",
      "Remote alarm monitoring 24/7",
      "Pre-trip temperature validation",
      "GDP-compliant handling for pharma",
    ],
    benefits: [
      { title: "Cold-chain certainty", text: "Dual-zone capability and continuous logging give you documented proof that temperature was maintained." },
      { title: "Compliance ready", text: "GDP-aligned processes and clean, validated equipment for pharmaceutical and food-grade cargo." },
      { title: "Zero surprises", text: "Remote alarms trigger immediate action if a unit drifts outside its range." },
    ],
    suitableCargo: [
      "Chilled and frozen food",
      "Pharmaceuticals and biologics",
      "Flowers and plants",
      "Temperature-sensitive chemicals",
      "Cosmetics and personal care",
    ],
    process: [
      { step: "01", title: "Specify the range", text: "Define required temperature, tolerance, and any pharma/GDP needs." },
      { step: "02", title: "Pre-trip validation", text: "Unit temperature is verified and logged before loading." },
      { step: "03", title: "Monitored linehaul", text: "Continuous logging with remote alarms through the journey." },
      { step: "04", title: "Verified delivery", text: "Temperature report delivered with your POD." },
    ],
    fleet: ["Reefer Trailer · 26 pallets", "Reefer Truck · 8 pallets", "Insulated Box Truck"],
    faqs: [
      { question: "What temperature ranges can you maintain?", answer: "Our reefer fleet maintains from -25°C (deep frozen) through +25°C, with dual-zone units available for mixed loads." },
      { question: "Do you provide temperature logs?", answer: "Yes. Every refrigerated shipment includes a continuous temperature report delivered with the POD, downloadable from your portal." },
      { question: "Can you transport pharma under GDP?", answer: "Yes. Our refrigerated pharma service follows GDP-aligned procedures with validated equipment and documented handling." },
    ],
  },
  {
    slug: "oversized",
    title: "Oversized Cargo",
    short: "Special transport planning for heavy and oversized loads.",
    description:
      "Project cargo, heavy machinery, and oversized equipment need more than a truck — they need engineering. Our special transport team plans route surveys, escorts, permits, and specialized equipment so your out-of-gauge cargo moves safely and legally.",
    icon: "crane",
    accent: "orange",
    features: [
      "Route surveys and feasibility analysis",
      "Permit and escort coordination",
      "Lowbed and flatbed equipment",
      "Crane and loading engineering",
      "Project cargo coordination",
    ],
    benefits: [
      { title: "Engineered, not improvised", text: "Every oversized move starts with a route survey: bridges, weights, clearances, and permits planned before wheels roll." },
      { title: "Specialized equipment", text: "Lowbeds, extendable trailers, and self-propelled modular transporters matched to your load." },
      { title: "Regulatory compliance", text: "Permits, escorts, and time-of-day restrictions handled by specialists who do this daily." },
    ],
    suitableCargo: [
      "Heavy machinery and plant equipment",
      "Wind and energy components",
      "Construction equipment",
      "Prefabricated structures",
      "Marine and industrial equipment",
    ],
    process: [
      { step: "01", title: "Load assessment", text: "We capture weight, dimensions, and center of gravity." },
      { step: "02", title: "Route survey", text: "Bridge calculations, clearances, and permit planning per country." },
      { step: "03", title: "Special transport", text: "Lowbed or modular transport with escort as required." },
      { step: "04", title: "Site delivery", text: "Unloading coordination with crane or ramp as planned." },
    ],
    fleet: ["Lowbed · up to 60 t", "Extendable Trailer", "Self-Propelled Modular Transporter"],
    faqs: [
      { question: "How far in advance should oversized cargo be booked?", answer: "Ideally 2–4 weeks. Permit lead times vary by country and route, and engineering time is needed for complex loads." },
      { question: "What documentation is required?", answer: "Load dimensions, weight, center of gravity, and any hazardous classification. We handle the route permits and escort arrangements." },
      { question: "Can you handle project cargo across multiple countries?", answer: "Yes. Our special transport desk coordinates multi-country oversized moves with local permit specialists in each jurisdiction." },
    ],
  },
  {
    slug: "warehousing",
    title: "Warehousing",
    short: "Storage, distribution, and cross-docking under one roof.",
    description:
      "Strategic warehousing at key European hubs for storage, order fulfillment, and distribution. Temperature-controlled zones, racking systems, and WMS-driven accuracy keep your inventory moving efficiently toward its next destination.",
    icon: "warehouse",
    accent: "blue",
    features: [
      "WMS-managed inventory accuracy",
      "Ambient and temperature-controlled zones",
      "Cross-docking and transshipment",
      "Order picking and value-added services",
      "Flexible short- and long-term storage",
    ],
    benefits: [
      { title: "Inventory you can trust", text: "WMS-driven putaway, picking, and cycle counts keep stock accuracy above 99.5%." },
      { title: "Faster order cycles", text: "Strategically placed hubs cut delivery times and let you stock closer to your customers." },
      { title: "Scalable space", text: "Flexible storage agreements grow and shrink with your demand — no long-term real estate commitments." },
    ],
    suitableCargo: [
      "Retail and e-commerce stock",
      "Manufacturing components",
      "Seasonal inventory",
      "Temperature-sensitive goods",
      "Consolidation and distribution freight",
    ],
    process: [
      { step: "01", title: "Receive", text: "Inbound goods are checked, scanned, and put away in hours." },
      { step: "02", title: "Store", text: "WMS-managed racking with the right zone for your product." },
      { step: "03", title: "Pick & pack", text: "Orders picked, packed, and labeled to your specification." },
      { step: "04", title: "Dispatch", text: "Outbound freight connects to our transport network for delivery." },
    ],
    fleet: ["Multi-user warehouse network", "Cross-dock facilities", "Dedicated storage zones"],
    faqs: [
      { question: "Do you offer short-term storage?", answer: "Yes. Storage is billed flexibly by pallet position per month, so you can scale up for peak season and scale back after." },
      { question: "Can you handle temperature-controlled storage?", answer: "Yes. We operate chilled and frozen zones alongside ambient storage, with temperature logging." },
      { question: "Do you pick and pack orders?", answer: "Yes. Order picking, kitting, labeling, and light assembly are standard value-added services." },
    ],
  },
  {
    slug: "business-logistics",
    title: "Business Logistics",
    short: "Custom logistics solutions for enterprises and complex supply chains.",
    description:
      "For companies whose supply chain is a competitive advantage, we design managed logistics programs: dedicated fleets, shared distribution, KPI-based reporting, and continuous optimization — run by a team that treats your freight like their own.",
    icon: "network",
    accent: "cyan",
    features: [
      "Dedicated fleet programs",
      "KPI-based performance reporting",
      "Supply chain consulting and design",
      "Multi-modal coordination",
      "Dedicated account team",
    ],
    benefits: [
      { title: "Designed around your flow", text: "We map your actual freight flows and design a network — routes, schedules, equipment — around them." },
      { title: "Transparent performance", text: "Monthly KPI reporting on on-time delivery, damage, cost per shipment, and exceptions." },
      { title: "Continuous improvement", text: "Quarterly optimization reviews identify cost and service improvements as your business changes." },
    ],
    suitableCargo: [
      "High-volume recurring freight",
      "Multi-site distribution networks",
      "Time-sensitive supply chains",
      "Retail and manufacturing flows",
      "Project-based logistics programs",
    ],
    process: [
      { step: "01", title: "Discovery", text: "We map your freight flows, volumes, and service requirements." },
      { step: "02", title: "Design", text: "Network, equipment, and KPI targets are designed and agreed." },
      { step: "03", title: "Operate", text: "Dedicated team runs your program with continuous monitoring." },
      { step: "04", title: "Optimize", text: "Quarterly reviews tune the network as your demand evolves." },
    ],
    fleet: ["Dedicated fleet programs", "Shared distribution network", "Multi-modal partners"],
    faqs: [
      { question: "What is a managed logistics program?", answer: "A long-term agreement where we operate part or all of your transport network — routes, vehicles, reporting, and optimization — to agreed KPIs." },
      { question: "How small can a business logistics program be?", answer: "Most programs start at 10+ shipments per week or dedicated vehicle requirements. Smaller volumes are better served by our standard services." },
      { question: "Do you sign SLAs?", answer: "Yes. Every managed program has a written SLA covering on-time delivery, transit time, reporting cadence, and service levels." },
    ],
  },
];

export function getService(slug: string): ServiceCategory | undefined {
  return services.find((s) => s.slug === slug);
}

export const serviceCategories = Array.from(new Set(services.map((s) => s.accent)));
