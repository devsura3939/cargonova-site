import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={cn("h-9 w-9", className)}
    >
      <rect width="40" height="40" rx="11" fill="url(#cn-mark-bg)" />
      {/* Route line */}
      <path
        d="M10 26 L18 26 L24 14 L31 14"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="2 5"
        className="route-line"
      />
      {/* Nodes */}
      <circle cx="10" cy="26" r="3.2" fill="white" />
      <circle cx="31" cy="14" r="3.2" fill="white" />
      <circle cx="24" cy="14" r="2" fill="#2ED3E6" />
      <defs>
        <linearGradient id="cn-mark-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1677FF" />
          <stop offset="1" stopColor="#0B1F3A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Logo({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="CargoNova Logistics — home"
    >
      <LogoMark className="transition-transform duration-300 group-hover:-translate-y-0.5" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-extrabold tracking-tight",
            dark ? "text-white" : "text-navy-900",
          )}
        >
          Cargo<span className="text-electric-500">Nova</span>
        </span>
        <span
          className={cn(
            "mt-1 text-[9px] font-semibold uppercase tracking-[0.32em]",
            dark ? "text-navy-300" : "text-slate",
          )}
        >
          Logistics
        </span>
      </span>
    </Link>
  );
}
