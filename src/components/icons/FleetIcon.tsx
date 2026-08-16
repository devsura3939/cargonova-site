import { cn } from "@/lib/utils";

const PATHS: Record<string, React.ReactNode> = {
  van: (
    <>
      <path d="M3 17v-5a3 3 0 0 1 3-3h8l5 5h2a2 2 0 0 1 2 2v1" />
      <path d="M3 17h-1a1 1 0 0 1-1-1v-3h2" />
      <path d="M14 9v8" />
      <circle cx="8" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M8 15h9" />
    </>
  ),
  "box-truck": (
    <>
      <rect x="3" y="6" width="12" height="9" rx="1.5" />
      <path d="M15 9h4.5L22 12v3h-7" />
      <circle cx="8" cy="17" r="2" />
      <circle cx="17.5" cy="17" r="2" />
      <path d="M6 6v-1.5h8V6" />
    </>
  ),
  semi: (
    <>
      <rect x="2" y="7" width="11" height="8" rx="1.5" />
      <path d="M13 9h6l3 3.5V15h-9" />
      <circle cx="7.5" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M13 7v9.5" />
    </>
  ),
  reefer: (
    <>
      <rect x="2" y="6" width="13" height="10" rx="1.5" />
      <path d="M15 9h4.5L22 12v4h-7" />
      <path d="M5 9h4" />
      <circle cx="8" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  flatbed: (
    <>
      <rect x="2" y="10" width="15" height="1.6" rx="0.8" />
      <path d="M17 11h4l-1.5 4h-4.5" />
      <path d="M5 7.5v2.5M9 7.5v2.5M13 7.5v2.5" />
      <circle cx="6.5" cy="15.5" r="2" />
      <circle cx="16.5" cy="15.5" r="2" />
    </>
  ),
  lowbed: (
    <>
      <path d="M3 13.5V11a1 1 0 0 1 1-1h10l3-2.5h2v6.5" />
      <path d="M3 13.5h15" />
      <path d="M19 11.5h2.5L22 13.5" />
      <path d="M7 10v3.5M11 10v3.5" />
      <circle cx="6" cy="15.5" r="2" />
      <circle cx="16.5" cy="15.5" r="2" />
    </>
  ),
};

export function FleetIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("h-6 w-6", className)}
    >
      {PATHS[name] ?? PATHS["semi"]}
    </svg>
  );
}
