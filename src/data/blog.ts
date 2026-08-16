import type { BlogPost } from "@/types";
import { images } from "@/data/images";

export const blogCategories = [
  "Freight",
  "Supply Chain",
  "Transportation",
  "Warehousing",
  "Business Logistics",
  "Industry News",
  "Guides",
];

export const posts: BlogPost[] = [
  {
    slug: "europe-ground-freight-2026",
    title: "The State of European Ground Freight in 2026",
    excerpt:
      "Capacity, corridor reliability, and digital visibility are reshaping how shippers buy road freight. Here's what procurement teams should watch this year.",
    category: "Freight",
    publishedAt: "2026-08-04",
    readTime: "8 min",
    author: "CargoNova Insights",
    image: images.containersAerial,
    featured: true,
    body: [
      "European road freight is entering a new phase. After years of volatile capacity, shippers are moving away from transactional spot buying toward committed programs with measurable service levels. The reason is simple: predictability has become the product.",
      "On-time performance is now a contractual metric on most major corridors. Shippers who track it know that 95% on-time is table stakes, and the difference between a good and a great logistics partner shows up in the last 5% — in how exceptions are handled when they happen.",
      "Digital visibility has moved from a differentiator to a baseline expectation. Live GPS, scan-level checkpoint data, and proactive alerts are now standard on lanes where a single delayed shipment can stop a production line.",
      "What separates the operators winning long-term contracts is not more trucks — it is network design. Corridor density, hub placement, and equipment flexibility determine whether a provider can absorb demand spikes without compromising the schedules they committed to.",
      "For procurement teams, the practical question is no longer 'who is cheapest per kilometer?' It is 'who can hold a schedule across my actual freight flows, and prove it?' The operators who answer that question with data are the ones winning the business.",
    ],
  },
  {
    slug: "ftl-vs-ltl-choosing",
    title: "FTL vs. LTL: How to Choose the Right Service for Your Load",
    excerpt:
      "Full Truckload or Less-than-Truckload? A practical decision framework based on volume, speed, and cost per pallet.",
    category: "Guides",
    publishedAt: "2026-07-22",
    readTime: "6 min",
    author: "CargoNova Insights",
    image: images.semiHighway,
    body: [
      "The FTL vs. LTL decision comes down to three variables: volume, urgency, and the value of direct handling.",
      "Full Truckload buys you a dedicated vehicle. That means no transfers, no co-loading, and a direct route. It is the right choice when your cargo fills most of a trailer, when transit time is critical, or when your freight is fragile enough that every handoff is a risk event.",
      "Less-than-Truckload buys you capacity sharing. You pay for the floor space you occupy, and your pallets move through a consolidation network. It is the right choice for 1–15 pallets where cost per pallet matters more than absolute speed.",
      "A useful rule of thumb: if your load occupies more than 13 Euro pallets (roughly half a trailer), FTL economics usually win. Below that, LTL rates per pallet are typically more competitive — but check the transit time, because consolidation adds a day on most corridors.",
      "The honest answer for many shippers is that both services belong in their lane strategy. Committed volumes justify an FTL program; overflow and irregular demand belong on LTL. Building both into your routing guide is how mature shippers keep costs and service in balance.",
    ],
  },
  {
    slug: "cold-chain-audit",
    title: "What a Cold-Chain Audit Actually Checks",
    excerpt:
      "Temperature logs, unit validation, alarm response — the specifics behind a compliant refrigerated transport operation.",
    category: "Supply Chain",
    publishedAt: "2026-07-10",
    readTime: "7 min",
    author: "CargoNova Insights",
    image: images.warehouseShelf,
    body: [
      "A cold-chain audit is a documentation exercise with physical consequences. Auditors are not checking whether your cargo was cold — they are checking whether you can prove it was, continuously, and what you did when it was not.",
      "The first thing auditors look at is unit validation. A reefer unit that cannot demonstrate a pre-trip temperature check against an independent reference starts the audit at a disadvantage.",
      "The second is logging continuity. Gaps in temperature records — even gaps that coincide with loading or rest stops — are treated as excursions until proven otherwise. Continuous logging, from pre-cooling through unloading, is the standard.",
      "The third is alarm response. The question is not whether an alarm fired, but what happened in the minutes after. Documented escalation, root-cause notes, and corrective action turn a monitoring system into a compliance system.",
      "Operationally, this is why we validate units before loading, log through the entire journey, and attach the full temperature report to every delivery. Compliance is not a separate activity — it is the process working as designed.",
    ],
  },
  {
    slug: "oversized-cargo-planning",
    title: "Planning an Oversized Cargo Move: A Field Guide",
    excerpt:
      "From route surveys to permits and escorts — what actually happens before a heavy load leaves the yard.",
    category: "Transportation",
    publishedAt: "2026-06-28",
    readTime: "9 min",
    author: "CargoNova Insights",
    image: images.portCranes,
    body: [
      "An oversized move fails or succeeds in the planning phase. The truck is the simple part; the route is where the work is.",
      "Every move starts with a load assessment: exact dimensions, weight, center of gravity, and load path. From there, our engineers survey candidate routes — bridge classifications, overhead clearances, road widths, turning radii, and local restrictions.",
      "Permits come next. Every country on the route has its own rules for out-of-gauge loads: weight thresholds, escort requirements, time-of-day restrictions, and documentation. A single permit gap can stop a convoy at a border.",
      "Then the equipment: lowbeds for height, extendable trailers for length, modular transporters for weight. Loading engineering — where the load sits, how it is lashed, how it is lifted — is planned before the equipment arrives.",
      "The lesson from hundreds of moves is that the load never changes the plan; the plan changes around the load. Start early, measure twice, and treat the route survey as the most important document in the file.",
    ],
  },
  {
    slug: "warehouse-staging-peak",
    title: "Why Peak Season Starts in the Warehouse",
    excerpt:
      "Staging, cross-docking, and flexible storage — how distribution planning absorbs the Q4 demand spike before it reaches the road.",
    category: "Warehousing",
    publishedAt: "2026-06-14",
    readTime: "5 min",
    author: "CargoNova Insights",
    image: images.warehouseForklift,
    body: [
      "Peak season pressure is not a transport problem; it is a timing problem. The freight that arrives late in Q4 usually failed to be staged early in Q4.",
      "Staging inventory closer to demand is the highest-leverage move a retail supply chain can make. Pre-positioning seasonal stock in regional warehouses cuts last-mile distance, shortens delivery windows, and turns the transport network's job from 'rush' into 'schedule'.",
      "Cross-docking compounds the effect. Inbound goods transfer directly to outbound vehicles without storage, which means product moves through the network in hours, not days, and warehouse capacity is freed for the inventory that genuinely needs it.",
      "Flexible storage agreements complete the picture. Committing to fixed warehouse space for a seasonal peak is expensive; scaling pallet positions up in October and down in January is not.",
      "The operators who handle peak best are the ones who start planning it in summer — network capacity, warehouse space, and driver schedules decided before the demand curve spikes.",
    ],
  },
  {
    slug: "logistics-kpis-that-matter",
    title: "Logistics KPIs That Actually Matter (and the Ones That Don't)",
    excerpt:
      "On-time delivery, cost per shipment, exception rate — how to build a KPI set that tells the truth about your logistics program.",
    category: "Business Logistics",
    publishedAt: "2026-05-30",
    readTime: "7 min",
    author: "CargoNova Insights",
    image: images.opsTablet,
    body: [
      "Most logistics dashboards are full of numbers that nobody acts on. A useful KPI set is small, measurable, and tied to a decision someone can make this week.",
      "On-time delivery is the anchor. Define it precisely — door-to-door or dock-to-dock? Within the agreed window, or by the promised day? The definition determines whether the number means anything.",
      "Cost per shipment matters, but only against a stable route mix. If your network changes month to month, raw cost trends are noise. Normalize by route, by equipment, and by weight band before you compare.",
      "Exception rate — the share of shipments that needed intervention — is the number that predicts service problems before they happen. A rising exception rate is the earliest signal of capacity strain or route degradation.",
      "Damage rate and claims per thousand shipments round out the set. Everything else — utilization, dwell time, empty miles — is operational detail that belongs in the ops review, not the executive dashboard.",
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
