"use client";

import { useLang } from "@/lib/i18n";

/**
 * Trust strip — no fake client names.
 * Shows the brand positioning statement per spec.
 * Replace with real client logos once approved for publication.
 */
export function ClientLogos() {
  const { t } = useLang();

  return (
    <section className="border-b border-soft bg-surface py-10 dark:border-white/10 dark:bg-ink-950">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <p className="font-display text-lg font-semibold tracking-tight text-strong dark:text-fog-50 sm:text-xl">
          {t("logos.heading")}
        </p>
        <p className="mt-3 text-[14px] leading-relaxed text-muted dark:text-fog-500">
          Manufacturers, wholesale and retail companies, business owners and decision-makers rely on BRB for integrated logistics across road, rail, air and ocean.
        </p>
      </div>
    </section>
  );
}
