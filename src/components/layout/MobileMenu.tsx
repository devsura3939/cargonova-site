"use client";

import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Search, Phone } from "lucide-react";
import { brand } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const MOBILE_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/tracking", label: "Tracking" },
  { href: "/coverage", label: "Coverage" },
  { href: "/fleet", label: "Fleet" },
  { href: "/technology", label: "Technology" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Insights" },
  { href: "/careers", label: "Careers" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduceMotion = useReducedMotion();

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
                    {link.label}
                    <ArrowRight className="h-4 w-4 text-navy-400" />
                  </Link>
                </motion.div>
              ))}
            </motion.nav>

            <div className="mt-8 flex flex-col gap-3">
              <Button asChild size="lg">
                <Link href="/quote" onClick={onClose}>
                  Get a Quote
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/tracking" onClick={onClose}>
                  <Search className="h-4 w-4" />
                  Track Shipment
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
