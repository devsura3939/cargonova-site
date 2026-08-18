import { z } from "zod";
import { isValidTrackingCode } from "@/lib/tracking";

export const emailSchema = z.string().trim().email("Enter a valid email address.");

export const phoneSchema = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number.")
  .max(24, "Enter a valid phone number.");

/** Shipment IDs: BRB Enterprise (CRG-582941), UPS (1Z…), DHL (JD…), FedEx/USPS digits, or generic letter+digit codes. */
export const trackingSchema = z
  .string()
  .trim()
  .toUpperCase()
  .refine((v) => isValidTrackingCode(v), "Enter a valid tracking number, e.g. CRG-582941 or 1Z999AA10123456784");

export const quoteSchema = z.object({
  pickupCountry: z.string().trim().min(2, "Pickup country is required."),
  pickupCity: z.string().trim().min(2, "Pickup city is required."),
  destinationCountry: z.string().trim().min(2, "Delivery country is required."),
  destinationCity: z.string().trim().min(2, "Delivery city is required."),
  cargoType: z.string().trim().min(1, "Select a cargo type."),
  cargoDescription: z.string().trim().max(1000).optional().or(z.literal("")),
  weight: z.coerce.number().positive("Enter a weight greater than 0.").max(100000).optional(),
  volume: z.coerce.number().positive().max(10000).optional(),
  pallets: z.coerce.number().int().min(1).max(100).optional(),
  length: z.coerce.number().positive().max(100).optional(),
  width: z.coerce.number().positive().max(100).optional(),
  height: z.coerce.number().positive().max(100).optional(),
  transportDate: z.string().optional(),
  urgency: z.enum(["standard", "priority", "express"]).default("standard"),
  refrigerationRequired: z.boolean().default(false),
  specialRequirements: z.string().trim().max(1500).optional().or(z.literal("")),
  name: z.string().trim().min(2, "Enter your full name.").max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  phone: phoneSchema,
  email: emailSchema,
});

export type QuoteInput = z.infer<typeof quoteSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(120),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal("")),
  department: z.enum(["sales", "support", "general"]).default("general"),
  subject: z.string().trim().min(3, "Add a short subject.").max(160),
  message: z.string().trim().min(10, "Message must be at least 10 characters.").max(4000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const careerSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(120),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal("")),
  role: z.string().trim().min(1, "Select the role you are applying for."),
  message: z.string().trim().max(3000).optional().or(z.literal("")),
});

export type CareerInput = z.infer<typeof careerSchema>;

export const newsletterSchema = z.object({
  email: emailSchema,
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
