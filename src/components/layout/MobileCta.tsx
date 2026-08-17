"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n";

const HIDDEN_ON = ["/quote", "/tracking", "/contact", "/tracking/"];

export function MobileCta() {
  const pathname = usePathname();
  const { t } = useLang();
  if (HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(p))) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-950/95 p-3 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-md gap-2">
        <Link
          href="/tracking"
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-[3px] border border-white/15 text-sm font-medium text-fog-200 transition-colors active:bg-white/5"
        >
          <Search className="h-4 w-4" />
          {t("mcta.track")}
        </Link>
        <Link
          href="/quote"
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-[3px] bg-signal text-sm font-medium text-ink-950 transition-colors active:bg-signal-400"
        >
          {t("mcta.quote")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
