import { describe, expect, it } from "vitest";
import { quoteSchema, contactSchema, careerSchema, newsletterSchema } from "@/lib/validations";

describe("quoteSchema", () => {
  const base = {
    pickupCountry: "Germany",
    pickupCity: "Berlin",
    destinationCountry: "Georgia",
    destinationCity: "Tbilisi",
    cargoType: "Palletized goods",
    weight: 4500,
    name: "Anna Meyer",
    phone: "+493012345678",
    email: "anna@company.com",
  };

  it("accepts a complete valid request", () => {
    const result = quoteSchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  it("rejects missing required route fields", () => {
    const result = quoteSchema.safeParse({ ...base, pickupCity: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = quoteSchema.safeParse({ ...base, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects negative weight", () => {
    const result = quoteSchema.safeParse({ ...base, weight: -10 });
    expect(result.success).toBe(false);
  });

  it("accepts optional fields left empty", () => {
    const result = quoteSchema.safeParse({
      ...base,
      company: "",
      cargoDescription: "",
      pallets: undefined,
      specialRequirements: "",
    });
    expect(result.success).toBe(true);
  });

  it("defaults urgency and refrigeration", () => {
    const result = quoteSchema.safeParse(base);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.urgency).toBe("standard");
      expect(result.data.refrigerationRequired).toBe(false);
    }
  });
});

describe("contactSchema", () => {
  const base = {
    name: "Anna Meyer",
    email: "anna@company.com",
    subject: "FTL quote request",
    message: "We need a quote for a full truckload from Berlin to Warsaw.",
  };

  it("accepts a valid message", () => {
    expect(contactSchema.safeParse(base).success).toBe(true);
  });

  it("rejects too-short messages", () => {
    const result = contactSchema.safeParse({ ...base, message: "Hi" });
    expect(result.success).toBe(false);
  });
});

describe("careerSchema", () => {
  it("requires name, email, and role", () => {
    const valid = careerSchema.safeParse({
      name: "Tomasz Nowak",
      email: "tomasz@email.com",
      role: "driver-eu-corridors",
    });
    expect(valid.success).toBe(true);

    const missingRole = careerSchema.safeParse({
      name: "Tomasz Nowak",
      email: "tomasz@email.com",
    });
    expect(missingRole.success).toBe(false);
  });
});

describe("newsletterSchema", () => {
  it("validates email", () => {
    expect(newsletterSchema.safeParse({ email: "ok@example.com" }).success).toBe(true);
    expect(newsletterSchema.safeParse({ email: "nope" }).success).toBe(false);
  });
});
