import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/constants";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-24 text-white sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-grid-dark" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-electric-500/25 blur-[130px]" />

      {/* Animated route background */}
      <svg
        viewBox="0 0 1200 300"
        fill="none"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-50"
      >
        <path
          d="M-50 240 C 150 200, 250 120, 420 150 S 720 90, 900 130 S 1150 60, 1300 100"
          stroke="url(#cta-route)"
          strokeWidth="2.5"
          strokeDasharray="3 12"
          strokeLinecap="round"
          className="route-line"
        />
        <path
          d="M-50 240 C 150 200, 250 120, 420 150 S 720 90, 900 130 S 1150 60, 1300 100"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <circle cx="-40" cy="242" r="6" fill="#2ED3E6" />
        <circle cx="420" cy="150" r="4.5" fill="#1677FF" />
        <circle cx="900" cy="130" r="4.5" fill="#FF8A3D" />
        <circle cx="1300" cy="98" r="6" fill="#2ED3E6" />
        <defs>
          <linearGradient id="cta-route" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#2ED3E6" />
            <stop offset="0.5" stopColor="#1677FF" />
            <stop offset="1" stopColor="#FF8A3D" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-1.5 text-xs font-semibold text-navy-100">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Capacity available this week on core corridors
          </p>
          <h2 className="text-balance font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Move Your Cargo With{" "}
            <span className="bg-gradient-to-r from-electric-400 to-cyan-400 bg-clip-text text-transparent">
              Confidence
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-navy-200 sm:text-lg">
            Get a confirmed quote within 4 business hours — or talk to a logistics
            specialist about your network today.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/quote">
                Get a Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">
                <PhoneCall className="h-4 w-4" />
                Contact Logistics Team
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-navy-300">
            Prefer to talk? Call{" "}
            <a href={brand.contact.phoneHref} className="font-semibold text-white underline decoration-cyan-400/60 underline-offset-4 hover:text-cyan-300">
              {brand.contact.phone}
            </a>{" "}
            — 24/7 for active shipments.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
