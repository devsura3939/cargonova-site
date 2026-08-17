"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, PackageSearch, Loader2, XCircle, AlertCircle } from "lucide-react";
import { lookupShipment, type Shipment } from "@/lib/tracking";
import { TrackingResult } from "@/components/tracking/TrackingResult";
import { FlightResult, FlightUnavailable } from "@/components/tracking/FlightResult";
import { Skeleton } from "@/components/ui/skeleton";
import { demoTrackingIds } from "@/lib/tracking";
import { isFlightNumber, findLiveFlight, type LiveFlight } from "@/lib/live-data";
import { trackingSchema } from "@/lib/validations";
import { trackEvent } from "@/lib/analytics";
import { useLang } from "@/lib/i18n";

type ViewState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "result"; data: { ok: true; shipment: Shipment } }
  | { kind: "flight"; data: { code: string; flight: LiveFlight } }
  | { kind: "flight-gone"; data: { code: string } };

export function TrackingForm() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewState>({ kind: "idle" });
  const [isPending, startTransition] = useTransition();
  const reduceMotion = useReducedMotion();
  const { t, lang } = useLang();
  const searchParams = useSearchParams();
  const lastIdRef = useRef<string>("");

  // Deep link: /tracking?code=CRG-582941 auto-runs the lookup.
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) search(code.toUpperCase());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function search(id: string) {
    const trimmed = id.trim();
    if (!trimmed) {
      setView({ kind: "error", message: t("trk.emptyMsg") });
      return;
    }
    const code = trimmed.toUpperCase().replace(/\s+/g, "");

    // Flight numbers (TK1984, LH452…) are tracked LIVE via OpenSky ADS-B.
    if (isFlightNumber(code)) {
      lastIdRef.current = code;
      setView({ kind: "loading" });
      trackEvent("tracking_search", { id: code });
      startTransition(async () => {
        await new Promise((r) => setTimeout(r, 500));
        const flight = await findLiveFlight(code);
        if (flight) {
          setView({ kind: "flight", data: { code, flight } });
        } else {
          setView({ kind: "flight-gone", data: { code } });
        }
      });
      return;
    }

    const parsed = trackingSchema.safeParse(trimmed);
    if (!parsed.success) {
      setView({ kind: "error", message: t("trk.invalidMsg") });
      return;
    }

    lastIdRef.current = parsed.data;
    setView({ kind: "loading" });
    trackEvent("tracking_search", { id: parsed.data });

    startTransition(async () => {
      // Short delay so the loading state is visible; the lookup itself is
      // deterministic and runs fully client-side (works on static hosting).
      await new Promise((r) => setTimeout(r, 500));
      const shipment = lookupShipment(parsed.data, lang);
      if (shipment) {
        setView({ kind: "result", data: { ok: true, shipment } });
      } else {
        setView({ kind: "error", message: t("trk.notFoundMsg") });
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
        <span className="hidden h-3 w-px bg-soft sm:block" aria-hidden="true" />
        <button
          type="button"
          onClick={() => {
            setQuery("TK1984");
            search("TK1984");
          }}
          className="rounded-full border border-purple-300 bg-purple-50 px-3 py-1 font-mono text-xs font-semibold text-purple-700 transition-colors hover:border-purple-400 dark:border-purple-500/40 dark:bg-purple-500/10 dark:text-purple-300"
        >
          TK1984 ✈ {t("trk.liveFlightShort")}
        </button>
        <button
          type="button"
          onClick={() => {
            setQuery("123-45678901");
            search("123-45678901");
          }}
          className="rounded-full border border-soft bg-surface px-3 py-1 font-mono text-xs font-semibold text-ink transition-colors hover:border-electric-400 hover:text-electric-600 dark:hover:text-electric-400"
        >
          123-45678901 · AWB
        </button>
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
              <TrackingResult
                key={view.data.shipment.id}
                shipment={view.data.shipment}
                onRefresh={() => {
                  const id = lastIdRef.current;
                  if (id) search(id);
                }}
              />
            </motion.div>
          ) : null}

          {view.kind === "flight" ? (
            <motion.div
              key="flight"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <FlightResult code={view.data.code} flight={view.data.flight} />
            </motion.div>
          ) : null}

          {view.kind === "flight-gone" ? (
            <motion.div
              key="flight-gone"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <FlightUnavailable code={view.data.code} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
