"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Menu, Moon, Sun, Globe, ChevronDown, Info, Globe2, Phone, Search } from "lucide-react";
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
  const [code, setCode] = useState("");
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { t, lang, setLang } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Close the dropdown whenever the route changes (incl. keyboard nav).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompanyOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  const submitTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    router.push(`/tracking?code=${encodeURIComponent(code.trim())}`);
    setCode("");
    setMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={reduceMotion ? false : { y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          solid
            ? "border-b border-white/10 bg-ink-950/92 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-[80rem] items-center justify-between gap-4 px-5 sm:px-8">
          <Logo dark className="text-fog-50" />

          {/* Desktop nav */}
          <nav aria-label="Main" className="hidden items-center gap-0.5 xl:flex">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative whitespace-nowrap px-3 py-2 text-[13px] font-medium transition-colors duration-150",
                    active ? "text-fog-50" : "text-fog-500 hover:text-fog-200",
                  )}
                >
                  {t(item.key)}
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-[1px] h-[2px] origin-left bg-signal transition-transform duration-200",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
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
                  "group relative flex items-center gap-1 whitespace-nowrap px-3 py-2 text-[13px] font-medium transition-colors duration-150",
                  COMPANY_LINKS.some((l) => pathname.startsWith(l.href))
                    ? "text-fog-50"
                    : "text-fog-500 hover:text-fog-200",
                )}
              >
                {t("nav.company")}
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition-transform duration-200", companyOpen && "rotate-180")}
                />
                <span
                  className={cn(
                    "absolute inset-x-3 -bottom-[1px] h-[2px] bg-signal transition-transform duration-200",
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
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: 6 }}
                    transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
                    className="absolute left-1/2 top-full z-50 mt-3 w-64 -translate-x-1/2 border border-white/10 bg-ink-900 p-1 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.7)]"
                  >
                    {COMPANY_LINKS.map((l, i) => {
                      const active = pathname.startsWith(l.href);
                      return (
                        <Link
                          key={l.href}
                          href={l.href}
                          onClick={() => setCompanyOpen(false)}
                          role="menuitem"
                          className={cn(
                            "flex items-center gap-3 px-3.5 py-2.5 text-[13px] font-medium transition-colors duration-150",
                            active ? "bg-white/8 text-fog-50" : "text-fog-400 hover:bg-white/5 hover:text-fog-50",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center border",
                              active
                                ? "border-signal/50 text-signal"
                                : "border-white/10 text-fog-500",
                            )}
                          >
                            <l.icon className="h-4 w-4" />
                          </span>
                          {t(l.key)}
                          <span className="ml-auto font-mono text-[9px] text-fog-600">0{i + 1}</span>
                        </Link>
                      );
                    })}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right actions */}
          <div className="hidden shrink-0 items-center gap-2 xl:flex">
            {/* Tracking search */}
            <form onSubmit={submitTrack} className="relative hidden 2xl:block">
              <label htmlFor="header-track" className="sr-only">
                {t("trk.placeholder")}
              </label>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fog-600"
                aria-hidden="true"
              />
              <input
                id="header-track"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t("trk.placeholder")}
                className="h-10 w-[210px] border border-white/10 bg-white/[0.03] pl-9 pr-3 font-mono text-[11px] uppercase tracking-[0.08em] text-fog-50 transition-colors duration-150 placeholder:normal-case placeholder:tracking-normal placeholder:text-fog-600 focus:border-signal focus:outline-none"
              />
            </form>

            {/* Language toggle */}
            <div
              className="flex items-center rounded-[3px] border border-white/10 p-0.5"
              role="group"
              aria-label="Language"
            >
              <Globe className="ml-2 h-3.5 w-3.5 shrink-0 text-fog-500" />
              {(["en", "ka"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className={cn(
                    "rounded-[2px] px-2 py-1 text-[11px] font-bold transition-colors",
                    lang === l ? "bg-signal text-ink-950" : "text-fog-400 hover:text-fog-50",
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
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-fog-400 transition-colors hover:bg-white/8 hover:text-fog-50"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Button asChild size="default" className="h-10 px-5">
              <Link href="/quote">
                {t("nav.requestCapacity")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-1 xl:hidden">
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "ka" : "en")}
              aria-label="Language"
              className="inline-flex h-10 shrink-0 items-center rounded-[3px] border border-white/10 px-2.5 text-[11px] font-bold text-fog-50 transition-colors hover:bg-white/8"
            >
              {lang === "en" ? "EN" : "ქარ"}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t("theme.toggle")}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-fog-50 transition-colors hover:bg-white/8"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Button asChild size="sm" className="h-10 px-4">
              <Link href="/quote">{t("nav.requestCapacity")}</Link>
            </Button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-fog-50 transition-colors hover:bg-white/8"
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
