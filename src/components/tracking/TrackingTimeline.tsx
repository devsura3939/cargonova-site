"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, CircleDashed } from "lucide-react";
import type { Shipment } from "@/lib/tracking";
import { cn } from "@/lib/utils";

export function TrackingTimeline({ shipment }: { shipment: Shipment }) {
  const reduceMotion = useReducedMotion();
  // The "current" step is the checkpoint that reflects the shipment status;
  // everything before it is done, everything after is upcoming.
  const currentRank = shipment.checkpoints.findIndex((c) => c.status === shipment.status);

  return (
    <ol className="relative" aria-label={`Progress for ${shipment.id}`}>
      {/* rail */}
      <div className="absolute bottom-6 left-5 top-6 w-px bg-navy-100" aria-hidden="true" />
      <motion.div
        className="absolute bottom-6 left-5 top-6 w-px origin-top bg-gradient-to-b from-electric-500 via-cyan-500 to-cyan-400"
        aria-hidden="true"
        initial={reduceMotion ? false : { scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
      />

      {shipment.route.map((step, i) => {
        const checkpoint = shipment.checkpoints[i];
        const done = i < currentRank;
        const current = i === currentRank;
        const label = checkpoint?.label ?? step;

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
                !done && !current && "border-navy-100 bg-white text-navy-200",
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
                <p className={cn("font-display font-bold", done || current ? "text-navy-900" : "text-navy-400")}>
                  {label}
                </p>
                <p className="text-xs font-medium text-slate">
                  {checkpoint?.location}
                </p>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-xs font-semibold text-electric-600">
                  {checkpoint?.timestamp}
                </span>
                {checkpoint?.note ? (
                  <span className="text-xs leading-relaxed text-slate">{checkpoint.note}</span>
                ) : null}
              </div>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
