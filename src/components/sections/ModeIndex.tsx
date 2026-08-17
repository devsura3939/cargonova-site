"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { images } from "@/data/images";
import { useLang, type Lang } from "@/lib/i18n";
import { SectionHeading } from "@/components/shared/SectionHeading";

const EASE = [0.23, 1, 0.32, 1] as const;

type Mode = {
  id: string;
  label: string;
  headline: string;
  description: string;
  transit: string;
  capacity: string;
  coverage: string;
  specs: { label: string; value: string }[];
  image: string;
};

type Bi = { en: string; ka: string };
const L = (lang: Lang) => (b: Bi) => (lang === "ka" ? b.ka : b.en);

const MODE_DEFS: Record<"en" | "ka", { label: Bi; headline: Bi; description: Bi; transit: Bi; capacity: Bi; coverage: Bi; specs: { label: Bi; value: Bi }[] }[]> = {
  en: [
    {
      label: { en: "Road freight", ka: "საგზაო გადაზიდვა" },
      headline: { en: "Own-fleet linehaul across 30+ countries", ka: "საკუთარი ავტოპარკი 30+ ქვეყანაში" },
      description: {
        en: "Full and part loads on scheduled linehaul, with tail-lift, ADR and temperature-controlled equipment available on every corridor.",
        ka: "სრული და ნაწილობრივი დატვირთვები დაგეგმილ მარშრუტებზე — ლიფტკარით, ADR და ტემპერატურული რეჟიმის აღჭურვილობით ყველა დერეფანზე.",
      },
      transit: { en: "1–4 days", ka: "1–4 დღე" },
      capacity: { en: "to 24 t / 100 m³", ka: "24 ტ-მდე / 100 მ³" },
      coverage: { en: "30+ countries", ka: "30+ ქვეყანა" },
      specs: [
        { label: { en: "Equipment", ka: "ტრანსპორტი" }, value: { en: "Tautliner · Mega · Reefer · Van", ka: "ტაუტლაინერი · მეგა · რეფრიჟერატორი · ვანი" } },
        { label: { en: "Booking cut-off", ka: "დაჯავშნის ბოლო ვადა" }, value: { en: "16:00 for same-day collection", ka: "16:00 იმავე დღის ჩატვირთვისთვის" } },
        { label: { en: "Telemetry", ka: "ტელემეტრია" }, value: { en: "2-min GPS + door sensors", ka: "2-წუთიანი GPS + კარის სენსორები" } },
        { label: { en: "Compliance", ka: "კომპლაიენსი" }, value: { en: "ADR classes 2–9 (excl. 1, 7)", ka: "ADR კლასები 2–9 (1, 7-ის გარდა)" } },
      ],
    },
    {
      label: { en: "Rail & intermodal", ka: "სარკინიგზო და ინტერმოდალური" },
      headline: { en: "Green linehaul on the Caucasus and EU corridors", ka: "მწვანე ტრანსპორტირება კავკასიისა და ევროკავშირის დერეფნებზე" },
      description: {
        en: "Scheduled block trains and combined transport that cut road miles by up to 80%, with truck pre- and post-carriage at both ends.",
        ka: "დაგეგმილი ბლოკ-მატარებლები და კომბინირებული ტრანსპორტი, რომელიც საგზაო კილომეტრებს 80%-მდე ამცირებს, ავტოგადაზიდვით ორივე ბოლოში.",
      },
      transit: { en: "2–5 days", ka: "2–5 დღე" },
      capacity: { en: "to 26 t / container", ka: "26 ტ-მდე / კონტეინერი" },
      coverage: { en: "18 rail terminals", ka: "18 სარკინიგზო ტერმინალი" },
      specs: [
        { label: { en: "Service", ka: "სერვისი" }, value: { en: "Block train · single wagon", ka: "ბლოკ-მატარებელი · ცალკე ვაგონი" } },
        { label: { en: "Gauge", ka: "ლიანდაგი" }, value: { en: "1435 / 1520 compatible", ka: "1435 / 1520 თავსებადი" } },
        { label: { en: "Tracking", ka: "თვალთვალი" }, value: { en: "Wagon-level GPS", ka: "ვაგონის დონის GPS" } },
        { label: { en: "Compliance", ka: "კომპლაიენსი" }, value: { en: "CIM / SMGS consignment", ka: "CIM / SMGS საბუთები" } },
      ],
    },
    {
      label: { en: "Air freight", ka: "საჰაერო ტვირთი" },
      headline: { en: "Priority uplift through partner gateways", ka: "პრიორიტეტული გადაზიდვა პარტნიორი კარიბჭეებით" },
      description: {
        en: "Express air capacity on 190 routes with airport-to-airport tracking, temperature-safe handling and door-to-door options where time is the cargo.",
        ka: "ექსპრეს ავიატევადობა 190 მარშრუტზე, აეროპორტ-აეროპორტის თვალთვალით, ტემპერატურულად უსაფრთხო მოპყრობით და კარამდე მიტანით, სადაც დრო თავად ტვირთია.",
      },
      transit: { en: "12–48 h", ka: "12–48 სთ" },
      capacity: { en: "to 5 t / ULD", ka: "5 ტ-მდე / ULD" },
      coverage: { en: "190 airports", ka: "190 აეროპორტი" },
      specs: [
        { label: { en: "Products", ka: "პროდუქტები" }, value: { en: "Express · standard · charter", ka: "ექსპრეს · სტანდარტული · ჩარტერი" } },
        { label: { en: "Handling", ka: "მოპყრობა" }, value: { en: "DG · temp · high value", ka: "DG · ტემპერატურა · მაღალი ღირებულება" } },
        { label: { en: "Tracking", ka: "თვალთვალი" }, value: { en: "Scan-level milestones", ka: "სკანირების დონის ეტაპები" } },
        { label: { en: "Customs", ka: "საბაჟო" }, value: { en: "Pre-clearance available", ka: "წინასწარი გაფორმება" } },
      ],
    },
    {
      label: { en: "Ocean freight", ka: "საზღვაო ტვირთი" },
      headline: { en: "FCL and LCL from Poti and Batumi", ka: "FCL და LCL პოტიდან და ბათუმიდან" },
      description: {
        en: "Container services from Georgian Black Sea ports to the world, with fixed weekly rotations, port-to-door tracking and customs-ready documentation.",
        ka: "კონტეინერული სერვისები საქართველოს შავი ზღვის პორტებიდან მთელ მსოფლიოში, ყოველკვირეული როტაციით, პორტამდე თვალთვალით და საბაჟოსთვის მზა დოკუმენტებით.",
      },
      transit: { en: "12–34 days", ka: "12–34 დღე" },
      capacity: { en: "to 28 t / container", ka: "28 ტ-მდე / კონტეინერი" },
      coverage: { en: "410 ports", ka: "410 პორტი" },
      specs: [
        { label: { en: "Loads", ka: "დატვირთვები" }, value: { en: "FCL 20' / 40' · LCL", ka: "FCL 20' / 40' · LCL" } },
        { label: { en: "Ports", ka: "პორტები" }, value: { en: "Poti · Batumi · Istanbul", ka: "ფოთი · ბათუმი · სტამბოლი" } },
        { label: { en: "Tracking", ka: "თვალთვალი" }, value: { en: "Vessel-level AIS", ka: "გემის დონის AIS" } },
        { label: { en: "Equipment", ka: "ტრანსპორტი" }, value: { en: "Dry · reefer · open top", ka: "მშრალი · რეფრიჟერატორი · ღია" } },
      ],
    },
  ],
  ka: [
    {
      label: { en: "Road freight", ka: "საგზაო გადაზიდვა" },
      headline: { en: "Own-fleet linehaul across 30+ countries", ka: "საკუთარი ავტოპარკი 30+ ქვეყანაში" },
      description: {
        en: "Full and part loads on scheduled linehaul, with tail-lift, ADR and temperature-controlled equipment available on every corridor.",
        ka: "სრული და ნაწილობრივი დატვირთვები დაგეგმილ მარშრუტებზე — ლიფტკარით, ADR და ტემპერატურული რეჟიმის აღჭურვილობით ყველა დერეფანზე.",
      },
      transit: { en: "1–4 days", ka: "1–4 დღე" },
      capacity: { en: "to 24 t / 100 m³", ka: "24 ტ-მდე / 100 მ³" },
      coverage: { en: "30+ countries", ka: "30+ ქვეყანა" },
      specs: [
        { label: { en: "Equipment", ka: "ტრანსპორტი" }, value: { en: "Tautliner · Mega · Reefer · Van", ka: "ტაუტლაინერი · მეგა · რეფრიჟერატორი · ვანი" } },
        { label: { en: "Booking cut-off", ka: "დაჯავშნის ბოლო ვადა" }, value: { en: "16:00 for same-day collection", ka: "16:00 იმავე დღის ჩატვირთვისთვის" } },
        { label: { en: "Telemetry", ka: "ტელემეტრია" }, value: { en: "2-min GPS + door sensors", ka: "2-წუთიანი GPS + კარის სენსორები" } },
        { label: { en: "Compliance", ka: "კომპლაიენსი" }, value: { en: "ADR classes 2–9 (excl. 1, 7)", ka: "ADR კლასები 2–9 (1, 7-ის გარდა)" } },
      ],
    },
    {
      label: { en: "Rail & intermodal", ka: "სარკინიგზო და ინტერმოდალური" },
      headline: { en: "Green linehaul on the Caucasus and EU corridors", ka: "მწვანე ტრანსპორტირება კავკასიისა და ევროკავშირის დერეფნებზე" },
      description: {
        en: "Scheduled block trains and combined transport that cut road miles by up to 80%, with truck pre- and post-carriage at both ends.",
        ka: "დაგეგმილი ბლოკ-მატარებლები და კომბინირებული ტრანსპორტი, რომელიც საგზაო კილომეტრებს 80%-მდე ამცირებს, ავტოგადაზიდვით ორივე ბოლოში.",
      },
      transit: { en: "2–5 days", ka: "2–5 დღე" },
      capacity: { en: "to 26 t / container", ka: "26 ტ-მდე / კონტეინერი" },
      coverage: { en: "18 rail terminals", ka: "18 სარკინიგზო ტერმინალი" },
      specs: [
        { label: { en: "Service", ka: "სერვისი" }, value: { en: "Block train · single wagon", ka: "ბლოკ-მატარებელი · ცალკე ვაგონი" } },
        { label: { en: "Gauge", ka: "ლიანდაგი" }, value: { en: "1435 / 1520 compatible", ka: "1435 / 1520 თავსებადი" } },
        { label: { en: "Tracking", ka: "თვალთვალი" }, value: { en: "Wagon-level GPS", ka: "ვაგონის დონის GPS" } },
        { label: { en: "Compliance", ka: "კომპლაიენსი" }, value: { en: "CIM / SMGS consignment", ka: "CIM / SMGS საბუთები" } },
      ],
    },
    {
      label: { en: "Air freight", ka: "საჰაერო ტვირთი" },
      headline: { en: "Priority uplift through partner gateways", ka: "პრიორიტეტული გადაზიდვა პარტნიორი კარიბჭეებით" },
      description: {
        en: "Express air capacity on 190 routes with airport-to-airport tracking, temperature-safe handling and door-to-door options where time is the cargo.",
        ka: "ექსპრეს ავიატევადობა 190 მარშრუტზე, აეროპორტ-აეროპორტის თვალთვალით, ტემპერატურულად უსაფრთხო მოპყრობით და კარამდე მიტანით, სადაც დრო თავად ტვირთია.",
      },
      transit: { en: "12–48 h", ka: "12–48 სთ" },
      capacity: { en: "to 5 t / ULD", ka: "5 ტ-მდე / ULD" },
      coverage: { en: "190 airports", ka: "190 აეროპორტი" },
      specs: [
        { label: { en: "Products", ka: "პროდუქტები" }, value: { en: "Express · standard · charter", ka: "ექსპრეს · სტანდარტული · ჩარტერი" } },
        { label: { en: "Handling", ka: "მოპყრობა" }, value: { en: "DG · temp · high value", ka: "DG · ტემპერატურა · მაღალი ღირებულება" } },
        { label: { en: "Tracking", ka: "თვალთვალი" }, value: { en: "Scan-level milestones", ka: "სკანირების დონის ეტაპები" } },
        { label: { en: "Customs", ka: "საბაჟო" }, value: { en: "Pre-clearance available", ka: "წინასწარი გაფორმება" } },
      ],
    },
    {
      label: { en: "Ocean freight", ka: "საზღვაო ტვირთი" },
      headline: { en: "FCL and LCL from Poti and Batumi", ka: "FCL და LCL პოტიდან და ბათუმიდან" },
      description: {
        en: "Container services from Georgian Black Sea ports to the world, with fixed weekly rotations, port-to-door tracking and customs-ready documentation.",
        ka: "კონტეინერული სერვისები საქართველოს შავი ზღვის პორტებიდან მთელ მსოფლიოში, ყოველკვირეული როტაციით, პორტამდე თვალთვალით და საბაჟოსთვის მზა დოკუმენტებით.",
      },
      transit: { en: "12–34 days", ka: "12–34 დღე" },
      capacity: { en: "to 28 t / container", ka: "28 ტ-მდე / კონტეინერი" },
      coverage: { en: "410 ports", ka: "410 პორტი" },
      specs: [
        { label: { en: "Loads", ka: "დატვირთვები" }, value: { en: "FCL 20' / 40' · LCL", ka: "FCL 20' / 40' · LCL" } },
        { label: { en: "Ports", ka: "პორტები" }, value: { en: "Poti · Batumi · Istanbul", ka: "ფოთი · ბათუმი · სტამბოლი" } },
        { label: { en: "Tracking", ka: "თვალთვალი" }, value: { en: "Vessel-level AIS", ka: "გემის დონის AIS" } },
        { label: { en: "Equipment", ka: "ტრანსპორტი" }, value: { en: "Dry · reefer · open top", ka: "მშრალი · რეფრიჟერატორი · ღია" } },
      ],
    },
  ],
};

const IMAGES = [images.truckRoad, images.railFreight, images.airCargo, images.ocean];

export function ModeIndex() {
  const { t, lang } = useLang();
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(0);

  const pick = L(lang);
  const modes: Mode[] = MODE_DEFS[lang].map((m, i) => ({
    id: String(i),
    label: pick(m.label),
    headline: pick(m.headline),
    description: pick(m.description),
    transit: pick(m.transit),
    capacity: pick(m.capacity),
    coverage: pick(m.coverage),
    specs: m.specs.map((s) => ({ label: pick(s.label), value: pick(s.value) })),
    image: IMAGES[i],
  }));
  const active = modes[activeId];

  return (
    <section className="border-b border-white/10 bg-ink-950">
      <div className="mx-auto max-w-[80rem] px-5 py-16 sm:px-8 lg:py-24">
        <SectionHeading
          index="01"
          eyebrow={t("mi.eyebrow")}
          align="split"
          title={
            <>
              {t("mi.title1")} <span className="text-fog-500">{t("mi.title2")}</span>
            </>
          }
          action={
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 border border-white/15 px-4 py-3 text-[13px] text-fog-200 transition-colors duration-150 hover:border-white/35 hover:text-fog-50"
            >
              {t("mi.fullDetail")}
              <ArrowRight className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
            </Link>
          }
          dark
        />

        <div className="mt-12 grid gap-px bg-white/[0.06] lg:grid-cols-[1fr_1.15fr]">
          {/* Image + readouts */}
          <div className="relative min-h-[280px] overflow-hidden bg-ink-900 lg:min-h-[520px]">
            <AnimatePresence initial={false}>
              <motion.img
                key={active.id}
                src={active.image}
                alt={`${active.label} operations`}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 gap-px bg-white/[0.08]">
              <Readout label={t("mi.transit")} value={active.transit} />
              <Readout label={t("mi.capacity")} value={active.capacity} />
              <Readout label={t("mi.coverage")} value={active.coverage} />
            </div>
          </div>

          {/* Mode rows */}
          <ul className="bg-ink-900">
            {modes.map((mode, i) => {
              const isActive = i === activeId;
              return (
                <li key={mode.id} className="border-b border-white/[0.07] last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setActiveId(i)}
                    onMouseEnter={() => setActiveId(i)}
                    aria-expanded={isActive}
                    className="w-full px-5 py-5 text-left transition-colors duration-150 hover:bg-white/[0.03] sm:px-7"
                  >
                    <div className="flex items-baseline gap-4">
                      <span
                        className={`font-mono text-[10px] tracking-[0.14em] ${isActive ? "text-signal" : "text-fog-600"}`}
                      >
                        0{i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <span
                            className={`text-[20px] font-semibold tracking-[-0.02em] sm:text-[24px] ${
                              isActive ? "text-fog-50" : "text-fog-300"
                            }`}
                          >
                            {mode.label}
                          </span>
                          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-fog-600">
                            {mode.transit}
                          </span>
                        </span>
                        <span className="mt-1.5 block text-[14px] leading-snug text-fog-500">
                          {mode.headline}
                        </span>
                      </span>
                    </div>

                    <AnimatePresence initial={false}>
                      {isActive ? (
                        <motion.div
                          key="detail"
                          initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.24, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="mt-4 max-w-xl pl-8 text-[14px] leading-relaxed text-fog-300">
                            {mode.description}
                          </p>
                          <dl className="mt-4 grid gap-x-8 gap-y-2 pl-8 sm:grid-cols-2">
                            {mode.specs.map((spec) => (
                              <div
                                key={spec.label}
                                className="flex items-baseline justify-between gap-3 border-b border-white/[0.07] py-1.5"
                              >
                                <dt className="label text-fog-600">{spec.label}</dt>
                                <dd className="text-right font-mono text-[10.5px] text-fog-300">
                                  {spec.value}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ink-950/88 px-3 py-3 backdrop-blur-sm">
      <p className="label text-fog-500">{label}</p>
      <p className="mt-1.5 font-mono text-[11.5px] text-fog-50 tnum">{value}</p>
    </div>
  );
}
