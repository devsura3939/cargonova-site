"use client";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { useLang, type DictKey } from "@/lib/i18n";

/** Language-aware SectionHeading for server pages (eyebrow/title from keys). */
export function SectionHeadingT({
  eyebrowKey,
  titleKey,
  descKey,
  ...rest
}: {
  eyebrowKey?: DictKey;
  titleKey: DictKey;
  descKey?: DictKey;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
  as?: "h1" | "h2" | "h3";
  index?: string;
}) {
  const { t } = useLang();
  return (
    <SectionHeading
      eyebrow={eyebrowKey ? t(eyebrowKey) : undefined}
      title={t(titleKey)}
      description={descKey ? t(descKey) : undefined}
      {...rest}
    />
  );
}
