"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { images } from "@/data/images";
import { useLang } from "@/lib/i18n";
import { OpsTicker } from "@/components/sections/OpsTicker";

const EASE = [0.23, 1, 0.32, 1] as const;

export function Hero() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { t } = useLang();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length < 6) {
      setError(t("trk.invalidMsg"));
      return;
    }
    router.push(`/tracking?code=${encodeURIComponent(code.trim())}`);
  };

  const fade = (delay: number) =>
    reduceMotion
      ? undefined
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.32, ease: EASE, delay },
        };

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-ink-950 pt-16 text-fog-50">
      {/* Color atmosphere — signal orange + tech blue, kept subtle */}
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-25" />
      <div className="pointer-events-none absolute -left-44 top-8 h-96 w-96 rounded-full bg-signal/15 blur-[110px]" />
      <div className="pointer-events-none absolute right-[-12%] bottom-0 h-[26rem] w-[26rem] rounded-full bg-tech-500/12 blur-[120px]" />

      <div className="relative mx-auto grid max-w-[80rem] grid-cols-1 lg:grid-cols-[1.02fr_1fr]">
        {/* Copy */}
        <div className="px-5 pb-12 pt-12 sm:px-8 lg:pb-16 lg:pt-20">
          <motion.p
            {...fade(0)}
            className="label flex flex-wrap items-center gap-x-3 gap-y-2 text-fog-500"
          >
            <span className="text-signal">{t("hero.metaLoc")}</span>
            <span className="hidden h-3 w-px bg-white/15 sm:block" aria-hidden="true" />
            <span>{t("hero.metaModes")}</span>
          </motion.p>

          <motion.h1
            {...fade(0.04)}
            className="mt-7 text-balance text-[40px] font-semibold leading-[0.98] tracking-[-0.03em] sm:text-[56px] lg:text-[62px]"
          >
            {t("hero.title1")}
            <br />
            {t("hero.titleAccent")}
          </motion.h1>

          <motion.p
            {...fade(0.08)}
            className="mt-6 max-w-lg text-[16px] leading-relaxed text-fog-500"
          >
            {t("hero.sub")}
          </motion.p>

          <motion.div {...fade(0.12)} className="mt-9 max-w-xl">
            <div className="mb-2 flex items-baseline justify-between">
              <p className="label text-fog-500">{t("hero.trackLabel")}</p>
              <button
                type="button"
                onClick={() => router.push("/quote")}
                className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-fog-600 transition-colors duration-150 hover:text-signal"
              >
                {t("hero.priceLane")}
                <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={submit} className="flex">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fog-600"
                  aria-hidden="true"
                />
                <input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError(null);
                  }}
                  placeholder={t("hero.trackPh")}
                  aria-label={t("hero.trackLabel")}
                  className="h-12 w-full border border-white/10 bg-white/[0.03] pl-10 pr-3 font-mono text-[12px] uppercase tracking-[0.08em] text-fog-50 transition-colors duration-150 placeholder:normal-case placeholder:tracking-normal placeholder:text-fog-600 focus:border-signal focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="flex h-12 shrink-0 items-center gap-2 bg-signal px-5 text-[14px] font-medium text-ink-950 transition-colors duration-150 hover:bg-signal-400"
              >
                {t("trk.search")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
            {error ? (
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-status-crit">
                {error}
              </p>
            ) : null}
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="label text-fog-600">{t("hero.demo")}</span>
              {["CRG-582941", "CRG-729103"].map((demo) => (
                <button
                  key={demo}
                  type="button"
                  onClick={() => router.push(`/tracking?code=${demo}`)}
                  className="border border-white/10 px-2 py-1 font-mono text-[10px] tracking-[0.08em] text-fog-500 transition-colors duration-150 hover:border-signal/50 hover:text-signal-400"
                >
                  {demo}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Visual — stock video with poster fallback */}
        <div className="relative min-h-[300px] overflow-hidden border-t border-white/10 sm:min-h-[380px] lg:min-h-0 lg:border-l lg:border-t-0">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="absolute inset-0"
          >
            <video
              className="h-full w-full object-cover object-center saturate-[0.82] brightness-[0.88] contrast-[1.04]"
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              preload="metadata"
              poster={images.semiHighway}
              aria-label="CargoNova linehaul truck on the highway"
            >
              <source media="(min-width: 1024px)" src="/videos/trucks-transport.mp4" type="video/mp4" />
              <source src="/videos/trucks-transport-sm.mp4" type="video/mp4" />
            </video>
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-ink-950/30" aria-hidden="true" />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-ink-950/45"
            aria-hidden="true"
          />
          <div className="glass-dark absolute bottom-4 left-4 px-3 py-2 sm:bottom-6 sm:left-6">
            <p className="label text-fog-400">{t("hero.fleetLabel")}</p>
            <p className="mt-1.5 font-mono text-[13px] text-fog-50 tnum">{t("hero.fleetUnits")}</p>
            <p className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-fog-500">
              {t("hero.fleetSub")}
            </p>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto grid max-w-[80rem] grid-cols-2 gap-px bg-white/[0.06] md:grid-cols-4">
          <Stat label={t("stats.inTransit")} value="1 284" unit={t("stats.inTransitUnit")} emphasis />
          <Stat label={t("stats.ontime")} value="98.7" unit="%" />
          <Stat label={t("stats.telemetry")} value={t("stats.telemetryVal")} unit={t("stats.telemetryUnit")} />
          <Stat label={t("stats.countries")} value={t("stats.countriesVal")} unit={t("stats.countriesUnit")} />
        </div>
      </div>

      {/* Ops ticker */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto max-w-[80rem] px-5 sm:px-8">
          <OpsTicker />
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  unit,
  emphasis = false,
}: {
  label: string;
  value: string;
  unit: string;
  emphasis?: boolean;
}) {
  return (
    <div className="bg-ink-950 px-5 py-6 sm:px-8">
      <p className="label mb-3 text-fog-500">{label}</p>
      <p
        className={`font-mono leading-none text-fog-50 tnum ${
          emphasis ? "text-[30px] sm:text-[40px]" : "text-[22px] sm:text-[26px]"
        }`}
      >
        {value}
        {unit ? (
          <span className="ml-1.5 text-[11px] uppercase tracking-[0.12em] text-fog-500">
            {unit}
          </span>
        ) : null}
      </p>
    </div>
  );
}
