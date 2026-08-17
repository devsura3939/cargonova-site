"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Plane, MapPin, Globe2, ExternalLink, Satellite, Package, AlertCircle } from "lucide-react";
import { flightRadarUrl, isCargoAirline, type LiveFlight } from "@/lib/live-data";
import { useLang } from "@/lib/i18n";

function Field({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-soft bg-surface-muted/60 px-3.5 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className={`mt-0.5 text-sm font-bold text-strong ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export function FlightResult({ code, flight }: { code: string; flight: LiveFlight }) {
  const { t } = useLang();
  const reduceMotion = useReducedMotion();
  const altFt = Math.round((flight.altitudeM / 0.3048) / 100) * 100;
  const speedKmh = Math.round(flight.velocityMs * 3.6);
  const cargo = isCargoAirline(flight.airlineCode);

  return (
    <div className="mx-auto mt-8 max-w-3xl">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
        className="overflow-hidden rounded-2xl border border-soft bg-surface shadow-lift"
      >
        {/* Header */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 text-white"
          style={{ background: "linear-gradient(135deg,#2e1065,#1e1b4b)" }}
        >
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-purple-300">
              <Satellite className="h-3.5 w-3.5" /> {t("trk.liveFlight")}
            </p>
            <h2 className="mt-1 font-mono text-2xl font-extrabold tracking-tight">{flight.callsign}</h2>
            <p className="mt-0.5 text-sm text-navy-300">
              {flight.airlineName} · {flight.originCountry}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold ${
                cargo ? "bg-purple-400/20 text-purple-200" : "bg-white/10 text-white"
              }`}
            >
              <Package className="h-3.5 w-3.5" />
              {cargo ? t("trk.cargoFlight") : t("trk.passengerFlight")}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3.5 py-1.5 text-xs font-bold text-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {t("trk.airborneNow")}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 px-6 py-5 sm:grid-cols-4">
          <Field label={t("trk.flAlt")} value={`${altFt.toLocaleString("en-US")} ft`} />
          <Field label={t("trk.flSpeed")} value={`${speedKmh} km/h`} />
          <Field label={t("trk.flHeading")} value={`${Math.round(flight.headingDeg)}°`} />
          <Field label={t("trk.flPosition")} value={`${flight.lat.toFixed(2)}, ${flight.lon.toFixed(2)}`} />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 border-t border-soft px-6 py-4">
          <a
            href={flightRadarUrl(code)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-purple-400"
          >
            <ExternalLink className="h-4 w-4" />
            {t("trk.openFlightRadar")}
          </a>
          <Link
            href="/live-map"
            className="inline-flex items-center gap-2 rounded-xl border border-soft px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-electric-400 hover:text-electric-600 dark:hover:text-electric-400"
          >
            <Globe2 className="h-4 w-4 text-electric-500" />
            {t("trk.watchLiveMap")}
          </Link>
        </div>

        <p className="flex items-start gap-2 border-t border-soft bg-surface-muted/50 px-6 py-3.5 text-[11px] leading-relaxed text-muted">
          <Satellite className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-400" />
          <span>{t("trk.adsbNote")}</span>
        </p>
      </motion.div>
    </div>
  );
}

export function FlightUnavailable({ code }: { code: string }) {
  const { t } = useLang();
  const reduceMotion = useReducedMotion();
  return (
    <div className="mx-auto mt-8 max-w-3xl">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
        className="rounded-2xl border border-soft bg-surface p-6 shadow-lift"
      >
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
            <AlertCircle className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold text-strong">{t("trk.flightNotLive")}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {t("trk.flightNotLiveText")}{" "}
              <span className="font-mono font-bold text-strong">{code}</span>.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={flightRadarUrl(code)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-purple-400"
              >
                <ExternalLink className="h-4 w-4" />
                {t("trk.checkFlightRadar")}
              </a>
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <Plane className="h-3.5 w-3.5" />
                {t("trk.flightHint")}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-surface-muted px-3.5 py-2.5 text-[11px] leading-relaxed text-muted">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-400" />
          <span>{t("trk.adsbCoverage")}</span>
        </div>
      </motion.div>
    </div>
  );
}
