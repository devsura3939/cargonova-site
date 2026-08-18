/**
 * Central brand configuration — BRB Enterprise
 * "Bridging Routes, Building Reach"
 */
export const brand = {
  name: "BRB Enterprise",
  shortName: "BRB",
  tagline: "Bridging Routes, Building Reach",
  description:
    "Full-scale logistics company engineering optimal connection routes between businesses and geographies through integrated transportation, supply chain management, and analytical services.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://brb-enterprise.example.com",
  contact: {
    phone: "+995 32 2 00 00 00",
    phoneHref: "tel:+995322000000",
    email: "hello@brb-enterprise.com",
    emailHref: "mailto:hello@brb-enterprise.com",
    salesEmail: "sales@brb-enterprise.com",
    supportEmail: "support@brb-enterprise.com",
    hours: "Mon – Fri, 08:00 – 18:00 GET · 24/7 for active shipments",
    address: "Tbilisi, Georgia",
  },
  social: {
    linkedin: "https://linkedin.com",
    x: "https://x.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
  },
} as const;

/** Colors used for inline brand graphics (maps, charts, gradients). */
export const brandColors = {
  navy: "#1B1F2A",
  navyDeep: "#004E89",
  electric: "#1E81B0",
  cyan: "#4B0082",
  orange: "#F5A623",
  slate: "#C0C5CE",
} as const;
