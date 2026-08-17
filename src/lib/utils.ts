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

const GEORGIAN_MONTHS = [
  "იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი",
  "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი",
];

const GEORGIAN_MONTHS_SHORT = [
  "იან", "თებ", "მარ", "აპრ", "მაი", "ივნ", "ივლ", "აგვ", "სექ", "ოქტ", "ნოე", "დეკ",
];

/**
 * Long date in the active language, e.g. "August 4, 2026" / "4 აგვისტო, 2026".
 * (Intl ka-GE falls back to English months in some browsers, so Georgian is
 * formatted manually.)
 */
export function formatDateLang(date: Date | string, lang: string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (lang === "ka") {
    return `${d.getDate()} ${GEORGIAN_MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
  }
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(d);
}

/**
 * ETA string from an epoch-ms value in the active language, e.g.
 * "Today 14:32" / "Aug 18" vs "დღეს 14:32" / "აგვ 18".
 */
export function formatEtaLang(etaMs: number, lang: string): string {
  const d = new Date(etaMs);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const today = new Date();
  if (d.toDateString() === today.toDateString()) {
    return lang === "ka" ? `დღეს ${hh}:${mm}` : `Today ${hh}:${mm}`;
  }
  const tomorrow = new Date(today.getTime() + 86400000);
  if (d.toDateString() === tomorrow.toDateString()) {
    return lang === "ka" ? `ხვალ ${hh}:${mm}` : `Tomorrow ${hh}:${mm}`;
  }
  if (lang === "ka") {
    return `${GEORGIAN_MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
  }
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(d);
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
