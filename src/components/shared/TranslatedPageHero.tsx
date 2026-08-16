"use client";

import { PageHero } from "@/components/shared/PageHero";
import { useLang, type DictKey } from "@/lib/i18n";

/**
 * Language-aware page hero for server pages: pass dictionary keys and the
 * component resolves them against the active language, so inner pages render
 * in Georgian without converting the whole page to a client component.
 */
export function TranslatedPageHero({
  eyebrowKey,
  titleKey,
  descKey,
  crumbKey,
  crumbPath,
  compact = false,
  children,
}: {
  eyebrowKey?: DictKey;
  titleKey: DictKey;
  descKey?: DictKey;
  crumbKey: DictKey;
  crumbPath: string;
  compact?: boolean;
  children?: React.ReactNode;
}) {
  const { t } = useLang();
  return (
    <PageHero
      crumb={[{ name: t(crumbKey), path: crumbPath }]}
      eyebrow={eyebrowKey ? t(eyebrowKey) : undefined}
      title={t(titleKey)}
      description={descKey ? t(descKey) : undefined}
      compact={compact}
    >
      {children}
    </PageHero>
  );
}
