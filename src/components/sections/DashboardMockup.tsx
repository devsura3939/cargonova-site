"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LayoutDashboard, Truck, Package, Map, FileText, Settings, Bell, Search, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

const KPIS = [
  { label: "In transit", value: "128", trend: "+12 today" },
  { label: "On-time rate", value: "—", trend: "" },
  { label: "Avg. ETA delay", value: "-0.4 h", trend: "ahead" },
  { label: "Active alerts", value: "3", trend: "2 resolved" },
];

const SHIPMENTS = [
  { id: "CRG-582941", route: "Berlin → Tbilisi", vehicle: "Semi Trailer", status: "In Transit", pct: 62, tone: "blue" },
  { id: "CRG-729103", route: "Rotterdam → Warsaw", vehicle: "Semi Trailer", status: "Customs", pct: 48, tone: "orange" },
  { id: "CRG-193847", route: "Munich → Zurich", vehicle: "Sprinter Van", status: "Out for Delivery", pct: 88, tone: "cyan" },
  { id: "CRG-664120", route: "Hamburg → Copenhagen", vehicle: "Box Truck", status: "Delivered", pct: 100, tone: "green" },
];

const TONE: Record<string, string> = {
  blue: "bg-electric-500/15 text-electric-300",
  orange: "bg-orange-500/15 text-orange-400",
  cyan: "bg-cyan-500/15 text-cyan-400",
  green: "bg-emerald-500/15 text-emerald-400",
};

const BAR: Record<string, string> = {
  blue: "bg-electric-500",
  orange: "bg-orange-500",
  cyan: "bg-cyan-400",
  green: "bg-emerald-400",
};

export function DashboardMockup({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-white/10 bg-navy-950 shadow-[0_40px_80px_-24px_rgb(0_0_0/0.65)]",
        className,
      )}
      role="img"
      aria-label="Illustration of the BRB Enterprise logistics control tower dashboard"
    >
      {/* Window bar */}
      <div className="flex items-center justify-between border-b border-white/8 bg-navy-900/80 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </div>
          <span className="font-mono text-[11px] text-navy-300">control.brb-enterprise.com/tower</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
          </span>
          Live
        </span>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden w-14 flex-col items-center gap-5 border-r border-white/8 bg-navy-900/50 py-5 sm:flex">
          {[LayoutDashboard, Truck, Package, Map, FileText, Settings].map((Icon, i) => (
            <span
              key={i}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                i === 0 ? "bg-electric-500/20 text-electric-300" : "text-navy-400 hover:text-navy-200",
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
          ))}
        </div>

        {/* Main panel */}
        <div className="flex-1 p-4 sm:p-5">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-white">Control Tower</p>
              <p className="text-[11px] text-navy-300">Operations overview · Aug 16, 14:02 CET</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden h-8 w-40 items-center gap-2 rounded-lg bg-white/5 px-3 text-[11px] text-navy-300 sm:flex">
                <Search className="h-3 w-3" /> Search shipments…
              </span>
              <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-navy-200">
                <Bell className="h-3.5 w-3.5" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-orange-500" />
              </span>
            </div>
          </div>

          {/* KPIs */}
          <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {KPIS.map((kpi) => (
              <div key={kpi.label} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-navy-300">{kpi.label}</p>
                <p className="mt-1 font-display text-xl font-extrabold text-white">{kpi.value}</p>
                <p className="mt-0.5 text-[10px] font-medium text-cyan-400">{kpi.trend}</p>
              </div>
            ))}
          </div>

          {/* Shipments table */}
          <div className="mt-4 overflow-hidden rounded-xl border border-white/8">
            <div className="flex items-center justify-between border-b border-white/8 bg-white/[0.03] px-3 py-2">
              <p className="text-[11px] font-bold text-white">Active shipments</p>
              <span className="flex items-center gap-1.5 text-[10px] text-navy-300">
                <Wifi className="h-3 w-3 text-cyan-400" /> Telemetry connected
              </span>
            </div>
            <ul className="divide-y divide-white/5">
              {SHIPMENTS.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * i }}
                  className="flex items-center gap-3 px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-white">{s.id}</span>
                      <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide", TONE[s.tone])}>
                        {s.status}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-[10px] text-navy-300">
                      {s.route} · {s.vehicle}
                    </p>
                    <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        className={cn("h-full rounded-full", BAR[s.tone])}
                        initial={reduceMotion ? false : { width: 0 }}
                        whileInView={{ width: `${s.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
                      />
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] font-semibold text-navy-200">{s.pct}%</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
