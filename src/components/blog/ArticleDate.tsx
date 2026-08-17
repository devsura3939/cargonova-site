"use client";

import { formatDateLang } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

export function ArticleDate({ iso }: { iso: string }) {
  const { lang } = useLang();
  return <>{formatDateLang(iso, lang)}</>;
}
