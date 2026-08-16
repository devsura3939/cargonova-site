"use client";

import { PageHero } from "@/components/shared/PageHero";
import { useLang } from "@/lib/i18n";

export function QuotePageHero() {
  const { t } = useLang();

  return (
    <PageHero
      crumb={[{ name: t("nav.getQuote"), path: "/quote" }]}
      eyebrow={t("quote.eyebrow")}
      title={t("quote.title")}
      description={t("quote.sub")}
    />
  );
}
