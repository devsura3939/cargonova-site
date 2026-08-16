"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import {
  MapPin,
  Flag,
  Box,
  Truck,
  Clock4,
  Package,
  Weight,
  Route as RouteIcon,
  FileText,
} from "lucide-react";
import { TrackingTimeline } from "@/components/tracking/TrackingTimeline";
import type { Shipment } from "@/lib/tracking";

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

export function TrackingResult({ shipment }: { shipment: Shipment }) {
  const reduceMotion = useReducedMotion();
  const { t } = useLang();

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
            </div>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${STATUS_TONE[shipment.status] ?? ""} dark:bg-white/10`}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {t(STATUS_KEYS[shipment.status] as never)}
            </span>
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
              {[
                { icon: Package, label: t("trk.cargo"), value: shipment.cargo.description },
                { icon: Weight, label: t("trk.weight"), value: shipment.cargo.weight },
                { icon: Truck, label: t("trk.service"), value: shipment.cargo.service },
                { icon: Box, label: t("trk.vehicle"), value: shipment.cargo.vehicle },
              ].map((item) => (
                <div key={item.label}>
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
