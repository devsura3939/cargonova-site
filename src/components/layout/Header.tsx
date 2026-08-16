"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, Moon, Sun, Globe } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useTheme } from "@/lib/theme";
import { useLang, type Lang, type DictKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type NavChild = { href: string; key: DictKey; descKey?: DictKey };
type NavItem =
  | { href: string; key: DictKey; children: NavChild[] }
  | { href: string; key: DictKey; children?: never };

const NAV: NavItem[] = [
  {
    href: "/services",
    key: "nav.services",
    children: [
      { href: "/services/ground-freight", key: "nav.groundFreight" },
      { href: "/services/full-truckload", key: "nav.ftl" },
      { href: "/services/ltl", key: "nav.ltl" },
      { href: "/services/express", key: "nav.express" },
      { href: "/services/refrigerated", key: "nav.refrigerated" },
      { href: "/services/oversized", key: "nav.oversized" },
      { href: "/services/warehousing", key: "nav.warehousing" },
      { href: "/services/business-logistics", key: "nav.consulting" },
      { href: "/services", key: "nav.allServices" },
    ],
  },
  { href: "/industries", key: "nav.industries" },
  {
    href: "/tracking",
    key: "nav.tracking",
    children: [
      { href: "/tracking", key: "nav.track" },
      { href: "/live-map", key: "nav.liveMap" },
    ],
  },
  {
    href: "/coverage",
    key: "nav.network",
    children: [
      { href: "/coverage", key: "nav.coverage" },
      { href: "/fleet", key: "nav.fleet" },
    ],
  },
  {
    href: "/about",
    key: "nav.company",
    children: [
      { href: "/about", key: "nav.about" },
      { href: "/technology", key: "nav.technology" },
      { href: "/careers", key: "nav.careers" },
      { href: "/contact", key: "nav.contact" },
    ],
  },
  {
    href: "/blog",
    key: "nav.insights",
    children: [
      { href: "/blog", key: "nav.blog" },
      { href: "/faq", key: "nav.faq" },
    ],
  },
];

function NavMenu({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const { t } = useLang();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

  // Close on outside click / route change
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close the dropdown when the route changes (render-time adjustment,
  // per React's recommended pattern for deriving state from props).
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  const openSoon = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  const triggerClasses = cn(
    "group relative inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200",
    active ? "text-white" : "text-navy-200 hover:text-white",
  );
  const underline = (
    <span
      className={cn(
        "absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-cyan-400 transition-transform duration-300 group-hover:scale-x-100",
        active && "scale-x-100",
      )}
    />
  );

  if (!item.children) {
    return (
      <div ref={ref}>
        <Link href={item.href} className={cn(triggerClasses, "group")}>
          {t(item.key)}
          {underline}
        </Link>
      </div>
    );
  }

  return (
    <div ref={ref} onMouseLeave={closeSoon}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={openSoon}
        aria-expanded={open}
        aria-haspopup="menu"
        className={triggerClasses}
      >
        {t(item.key)}
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")}
        />
        {underline}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 0.61, 0.36, 1] }}
            role="menu"
            className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3"
          >
            <div
              className={cn(
                "min-w-56 rounded-2xl border border-white/10 bg-navy-900/95 p-2 shadow-[0_24px_60px_-16px_rgb(0_0_0/0.6)] backdrop-blur-xl",
                item.children.length > 6 && "grid grid-cols-2 gap-1 min-w-[26rem]",
              )}
            >
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between gap-6 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-150 hover:bg-white/10",
                    (pathname === child.href || pathname.startsWith(`${child.href}/`))
                      ? "text-white"
                      : "text-navy-100 hover:text-white",
                  )}
                >
                  {t(child.key)}
                  {child.href === item.href && (
                    <span className="text-xs font-bold text-cyan-400">→</span>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 24,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
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
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:h-18 sm:px-8 lg:px-10">
          <Logo dark />

          {/* Desktop nav */}
          <nav aria-label="Main" className="hidden items-center gap-0.5 xl:flex">
            {NAV.map((item) => (
              <NavMenu key={item.href} item={item} />
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden items-center gap-2 xl:flex">
            {/* Language toggle */}
            <div
              className="flex items-center rounded-full border border-white/12 bg-white/5 p-0.5 backdrop-blur"
              role="group"
              aria-label="Language"
            >
              <Globe className="ml-2.5 h-3.5 w-3.5 text-navy-300" />
              {(["en", "ka"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-bold transition-colors",
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
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-navy-200 transition-colors hover:bg-white/10 hover:text-white"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Button asChild size="default">
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
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "ka" : "en")}
              aria-label="Language"
              className="inline-flex h-10 items-center rounded-full px-2 text-xs font-bold text-white transition-colors hover:bg-white/10"
            >
              {lang === "en" ? "EN" : "ქარ"}
            </button>
            <Button asChild size="sm" className="h-10">
              <Link href="/quote">{t("nav.getQuote")}</Link>
            </Button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
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
