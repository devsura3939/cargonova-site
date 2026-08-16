"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Loader2, Send } from "lucide-react";
import { careerSchema, type CareerInput } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { jobs } from "@/data/jobs";
import { trackEvent } from "@/lib/analytics";

export function CareerForm({ role }: { role?: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CareerInput, unknown, z.output<typeof careerSchema>>({
    resolver: zodResolver(careerSchema),
    mode: "onTouched",
    defaultValues: { role: role ?? "", phone: "" },
  });

  async function onSubmit(data: CareerInput) {
    setStatus("submitting");
    // Mocked submission — replace with a server action + ATS hook.
    await new Promise((r) => setTimeout(r, 800));
    trackEvent("career_submitted", { role: data.role });
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-emerald-200 bg-emerald-50/60 p-10 text-center" role="status">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-display text-xl font-bold text-strong">Application received</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Thanks for applying. Our talent team reviews every application and replies
          within five business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5" noValidate>
      {status === "error" ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600" role="alert">
          Your application could not be submitted. Please try again.
        </p>
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="career-name" error={errors.name?.message}>
          <Input id="career-name" placeholder="e.g. Tomasz Nowak" {...register("name")} invalid={!!errors.name} />
        </Field>
        <Field label="Applying for" error={errors.role?.message}>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((j) => (
                    <SelectItem key={j.slug} value={j.slug}>
                      {j.title}
                    </SelectItem>
                  ))}
                  <SelectItem value="open-application">Open application</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label="Email" htmlFor="career-email" error={errors.email?.message}>
          <Input id="career-email" type="email" placeholder="you@email.com" {...register("email")} invalid={!!errors.email} />
        </Field>
        <Field label="Phone (optional)" htmlFor="career-phone" error={errors.phone?.message}>
          <Input id="career-phone" type="tel" placeholder="+49 30 …" {...register("phone")} invalid={!!errors.phone} />
        </Field>
        <Field label="Why you / anything else (optional)" htmlFor="career-message" error={errors.message?.message} className="sm:col-span-2">
          <Textarea id="career-message" rows={5} placeholder="Relevant experience, notice period, questions…" {...register("message")} invalid={!!errors.message} />
        </Field>
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted">We reply to every application within five business days.</p>
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Submit Application
              <Send className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

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
        <p className="mt-1.5 text-xs font-medium text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
