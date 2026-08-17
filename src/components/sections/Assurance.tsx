"use client";

import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { useLang } from "@/lib/i18n";

const COMMITMENT_KEYS = [
  { index: "01", title: "as.c1t", body: "as.c1b" },
  { index: "02", title: "as.c2t", body: "as.c2b" },
  { index: "03", title: "as.c3t", body: "as.c3b" },
  { index: "04", title: "as.c4t", body: "as.c4b" },
] as const;

export function Assurance() {
  const { t } = useLang();

  return (
    <section className="bg-bone-50 text-ink-950">
      <div className="mx-auto max-w-[80rem] px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          {/* Copy */}
          <div>
            <p className="label flex items-center gap-2 text-ink-950/50">
              <span className="text-signal-600">04</span> {t("as.eyebrow")}
            </p>
            <h2 className="mt-5 text-balance text-3xl font-semibold leading-[1.03] tracking-[-0.025em] sm:text-4xl lg:text-[46px]">
              {t("as.title1")} <span className="text-ink-950/45">{t("as.title2")}</span>
            </h2>
            <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-ink-950/65">
              {t("as.sub")}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 rounded-[3px] bg-ink-950 px-5 py-3.5 text-[14px] font-medium text-bone-50 transition-colors duration-150 hover:bg-ink-800"
              >
                {t("as.cta")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href="tel:+995322550000"
                className="inline-flex items-center gap-2 rounded-[3px] border border-ink-950/20 px-5 py-3.5 text-[14px] text-ink-950 transition-colors duration-150 hover:border-ink-950/50"
              >
                <PhoneCall className="h-4 w-4" aria-hidden="true" />
                +995 32 255 00 00
              </a>
            </div>
          </div>

          {/* Commitments */}
          <ol className="border-t border-ink-950/15">
            {COMMITMENT_KEYS.map((item) => (
              <li key={item.index} className="flex gap-5 border-b border-ink-950/15 py-6 sm:gap-8 sm:py-7">
                <span className="mt-1 font-mono text-[10px] tracking-[0.14em] text-signal-600">
                  {item.index}
                </span>
                <div>
                  <h3 className="text-[18px] font-semibold tracking-[-0.01em] sm:text-[20px]">
                    {t(item.title)}
                  </h3>
                  <p className="mt-2 max-w-lg text-[14.5px] leading-relaxed text-ink-950/65">
                    {t(item.body)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
