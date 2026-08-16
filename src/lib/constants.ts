/**
 * Central brand configuration. Replace these values globally when the
 * final company identity is confirmed — nothing else in the app should
 * hardcode company details.
 */
export const brand = {
  name: "CargoNova Logistics",
  shortName: "CargoNova",
  tagline: "Move Smarter. Deliver Better.",
  description:
    "Reliable ground freight, intelligent route planning, and end-to-end logistics solutions built for businesses that cannot afford delays.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cargonova.example.com",
  contact: {
    phone: "+49 30 1234 5678",
    phoneHref: "tel:+493012345678",
    email: "hello@cargonova.example.com",
    emailHref: "mailto:hello@cargonova.example.com",
    salesEmail: "sales@cargonova.example.com",
    supportEmail: "support@cargonova.example.com",
    hours: "Mon – Fri, 08:00 – 20:00 CET · 24/7 for active shipments",
    address: "Kurfürstendamm 21, 10719 Berlin, Germany",
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
  navy: "#0B1F3A",
  navyDeep: "#08111F",
  electric: "#1677FF",
  cyan: "#2ED3E6",
  orange: "#FF8A3D",
  slate: "#7B8794",
} as const;
