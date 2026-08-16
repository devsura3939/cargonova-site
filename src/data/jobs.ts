import type { JobRole } from "@/types";

export const jobs: JobRole[] = [
  {
    slug: "ftl-dispatch-coordinator",
    title: "FTL Dispatch Coordinator",
    department: "Operations",
    location: "Berlin, Germany",
    type: "Full-time",
    summary:
      "Own the daily dispatch of FTL movements across our core corridors — matching vetted capacity to customer commitments and keeping schedules honest.",
    requirements: [
      "2+ years in transport operations or dispatch",
      "Strong planning and exception-handling skills",
      "Comfort with transport management systems",
      "Fluent English; German a plus",
    ],
  },
  {
    slug: "driver-eu-corridors",
    title: "Professional Driver — EU Corridors",
    department: "Drivers",
    location: "Berlin / Home base",
    type: "Full-time · CDL class CE",
    summary:
      "Drive scheduled EU corridors in modern, telematics-equipped trucks. Predictable routes, fixed schedules, and a team that plans your week so you can plan your life.",
    requirements: [
      "Valid CE license and digital tachograph card",
      "Valid CPC qualification",
      "1+ years of long-haul EU experience",
      "Clean driving record",
    ],
  },
  {
    slug: "ltl-network-planner",
    title: "LTL Network Planner",
    department: "Network Design",
    location: "Berlin, Germany",
    type: "Full-time",
    summary:
      "Design and continuously optimize our LTL hub-and-spoke network — consolidation lanes, transit times, and capacity allocation across 14 hubs.",
    requirements: [
      "3+ years in network planning or linehaul",
      "Strong analytical and modeling skills",
      "Experience with optimization tools or SQL",
      "Process-driven mindset",
    ],
  },
  {
    slug: "logistics-account-manager",
    title: "Logistics Account Manager",
    department: "Sales",
    location: "Berlin, Germany",
    type: "Full-time",
    summary:
      "Own the relationship for a portfolio of mid-market logistics clients — from onboarding to quarterly performance reviews and program growth.",
    requirements: [
      "3+ years in logistics or supply chain sales",
      "Demonstrated track record of account growth",
      "Excellent communication and presentation skills",
      "Willingness to travel within Europe",
    ],
  },
  {
    slug: "cold-chain-specialist",
    title: "Cold Chain Quality Specialist",
    department: "Quality",
    location: "Berlin, Germany",
    type: "Full-time",
    summary:
      "Own temperature-controlled quality across our reefer fleet — validation procedures, temperature data review, and GDP-aligned documentation.",
    requirements: [
      "Experience in temperature-controlled logistics",
      "Understanding of GDP and food-safety standards",
      "Meticulous documentation discipline",
      "Analytical and audit-ready mindset",
    ],
  },
];
