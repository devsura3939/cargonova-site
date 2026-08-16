"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Menu, Moon, Sun, Globe } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useTheme } from "@/lib/theme";
import { useLang, type Lang, type DictKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Main navigation: short, flat, no sub-menus. Everything else lives in the footer. */
const NAV: { href: string; key: DictKey }[] = [
  { href: "/services", key: "nav.services" },
  { href: "/industries", key: "nav.industries" },
  { href: "/tracking", key: "nav.tracking" },
  { href: "/live-map", key: "nav.liveMap" },
  { href: "/coverage", key: "nav.network" },
  { href: "/about", key: "nav.company" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 24,
  );
  const [menuOpen, setMenuOpen] = useState(false);
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
