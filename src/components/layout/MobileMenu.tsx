"use client";

import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Search, Phone } from "lucide-react";
import { brand } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useLang, type DictKey } from "@/lib/i18n";

type Group = { heading: DictKey; href: string; links: { label: DictKey; href: string }[] };

const GROUPS: Group[] = [
  {
    heading: "nav.services",
    href: "/services",
    links: [
      { label: "nav.groundFreight", href: "/services/ground-freight" },
      { label: "nav.ftl", href: "/services/full-truckload" },
      { label: "nav.ltl", href: "/services/ltl" },
      { label: "nav.express", href: "/services/express" },
      { label: "nav.refrigerated", href: "/services/refrigerated" },
      { label: "nav.oversized", href: "/services/oversized" },
      { label: "nav.warehousing", href: "/services/warehousing" },
    ],
  },
  {
    heading: "nav.tracking",
    href: "/tracking",
    links: [
      { label: "nav.track", href: "/tracking" },
      { label: "nav.liveMap", href: "/live-map" },
    ],
  },
  {
    heading: "nav.network",
    href: "/coverage",
    links: [
      { label: "nav.coverage", href: "/coverage" },
      { label: "nav.fleet", href: "/fleet" },
    ],
  },
  {
    heading: "nav.company",
    href: "/about",
    links: [
      { label: "nav.about", href: "/about" },
      { label: "nav.technology", href: "/technology" },
      { label: "nav.careers", href: "/careers" },
      { label: "nav.contact", href: "/contact" },
    ],
  },
  {
    heading: "nav.insights",
    href: "/blog",
    links: [
      { label: "nav.blog", href: "/blog" },
      { label: "nav.faq", href: "/faq" },
    ],
  },
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
          className="fixed inset-0 z-40 overflow-y-auto bg-navy-900 pt-24 text-white xl:hidden"
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
              className="flex flex-col divide-y divide-white/8"
            >
              <Link
                href="/industries"
                onClick={onClose}
                className="flex items-center justify-between py-3.5 text-base font-semibold text-white/90 transition-colors hover:text-white"
              >
                {t("nav.industries")}
                <ArrowRight className="h-4 w-4 text-navy-400" />
              </Link>

              {GROUPS.map((group, i) => (
                <motion.div
                  key={group.heading}
                  initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.04 * i }}
                  className="py-3"
                >
                  <Link
                    href={group.href}
                    onClick={onClose}
                    className="flex items-center justify-between text-base font-semibold text-white transition-colors hover:text-white"
                  >
                    {t(group.heading)}
                    <ArrowRight className="h-4 w-4 text-cyan-400" />
                  </Link>
                  <ul className="mt-2.5 grid grid-cols-1 gap-0.5 pl-1">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={onClose}
                          className="block py-1.5 pl-3 text-sm text-navy-200 transition-colors hover:text-white"
                        >
                          {t(link.label)}
                        </Link>
                      </li>
                    ))}
                  </ul>
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
