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
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-soft bg-surface/95 p-3 shadow-[0_-8px_32px_-16px_rgb(11_31_58/0.25)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-md gap-2">
        <Link
          href="/tracking"
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-soft bg-surface text-sm font-semibold text-ink transition-colors active:bg-surface-hover"
        >
          <Search className="h-4 w-4" />
          {t("mcta.track")}
        </Link>
        <Link
          href="/quote"
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-electric-500 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgb(22_119_255/0.7)] transition-colors active:bg-electric-400"
        >
          {t("mcta.quote")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
