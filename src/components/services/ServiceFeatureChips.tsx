"use client";

import { Check } from "lucide-react";
import type { ServiceCategory } from "@/types";
import { useLang } from "@/lib/i18n";

export function ServiceFeatureChips({ service }: { service: ServiceCategory }) {
  const { lang } = useLang();
  const features = lang === "ka" && service.ka ? service.ka.features : service.features;

  return (
    <div className="flex flex-wrap gap-1.5">
      {features.slice(0, 4).map((f) => (
        <span
          key={f}
          className="inline-flex items-center gap-2 border border-white/12 bg-white/[0.04] px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-fog-200 backdrop-blur"
        >
          <Check className="h-3 w-3 text-signal-400" />
          {f}
        </span>
      ))}
    </div>
  );
}
