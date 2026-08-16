"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { formatNumber } from "@/lib/utils";

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

const STATS = [
  { value: 10000, suffix: "+", label: "Shipments delivered yearly", decimals: 0 },
  { value: 98.7, suffix: "%", label: "On-time delivery rate", decimals: 1 },
  { value: 24, suffix: "/7", label: "Logistics support & monitoring", decimals: 0 },
  { value: 30, suffix: "+", label: "Regions covered across Europe", decimals: 0 },
];

export function StatsSection() {
  return (
    <div className="relative border-b border-navy-100/70 bg-white">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-px overflow-hidden px-5 py-14 sm:px-8 lg:grid-cols-4 lg:px-10">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative px-6 py-6 text-center lg:py-2"
          >
            <p className="font-display text-4xl font-extrabold tracking-tight text-navy-900 sm:text-5xl">
              <CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
            </p>
            <p className="mt-2 text-sm font-medium text-slate">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
