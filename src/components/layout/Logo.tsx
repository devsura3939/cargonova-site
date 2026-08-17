import Link from "next/link";
import { cn } from "@/lib/utils";

/** Nordvia-style brand mark — square outline, route chevron, signal accent. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("h-6 w-6", className)}
    >
      <rect
        x="0.75"
        y="0.75"
        width="22.5"
        height="22.5"
        stroke="currentColor"
        strokeOpacity="0.28"
      />
      <path d="M5 17.5 12 6l7 11.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.5 17.5 12 11.6l3.5 5.9" stroke="#FF5F1F" strokeWidth="1.6" />
    </svg>
  );
}

/**
 * Brand lockup. The wordmark follows `currentColor`, so callers control the
 * tone via className — e.g. `text-fog-50` over dark imagery or
 * `text-strong dark:text-fog-50` on theme-aware surfaces.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="CargoNova Logistics — home"
    >
      <LogoMark className="text-current" />
      <span className="flex flex-col leading-none text-current">
        <span className="text-[15px] font-semibold tracking-[0.16em]">
          CARGO<span className="text-signal">NOVA</span>
        </span>
        <span className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.22em] opacity-55">
          Logistics
        </span>
      </span>
    </Link>
  );
}
