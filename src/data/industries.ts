import type { Industry } from "@/types";

export const industries: Industry[] = [
  {
    slug: "manufacturing",
    name: "Manufacturing",
    icon: "factory",
    problem: "Production lines depend on components arriving in the right sequence, at the right time — a single late delivery stops a line.",
    challenge: "Synchronizing inbound components and outbound finished goods across multiple plants.",
    solution:
      "Scheduled daily and weekly lanes between your plants and suppliers, with slot-based delivery windows and live visibility so planners always know where inventory is.",
    services: ["ground-freight", "full-truckload", "business-logistics"],
    benefit: "Reduced line-stoppage risk and predictable inbound flow.",
  },
  {
    slug: "retail",
    name: "Retail",
    icon: "shopping-bag",
    problem: "Seasonal peaks, store replenishment, and omnichannel demand make inventory timing everything.",
    challenge: "Matching inbound freight to promotion calendars and store opening hours.",
    solution:
      "Distribution programs with staging in our warehousing network, then just-in-time delivery to stores and e-commerce fulfillment hubs.",
    services: ["ltl", "warehousing", "ground-freight"],
    benefit: "Stores stocked when they need to be, without overflow inventory.",
  },
  {
    slug: "construction",
    name: "Construction",
    icon: "hard-hat",
    problem: "Site deadlines are contractual — materials arriving late cascade into penalties.",
    challenge: "Moving heavy, irregular loads to sites with limited access and tight windows.",
    solution:
      "FTL and oversized transport with route surveys for every site, plus crane-coordinated unloading for structural and heavy components.",
    services: ["oversized", "full-truckload", "ground-freight"],
    benefit: "Materials on site when the crane and crew are ready.",
  },
  {
    slug: "automotive",
    name: "Automotive",
    icon: "car",
    problem: "Automotive supply chains run on exact sequences and zero tolerance for damage.",
    challenge: "Just-in-sequence delivery of parts with damage-free handling.",
    solution:
      "Dedicated FTL programs with sequence loading, protective securing, and telematics-monitored vehicles for parts and finished vehicles.",
    services: ["full-truckload", "business-logistics", "ground-freight"],
    benefit: "JIS/JIT reliability with documented handling quality.",
  },
  {
    slug: "food-beverage",
    name: "Food & Beverage",
    icon: "utensils",
    problem: "Cold chains cannot be broken — temperature excursions mean rejected product and lost value.",
    challenge: "Maintaining documented temperature integrity across borders and handoffs.",
    solution:
      "Refrigerated transport with continuous logging, pre-trip validation, and dual-zone units for mixed chilled and ambient loads.",
    services: ["refrigerated", "warehousing", "full-truckload"],
    benefit: "Documented cold-chain integrity, from plant to shelf.",
  },
  {
    slug: "ecommerce",
    name: "E-commerce",
    icon: "package",
    problem: "Customers expect fast, tracked delivery — and returns handled without friction.",
    challenge: "Scaling fulfillment and last-mile delivery with the season.",
    solution:
      "Warehouse-integrated fulfillment with pick-and-pack, plus express and LTL lanes into e-commerce carrier networks.",
    services: ["express", "warehousing", "ltl"],
    benefit: "Faster order cycles and a returns process customers don't dread.",
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    icon: "heart-pulse",
    problem: "Pharmaceuticals and medical equipment are time- and temperature-critical, with strict compliance.",
    challenge: "GDP-aligned transport with validation for sensitive products.",
    solution:
      "Temperature-controlled express and FTL with logging, alarm monitoring, and documented handling for pharma and medical devices.",
    services: ["express", "refrigerated", "business-logistics"],
    benefit: "Compliance-ready cold chain for regulated products.",
  },
  {
    slug: "industrial-equipment",
    name: "Industrial Equipment",
    icon: "cog",
    problem: "Heavy machinery is slow to load, hard to move, and expensive to damage.",
    challenge: "Permits, route engineering, and specialized equipment for out-of-gauge loads.",
    solution:
      "Oversized cargo planning with route surveys, lowbed transport, and escort coordination for machinery moves across Europe.",
    services: ["oversized", "ground-freight", "full-truckload"],
    benefit: "Heavy equipment moved safely, legally, and on schedule.",
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
