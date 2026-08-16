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
import { useLang } from "@/lib/i18n";

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
  const { t } = useLang();
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
        <h3 className="mt-5 font-display text-xl font-bold text-strong">{t("contact.sentTitle")}</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
          {t("contact.sentSub")}
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setStatus("idle")}>
          {t("contact.sendAnother")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5" noValidate>
      {status === "error" ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600" role="alert">
          {t("contact.error")}
        </p>
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("contact.name")} htmlFor="contact-name" error={errors.name?.message}>
          <Input id="contact-name" placeholder={t("contact.namePh")} {...register("name")} invalid={!!errors.name} />
        </Field>
        <Field label={t("contact.department")}>
          <Controller
            control={control}
            name="department"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">{t("contact.deptSales")}</SelectItem>
                  <SelectItem value="support">{t("contact.deptSupport")}</SelectItem>
                  <SelectItem value="general">{t("contact.deptGeneral")}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label={t("contact.email")} htmlFor="contact-email" error={errors.email?.message}>
          <Input id="contact-email" type="email" placeholder={t("contact.emailPh")} {...register("email")} invalid={!!errors.email} />
        </Field>
        <Field label={t("contact.phone")} htmlFor="contact-phone" error={errors.phone?.message}>
          <Input id="contact-phone" type="tel" placeholder={t("contact.phonePh")} {...register("phone")} invalid={!!errors.phone} />
        </Field>
        <Field label={t("contact.subject")} htmlFor="contact-subject" error={errors.subject?.message} className="sm:col-span-2">
          <Input id="contact-subject" placeholder={t("contact.subjectPh")} {...register("subject")} invalid={!!errors.subject} />
        </Field>
        <Field label={t("contact.message")} htmlFor="contact-message" error={errors.message?.message} className="sm:col-span-2">
          <Textarea id="contact-message" rows={6} placeholder={t("contact.messagePh")} {...register("message")} invalid={!!errors.message} />
        </Field>
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted">{t("contact.replyNote")}</p>
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> {t("contact.sending")}
            </>
          ) : (
            <>
              {t("contact.send")}
              <Send className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
