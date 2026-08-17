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

export function Logo({
  dark = false,
  className,
}: {
  dark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="CargoNova Logistics — home"
    >
      <LogoMark className="text-current" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[15px] font-semibold tracking-[0.16em]",
            dark ? "text-fog-50" : "text-strong",
          )}
        >
          CARGO<span className="text-signal">NOVA</span>
        </span>
        <span
          className={cn(
            "mt-1 font-mono text-[8.5px] uppercase tracking-[0.22em]",
            dark ? "text-fog-600" : "text-muted",
          )}
        >
          Logistics
        </span>
      </span>
    </Link>
  );
}
