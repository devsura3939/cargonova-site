"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  MapPin,
  Package,
  Truck,
  User,
  ClipboardCheck,
  Snowflake,
  PhoneCall,
} from "lucide-react";
import { quoteSchema, type QuoteInput } from "@/lib/validations";
import { submitQuoteRequest } from "@/lib/quote";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

const STEPS = [
  { id: "route", labelKey: "quote.step.route" as const, icon: MapPin },
  { id: "cargo", labelKey: "quote.step.cargo" as const, icon: Package },
  { id: "transport", labelKey: "quote.step.transport" as const, icon: Truck },
  { id: "customer", labelKey: "quote.step.customer" as const, icon: User },
  { id: "review", labelKey: "quote.step.review" as const, icon: ClipboardCheck },
];

const CARGO_TYPES = [
  "Palletized goods",
  "Full truckload",
  "Partial load (LTL)",
  "Temperature controlled",
  "Oversized / heavy",
  "Express / urgent",
  "Packaged parcels",
  "Other",
];

const COUNTRIES = [
  "Germany",
  "Netherlands",
  "France",
  "Poland",
  "Austria",
  "Switzerland",
  "Czechia",
  "Italy",
  "Denmark",
  "Belgium",
  "Spain",
  "Romania",
  "Türkiye",
  "Georgia",
  "Other",
];

function Field({
  label,
  htmlFor,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className="mb-1.5 block">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function QuoteForm({ prefill }: { prefill?: Partial<QuoteInput> }) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [reference, setReference] = useState("");
  const reduceMotion = useReducedMotion();
  const { t } = useLang();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    control,
    formState: { errors },
  } = useForm<z.input<typeof quoteSchema>, unknown, z.output<typeof quoteSchema>>({
    resolver: zodResolver(quoteSchema),
    mode: "onTouched",
    defaultValues: {
      urgency: "standard",
      refrigerationRequired: false,
      cargoType: "",
      pickupCountry: "",
      pickupCity: prefill?.pickupCity ?? "",
      destinationCountry: "",
      destinationCity: prefill?.destinationCity ?? "",
      weight: prefill?.weight,
      transportDate: prefill?.transportDate,
      name: "",
      company: "",
      phone: "",
      email: "",
      ...prefill,
    },
  });

  const values = watch();

  const stepFields: (keyof QuoteInput)[][] = [
    ["pickupCountry", "pickupCity", "destinationCountry", "destinationCity"],
    ["cargoType", "cargoDescription", "weight", "pallets", "volume", "length", "width", "height"],
    ["transportDate", "urgency", "refrigerationRequired", "specialRequirements"],
    ["name", "company", "phone", "email"],
    [],
  ];

  async function next() {
    const ok = await trigger(stepFields[step] as (keyof QuoteInput)[]);
    if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function onSubmit(data: QuoteInput) {
    setStatus("submitting");
    const result = await submitQuoteRequest(data);
    if (result.ok) {
      setReference(result.reference);
      setStatus("done");
      trackEvent("quote_completed", { reference: result.reference });
    } else {
      setStatus("error");
    }
  }

  const summaryRows = useMemo(() => {
    const rows: { label: string; value: string }[] = [
      { label: t("quote.sum.pickup"), value: [values.pickupCity, values.pickupCountry].filter(Boolean).join(", ") },
      { label: t("quote.sum.delivery"), value: [values.destinationCity, values.destinationCountry].filter(Boolean).join(", ") },
      { label: t("quote.sum.cargoType"), value: values.cargoType },
      { label: t("quote.sum.weight"), value: values.weight ? `${values.weight} kg` : "—" },
      { label: t("quote.sum.pallets"), value: values.pallets ? String(values.pallets) : "—" },
      { label: t("quote.sum.volume"), value: values.volume ? `${values.volume} m³` : "—" },
      { label: t("quote.sum.dimensions"), value: [values.length, values.width, values.height].some(Boolean) ? `${values.length || "?"} × ${values.width || "?"} × ${values.height || "?"} m` : "—" },
      { label: t("quote.sum.date"), value: values.transportDate || t("quote.asap") },
      { label: t("quote.sum.urgency"), value: values.urgency === "standard" ? t("quote.urgencyStandard") : values.urgency === "priority" ? t("quote.urgencyPriority") : t("quote.urgencyExpress") },
      { label: t("quote.sum.refrig"), value: values.refrigerationRequired ? t("quote.required") : t("quote.notRequired") },
      { label: t("quote.sum.contact"), value: `${values.name}${values.company ? ` · ${values.company}` : ""}` },
      { label: t("quote.sum.email"), value: values.email || "—" },
      { label: t("quote.sum.phone"), value: values.phone || "—" },
    ];
    if (values.specialRequirements) rows.push({ label: t("quote.sum.special"), value: values.specialRequirements });
    return rows;
  }, [values, t]);

  /* ── Success screen ─────────────────────────────────── */
  if (status === "done") {
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-xl rounded-3xl border border-soft bg-surface p-10 text-center shadow-lift sm:p-12"
        role="status"
      >
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20">
          <Check className="h-8 w-8" />
        </span>
        <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-strong">
          {t("quote.successTitle")}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          {t("quote.successSub")}{" "}
          <span className="font-mono font-bold text-electric-600 dark:text-electric-400">{reference}</span>
          {t("quote.successSub2")}
        </p>
        <div className="mt-8 rounded-2xl bg-surface-muted p-5 text-left text-sm leading-relaxed text-ink">
          <p className="font-semibold text-strong">{t("quote.whatNext")}</p>
          <ol className="mt-2 list-inside list-decimal space-y-1">
            <li>{t("quote.next1")}</li>
            <li>{t("quote.next2")}</li>
            <li>{t("quote.next3")}</li>
          </ol>
        </div>
        <Button asChild size="lg" className="mt-8">
          <Link href="/tracking">{t("quote.trackFirst")}</Link>
        </Button>
      </motion.div>
    );
  }

  /* ── Form ───────────────────────────────────────────── */
  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress */}
      <ol className="mb-10 flex items-center gap-0" aria-label="Quote progress">
        {STEPS.map((s, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <li key={s.id} className={cn("flex items-center", i < STEPS.length - 1 && "flex-1")}>
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={cn(
                  "group flex items-center gap-2",
                  i > step && "cursor-not-allowed",
                )}
                aria-current={active ? "step" : undefined}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                    done && "bg-electric-500 text-white",
                    active && "bg-navy-850 text-white ring-4 ring-electric-500/25",
                    !done && !active && "border-2 border-navy-200 bg-white text-navy-300 dark:border-white/20 dark:bg-transparent dark:text-navy-400",
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "hidden text-sm font-semibold sm:block",
                    active ? "text-strong" : done ? "text-electric-600" : "text-muted",
                  )}
                >
                  {t(s.labelKey)}
                </span>
              </button>
              {i < STEPS.length - 1 ? (
                <span
                  className={cn(
                    "mx-2 h-px flex-1 transition-colors duration-500 sm:mx-3",
                    i < step ? "bg-electric-500" : "bg-navy-200 dark:bg-white/15",
                  )}
                  aria-hidden="true"
                />
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="relative overflow-hidden rounded-3xl border border-soft bg-surface p-6 shadow-lift sm:p-10">
        {status === "error" ? (
          <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-500/15 dark:text-red-400" role="alert">
            {t("quote.error")}
          </p>
        ) : null}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduceMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {step === 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <h2 className="flex items-center gap-2 font-display text-xl font-bold text-strong">
                    <MapPin className="h-5 w-5 text-electric-500" /> {t("quote.heading.route")}
                  </h2>
                </div>
                <Field label={t("quote.pickupCountry")} error={errors.pickupCountry?.message}>
                  <Controller
                    control={control}
                    name="pickupCountry"
                    render={({ field }) => (
                      <Select value={field.value || undefined} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("quote.selectCountry")} />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
                <Field label={t("quote.pickupCity")} htmlFor="pickupCity" error={errors.pickupCity?.message}>
                  <Input id="pickupCity" placeholder="e.g. Berlin" {...register("pickupCity")} invalid={!!errors.pickupCity} />
                </Field>
                <Field label={t("quote.destCountry")} error={errors.destinationCountry?.message}>
                  <Controller
                    control={control}
                    name="destinationCountry"
                    render={({ field }) => (
                      <Select value={field.value || undefined} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("quote.selectCountry")} />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
                <Field label={t("quote.destCity")} htmlFor="destinationCity" error={errors.destinationCity?.message}>
                  <Input id="destinationCity" placeholder={t("quote.exampleCity")} {...register("destinationCity")} invalid={!!errors.destinationCity} />
                </Field>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <h2 className="flex items-center gap-2 font-display text-xl font-bold text-strong">
                    <Package className="h-5 w-5 text-electric-500" /> {t("quote.heading.cargo")}
                  </h2>
                </div>
                <Field label={t("quote.cargoType")} error={errors.cargoType?.message} className="sm:col-span-2">
                  <Controller
                    control={control}
                    name="cargoType"
                    render={({ field }) => (
                      <Select value={field.value || undefined} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("quote.selectCargo")} />
                        </SelectTrigger>
                        <SelectContent>
                          {CARGO_TYPES.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
                <Field label={t("quote.description")} htmlFor="cargoDescription" className="sm:col-span-2">
                  <Input id="cargoDescription" placeholder="e.g. Industrial components, palletized" {...register("cargoDescription")} />
                </Field>
                <Field label={t("quote.weight")} htmlFor="weight" error={errors.weight?.message}>
                  <Input id="weight" type="number" min="1" placeholder="e.g. 4500" {...register("weight")} invalid={!!errors.weight} />
                </Field>
                <Field label={t("quote.pallets")} htmlFor="pallets" error={errors.pallets?.message}>
                  <Input id="pallets" type="number" min="1" max="100" placeholder="e.g. 6" {...register("pallets")} invalid={!!errors.pallets} />
                </Field>
                <Field label={t("quote.volume")} htmlFor="volume" error={errors.volume?.message}>
                  <Input id="volume" type="number" step="0.1" min="0.1" placeholder="e.g. 24" {...register("volume")} invalid={!!errors.volume} />
                </Field>
                <div />
                <Field label={t("quote.length")} htmlFor="length" error={errors.length?.message}>
                  <Input id="length" type="number" step="0.1" placeholder="e.g. 2.4" {...register("length")} invalid={!!errors.length} />
                </Field>
                <Field label={t("quote.width")} htmlFor="width" error={errors.width?.message}>
                  <Input id="width" type="number" step="0.1" placeholder="e.g. 1.2" {...register("width")} invalid={!!errors.width} />
                </Field>
                <Field label={t("quote.height")} htmlFor="height" error={errors.height?.message}>
                  <Input id="height" type="number" step="0.1" placeholder="e.g. 1.5" {...register("height")} invalid={!!errors.height} />
                </Field>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <h2 className="flex items-center gap-2 font-display text-xl font-bold text-strong">
                    <Truck className="h-5 w-5 text-electric-500" /> {t("quote.heading.transport")}
                  </h2>
                </div>
                <Field label={t("quote.date")} htmlFor="transportDate" error={errors.transportDate?.message}>
                  <Input id="transportDate" type="date" {...register("transportDate")} invalid={!!errors.transportDate} />
                </Field>
                <Field label={t("quote.urgency")}>
                  <Controller
                    control={control}
                    name="urgency"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">{t("quote.urgencyStandard")}</SelectItem>
                          <SelectItem value="priority">{t("quote.urgencyPriority")}</SelectItem>
                          <SelectItem value="express">{t("quote.urgencyExpress")}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Controller
                    control={control}
                    name="refrigerationRequired"
                    render={({ field }) => (
                      <button
                        type="button"
                        role="switch"
                        aria-checked={field.value}
                        onClick={() => field.onChange(!field.value)}
                        className={cn(
                          "flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all duration-200",
                          field.value
                            ? "border-cyan-400 bg-cyan-100/50 ring-2 ring-cyan-400/30"
                            : "border-soft bg-surface hover:border-soft-strong",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", field.value ? "bg-cyan-500 text-white" : "bg-surface-muted text-navy-400 dark:text-navy-300")}>
                            <Snowflake className="h-5 w-5" />
                          </span>
                          <span>
                            <span className="block text-sm font-bold text-strong">{t("quote.refrigeration")}</span>
                            <span className="block text-xs text-muted">{t("quote.refrigerationSub")}</span>
                          </span>
                        </span>
                        <span
                          className={cn(
                            "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
                            field.value ? "bg-cyan-500" : "bg-soft-strong dark:bg-white/20",
                          )}
                          aria-hidden="true"
                        >
                          <span
                            className={cn(
                              "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200",
                              field.value ? "left-[22px]" : "left-0.5",
                            )}
                          />
                        </span>
                      </button>
                    )}
                  />
                </div>
                <Field label={t("quote.special")} htmlFor="specialRequirements" className="sm:col-span-2">
                  <Textarea id="specialRequirements" placeholder="Loading equipment, appointment windows, hazardous notes, delivery instructions…" {...register("specialRequirements")} />
                </Field>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <h2 className="flex items-center gap-2 font-display text-xl font-bold text-strong">
                    <User className="h-5 w-5 text-electric-500" /> {t("quote.heading.customer")}
                  </h2>
                </div>
                <Field label={t("quote.name")} htmlFor="name" error={errors.name?.message}>
                  <Input id="name" placeholder="e.g. Anna Meyer" {...register("name")} invalid={!!errors.name} />
                </Field>
                <Field label={t("quote.company")} htmlFor="company" error={errors.company?.message}>
                  <Input id="company" placeholder="e.g. Meyer Manufacturing GmbH" {...register("company")} invalid={!!errors.company} />
                </Field>
                <Field label={t("quote.phone")} htmlFor="phone" error={errors.phone?.message}>
                  <Input id="phone" type="tel" placeholder="+49 30 …" {...register("phone")} invalid={!!errors.phone} />
                </Field>
                <Field label={t("quote.email")} htmlFor="email" error={errors.email?.message}>
                  <Input id="email" type="email" placeholder="you@company.com" {...register("email")} invalid={!!errors.email} />
                </Field>
                <p className="flex items-center gap-2 text-xs text-muted sm:col-span-2">
                  <PhoneCall className="h-3.5 w-3.5 shrink-0 text-electric-500" />
                  {t("quote.prefersPhone")}
                </p>
              </div>
            ) : null}

            {step === 4 ? (
              <div>
                <h2 className="flex items-center gap-2 font-display text-xl font-bold text-strong">
                  <ClipboardCheck className="h-5 w-5 text-electric-500" /> {t("quote.reviewTitle")}
                </h2>
                <p className="mt-1.5 text-sm text-muted">
                  {t("quote.reviewSub")}
                </p>
                <dl className="mt-6 grid gap-x-8 gap-y-3 rounded-2xl bg-surface-muted p-6 text-sm sm:grid-cols-2">
                  {summaryRows.map((row) => (
                    <div key={row.label} className="flex justify-between gap-4 border-b border-soft pb-2.5">
                      <dt className="shrink-0 font-medium text-muted">{row.label}</dt>
                      <dd className="text-right font-semibold text-strong">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-xs leading-relaxed text-muted">
                  {t("quote.agree")}{" "}
                  <Link href="/terms" className="font-semibold text-electric-600 underline decoration-electric-300 underline-offset-2 dark:text-electric-400">terms of service</Link>{" "}
                  {t("quote.and")}{" "}
                  <Link href="/privacy" className="font-semibold text-electric-600 underline decoration-electric-300 underline-offset-2 dark:text-electric-400">privacy policy</Link>.
                </p>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-4 border-t border-navy-100 pt-6 dark:border-white/10">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            disabled={step === 0 || status === "submitting"}
            className={cn(step === 0 && "invisible")}
          >
            <ArrowLeft className="h-4 w-4" />
            {t("common.back")}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={next} size="lg">
              {t("common.continue")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              size="lg"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("quote.submitting")}
                </>
              ) : (
                <>
                  {t("quote.submit")}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
