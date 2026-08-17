"use client";

import { Check } from "lucide-react";
import type { ServiceCategory } from "@/types";
import { useLang } from "@/lib/i18n";

export function ServiceFeatureChips({ service }: { service: ServiceCategory }) {
  const { lang } = useLang();
  const features = lang === "ka" && service.ka ? service.ka.features : service.features;

  return (
    <div className="flex flex-wrap gap-3">
      {features.slice(0, 4).map((f) => (
        <span
          key={f}
          className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-1.5 text-xs font-semibold text-navy-100 backdrop-blur"
        >
          <Check className="h-3.5 w-3.5 text-cyan-400" />
          {f}
        </span>
      ))}
    </div>
  );
}
