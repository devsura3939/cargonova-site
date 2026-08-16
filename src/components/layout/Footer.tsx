"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Mail, Phone, MapPin, Clock } from "lucide-react";

const SOCIAL_ICONS = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
    </svg>
  ),
} as const;
import { LogoMark } from "@/components/layout/Logo";
import { brand } from "@/lib/constants";
import { newsletterSchema } from "@/lib/validations";
import { trackEvent } from "@/lib/analytics";
import { unsplashAttribution } from "@/data/images";
import { useLang } from "@/lib/i18n";

const COLUMNS: {
  heading: string;
  headingKey: "footer.services" | "footer.company" | "footer.resources" | "footer.legal";
  links: { label: string; href: string }[];
}[] = [
  {
    heading: "Services",
    headingKey: "footer.services",
    links: [
      { label: "Ground Freight", href: "/services/ground-freight" },
      { label: "Full Truckload", href: "/services/full-truckload" },
      { label: "Less-than-Truckload", href: "/services/ltl" },
      { label: "Express Cargo", href: "/services/express" },
      { label: "Refrigerated Transport", href: "/services/refrigerated" },
      { label: "Warehousing", href: "/services/warehousing" },
    ],
  },
  {
    heading: "Company",
    headingKey: "footer.company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Fleet", href: "/fleet" },
      { label: "Coverage & Routes", href: "/coverage" },
      { label: "Technology", href: "/technology" },
      { label: "Careers", href: "/careers" },
      { label: "Insights", href: "/blog" },
    ],
  },
  {
    heading: "Resources",
    headingKey: "footer.resources",
    links: [
      { label: "Track Shipment", href: "/tracking" },
      { label: "Get a Quote", href: "/quote" },
      { label: "Industries", href: "/industries" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    headingKey: "footer.legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/privacy" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const { t } = useLang();

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    const parsed = newsletterSchema.safeParse({ email });
    if (!parsed.success) {
      setState("error");
      return;
    }
    setState("loading");
    await new Promise((r) => setTimeout(r, 600));
    trackEvent("newsletter_subscribed", { email: parsed.data.email });
    setState("done");
  }

  return (
    <footer className="relative overflow-hidden bg-navy-900 text-white">
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-10 pt-16 sm:px-8 lg:px-10">
        {/* Top row: brand + newsletter */}
        <div className="flex flex-col gap-10 border-b border-white/10 pb-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-10 w-10" />
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-extrabold tracking-tight">
                  Cargo<span className="text-electric-400">Nova</span>
                </span>
                <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.32em] text-navy-300">
                  Logistics
                </span>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-navy-200">
              {brand.tagline} {t("footer.tagline")}
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { href: brand.social.linkedin, label: "LinkedIn", icon: SOCIAL_ICONS.linkedin },
                { href: brand.social.x, label: "X (Twitter)", icon: SOCIAL_ICONS.x },
                { href: brand.social.instagram, label: "Instagram", icon: SOCIAL_ICONS.instagram },
                { href: brand.social.youtube, label: "YouTube", icon: SOCIAL_ICONS.youtube },
              ].map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-navy-200 transition-all duration-200 hover:bg-electric-500 hover:text-white"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="w-full max-w-md lg:pt-1">
            <h3 className="font-display text-base font-bold">{t("footer.newsletterTitle")}</h3>
            <p className="mt-2 text-sm text-navy-200">{t("footer.newsletterSub")}</p>
            {state === "done" ? (
              <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan-500/10 px-4 py-3 text-sm font-medium text-cyan-400">
                <Check className="h-4 w-4" /> {t("footer.subscribed")}
              </p>
            ) : (
              <form onSubmit={subscribe} className="mt-4 flex gap-2">
                <label htmlFor="newsletter-email" className="sr-only">
                  {t("footer.newsletterTitle")}
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder={t("footer.newsletterPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-full border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-navy-300 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/15"
                />
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-electric-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-electric-400 disabled:opacity-60"
                >
                  {state === "loading" ? "…" : t("footer.newsletterCta")}
                  {state !== "loading" ? <ArrowRight className="h-4 w-4" /> : null}
                </button>
              </form>
            )}
            {state === "error" ? (
              <p className="mt-2 text-xs text-orange-400">Please enter a valid email address.</p>
            ) : null}
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-10 py-12 sm:grid-cols-3 lg:grid-cols-6">              {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-navy-300">
                {t(col.headingKey)}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label + link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-navy-200 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-navy-300">{t("footer.contact")}</h3>
            <ul className="mt-4 space-y-3 text-sm text-navy-200">
              <li>
                <a href={brand.contact.phoneHref} className="flex items-start gap-2.5 transition-colors hover:text-white" onClick={() => trackEvent("phone_clicked")}>
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                  {brand.contact.phone}
                </a>
              </li>
              <li>
                <a href={brand.contact.emailHref} className="flex items-start gap-2.5 transition-colors hover:text-white" onClick={() => trackEvent("email_clicked")}>
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                  {brand.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                {brand.contact.address}
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                {brand.contact.hours}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-xs text-navy-300 sm:flex-row">
          <p>© {new Date().getFullYear()} {brand.name}. {t("footer.rights")}</p>
          <p>
            Demo website — placeholder company details. Certifications shown are illustrative.{" "}
            {unsplashAttribution}
          </p>
        </div>
      </div>
    </footer>
  );
}
