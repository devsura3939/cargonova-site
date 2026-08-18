"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { formatNumber } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView) return;
    const duration = reduceMotion ? 0 : 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduceMotion]);

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : formatNumber(Math.round(display));

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

const STAT_KEYS = ["stats.shipments", "stats.ontime", "stats.support", "stats.regions"] as const;
const STATS = [
  { value: 10000, suffix: "+", decimals: 0 },
  { value: 0, suffix: "%", decimals: 1 },
  { value: 24, suffix: "/7", decimals: 0 },
  { value: 30, suffix: "+", decimals: 0 },
];

export function StatsSection() {
  const { t } = useLang();
  return (
    <div className="relative border-b border-soft bg-surface">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-px overflow-hidden px-5 py-14 sm:px-8 lg:grid-cols-4 lg:px-10">
        {STATS.map((stat, i) => (
          <motion.div
            key={STAT_KEYS[i]}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative px-6 py-6 text-center lg:py-2"
          >
            <p className="font-display text-4xl font-extrabold tracking-tight text-strong sm:text-5xl">
              <CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
            </p>
            <p className="mt-2 text-sm font-medium text-muted">{t(STAT_KEYS[i])}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
