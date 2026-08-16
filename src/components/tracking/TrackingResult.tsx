"use client";

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
import { shipmentStatusLabel } from "@/lib/utils";

const STATUS_TONE: Record<string, string> = {
  pending: "bg-slate-100 text-navy-700",
  picked_up: "bg-electric-100 text-electric-600",
  in_transit: "bg-cyan-100 text-navy-800",
  customs: "bg-orange-100 text-orange-500",
  out_for_delivery: "bg-electric-100 text-electric-600",
  delivered: "bg-emerald-100 text-emerald-700",
};

export function TrackingResult({ shipment }: { shipment: Shipment }) {
  const reduceMotion = useReducedMotion();

  const card = (delay: number, children: React.ReactNode) => (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 0.61, 0.36, 1] }}
      className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card"
    >
      {children}
    </motion.div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      {/* Left: overview */}
      <div className="space-y-6">
        {card(0, (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate">Shipment</p>
              <p className="mt-1 font-mono text-2xl font-bold text-navy-900">{shipment.id}</p>
            </div>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${STATUS_TONE[shipment.status] ?? ""}`}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {shipmentStatusLabel(shipment.status)}
            </span>
          </div>
        ))}

        <div className="grid gap-6 sm:grid-cols-2">
          {card(0.08, (
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate">
                <MapPin className="h-3.5 w-3.5 text-electric-500" /> Origin
              </p>
              <p className="mt-2 text-base font-bold text-navy-900">{shipment.origin}</p>
            </div>
          ))}
          {card(0.14, (
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate">
                <Flag className="h-3.5 w-3.5 text-orange-500" /> Destination
              </p>
              <p className="mt-2 text-base font-bold text-navy-900">{shipment.destination}</p>
            </div>
          ))}
          {card(0.2, (
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate">
                <RouteIcon className="h-3.5 w-3.5 text-cyan-500" /> Current checkpoint
              </p>
              <p className="mt-2 text-base font-bold text-navy-900">{shipment.currentCheckpoint}</p>
            </div>
          ))}
          {card(0.26, (
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate">
                <Clock4 className="h-3.5 w-3.5 text-emerald-500" /> Estimated delivery
              </p>
              <p className="mt-2 text-base font-bold text-navy-900">{shipment.eta}</p>
            </div>
          ))}
        </div>

        {card(0.32, (
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate">Journey progress</p>
              <p className="font-mono text-sm font-bold text-electric-600">{shipment.progress}%</p>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-navy-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-electric-500 to-cyan-500"
                initial={reduceMotion ? false : { width: 0 }}
                animate={{ width: `${shipment.progress}%` }}
                transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
              {[
                { icon: Package, label: "Cargo", value: shipment.cargo.description },
                { icon: Weight, label: "Weight", value: shipment.cargo.weight },
                { icon: Truck, label: "Service", value: shipment.cargo.service },
                { icon: Box, label: "Vehicle", value: shipment.cargo.vehicle },
              ].map((item) => (
                <div key={item.label}>
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate">
                    <item.icon className="h-3 w-3 text-navy-400" /> {item.label}
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-snug text-navy-800">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {card(0.38, (
          <div className="flex items-start gap-3 rounded-xl bg-mist p-4">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-electric-500" />
            <p className="text-xs leading-relaxed text-navy-700">
              Need proof of delivery or temperature logs for this shipment?{" "}
              <a href="/contact" className="font-semibold text-electric-600 underline decoration-electric-300 underline-offset-2 hover:text-electric-500">
                Request documents
              </a>{" "}
              — available in your portal on request.
            </p>
          </div>
        ))}
      </div>

      {/* Right: timeline */}
      {card(0.1, (
        <div className="p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate">Shipment timeline</p>
          <div className="mt-6">
            <TrackingTimeline shipment={shipment} />
          </div>
        </div>
      ))}
    </div>
  );
}
