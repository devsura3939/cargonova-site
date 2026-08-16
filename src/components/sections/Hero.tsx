"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Search, ShieldCheck, Clock4, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { fadeUp, stagger } from "@/lib/motion";

const LogisticsScene = dynamic(() => import("@/components/three/LogisticsScene"), {
  ssr: false,
  loading: () => <HeroVisualFallback />,
});

function HeroVisualFallback() {
  return (
    <svg viewBox="0 0 600 460" fill="none" aria-hidden="true" className="h-auto w-full max-w-2xl">
      <defs>
        <linearGradient id="hv-road" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#122b50" />
          <stop offset="1" stopColor="#0a1526" />
        </linearGradient>
        <linearGradient id="hv-line" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#1677FF" />
          <stop offset="1" stopColor="#2ED3E6" />
        </linearGradient>
      </defs>
      {/* road */}
      <path d="M60 420 C 160 380, 220 320, 300 300 S 480 250, 560 200" stroke="url(#hv-road)" strokeWidth="64" strokeLinecap="round" />
      {/* route */}
      <path d="M60 420 C 160 380, 220 320, 300 300 S 480 250, 560 200" stroke="url(#hv-line)" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" className="route-line" />
      {/* truck */}
      <g transform="translate(215 312) rotate(18)">
        <rect x="-52" y="-26" width="62" height="34" rx="3" fill="#12315e" />
        <rect x="20" y="-22" width="26" height="26" rx="3" fill="#1677ff" />
        <rect x="-48" y="-18" width="8" height="18" rx="1.5" fill="#0a1526" />
        <circle cx="-30" cy="12" r="6" fill="#0a0f18" />
        <circle cx="34" cy="12" r="6" fill="#0a0f18" />
      </g>
      {/* warehouse */}
      <g transform="translate(470 200)">
        <rect x="-70" y="-40" width="140" height="80" rx="6" fill="#132c52" />
        <rect x="-80" y="-52" width="160" height="14" rx="4" fill="#1e4578" />
        <rect x="-36" y="-12" width="26" height="52" rx="2" fill="#0b1f3a" />
        <rect x="10" y="-12" width="26" height="52" rx="2" fill="#0b1f3a" />
      </g>
      {/* containers */}
      <g transform="translate(120 300)">
        <rect x="0" y="0" width="34" height="26" rx="3" fill="#1677ff" />
        <rect x="40" y="0" width="34" height="26" rx="3" fill="#ff8a3d" />
        <rect x="0" y="-30" width="34" height="26" rx="3" fill="#2ed3e6" />
        <rect x="40" y="-30" width="34" height="26" rx="3" fill="#e3efff" />
      </g>
      {/* pins */}
      <g>
        <circle cx="60" cy="420" r="10" fill="#2ED3E6" opacity="0.25" />
        <circle cx="60" cy="420" r="5" fill="#2ED3E6" />
        <circle cx="560" cy="200" r="10" fill="#FF8A3D" opacity="0.25" />
        <circle cx="560" cy="200" r="5" fill="#FF8A3D" />
      </g>
    </svg>
  );
}

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "10,000+ shipments delivered yearly" },
  { icon: Clock4, label: "98.7% on-time delivery rate" },
  { icon: MapPin, label: "30+ regions across Europe & beyond" },
];

export function Hero() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-grid-dark" />
      <div className="pointer-events-none absolute -top-56 right-[-15%] h-130 w-130 rounded-full bg-electric-500/25 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-30%] left-[-10%] h-130 w-130 rounded-full bg-cyan-500/12 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-900/60 to-navy-900" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-5 pb-20 pt-28 sm:px-8 sm:pt-32 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-8 lg:px-10 lg:pb-28 lg:pt-36">
        {/* Copy */}
        <motion.div
          variants={stagger(0.09)}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          className="relative z-10 max-w-2xl"
        >
          <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-1.5 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            <span className="text-xs font-semibold tracking-wide text-navy-100">
              European ground freight · 24/7 control tower
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-balance font-display text-[2.65rem] font-extrabold leading-[1.06] tracking-tight sm:text-6xl lg:text-[4.25rem]"
          >
            Logistics That{" "}
            <span className="bg-gradient-to-r from-electric-400 via-cyan-400 to-electric-400 bg-clip-text text-transparent">
              Keep Business Moving
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-navy-200 sm:text-lg"
          >
            Reliable cargo transportation, intelligent route planning, and end-to-end
            logistics solutions built for businesses that cannot afford delays.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link href="/quote">
                Get a Quote
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/tracking">
                <Search className="h-4 w-4" />
                Track Shipment
              </Link>
            </Button>
          </motion.div>

          <motion.ul variants={fadeUp} className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-7">
            {TRUST_ITEMS.map((item) => (
              <li key={item.label} className="flex items-center gap-2.5 text-sm font-medium text-navy-100">
                <item.icon className="h-4 w-4 text-cyan-400" />
                {item.label}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 0.61, 0.36, 1] }}
          className="relative hidden lg:block"
        >
          <div className="absolute inset-0 -z-0 rounded-[2.5rem] bg-gradient-to-br from-electric-500/15 via-transparent to-cyan-500/10 blur-2xl" />
          <div className="relative h-[540px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-navy-950/60 shadow-[0_40px_80px_-24px_rgb(0_0_0/0.6)] backdrop-blur-sm">
            {isDesktop ? <LogisticsScene /> : <HeroVisualFallback />}
            {/* HUD overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/5" />
            <div className="pointer-events-none absolute left-5 top-5 rounded-xl border border-white/10 bg-navy-900/70 px-4 py-3 backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">Live Network</p>
              <p className="mt-1 font-mono text-sm font-semibold text-white">CRG-582941 · In Transit</p>
            </div>
            <div className="pointer-events-none absolute bottom-5 right-5 rounded-xl border border-white/10 bg-navy-900/70 px-4 py-3 text-right backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy-300">ETA Berlin → Tbilisi</p>
              <p className="mt-1 font-mono text-sm font-semibold text-white">Aug 18 · 62% complete</p>
            </div>
          </div>
        </motion.div>

        {/* Mobile/tablet visual */}
        <div className="relative -mx-5 sm:-mx-8 lg:hidden">
          <div className="rounded-3xl border border-white/10 bg-navy-950/70 p-2">
            <HeroVisualFallback />
          </div>
        </div>
      </div>
    </section>
  );
}
