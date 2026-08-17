"use client";

import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Search, Phone, Info, Globe2, Contact } from "lucide-react";
import { brand } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useLang, type DictKey } from "@/lib/i18n";

const LINKS: { label: DictKey; href: string }[] = [
  { label: "nav.services", href: "/services" },
  { label: "nav.industries", href: "/industries" },
  { label: "nav.tracking", href: "/tracking" },
  { label: "nav.liveMap", href: "/live-map" },
];

/** Company & Network live together — one group with About, Coverage, Contact. */
const COMPANY_LINKS: { label: DictKey; href: string; icon: typeof Info }[] = [
  { label: "nav.about", href: "/about", icon: Info },
  { label: "nav.coverage", href: "/coverage", icon: Globe2 },
  { label: "nav.contact", href: "/contact", icon: Contact },
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
          className="fixed inset-0 z-40 overflow-y-auto border-t border-soft bg-surface pt-24 text-strong dark:border-white/10 dark:bg-ink-950 dark:text-fog-50 xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto max-w-[80rem] px-5 pb-16 sm:px-8">
            <motion.nav
              aria-label="Mobile"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="flex flex-col divide-y divide-soft dark:divide-white/8"
            >
              {LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.04 * i }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="flex items-baseline justify-between py-5 text-2xl font-semibold tracking-[-0.02em] text-strong dark:text-fog-50"
                  >
                    {t(link.label)}
                    <span className="font-mono text-[10px] tracking-[0.14em] text-muted dark:text-fog-600">
                      0{i + 1}
                    </span>
                  </Link>
                </motion.div>
              ))}

              {/* Company & Network group */}
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="pt-6"
              >
                <p className="label text-muted dark:text-fog-600">{t("nav.company")}</p>
                <div className="mt-2 flex flex-col divide-y divide-soft dark:divide-white/8">
                  {COMPANY_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center gap-3 py-4 text-[15px] font-medium text-ink dark:text-fog-200"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-soft text-signal dark:border-white/10">
                        <link.icon className="h-4 w-4" />
                      </span>
                      {t(link.label)}
                      <ArrowRight className="ml-auto h-4 w-4 text-muted dark:text-fog-600" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </motion.nav>

            <div className="mt-8 flex flex-col gap-3">
              <Button asChild size="lg">
                <Link href="/quote" onClick={onClose}>
                  {t("nav.requestCapacity")}
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
