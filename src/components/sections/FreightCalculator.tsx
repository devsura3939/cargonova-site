"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeftRight,
  MapPin,
  Route as RouteIcon,
  Clock4,
  Fuel,
  Landmark,
  FileBadge,
  Calculator,
  Loader2,
} from "lucide-react";
import { COUNTRIES, getCountry, estimateFreight, type Estimate } from "@/lib/geo";
import { useLang } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/Reveal";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const CARGO_OPTIONS = [
  { id: "ftl", labelKey: "calc.palletLoad" },
  { id: "ltl", labelKey: "calc.partialLoad" },
  { id: "express", labelKey: "calc.express" },
  { id: "reefer", labelKey: "calc.refrigerated" },
  { id: "oversized", labelKey: "calc.oversized" },
  { id: "other", labelKey: "calc.other" },
] as const;

const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);

export function FreightCalculator() {
  const router = useRouter();
  const { t, lang } = useLang();
  const reduceMotion = useReducedMotion();

  const [originCountry, setOriginCountry] = useState("GE");
  const [originCity, setOriginCity] = useState("tbilisi");
  const [destCountry, setDestCountry] = useState("DE");
  const [destCity, setDestCity] = useState("berlin");
  const [cargoType, setCargoType] = useState<string>("ftl");
  const [weight, setWeight] = useState("8000");
  const [pallets, setPallets] = useState("6");
  const [submitting, setSubmitting] = useState(false);

  const originCities = getCountry(originCountry)?.cities ?? [];
  const destCities = getCountry(destCountry)?.cities ?? [];

  // Keep selected city valid when country changes.
  function changeOriginCountry(code: string) {
    setOriginCountry(code);
    const cities = getCountry(code)?.cities ?? [];
    setOriginCity(cities[0]?.id ?? "");
  }
  function changeDestCountry(code: string) {
    setDestCountry(code);
    const cities = getCountry(code)?.cities ?? [];
    setDestCity(cities[0]?.id ?? "");
  }

  function swap() {
    setOriginCountry(destCountry);
    setOriginCity(destCity);
    setDestCountry(originCountry);
    setDestCity(originCity);
  }

  const estimate: Estimate | null = useMemo(
    () =>
      estimateFreight({
        originCountry,
        originCity,
        destCountry,
        destCity,
        cargoType,
        pallets: Number(pallets) || 0,
        weightKg: Number(weight) || 0,
      }),
    [originCountry, originCity, destCountry, destCity, cargoType, pallets, weight],
  );

  const cityName = (countryCode: string, cityId: string) =>
    getCountry(countryCode)?.cities.find((c) => c.id === cityId)?.[lang === "ka" ? "nameKa" : "name"] ?? "";
  const countryName = (code: string) => getCountry(code)?.[lang === "ka" ? "nameKa" : "name"] ?? "";

  function requestExactQuote() {
    trackEvent("quote_started", { source: "calculator" });
    setSubmitting(true);
    const params = new URLSearchParams({
      pickupCountry: countryName(originCountry),
      pickupCity: cityName(originCountry, originCity),
      destinationCountry: countryName(destCountry),
      destinationCity: cityName(destCountry, destCity),
      cargoType: cargoType === "other" ? "Palletized goods" : CARGO_OPTIONS.find((c) => c.id === cargoType)?.labelKey ?? "",
      weight,
      pallets,
    });
    router.push(`/quote?${params.toString()}`);
  }

  const lines = estimate
    ? [
        { icon: RouteIcon, label: t("calc.baseRate"), value: `€ ${fmt(estimate.base)}` },
        { icon: Fuel, label: t("calc.fuel"), value: `€ ${fmt(estimate.fuel)}` },
        { icon: FileBadge, label: t("calc.border"), value: estimate.customs > 0 ? `€ ${fmt(estimate.customs)}` : "—" },
        { icon: Landmark, label: "Tolls & road fees", value: `€ ${fmt(estimate.tolls)}` },
      ]
    : [];

  return (
    <Reveal className="relative overflow-hidden rounded-3xl border border-soft bg-surface shadow-card">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-electric-100/70 blur-3xl dark:bg-electric-500/10" />
      <div className="relative grid gap-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        {/* Form */}
        <div className="p-7 sm:p-10">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-electric-600">
            <Calculator className="h-4 w-4" />
            {t("calc.eyebrow")}
          </p>
          <h2 className="text-balance font-display text-2xl font-extrabold leading-tight tracking-tight text-strong sm:text-3xl">
            {t("calc.title")}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">{t("calc.sub")}</p>

          <div className="mt-8 space-y-5">
            {/* Route */}
            <div className="rounded-2xl border border-soft bg-surface-muted/60 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
                  <MapPin className="h-3.5 w-3.5 text-electric-500" /> {t("calc.origin")}
                </p>
                <button
                  type="button"
                  onClick={swap}
                  className="inline-flex items-center gap-1.5 rounded-full border border-soft bg-surface px-3 py-1.5 text-xs font-semibold text-strong transition-colors hover:border-electric-400 hover:text-electric-600"
                >
                  <ArrowLeftRight className="h-3.5 w-3.5" />
                  {t("calc.swap")}
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Select value={originCountry} onValueChange={changeOriginCountry}>
                  <SelectTrigger aria-label={t("calc.origin")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {lang === "ka" ? c.nameKa : c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={originCity} onValueChange={setOriginCity}>
                  <SelectTrigger aria-label={t("calc.originCity")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {originCities.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {lang === "ka" ? c.nameKa : c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="my-4 flex items-center gap-3 text-muted">
                <span className="h-px flex-1 bg-soft" />
                <ArrowRight className="h-4 w-4 rotate-90 text-electric-500" />
                <span className="h-px flex-1 bg-soft" />
              </div>

              <div className="mb-3">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
                  <MapPin className="h-3.5 w-3.5 text-cyan-500" /> {t("calc.dest")}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Select value={destCountry} onValueChange={changeDestCountry}>
                  <SelectTrigger aria-label={t("calc.dest")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {lang === "ka" ? c.nameKa : c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={destCity} onValueChange={setDestCity}>
                  <SelectTrigger aria-label={t("calc.destCity")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {destCities.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {lang === "ka" ? c.nameKa : c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Cargo */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <Label className="mb-1.5 block">{t("calc.cargoType")}</Label>
                <div className="flex flex-wrap gap-2">
                  {CARGO_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCargoType(opt.id)}
                      className={cn(
                        "rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200",
                        cargoType === opt.id
                          ? "bg-electric-500 text-white shadow-glow"
                          : "border border-soft bg-surface text-strong hover:border-electric-400 hover:text-electric-600",
                      )}
                    >
                      {t(opt.labelKey)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="calc-weight" className="mb-1.5 block">
                  {t("calc.weight")}
                </Label>
                <Input id="calc-weight" type="number" min="0" value={weight} onChange={(e) => setWeight(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="calc-pallets" className="mb-1.5 block">
                  {t("calc.pallets")}
                </Label>
                <Input id="calc-pallets" type="number" min="0" max="100" value={pallets} onChange={(e) => setPallets(e.target.value)} />
              </div>
              <div className="flex items-end">
                <Button type="button" onClick={requestExactQuote} disabled={submitting} className="w-full sm:w-auto">
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  {t("calc.request")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Live estimate */}
        <div className="relative flex flex-col border-t border-soft bg-navy-900 p-7 text-white sm:p-10 lg:border-l lg:border-t-0">
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-30" />
          <div className="pointer-events-none absolute inset-0 bg-grid-dark" />
          <div className="relative">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              {t("calc.estimate")}
            </p>

            <AnimatePresence mode="wait">
              {estimate ? (
                <motion.div
                  key="estimate"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Route summary */}
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <p className="text-xs font-semibold text-navy-300">{t("calc.originCity")}</p>
                      <p className="mt-0.5 font-display text-sm font-bold text-white">
                        {cityName(originCountry, originCity)}, {countryName(originCountry)}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-cyan-400" />
                    <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <p className="text-xs font-semibold text-navy-300">{t("calc.destCity")}</p>
                      <p className="mt-0.5 font-display text-sm font-bold text-white">
                        {cityName(destCountry, destCity)}, {countryName(destCountry)}
                      </p>
                    </div>
                  </div>

                  {/* Key figures */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-navy-300">
                        <RouteIcon className="h-3 w-3 text-electric-400" /> {t("calc.distance")}
                      </p>
                      <p className="mt-1 font-mono text-lg font-bold text-white">{fmt(estimate.km)} km</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-navy-300">
                        <Clock4 className="h-3 w-3 text-cyan-400" /> {t("calc.transit")}
                      </p>
                      <p className="mt-1 font-mono text-lg font-bold text-white">
                        {estimate.transitDays} {t("calc.days")}
                      </p>
                    </div>
                  </div>

                  {/* Line items */}
                  <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-4">
                    {lines.map((line) => (
                      <li key={line.label} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-navy-200">
                          <line.icon className="h-3.5 w-3.5 text-navy-400" />
                          {line.label}
                        </span>
                        <span className="font-mono font-semibold text-white">{line.value}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Total */}
                  <div className="mt-5 rounded-2xl bg-gradient-to-br from-electric-500/20 to-cyan-500/10 p-5 ring-1 ring-inset ring-white/10">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-navy-300">{t("calc.total")} · EUR</p>
                        <p className="mt-0.5 font-display text-3xl font-extrabold text-white">
                          € {fmt(estimate.totalEur)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-navy-300">{t("calc.inGel")}</p>
                        <p className="mt-0.5 font-display text-lg font-bold text-cyan-400">
                          ₾ {fmt(estimate.totalGel)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-[11px] leading-relaxed text-navy-300">{t("calc.note")}</p>
                </motion.div>
              ) : (
                <motion.p
                  key="empty"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 rounded-2xl border border-dashed border-white/15 p-6 text-sm text-navy-300"
                >
                  {t("calc.title")}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
