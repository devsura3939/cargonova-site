"use client";

import { PageHero } from "@/components/shared/PageHero";
import { useLang } from "@/lib/i18n";

export function ContactPageHero() {
  const { t } = useLang();

  return (
    <PageHero
      crumb={[{ name: t("nav.contact"), path: "/contact" }]}
      eyebrow={t("pg.contact.eyebrow")}
      title={t("contact.title")}
      description={t("contact.sub")}
    />
  );
}
