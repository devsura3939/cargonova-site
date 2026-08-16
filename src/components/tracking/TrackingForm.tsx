"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, PackageSearch, Loader2, XCircle, AlertCircle } from "lucide-react";
import { lookupTrackingAction, type LookupResult } from "@/app/tracking/actions";
import { TrackingResult } from "@/components/tracking/TrackingResult";
import { Skeleton } from "@/components/ui/skeleton";
import { demoTrackingIds } from "@/lib/tracking";
import { trackingSchema } from "@/lib/validations";
import { trackEvent } from "@/lib/analytics";
import { useLang } from "@/lib/i18n";

type ViewState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "result"; data: LookupResult & { ok: true } };

export function TrackingForm() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewState>({ kind: "idle" });
  const [isPending, startTransition] = useTransition();
  const reduceMotion = useReducedMotion();
  const { t } = useLang();

  function search(id: string) {
    const trimmed = id.trim();
    if (!trimmed) {
      setView({ kind: "error", message: t("trk.emptyMsg") });
      return;
    }
    const parsed = trackingSchema.safeParse(trimmed);
    if (!parsed.success) {
      setView({ kind: "error", message: t("trk.invalidMsg") });
      return;
    }

    setView({ kind: "loading" });
    trackEvent("tracking_search", { id: parsed.data });

    startTransition(async () => {
      const result = await lookupTrackingAction(parsed.data);
      if (result.ok) {
        setView({ kind: "result", data: result });
      } else {
        setView({
          kind: "error",
          message: result.error === "invalid" ? t("trk.invalidMsg") : t("trk.notFoundMsg"),
        });
      }
    });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    search(query);
  }

  return (
    <div>
      {/* Search bar */}
      <form
        onSubmit={onSubmit}
        className="relative z-10 mx-auto max-w-2xl rounded-3xl border border-soft bg-surface p-2 shadow-lift"
        noValidate
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor="tracking-input" className="sr-only">
            {t("trk.shipment")}
          </label>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
            <input
              id="tracking-input"
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
              placeholder={t("trk.placeholder")}
              autoComplete="off"
              spellCheck={false}
              className="h-12 w-full rounded-2xl border border-transparent bg-surface-muted pl-11 pr-4 font-mono text-sm font-semibold tracking-wide text-strong placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:text-muted focus:border-electric-500 focus:bg-surface focus:outline-none focus:ring-4 focus:ring-electric-500/15"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-electric-500 px-6 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgb(22_119_255/0.7)] transition-colors hover:bg-electric-400 disabled:opacity-60"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {t("trk.search")}
          </button>
        </div>
      </form>

      {/* Demo IDs */}
      <div className="mx-auto mt-4 flex max-w-2xl flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-medium text-slate">{t("trk.quick")}</span>
        {demoTrackingIds.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setQuery(id);
              search(id);
            }}
            className="rounded-full border border-soft bg-surface px-3 py-1 font-mono text-xs font-semibold text-ink transition-colors hover:border-electric-400 hover:text-electric-600 dark:hover:text-electric-400"
          >
            {id}
          </button>
        ))}
      </div>

      {/* States */}
      <div className="relative z-10 mx-auto mt-10 max-w-6xl">
        <AnimatePresence mode="wait">
          {view.kind === "idle" ? (
            <motion.div
              key="idle"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="mx-auto flex max-w-lg flex-col items-center rounded-3xl border border-dashed border-soft bg-surface/60 px-8 py-14 text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-electric-100 text-electric-600">
                <PackageSearch className="h-7 w-7" strokeWidth={1.6} />
              </span>
              <h2 className="mt-5 font-display text-xl font-bold text-navy-900 dark:text-white">
                {t("trk.idleTitle")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate dark:text-navy-200">
                {t("trk.idleSub")}
              </p>
            </motion.div>
          ) : null}

          {view.kind === "loading" ? (
            <motion.div
              key="loading"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              className="grid gap-6 lg:grid-cols-2"
              aria-busy="true"
              aria-label="Loading shipment"
            >
              <div className="space-y-6">
                <Skeleton className="h-24 w-full rounded-2xl" />
                <div className="grid grid-cols-2 gap-6">
                  <Skeleton className="h-28 w-full rounded-2xl" />
                  <Skeleton className="h-28 w-full rounded-2xl" />
                  <Skeleton className="h-28 w-full rounded-2xl" />
                  <Skeleton className="h-28 w-full rounded-2xl" />
                </div>
                <Skeleton className="h-40 w-full rounded-2xl" />
              </div>
              <Skeleton className="h-96 w-full rounded-2xl" />
            </motion.div>
          ) : null}

          {view.kind === "error" ? (
            <motion.div
              key="error"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="mx-auto flex max-w-lg flex-col items-center rounded-3xl border border-orange-200 bg-orange-50/70 px-8 py-12 text-center dark:border-orange-500/30 dark:bg-orange-500/10"
              role="alert"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
                <AlertCircle className="h-7 w-7" strokeWidth={1.6} />
              </span>
              <h2 className="mt-5 font-display text-xl font-bold text-navy-900 dark:text-white">
                {t("trk.notFound")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate dark:text-navy-200">{view.message}</p>
              <button
                type="button"
                onClick={() => setView({ kind: "idle" })}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-electric-600 hover:text-electric-500"
              >
                <XCircle className="h-4 w-4" />
                {t("trk.clear")}
              </button>
            </motion.div>
          ) : null}

          {view.kind === "result" ? (
            <motion.div
              key="result"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <TrackingResult shipment={view.data.shipment} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
