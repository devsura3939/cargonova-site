"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LogoMark } from "@/components/layout/Logo";
import { useLang, type DictKey } from "@/lib/i18n";

const CERTIFICATIONS = ["AEO-F", "ISO 9001", "ISO 14001", "ADR", "GDP"];

const COLUMNS: {
  headingKey: "footer.services" | "footer.resources";
  links: { key: DictKey; href: string }[];
}[] = [
  {
    headingKey: "footer.services",
    links: [
      { key: "svc.title.groundFreight", href: "/services/ground-freight" },
      { key: "svc.title.ftl", href: "/services/full-truckload" },
      { key: "svc.title.ltl", href: "/services/ltl" },
      { key: "svc.title.express", href: "/services/express" },
      { key: "svc.title.refrigerated", href: "/services/refrigerated" },
      { key: "svc.title.warehousing", href: "/services/warehousing" },
    ],
  },
  {
    headingKey: "footer.resources",
    links: [
      { key: "nav.track", href: "/tracking" },
      { key: "nav.liveMap", href: "/live-map" },
      { key: "nav.getQuote", href: "/quote" },
      { key: "nav.coverage", href: "/coverage" },
      { key: "nav.industries", href: "/industries" },
      { key: "nav.insights", href: "/blog" },
    ],
  },
];

const OFFICES: { city: string; roleKey: "footer.roleHQ" | "footer.roleEast" | "footer.roleSouth"; tel: string }[] = [
  { city: "Tbilisi", roleKey: "footer.roleHQ", tel: "+995 32 255 00 00" },
  { city: "Istanbul", roleKey: "footer.roleEast", tel: "+90 212 555 44 33" },
  { city: "Berlin", roleKey: "footer.roleSouth", tel: "+49 30 1234 5678" },
];

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t border-white/10 bg-ink-950 text-fog-50">
      <div className="mx-auto max-w-[80rem] px-5 py-14 sm:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex text-fog-50">
              <span className="flex items-center gap-2.5">
                <LogoMark className="h-6 w-6" />
                <span className="flex flex-col leading-none">
                  <span className="text-[15px] font-semibold tracking-[0.16em]">
                    CARGO<span className="text-signal">NOVA</span>
                  </span>
                  <span className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.22em] text-fog-600">
                    Logistics
                  </span>
                </span>
              </span>
            </Link>
            <p className="mt-6 max-w-xs text-[14px] leading-relaxed text-fog-500">{t("footer.bio")}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {CERTIFICATIONS.map((cert) => (
                <span
                  key={cert}
                  className="border border-white/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-fog-500"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <nav key={col.headingKey} aria-label={t(col.headingKey)}>
              <p className="label mb-5 text-fog-600">{t(col.headingKey)}</p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-[14px] text-fog-300 transition-colors duration-150 hover:text-fog-50"
                    >
                      {t(link.key)}
                      <ArrowUpRight
                        className="h-3 w-3 text-fog-600 transition-colors duration-150 group-hover:text-signal"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Operations */}
          <div>
            <p className="label mb-5 text-fog-600">{t("footer.ops")}</p>
            <ul className="space-y-4">
              {OFFICES.map((office) => (
                <li key={office.city} className="border-b border-white/[0.07] pb-3">
                  <p className="text-[14px] text-fog-50">{office.city}</p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-fog-600">
                    {t(office.roleKey)}
                  </p>
                  <a
                    href={`tel:${office.tel.replace(/\s/g, "")}`}
                    className="mt-1 block font-mono text-[12px] text-fog-300 tnum transition-colors duration-150 hover:text-signal"
                  >
                    {office.tel}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-fog-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CargoNova Logistics</p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-status-ok" aria-hidden="true" />
            {t("footer.status")}
          </p>
        </div>
        <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-fog-700">
          {t("footer.disclaimer")} {t("footer.photoAttrib")}
        </p>
      </div>
    </footer>
  );
}
