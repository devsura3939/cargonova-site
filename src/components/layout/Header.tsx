"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Menu, Moon, Sun, Globe, ChevronDown, Info, Globe2, Phone } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useTheme } from "@/lib/theme";
import { useLang, type Lang, type DictKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Main navigation: short and flat. Company & Network are one item with a small
 *  dropdown (About, Coverage & Routes, Contact). Everything else is in the footer. */
const NAV: { href: string; key: DictKey }[] = [
  { href: "/services", key: "nav.services" },
  { href: "/industries", key: "nav.industries" },
  { href: "/tracking", key: "nav.tracking" },
  { href: "/live-map", key: "nav.liveMap" },
];

const COMPANY_LINKS: { href: string; key: DictKey; icon: typeof Info }[] = [
  { href: "/about", key: "nav.about", icon: Info },
  { href: "/coverage", key: "nav.coverage", icon: Globe2 },
  { href: "/contact", key: "nav.contact", icon: Phone },
];

export function Header() {
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 24,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { t, lang, setLang } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <>
      <motion.header
        initial={reduceMotion ? false : { y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          solid
            ? "border-b border-white/10 bg-navy-900/90 shadow-[0_8px_32px_-12px_rgb(0_0_0/0.5)] backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-[100rem] items-center justify-between gap-3 px-4 sm:h-18 sm:px-6 lg:px-8">
          <Logo dark />

          {/* Desktop nav */}
          <nav aria-label="Main" className="hidden items-center gap-0.5 xl:flex">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200",
                    active ? "text-white" : "text-navy-200 hover:text-white",
                  )}
                >
                  {t(item.key)}
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-cyan-400 transition-transform duration-300 group-hover:scale-x-100",
                      active && "scale-x-100",
                    )}
                  />
                </Link>
              );
            })}

            {/* Company — one item, small dropdown (About · Coverage · Contact) */}
            <div
              className="relative"
              onMouseEnter={() => setCompanyOpen(true)}
              onMouseLeave={() => setCompanyOpen(false)}
            >
              <button
                type="button"
                onClick={() => setCompanyOpen((v) => !v)}
                aria-expanded={companyOpen}
                aria-haspopup="menu"
                className={cn(
                  "group relative flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200",
                  COMPANY_LINKS.some((l) => pathname.startsWith(l.href))
                    ? "text-white"
                    : "text-navy-200 hover:text-white",
                )}
              >
                {t("nav.company")}
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition-transform duration-200", companyOpen && "rotate-180")}
                />
                <span
                  className={cn(
                    "absolute inset-x-3 -bottom-0.5 h-px origin-left bg-cyan-400 transition-transform duration-300",
                    COMPANY_LINKS.some((l) => pathname.startsWith(l.href)) || companyOpen
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </button>

              <AnimatePresence>
                {companyOpen ? (
                  <motion.div
                    role="menu"
                    initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
                    className="absolute left-1/2 top-full z-50 mt-3 w-64 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/12 bg-navy-900/95 p-1.5 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.6)] backdrop-blur-xl"
                  >
                    {COMPANY_LINKS.map((l) => {
                      const active = pathname.startsWith(l.href);
                      return (
                        <Link
                          key={l.href}
                          href={l.href}
                          onClick={() => setCompanyOpen(false)}
                          role="menuitem"
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-150",
                            active
                              ? "bg-white/10 text-white"
                              : "text-navy-200 hover:bg-white/5 hover:text-white",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                              active ? "bg-cyan-500/15 text-cyan-400" : "bg-white/5 text-navy-300",
                            )}
                          >
                            <l.icon className="h-4 w-4" />
                          </span>
                          {t(l.key)}
                          <ArrowRight
                            className={cn(
                              "ml-auto h-3.5 w-3.5 transition-transform duration-200",
                              active ? "text-cyan-400" : "text-navy-400 group-hover:translate-x-0.5",
                            )}
                          />
                        </Link>
                      );
                    })}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right actions */}
          <div className="hidden shrink-0 items-center gap-1.5 xl:flex">
            {/* Language toggle */}
            <div
              className="flex items-center rounded-full border border-white/12 bg-white/5 p-0.5 backdrop-blur"
              role="group"
              aria-label="Language"
            >
              <Globe className="ml-2 h-3.5 w-3.5 shrink-0 text-navy-300" />
              {(["en", "ka"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className={cn(
                    "rounded-full px-2 py-1 text-xs font-bold transition-colors",
                    lang === l ? "bg-white text-navy-900" : "text-navy-200 hover:text-white",
                  )}
                >
                  {l === "en" ? "EN" : "ქარ"}
                </button>
              ))}
            </div>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t("theme.toggle")}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-navy-200 transition-colors hover:bg-white/10 hover:text-white"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Button asChild size="default" className="whitespace-nowrap">
              <Link href="/quote">
                {t("nav.getQuote")}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-1.5 xl:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t("theme.toggle")}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "ka" : "en")}
              aria-label="Language"
              className="inline-flex h-10 shrink-0 items-center rounded-full px-2 text-xs font-bold text-white transition-colors hover:bg-white/10"
            >
              {lang === "en" ? "EN" : "ქარ"}
            </button>
            <Button asChild size="sm" className="h-10 whitespace-nowrap">
              <Link href="/quote">{t("nav.getQuote")}</Link>
            </Button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
            >
              {menuOpen ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
