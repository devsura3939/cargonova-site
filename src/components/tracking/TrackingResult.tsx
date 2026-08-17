"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  MapPin,
  Flag,
  Box,
  Truck,
  Clock4,
  Package,
  Weight,
  Anchor,
  Route as RouteIcon,
  FileText,
  ExternalLink,
} from "lucide-react";
import { TrackingTimeline } from "@/components/tracking/TrackingTimeline";
import { carrierVerifyUrl, type Shipment } from "@/lib/tracking";

// Leaflet touches browser globals at module load — client-side only.
const RouteMap = dynamic(() => import("@/components/map/RouteMap").then((m) => m.RouteMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 w-full items-center justify-center rounded-2xl border border-soft bg-surface-muted text-sm text-muted sm:h-80">
      Loading route map…
    </div>
  ),
});
import { useLang } from "@/lib/i18n";

const STATUS_TONE: Record<string, string> = {
  pending: "bg-slate-100 text-navy-700 dark:bg-white/10 dark:text-navy-100",
  picked_up: "bg-electric-100 text-electric-600",
  in_transit: "bg-cyan-100 text-navy-800 dark:bg-cyan-500/15 dark:text-cyan-300",
  customs: "bg-orange-100 text-orange-500",
  out_for_delivery: "bg-electric-100 text-electric-600",
  delivered: "bg-emerald-100 text-emerald-700",
};

const STATUS_KEYS: Record<string, string> = {
  pending: "trk.shipmentStatus.pending",
  picked_up: "trk.shipmentStatus.picked_up",
  in_transit: "trk.shipmentStatus.in_transit",
  customs: "trk.shipmentStatus.customs",
  out_for_delivery: "trk.shipmentStatus.out_for_delivery",
  delivered: "trk.shipmentStatus.delivered",
};

export function TrackingResult({
  shipment,
  onRefresh,
}: {
  shipment: Shipment;
  onRefresh?: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const { t, tPhrase, lang } = useLang();
  // The component is keyed by shipment id upstream, so these clocks start
  // fresh whenever a different shipment (or a refreshed status) is shown.
  const [now, setNow] = useState(() => Date.now());
  const [updatedAt] = useState(() => Date.now());

  // Live 1s tick for the ETA countdown + "updated Xs ago".
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeAgo = (ms: number) => {
    if (ms < 0) ms = 0;
    const s = Math.round(ms / 1000);
    if (s < 60) return s <= 2 ? t("trk.justNow") : `${s}${t("trk.secondsAgo")}`;
    return `${Math.floor(s / 60)}${t("trk.minutesAgo")}`;
  };

  const countdown = (() => {
    if (shipment.status === "delivered") return null;
    const left = shipment.etaMs - now;
    if (left <= 0) return null;
    const d = Math.floor(left / 86400000);
    const h = Math.floor((left % 86400000) / 3600000);
    const m = Math.floor((left % 3600000) / 60000);
    if (lang === "ka") {
      const parts: string[] = [];
      if (d) parts.push(`${d}დ`);
      if (h) parts.push(`${h}სთ`);
      if (!d && m) parts.push(`${m}წთ`);
      return parts.length ? parts.join(" ") : `${m}წთ`;
    }
    if (d) return `${d}d ${h}h`;
    if (h) return `${h}h ${m}m`;
    return `${m}m`;
  })();

  const cargoValue = (v: string) => tPhrase(v);
  const serviceValue = (v: string) => tPhrase(v);
  const vehicleValue = (v: string) =>
    v.startsWith("Container vessel")
      ? `${tPhrase("Container vessel")}${v.slice("Container vessel".length)}`
      : tPhrase(v);

  // Detail cards — keys are explicit and unique per card. Ocean shipments get
  // both VESSEL and SERVICE; road/air/rail shipments get SERVICE once.
  const detailItems = [
    { key: "cargo", icon: Package, label: t("trk.cargo"), value: cargoValue(shipment.cargo.description) },
    { key: "weight", icon: Weight, label: t("trk.weight"), value: shipment.cargo.weight },
    ...(shipment.voyage
      ? [{ key: "vessel", icon: Anchor, label: t("trk.vessel"), value: shipment.voyage.vessel }]
      : []),
    { key: "service", icon: Truck, label: t("trk.service"), value: serviceValue(shipment.cargo.service) },
    { key: "vehicle", icon: Box, label: t("trk.vehicle"), value: vehicleValue(shipment.cargo.vehicle) },
  ];

  const card = (delay: number, children: React.ReactNode) => (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 0.61, 0.36, 1] }}
      className="rounded-2xl border border-soft bg-surface p-5 shadow-card"
    >
      {children}
    </motion.div>
  );

  return (
    <div className="grid gap-6">
      {/* Live route map */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <RouteMap shipment={shipment} />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      {/* Left: overview */}
      <div className="space-y-6">
        {card(0, (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{t("trk.shipment")}</p>
              <p className="mt-1 font-mono text-2xl font-bold text-strong">{shipment.id}</p>
              <p className="mt-0.5 text-xs font-semibold text-electric-600 dark:text-electric-400">{shipment.carrierName}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {shipment.status !== "delivered" && countdown ? (
                <div className="text-right">
                  <p className="flex items-center justify-end gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                    {t("trk.etaIn")}
                  </p>
                  <p className="mt-1 font-mono text-base font-bold text-electric-600 dark:text-electric-400">{countdown}</p>
                </div>
              ) : null}
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${STATUS_TONE[shipment.status] ?? ""} dark:bg-white/10`}
              >
                <span className="h-2 w-2 rounded-full bg-current" />
                {t(STATUS_KEYS[shipment.status] as never)}
              </span>
            </div>
          </div>
        ))}

        <div className="grid gap-6 sm:grid-cols-2">
          {card(0.08, (
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-muted">
                <MapPin className="h-3.5 w-3.5 text-electric-500" /> {t("trk.origin")}
              </p>
              <p className="mt-2 text-base font-bold text-strong">{shipment.origin}</p>
            </div>
          ))}
          {card(0.14, (
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-muted">
                <Flag className="h-3.5 w-3.5 text-orange-500" /> {t("trk.destination")}
              </p>
              <p className="mt-2 text-base font-bold text-strong">{shipment.destination}</p>
            </div>
          ))}
          {card(0.2, (
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-muted">
                <RouteIcon className="h-3.5 w-3.5 text-cyan-500" /> {t("trk.checkpoint")}
              </p>
              <p className="mt-2 text-base font-bold text-strong">{shipment.currentCheckpoint}</p>
            </div>
          ))}
          {card(0.26, (
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-muted">
                <Clock4 className="h-3.5 w-3.5 text-emerald-500" /> {t("trk.eta")}
              </p>
              <p className="mt-2 text-base font-bold text-strong">{shipment.eta}</p>
            </div>
          ))}
        </div>

        {card(0.3, (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-soft bg-surface-muted/60 p-4">
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {t("trk.updated")}: <span className="font-mono font-bold text-strong">{timeAgo(now - updatedAt)}</span>
            </div>
            {onRefresh ? (
              <button
                type="button"
                onClick={onRefresh}
                className="inline-flex items-center gap-1.5 rounded-full border border-soft bg-surface px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-electric-400 hover:text-electric-600 dark:hover:text-electric-400"
              >
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                  <path d="M21 3v6h-6" />
                </svg>
                {t("trk.refresh")}
              </button>
            ) : null}
          </div>
        ))}

        {card(0.32, (
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{t("trk.progress")}</p>
              <p className="font-mono text-sm font-bold text-electric-600 dark:text-electric-400">{shipment.progress}%</p>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-soft dark:bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-electric-500 to-cyan-500"
                initial={reduceMotion ? false : { width: 0 }}
                animate={{ width: `${shipment.progress}%` }}
                transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
              {detailItems.map((item) => (
                <div key={item.key}>
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted">
                    <item.icon className="h-3 w-3 text-navy-400" /> {item.label}
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-snug text-ink">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {card(0.38, (
          <div className="flex items-start gap-3 rounded-xl bg-surface-muted p-4">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-electric-500" />
            <p className="text-xs leading-relaxed text-ink">
              {t("trk.docsNote1")}{" "}
              <a href="/contact" className="font-semibold text-electric-600 underline decoration-electric-300 underline-offset-2 hover:text-electric-500 dark:text-electric-400">
                {t("trk.requestDocs")}
              </a>{" "}
              {t("trk.docsNote2")}
            </p>
          </div>
        ))}

        {card(0.42, (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-soft bg-surface p-4">
            <p className="text-xs leading-relaxed text-ink">
              {t("trk.verifyNote")}
            </p>
            <a
              href={carrierVerifyUrl(shipment.id, shipment.carrier)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-navy-850 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-navy-700"
            >
              {t("trk.verifyCta")}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        ))}
      </div>

      {/* Right: timeline */}
        {card(0.1, (
          <div className="p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{t("trk.timeline")}</p>
            <div className="mt-6">
              <TrackingTimeline shipment={shipment} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
