import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a large number with locale separators, e.g. 10500 -> "10,500". */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

/** Format a date like "August 18". */
export function formatDateShort(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(
    typeof date === "string" ? new Date(date) : date,
  );
}

/** Generate a placeholder shipment id, e.g. CRG-582941. */
export function makeShipmentId(): string {
  return `CRG-${Math.floor(100000 + Math.random() * 900000)}`;
}

/** Sleep helper for simulating async latency in mocked services. */
export function delay(ms = 450): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Human readable status label for a shipment status key. */
export function shipmentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pending",
    picked_up: "Picked Up",
    in_transit: "In Transit",
    customs: "Customs Clearance",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
  };
  return labels[status] ?? status;
}
