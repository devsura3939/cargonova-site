"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, CircleDashed } from "lucide-react";
import type { Shipment } from "@/lib/tracking";
import { cn } from "@/lib/utils";
import { useLang, type DictKey } from "@/lib/i18n";

const STEP_LABEL_KEYS: Record<string, DictKey> = {
  Pickup: "trk.step.pickup",
  "Origin Hub": "trk.step.originHub",
  Transit: "trk.step.transit",
  "Border Check": "trk.step.borderCheck",
  Customs: "trk.step.borderCheck",
  "Destination Hub": "trk.step.destHub",
  Delivery: "trk.step.delivery",
  Departure: "trk.step.departure",
  "Open Sea": "trk.step.openSea",
  "Port of Call": "trk.step.portCall",
  Arrival: "trk.step.arrival",
} as const;

const NOTE_KEYS: Record<string, DictKey> = {
  "Freight collected at shipper facility.": "trk.note.collected",
  "Consolidated and secured for linehaul.": "trk.note.consolidated",
  "In linehaul across the corridor.": "trk.note.linehaul",
  "Customs documentation pre-cleared.": "trk.note.customs",
  "Signed for by recipient. POD available on request.": "trk.note.signed",
  "Delivery window confirmed.": "trk.note.window",
  "Cargo loaded and sealed on board.": "trk.note.loaded",
  "Voyage in progress across the sea lane.": "trk.note.voyage",
  "Port call for bunkering and rotation.": "trk.note.portCall",
  "Arrived at destination port. Discharge in progress.": "trk.note.arrived",
  "Scheduled arrival at destination port.": "trk.note.scheduled",
} as const;

export function TrackingTimeline({ shipment }: { shipment: Shipment }) {
  const reduceMotion = useReducedMotion();
  const { t, tLocation } = useLang();
  // The "current" step reflects the shipment status (or an explicit per-step
  // `done` flag when several steps share a status, e.g. ocean voyages).
  const statusRank = shipment.checkpoints.findIndex((c) => c.status === shipment.status);
  const currentRank = shipment.checkpoints.findIndex((c, i) => !(c.done ?? i < statusRank));

  return (
    <ol className="relative" aria-label={`Progress for ${shipment.id}`}>
      {/* rail */}
      <div className="absolute bottom-6 left-5 top-6 w-px bg-soft" aria-hidden="true" />
      <motion.div
        className="absolute bottom-6 left-5 top-6 w-px origin-top bg-gradient-to-b from-electric-500 via-cyan-500 to-cyan-400"
        aria-hidden="true"
        initial={reduceMotion ? false : { scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
      />

      {shipment.route.map((step, i) => {
        const checkpoint = shipment.checkpoints[i];
        const done = checkpoint?.done ?? i < currentRank;
        const current = i === currentRank;
        const rawLabel = checkpoint?.label ?? step;
        const labelKey = STEP_LABEL_KEYS[rawLabel];
        const label = labelKey ? t(labelKey) : rawLabel;

        return (
          <motion.li
            key={`${step}-${i}`}
            initial={reduceMotion ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.12 * i }}
            className="relative flex gap-5 pb-9 last:pb-0"
          >
            <span
              className={cn(
                "relative z-10 mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                done && "border-electric-500 bg-electric-500 text-white",
                current && "border-cyan-500 bg-white text-cyan-500",
                !done && !current && "border-soft bg-surface text-muted",
              )}
            >
              {done ? (
                <Check className="h-4 w-4" />
              ) : current ? (
                <span className="relative flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-50" />
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-cyan-500" />
                </span>
              ) : (
                <CircleDashed className="h-4 w-4" />
              )}
            </span>

            <div className="min-w-0 flex-1 pt-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className={cn("font-display font-bold", done || current ? "text-strong" : "text-muted")}>
                  {label}
                </p>
                <p className="text-xs font-medium text-muted">
                  {checkpoint?.location ? tLocation(checkpoint.location) : ""}
                </p>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-xs font-semibold text-electric-600">
                  {checkpoint?.timestamp}
                </span>
                {checkpoint?.note ? (
                  <span className="text-xs leading-relaxed text-muted">
                    {NOTE_KEYS[checkpoint.note] ? t(NOTE_KEYS[checkpoint.note]) : checkpoint.note}
                  </span>
                ) : null}
              </div>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
