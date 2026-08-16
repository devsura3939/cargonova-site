"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Route as RouteIcon, Weight, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Reveal } from "@/components/shared/Reveal";
import { trackEvent } from "@/lib/analytics";

const CARGO_TYPES = [
  "Palletized goods",
  "Full truckload",
  "Partial load (LTL)",
  "Temperature controlled",
  "Oversized / heavy",
  "Express / urgent",
  "Other",
];

export function QuickQuote() {
  const router = useRouter();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [cargoType, setCargoType] = useState("");
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    trackEvent("quote_started", { source: "home_quick_quote" });
    const params = new URLSearchParams();
    if (pickup) params.set("pickupCity", pickup);
    if (destination) params.set("destinationCity", destination);
    if (cargoType) params.set("cargoType", cargoType);
    if (weight) params.set("weight", weight);
    if (date) params.set("transportDate", date);
    router.push(`/quote?${params.toString()}`);
  }

  return (
    <Reveal className="relative overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card">
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-electric-100/60 blur-3xl" />
      <div className="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-electric-600">
            Instant Estimate
          </p>
          <h2 className="text-balance font-display text-2xl font-extrabold leading-tight tracking-tight text-navy-900 sm:text-3xl">
            Tell us what you're shipping. Get a route and rate in hours.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate sm:text-base">
            Share your route and cargo details — our planning team confirms availability and
            pricing within 4 business hours. Urgent loads: 60 minutes.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm text-navy-700">
            {[
              "No commitment — estimates are free",
              "FTL, LTL, express, and special cargo",
              "Confirmed capacity before you book",
            ].map((line) => (
              <li key={line} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-electric-100 text-electric-600">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2" noValidate>
          <div className="sm:col-span-2">
            <label htmlFor="qq-pickup" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-navy-700">
              <RouteIcon className="h-3.5 w-3.5 text-electric-500" /> Pickup location
            </label>
            <Input id="qq-pickup" placeholder="City or postal code" value={pickup} onChange={(e) => setPickup(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="qq-dest" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-navy-700">
              <RouteIcon className="h-3.5 w-3.5 text-cyan-500" /> Delivery location
            </label>
            <Input id="qq-dest" placeholder="City or postal code" value={destination} onChange={(e) => setDestination(e.target.value)} />
          </div>
          <div>
            <label htmlFor="qq-type" className="mb-1.5 block text-xs font-semibold text-navy-700">Cargo type</label>
            <Select value={cargoType} onValueChange={setCargoType}>
              <SelectTrigger id="qq-type">
                <SelectValue placeholder="Select cargo type" />
              </SelectTrigger>
              <SelectContent>
                {CARGO_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="qq-weight" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-navy-700">
              <Weight className="h-3.5 w-3.5 text-slate" /> Approx. weight (kg)
            </label>
            <Input id="qq-weight" type="number" min="1" placeholder="e.g. 4500" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="qq-date" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-navy-700">
              <CalendarClock className="h-3.5 w-3.5 text-orange-500" /> Desired transport date
            </label>
            <Input id="qq-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              Request Estimate
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="mt-2.5 text-xs text-slate">
              Continue to the full form for a detailed quote.
            </p>
          </div>
        </form>
      </div>
    </Reveal>
  );
}
