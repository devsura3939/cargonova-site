import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * BRB Enterprise brand mark — bridge-inspired design
 * "Bridging Routes, Building Reach"
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 24"
      fill="none"
      aria-hidden="true"
      className={cn("h-6 w-8", className)}
    >
      {/* Bridge arch */}
      <path
        d="M2 18 Q16 2 30 18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Bridge supports */}
      <path d="M6 18 V12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M26 18 V12" stroke="currentColor" strokeWidth="1.5" />
      {/* Route line — gold accent */}
      <path
        d="M2 18 Q16 8 30 18"
        stroke="#F5A623"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="3 4"
        fill="none"
      />
    </svg>
  );
}

/**
 * Brand lockup — BRB Enterprise
 * "Bridging Routes, Building Reach"
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="BRB Enterprise — home"
    >
      <LogoMark className="text-current" />
      <span className="flex flex-col leading-none text-current">
        <span className="text-[15px] font-bold tracking-[0.12em]">
          BRB
        </span>
        <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] opacity-55">
          Enterprise
        </span>
      </span>
    </Link>
  );
}
