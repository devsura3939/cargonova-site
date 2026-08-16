"use client";

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
import { submitQuoteAction } from "@/app/quote/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "route", label: "Route", icon: MapPin },
  { id: "cargo", label: "Cargo", icon: Package },
  { id: "transport", label: "Transport", icon: Truck },
  { id: "customer", label: "Customer", icon: User },
  { id: "review", label: "Review", icon: ClipboardCheck },
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
    const result = await submitQuoteAction(data);
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
      { label: "Pickup", value: [values.pickupCity, values.pickupCountry].filter(Boolean).join(", ") },
      { label: "Delivery", value: [values.destinationCity, values.destinationCountry].filter(Boolean).join(", ") },
      { label: "Cargo type", value: values.cargoType },
      { label: "Weight", value: values.weight ? `${values.weight} kg` : "—" },
      { label: "Pallets", value: values.pallets ? String(values.pallets) : "—" },
      { label: "Volume", value: values.volume ? `${values.volume} m³` : "—" },
      { label: "Dimensions", value: [values.length, values.width, values.height].some(Boolean) ? `${values.length || "?"} × ${values.width || "?"} × ${values.height || "?"} m` : "—" },
      { label: "Transport date", value: values.transportDate || "As soon as possible" },
      { label: "Urgency", value: values.urgency === "standard" ? "Standard" : values.urgency === "priority" ? "Priority" : "Express" },
      { label: "Refrigeration", value: values.refrigerationRequired ? "Required" : "Not required" },
      { label: "Contact", value: `${values.name}${values.company ? ` · ${values.company}` : ""}` },
      { label: "Email", value: values.email || "—" },
      { label: "Phone", value: values.phone || "—" },
    ];
    if (values.specialRequirements) rows.push({ label: "Special handling", value: values.specialRequirements });
    return rows;
  }, [values]);

  /* ── Success screen ─────────────────────────────────── */
  if (status === "done") {
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-xl rounded-3xl border border-navy-100 bg-white p-10 text-center shadow-lift sm:p-12"
        role="status"
      >
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Check className="h-8 w-8" />
        </span>
        <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-navy-900">
          Quote request received
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate sm:text-base">
          Your reference is{" "}
          <span className="font-mono font-bold text-electric-600">{reference}</span>. Our
          planning team will confirm pricing and availability within{" "}
          <span className="font-semibold text-navy-900">4 business hours</span> — for urgent
          loads, within 60 minutes.
        </p>
        <div className="mt-8 rounded-2xl bg-mist p-5 text-left text-sm leading-relaxed text-navy-700">
          <p className="font-semibold text-navy-900">What happens next:</p>
          <ol className="mt-2 list-inside list-decimal space-y-1">
            <li>You'll receive the quote by email.</li>
            <li>Confirm to lock capacity and schedule pickup.</li>
            <li>We handle the rest — you track it live.</li>
          </ol>
        </div>
        <Button asChild size="lg" className="mt-8">
          <a href="/tracking">Track your first shipment</a>
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
                    !done && !active && "border-2 border-navy-200 bg-white text-navy-300",
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "hidden text-sm font-semibold sm:block",
                    active ? "text-navy-900" : done ? "text-electric-600" : "text-navy-300",
                  )}
                >
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 ? (
                <span
                  className={cn(
                    "mx-2 h-px flex-1 transition-colors duration-500 sm:mx-3",
                    i < step ? "bg-electric-500" : "bg-navy-200",
                  )}
                  aria-hidden="true"
                />
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="relative overflow-hidden rounded-3xl border border-navy-100 bg-white p-6 shadow-lift sm:p-10">
        {status === "error" ? (
          <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600" role="alert">
            Your request could not be submitted. Please try again.
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
                  <h2 className="flex items-center gap-2 font-display text-xl font-bold text-navy-900">
                    <MapPin className="h-5 w-5 text-electric-500" /> Where is the cargo going?
                  </h2>
                </div>
                <Field label="Pickup country" error={errors.pickupCountry?.message}>
                  <Controller
                    control={control}
                    name="pickupCountry"
                    render={({ field }) => (
                      <Select value={field.value || undefined} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
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
                <Field label="Pickup city" htmlFor="pickupCity" error={errors.pickupCity?.message}>
                  <Input id="pickupCity" placeholder="e.g. Berlin" {...register("pickupCity")} invalid={!!errors.pickupCity} />
                </Field>
                <Field label="Delivery country" error={errors.destinationCountry?.message}>
                  <Controller
                    control={control}
                    name="destinationCountry"
                    render={({ field }) => (
                      <Select value={field.value || undefined} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
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
                <Field label="Delivery city" htmlFor="destinationCity" error={errors.destinationCity?.message}>
                  <Input id="destinationCity" placeholder="e.g. Tbilisi" {...register("destinationCity")} invalid={!!errors.destinationCity} />
                </Field>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <h2 className="flex items-center gap-2 font-display text-xl font-bold text-navy-900">
                    <Package className="h-5 w-5 text-electric-500" /> What are we moving?
                  </h2>
                </div>
                <Field label="Cargo type" error={errors.cargoType?.message} className="sm:col-span-2">
                  <Controller
                    control={control}
                    name="cargoType"
                    render={({ field }) => (
                      <Select value={field.value || undefined} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cargo type" />
                        </SelectTrigger>
                        <SelectContent>
                          {CARGO_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
                <Field label="Description (optional)" htmlFor="cargoDescription" className="sm:col-span-2">
                  <Input id="cargoDescription" placeholder="e.g. Industrial components, palletized" {...register("cargoDescription")} />
                </Field>
                <Field label="Weight (kg)" htmlFor="weight" error={errors.weight?.message}>
                  <Input id="weight" type="number" min="1" placeholder="e.g. 4500" {...register("weight")} invalid={!!errors.weight} />
                </Field>
                <Field label="Pallets" htmlFor="pallets" error={errors.pallets?.message}>
                  <Input id="pallets" type="number" min="1" max="100" placeholder="e.g. 6" {...register("pallets")} invalid={!!errors.pallets} />
                </Field>
                <Field label="Volume (m³, optional)" htmlFor="volume" error={errors.volume?.message}>
                  <Input id="volume" type="number" step="0.1" min="0.1" placeholder="e.g. 24" {...register("volume")} invalid={!!errors.volume} />
                </Field>
                <div />
                <Field label="Length (m, optional)" htmlFor="length" error={errors.length?.message}>
                  <Input id="length" type="number" step="0.1" placeholder="e.g. 2.4" {...register("length")} invalid={!!errors.length} />
                </Field>
                <Field label="Width (m, optional)" htmlFor="width" error={errors.width?.message}>
                  <Input id="width" type="number" step="0.1" placeholder="e.g. 1.2" {...register("width")} invalid={!!errors.width} />
                </Field>
                <Field label="Height (m, optional)" htmlFor="height" error={errors.height?.message}>
                  <Input id="height" type="number" step="0.1" placeholder="e.g. 1.5" {...register("height")} invalid={!!errors.height} />
                </Field>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <h2 className="flex items-center gap-2 font-display text-xl font-bold text-navy-900">
                    <Truck className="h-5 w-5 text-electric-500" /> When and how should it move?
                  </h2>
                </div>
                <Field label="Desired transport date" htmlFor="transportDate" error={errors.transportDate?.message}>
                  <Input id="transportDate" type="date" {...register("transportDate")} invalid={!!errors.transportDate} />
                </Field>
                <Field label="Delivery urgency">
                  <Controller
                    control={control}
                    name="urgency"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard (most economical)</SelectItem>
                          <SelectItem value="priority">Priority (faster lane)</SelectItem>
                          <SelectItem value="express">Express (dedicated vehicle)</SelectItem>
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
                            : "border-navy-200 bg-white hover:border-navy-300",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", field.value ? "bg-cyan-500 text-white" : "bg-mist text-navy-400")}>
                            <Snowflake className="h-5 w-5" />
                          </span>
                          <span>
                            <span className="block text-sm font-bold text-navy-900">Temperature-controlled transport</span>
                            <span className="block text-xs text-slate">Reefer unit, continuous logging, -25°C to +25°C</span>
                          </span>
                        </span>
                        <span
                          className={cn(
                            "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
                            field.value ? "bg-cyan-500" : "bg-navy-200",
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
                <Field label="Special handling (optional)" htmlFor="specialRequirements" className="sm:col-span-2">
                  <Textarea id="specialRequirements" placeholder="Loading equipment, appointment windows, hazardous notes, delivery instructions…" {...register("specialRequirements")} />
                </Field>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <h2 className="flex items-center gap-2 font-display text-xl font-bold text-navy-900">
                    <User className="h-5 w-5 text-electric-500" /> Who should receive the quote?
                  </h2>
                </div>
                <Field label="Full name" htmlFor="name" error={errors.name?.message}>
                  <Input id="name" placeholder="e.g. Anna Meyer" {...register("name")} invalid={!!errors.name} />
                </Field>
                <Field label="Company (optional)" htmlFor="company" error={errors.company?.message}>
                  <Input id="company" placeholder="e.g. Meyer Manufacturing GmbH" {...register("company")} invalid={!!errors.company} />
                </Field>
                <Field label="Phone" htmlFor="phone" error={errors.phone?.message}>
                  <Input id="phone" type="tel" placeholder="+49 30 …" {...register("phone")} invalid={!!errors.phone} />
                </Field>
                <Field label="Email" htmlFor="email" error={errors.email?.message}>
                  <Input id="email" type="email" placeholder="you@company.com" {...register("email")} invalid={!!errors.email} />
                </Field>
                <p className="flex items-center gap-2 text-xs text-slate sm:col-span-2">
                  <PhoneCall className="h-3.5 w-3.5 shrink-0 text-electric-500" />
                  Prefer to talk? Call +49 30 1234 5678 — urgent loads answered in minutes.
                </p>
              </div>
            ) : null}

            {step === 4 ? (
              <div>
                <h2 className="flex items-center gap-2 font-display text-xl font-bold text-navy-900">
                  <ClipboardCheck className="h-5 w-5 text-electric-500" /> Review your request
                </h2>
                <p className="mt-1.5 text-sm text-slate">
                  Check the details below, then submit. You'll receive the quote by email.
                </p>
                <dl className="mt-6 grid gap-x-8 gap-y-3 rounded-2xl bg-mist p-6 text-sm sm:grid-cols-2">
                  {summaryRows.map((row) => (
                    <div key={row.label} className="flex justify-between gap-4 border-b border-navy-100 pb-2.5">
                      <dt className="shrink-0 font-medium text-slate">{row.label}</dt>
                      <dd className="text-right font-semibold text-navy-900">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-xs leading-relaxed text-slate">
                  By submitting you agree to our{" "}
                  <a href="/terms" className="font-semibold text-electric-600 underline decoration-electric-300 underline-offset-2">terms of service</a>{" "}
                  and{" "}
                  <a href="/privacy" className="font-semibold text-electric-600 underline decoration-electric-300 underline-offset-2">privacy policy</a>.
                  No payment is taken at this stage.
                </p>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-4 border-t border-navy-100 pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            disabled={step === 0 || status === "submitting"}
            className={cn(step === 0 && "invisible")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={next} size="lg">
              Continue
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
                  Submitting…
                </>
              ) : (
                <>
                  Submit Quote Request
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
