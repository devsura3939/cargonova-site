export type { Shipment, ShipmentStatus, TrackingCheckpoint } from "@/lib/tracking";

export type ServiceCategory = {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: string;
  accent: "blue" | "cyan" | "orange";
  features: string[];
  benefits: { title: string; text: string }[];
  suitableCargo: string[];
  process: { step: string; title: string; text: string }[];
  fleet: string[];
  faqs: { question: string; answer: string }[];
};

export type Industry = {
  slug: string;
  name: string;
  icon: string;
  challenge: string;
  problem: string;
  solution: string;
  services: string[];
  benefit: string;
};

export type FleetVehicle = {
  slug: string;
  name: string;
  category: "express" | "standard" | "refrigerated" | "heavy";
  icon: string;
  payload: string;
  volume: string;
  dimensions: string;
  ideal: string;
  features: string[];
  available: boolean;
};

export type Testimonial = {
  company: string;
  person: string;
  role: string;
  quote: string;
  metric?: string;
  metricLabel?: string;
};

export type FaqItem = {
  category: string;
  question: string;
  answer: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  author: string;
  featured?: boolean;
  body: string[];
};

export type JobRole = {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  summary: string;
  requirements: string[];
};
