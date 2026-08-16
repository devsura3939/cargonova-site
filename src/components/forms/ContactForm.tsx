"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Loader2, Send } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

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

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<z.input<typeof contactSchema>, unknown, z.output<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { department: "general", phone: "" },
  });

  async function onSubmit(data: ContactInput) {
    setStatus("submitting");
    // Mocked submission — replace with a server action calling the contact service.
    await new Promise((r) => setTimeout(r, 800));
    trackEvent("contact_submitted", { department: data.department });
    reset();
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-emerald-200 bg-emerald-50/60 p-10 text-center" role="status">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-display text-xl font-bold text-strong">Message sent</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Thanks for reaching out. Our team replies within one business day — faster for
          active shipments.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5" noValidate>
      {status === "error" ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600" role="alert">
          Your message could not be sent. Please try again.
        </p>
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="contact-name" error={errors.name?.message}>
          <Input id="contact-name" placeholder="e.g. Anna Meyer" {...register("name")} invalid={!!errors.name} />
        </Field>
        <Field label="Department">
          <Controller
            control={control}
            name="department"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales & Quotes</SelectItem>
                  <SelectItem value="support">Logistics Support</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label="Email" htmlFor="contact-email" error={errors.email?.message}>
          <Input id="contact-email" type="email" placeholder="you@company.com" {...register("email")} invalid={!!errors.email} />
        </Field>
        <Field label="Phone (optional)" htmlFor="contact-phone" error={errors.phone?.message}>
          <Input id="contact-phone" type="tel" placeholder="+49 30 …" {...register("phone")} invalid={!!errors.phone} />
        </Field>
        <Field label="Subject" htmlFor="contact-subject" error={errors.subject?.message} className="sm:col-span-2">
          <Input id="contact-subject" placeholder="e.g. Quote for FTL Berlin → Warsaw" {...register("subject")} invalid={!!errors.subject} />
        </Field>
        <Field label="Message" htmlFor="contact-message" error={errors.message?.message} className="sm:col-span-2">
          <Textarea id="contact-message" rows={6} placeholder="Tell us about your shipment or question…" {...register("message")} invalid={!!errors.message} />
        </Field>
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted">We reply within one business day.</p>
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send Message
              <Send className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
