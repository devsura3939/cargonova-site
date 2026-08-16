import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumb({
  items,
  dark = false,
}: {
  items: { name: string; path: string }[];
  dark?: boolean;
}) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm">
      <Link
        href="/"
        className={cn(
          "transition-colors",
          dark ? "text-navy-300 hover:text-white" : "text-muted hover:text-strong",
        )}
      >
        Home
      </Link>
      {items.map((item, i) => (
        <span key={item.path} className="flex items-center gap-1.5">
          <ChevronRight
            className={cn("h-3.5 w-3.5", dark ? "text-navy-500" : "text-navy-200")}
          />
          {i === items.length - 1 ? (
            <span className={cn("font-semibold", dark ? "text-white" : "text-strong")}>
              {item.name}
            </span>
          ) : (
            <Link
              href={item.path}
              className={cn(
                "transition-colors",
                dark ? "text-navy-300 hover:text-white" : "text-muted hover:text-strong",
              )}
            >
              {item.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
