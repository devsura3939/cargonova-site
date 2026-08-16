import type { FaqItem } from "@/types";

export const faqCategories = [
  "General",
  "Shipment",
  "Pricing",
  "Tracking",
  "Insurance",
  "Cargo Requirements",
  "International Transport",
] as const;

export const faqs: FaqItem[] = [
  {
    category: "General",
    question: "What does CargoNova Logistics do?",
    answer:
      "We provide ground freight, FTL and LTL transport, express cargo, refrigerated logistics, oversized transport, warehousing, and managed logistics programs for B2B customers across Europe and international corridors.",
  },
  {
    category: "General",
    question: "Which regions do you cover?",
    answer:
      "Our core network covers Central and Western Europe with daily scheduled lanes, extended to Southern, Eastern, and Nordic Europe through partner corridors. International services connect EU hubs with the Caucasus, Middle East, and Central Asia.",
  },
  {
    category: "General",
    question: "How do I get a quote?",
    answer:
      "Use the quote form with your route and cargo details. Most requests receive a confirmed price within 4 business hours, and express requests within 60 minutes.",
  },
  {
    category: "Shipment",
    question: "How far in advance should I book transport?",
    answer:
      "Standard ground freight and LTL can be booked 24–48 hours ahead. FTL benefits from 2–3 days lead time, oversized cargo from 2–4 weeks, and express is available on request with availability confirmed within 30 minutes.",
  },
  {
    category: "Shipment",
    question: "What is the difference between FTL and LTL?",
    answer:
      "FTL (Full Truckload) gives you a dedicated vehicle for your cargo alone — faster and with no transfers. LTL (Less-than-Truckload) shares capacity with other freight, so you pay only for the space you use on smaller loads.",
  },
  {
    category: "Shipment",
    question: "Can you pick up and deliver at specific times?",
    answer:
      "Yes. Time windows are confirmed at booking, and most routes support early, standard, and evening windows. Express service offers two-hour pickup windows.",
  },
  {
    category: "Pricing",
    question: "How is freight pricing calculated?",
    answer:
      "Pricing depends on route, cargo type, weight or volume, pallet count, required equipment, and urgency. FTL is quoted per vehicle, LTL per pallet or m³, and special transport is quoted per project after assessment.",
  },
  {
    category: "Pricing",
    question: "Are there fuel surcharges?",
    answer:
      "Quotes are valid for 7 days and include current fuel levels. Long-term programs are priced with a transparent fuel index mechanism so neither side carries fuel risk alone.",
  },
  {
    category: "Tracking",
    question: "How do I track my shipment?",
    answer:
      "Enter your tracking number (format CRG-000000) on the tracking page. You'll see current status, checkpoint history, ETA, and progress — no login required for single shipments.",
  },
  {
    category: "Tracking",
    question: "Why is my tracking status not updating?",
    answer:
      "Most checkpoints update on scan or GPS events. If nothing changes for more than 12 hours during transit, contact our support team — they can see telemetry beyond the public feed.",
  },
  {
    category: "Insurance",
    question: "Is my cargo insured during transport?",
    answer:
      "Every shipment includes base carrier liability. We also arrange full-value cargo insurance on request, quoted per shipment at booking.",
  },
  {
    category: "Insurance",
    question: "What should I do if cargo is damaged?",
    answer:
      "Note the damage on the delivery receipt, photograph the cargo, and file a claim within 7 days through your account manager or support. Claims are typically resolved within 15 business days.",
  },
  {
    category: "Cargo Requirements",
    question: "What cargo can you not transport?",
    answer:
      "We do not carry hazardous materials outside our certified hazmat lanes, and we never carry illegal goods. Weapons, valuables, and live animals are handled under special arrangements only.",
  },
  {
    category: "Cargo Requirements",
    question: "How should pallets be prepared?",
    answer:
      "Pallets should be stable, stackable per your load plan, and stretch-wrapped or shrink-wrapped. Weight should not exceed the pallet's rated capacity. We can advise on special securing for unusual loads.",
  },
  {
    category: "International Transport",
    question: "Do you handle customs documentation?",
    answer:
      "Yes. For international routes we prepare transport documents, coordinate with customs brokers at borders, and pre-clear where the corridor allows.",
  },
  {
    category: "International Transport",
    question: "What is your coverage beyond Europe?",
    answer:
      "We operate international corridors to the Caucasus, Middle East, and Central Asia, and partner with vetted operators for intercontinental freight. Route-specific capabilities are confirmed at quote stage.",
  },
];

export function searchFaqs(query: string): FaqItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return faqs;
  return faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q),
  );
}
