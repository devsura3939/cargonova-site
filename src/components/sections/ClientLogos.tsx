"use client";

import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

/**
 * Placeholder client marks — fictional names rendered as styled wordmarks.
 * Swap for real client logos (grayscale) when approved for publication.
 */
const CLIENT_NAMES = [
  "Helvetia Components",
  "Nordic Fresh",
  "Baumgartner Bau",
  "Vela Retail",
  "MediCore",
  "Atlas Commerce",
  "Rheinwerk AG",
  "Aurora Foods",
];

export function ClientLogos() {
  const reduceMotion = useReducedMotion();
  const { t } = useLang();
  const row = [...CLIENT_NAMES, ...CLIENT_NAMES];

  return (
    <section className="border-b border-soft bg-surface py-12">
      <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-muted">
        {t("logos.heading")}
      </p>
      <div className="relative mx-auto mt-8 max-w-6xl overflow-hidden px-5 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div
          className={cn(
            "flex w-max items-center gap-14",
            !reduceMotion && "animate-marquee",
          )}
        >
          {row.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="whitespace-nowrap font-display text-lg font-bold tracking-tight text-navy-300 transition-colors duration-300 hover:text-navy-600 dark:text-navy-500 dark:hover:text-navy-300"
              aria-hidden={i >= CLIENT_NAMES.length}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
