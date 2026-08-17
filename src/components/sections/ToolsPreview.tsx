"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { COUNTRIES, estimateFreight, type FreightMode } from "@/lib/geo";
import { lookupShipment } from "@/lib/tracking";
import { useLang } from "@/lib/i18n";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";

/** Mode tabs — all four are real, computed modes of the pricing model. */
const MODES: { id: FreightMode; labelKey: string }[] = [
  { id: "ftl", labelKey: "calc.mode.ftl" },
  { id: "ltl", labelKey: "calc.mode.ltl" },
  { id: "express", labelKey: "calc.mode.express" },
  { id: "reefer", labelKey: "calc.mode.reefer" },
];

const PALLETS_BY_MODE: Record<FreightMode, number> = {
  ftl: 13,
  ltl: 4,
  express: 6,
  reefer: 13,
  oversized: 13,
  van: 1,
  small: 4,
};

const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);

export function ToolsPreview() {
  const router = useRouter();
  const { t, lang } = useLang();

  const [mode, setMode] = useState<FreightMode>("ftl");
  const [from, setFrom] = useState("GE|tbilisi");
  const [to, setTo] = useState("DE|berlin");
  const [weight, setWeight] = useState("8400");

  const estimate = useMemo(() => {
    const [originCountry, originCity] = from.split("|");
    const [destCountry, destCity] = to.split("|");
    return estimateFreight({
      originCountry,
      originCity,
      destCountry,
      destCity,
      cargoType: mode,
      pallets: PALLETS_BY_MODE[mode],
      weightKg: Number(weight) || 0,
    });
  }, [mode, from, to, weight]);

  const sameCity = from === to;

  const shipment = useMemo(() => lookupShipment("CRG-582941", lang), [lang]);
  const nextEvent =
    shipment?.checkpoints.find((c) => c.status === "pending") ??
    shipment?.checkpoints[shipment.checkpoints.length - 1];

  const originCity = shipment?.origin.split(",")[0] ?? "";
  const destCity = shipment?.destination.split(",")[0] ?? "";

  return (
    <section className="border-b border-white/10 bg-ink-950">
      <div className="mx-auto max-w-[80rem] px-5 py-16 sm:px-8 lg:py-24">
        <SectionHeading
          index="03"
          eyebrow={t("tp.eyebrow")}
          dark
          title={
            <>
              {t("tp.title1")} <span className="text-fog-500">{t("tp.title2")}</span>
            </>
          }
          description={t("tp.lead")}
        />

        <div className="mt-12 grid gap-px bg-white/[0.06] lg:grid-cols-2">
          {/* Rate engine */}
          <div className="bg-ink-900 p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <p className="label text-fog-500">{t("tp.rateEngine")}</p>
              <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-fog-600">
                {t("tp.liveCost")}
              </span>
            </div>

            {/* Mode tabs */}
            <div className="mt-5 grid grid-cols-4 gap-px bg-white/[0.08]">
              {MODES.map((m) => {
                const active = m.id === mode;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id)}
                    aria-pressed={active}
                    className={cn(
                      "px-2 py-2.5 text-[11px] font-medium uppercase tracking-[0.06em] transition-colors duration-150",
                      active ? "bg-signal text-ink-950" : "bg-ink-900 text-fog-500 hover:text-fog-200",
                    )}
                  >
                    {t(m.labelKey as never)}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Field label={t("tp.collection")}>
                <CitySelect value={from} onChange={setFrom} />
              </Field>
              <Field label={t("tp.delivery")}>
                <CitySelect value={to} onChange={setTo} />
              </Field>
            </div>

            <div className="mt-3">
              <Field label={t("tp.grossWeight")}>
                <div className="relative">
                  <input
                    inputMode="numeric"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value.replace(/[^0-9]/g, ""))}
                    className="h-11 w-full border border-white/10 bg-white/[0.03] px-3 pr-14 font-mono text-[13px] text-fog-50 tnum transition-colors duration-150 focus:border-signal focus:outline-none"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.12em] text-fog-600">
                    kg
                  </span>
                </div>
              </Field>
            </div>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-5">
              <div>
                <p className="label mb-2 text-fog-500">{t("tp.indicative")}</p>
                <p className="font-mono text-[32px] leading-none text-fog-50 tnum">
                  {sameCity || !estimate ? "—" : `€${fmt(estimate.totalEur)}`}
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-fog-600">
                  {sameCity
                    ? t("tp.selectTwo")
                    : estimate
                      ? `${fmt(estimate.km)} km · ${estimate.transitDays} ${t("calc.days")} ${t("tp.transit")}`
                      : "—"}
                </p>
              </div>
              <button
                type="button"
                disabled={sameCity}
                onClick={() => router.push("/quote")}
                className="group inline-flex items-center gap-2 bg-signal px-4 py-3 text-[13px] font-medium text-ink-950 transition-colors duration-150 hover:bg-signal-400 disabled:opacity-40"
              >
                {t("tp.refine")}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Shipment console */}
          <div className="bg-ink-900 p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <p className="label text-fog-500">{t("tp.console")}</p>
              <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-fog-600">
                {t("tp.sample")}
              </span>
            </div>

            {shipment ? (
              <>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 bg-signal px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-950">
                    <span className="h-1.5 w-1.5 rounded-full bg-ink-950/70" aria-hidden="true" />
                    {t(`trk.shipmentStatus.${shipment.status}` as never)}
                  </span>
                  <span className="font-mono text-[15px] text-fog-50 tnum">{shipment.id}</span>
                </div>

                {/* Progress rail */}
                <div className="mt-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="label mb-1.5 text-fog-600">{t("trk.origin")}</p>
                      <p className="font-mono text-[13px] text-fog-50">{originCity}</p>
                    </div>
                    <div className="pb-1 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-fog-600">
                      {Math.round(shipment.progress)}% {t("tp.complete")}
                    </div>
                    <div className="text-right">
                      <p className="label mb-1.5 text-fog-600">{t("trk.destination")}</p>
                      <p className="font-mono text-[13px] text-fog-50">{destCity}</p>
                    </div>
                  </div>
                  <div className="relative mt-4 h-[3px] w-full bg-white/10">
                    <div
                      className="absolute inset-y-0 left-0 bg-signal"
                      style={{ width: `${shipment.progress}%` }}
                    />
                    <span
                      className="absolute -top-[3px] h-[9px] w-[9px] -translate-x-1/2 rounded-full bg-signal"
                      style={{ left: `${shipment.progress}%` }}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-x-8">
                  <ConsoleRow label={t("tp.nextMilestone")} value={nextEvent?.label ?? "—"} />
                  <ConsoleRow label={t("tp.scheduled")} value={nextEvent?.timestamp ?? "—"} mono />
                  <ConsoleRow label={t("tp.equipment")} value={shipment.cargo.vehicle} />
                  <ConsoleRow label={t("tp.consignment")} value={shipment.cargo.weight} />
                </dl>

                <Link
                  href={`/tracking?code=${shipment.id}`}
                  className="group mt-6 inline-flex items-center gap-2 border border-white/15 px-4 py-3 text-[13px] text-fog-200 transition-colors duration-150 hover:border-white/35 hover:text-fog-50"
                >
                  {t("tp.openConsole")}
                  <ArrowRight className="h-3.5 w-3.5 text-signal transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </>
            ) : (
              <p className="mt-5 text-[13px] text-fog-500">—</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label mb-1.5 block text-fog-600">{label}</span>
      {children}
    </label>
  );
}

function CitySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { lang } = useLang();
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full border border-white/10 bg-ink-900 px-3 font-mono text-[11.5px] uppercase tracking-[0.04em] text-fog-50 transition-colors duration-150 focus:border-signal focus:outline-none"
    >
      {COUNTRIES.flatMap((country) =>
        country.cities.map((city) => (
          <option key={`${country.code}|${city.id}`} value={`${country.code}|${city.id}`}>
            {city.name.toUpperCase()} — {city.name}, {lang === "ka" ? country.nameKa : country.name}
          </option>
        )),
      )}
    </select>
  );
}

function ConsoleRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="border-b border-white/[0.07] py-2.5">
      <dt className="label mb-1.5 text-fog-600">{label}</dt>
      <dd className={mono ? "font-mono text-[12px] text-fog-200 tnum" : "text-[13px] text-fog-200"}>
        {value}
      </dd>
    </div>
  );
}
