"use client";

import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Search, Phone } from "lucide-react";
import { brand } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

const MOBILE_LINKS: { href: string; label: "nav.services" | "nav.industries" | "nav.tracking" | "nav.coverage" | "nav.fleet" | "nav.technology" | "nav.about" | "nav.insights" | "nav.careers" | "nav.faq" | "nav.contact" }[] = [
  { href: "/services", label: "nav.services" },
  { href: "/industries", label: "nav.industries" },
  { href: "/tracking", label: "nav.tracking" },
  { href: "/coverage", label: "nav.coverage" },
  { href: "/fleet", label: "nav.fleet" },
  { href: "/technology", label: "nav.technology" },
  { href: "/about", label: "nav.about" },
  { href: "/blog", label: "nav.insights" },
  { href: "/careers", label: "nav.careers" },
  { href: "/faq", label: "nav.faq" },
  { href: "/contact", label: "nav.contact" },
];

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const { t } = useLang();

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-40 overflow-y-auto bg-navy-900 pt-24 text-white lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
            <motion.nav
              aria-label="Mobile"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="flex flex-col"
            >
              {MOBILE_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.04 * i }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center justify-between border-b border-white/8 py-4 text-lg font-semibold text-white/90 transition-colors hover:text-white"
                  >
                    {t(link.label)}
                    <ArrowRight className="h-4 w-4 text-navy-400" />
                  </Link>
                </motion.div>
              ))}
            </motion.nav>

            <div className="mt-8 flex flex-col gap-3">
              <Button asChild size="lg">
                <Link href="/quote" onClick={onClose}>
                  {t("nav.getQuote")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/tracking" onClick={onClose}>
                  <Search className="h-4 w-4" />
                  {t("nav.track")}
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost-light" className="justify-start">
                <Link href={brand.contact.phoneHref} onClick={onClose}>
                  <Phone className="h-4 w-4" />
                  {brand.contact.phone}
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
