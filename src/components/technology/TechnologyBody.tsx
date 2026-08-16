"use client";

import Link from "next/link";
import { ArrowRight, Radar, Route, Gauge, Timer, FileCheck2, LayoutGrid, ShieldCheck, Database, Plug, Smartphone, BellRing, Check } from "lucide-react";
import { Section } from "@/components/shared/Section";
import { SectionHeadingT } from "@/components/shared/SectionHeadingT";
import { Reveal } from "@/components/shared/Reveal";
import { DashboardMockup } from "@/components/sections/DashboardMockup";
import { useLang, type Lang } from "@/lib/i18n";

type Item = { title: string; text: string };

const CONTENT: Record<Lang, {
  capabilities: (Item & { icon: typeof Radar })[];
  tower: string[];
  integrations: (Item & { icon: typeof Database })[];
  securityTitle: string;
  security: string[];
  demoLink: string;
}> = {
  en: {
    capabilities: [
      { icon: Radar, title: "Live Tracking", text: "GPS position and scan-level checkpoints on every shipment. Watch your cargo move in real time, with automatic status changes at pickup, transit, customs, and delivery." },
      { icon: Route, title: "Smart Routing", text: "Routes are planned against traffic, weather, border, and roadwork data — and replanned automatically when conditions change mid-journey." },
      { icon: Gauge, title: "Fleet Telemetry", text: "Speed, fuel, temperature, and driving behavior data from every vehicle. Maintenance is scheduled on real usage, not a calendar." },
      { icon: Timer, title: "ETA Prediction", text: "Arrival estimates that learn. Our ETA engine refines the delivery window continuously as the journey progresses — so your team can plan around reality." },
      { icon: FileCheck2, title: "Digital Documentation", text: "CMR, PODs, temperature logs, and customs files in one searchable archive. No filing cabinets, no chasing faxes, no lost paperwork." },
      { icon: LayoutGrid, title: "Operations Dashboard", text: "Every shipment in your program, one control tower. Filters, exports, and KPI views that turn operational data into decisions." },
    ],
    tower: [
      "Exception-first design — problems float to the top",
      "One click from alert to the affected shipment",
      "KPI views for on-time, damage, and cost trends",
      "Exportable reports for your own BI stack",
    ],
    integrations: [
      { icon: Database, title: "ERP / WMS integration", text: "Orders flow from your system to ours — no re-keying." },
      { icon: Plug, title: "Open API", text: "Shipment data, tracking webhooks, and documents via REST API." },
      { icon: Smartphone, title: "Mobile access", text: "Approve, sign PODs, and check status from any device." },
      { icon: BellRing, title: "Proactive alerts", text: "Email, SMS, or webhook notifications at every milestone." },
    ],
    securityTitle: "Security & reliability",
    security: [
      "TLS-encrypted data in transit and at rest",
      "Role-based access for you and your team",
      "99.9% platform uptime target with monitoring",
      "Data stays yours — exportable at any time",
    ],
    demoLink: "Request a platform demo",
  },
  ka: {
    capabilities: [
      { icon: Radar, title: "ცოცხალი თვალთვალი", text: "GPS პოზიცია და სკანირების დონის საკონტროლო პუნქტები ყოველ გადაზიდვაზე. უყურეთ თქვენს ტვირთს რეალურ დროში — სტატუსი ავტომატურად იცვლება ჩატვირთვაზე, ტრანზიტზე, საბაჟოზე და მიწოდებაზე." },
      { icon: Route, title: "ჭკვიანი მარშრუტიზაცია", text: "მარშრუტები დაგეგმილია საგზაო მოძრაობის, ამინდის, საზღვრისა და გზის სამუშაოების მონაცემებზე დაყრდნობით — და ავტომატურად გადაიგეგმება, თუ პირობები გზადაგზა შეიცვალა." },
      { icon: Gauge, title: "ავტოპარკის ტელემეტრია", text: "სიჩქარის, საწვავის, ტემპერატურისა და მართვის სტილის მონაცემები ყოველი სატრანსპორტო საშუალებიდან. მოვლა დაგეგმილია რეალური გამოყენების მიხედვით, კალენდრის ნაცვლად." },
      { icon: Timer, title: "ETA პროგნოზი", text: "ჩასვლის სავარაუდო დრო, რომელიც სწავლობს. ჩვენი ETA ძრავა მიწოდების ფანჯარას მგზავრობისას განუწყვეტლივ ზუსტებს — რომ თქვენი გუნდი რეალობას დაეყრდნოს." },
      { icon: FileCheck2, title: "ციფრული დოკუმენტაცია", text: "CMR, მიწოდების დამადასტურებელი დოკუმენტები, ტემპერატურის ჟურნალები და საბაჟო ფაილები — ერთ საძიებო არქივში. არც საქაღალდეები, არც დაკარგული ქაღალდები." },
      { icon: LayoutGrid, title: "ოპერაციების დაფა", text: "თქვენი პროგრამის ყოველი გადაზიდვა — ერთ საკონტროლო ცენტრში. ფილტრები, ექსპორტი და KPI ხედები, რომლებიც მონაცემებს გადაწყვეტილებად აქცევს." },
    ],
    tower: [
      "გამონაკლისზე ორიენტირებული დიზაინი — პრობლემები ზედა ნაწილში ამოდის",
      "ერთი დაწკაპუნება შეტყობინებიდან დაზარალებულ გადაზიდვამდე",
      "KPI ხედები ვადების, დაზიანებებისა და ხარჯების ტენდენციებისთვის",
      "ექსპორტირებადი ანგარიშები თქვენი BI სისტემისთვის",
    ],
    integrations: [
      { icon: Database, title: "ERP / WMS ინტეგრაცია", text: "შეკვეთები თქვენი სისტემიდან ჩვენში გადადის — ხელახალი შეყვანის გარეშე." },
      { icon: Plug, title: "ღია API", text: "გადაზიდვების მონაცემები, თვალთვალის ვებჰუკები და დოკუმენტები REST API-ით." },
      { icon: Smartphone, title: "მობილური წვდომა", text: "დაამტკიცეთ, მოაწერეთ ხელი დოკუმენტებს და შეამოწმეთ სტატუსი ნებისმიერი მოწყობილობიდან." },
      { icon: BellRing, title: "აქტიური შეტყობინებები", text: "ელფოსტის, SMS-ის ან ვებჰუკის შეტყობინებები ყოველ მნიშვნელოვან ეტაპზე." },
    ],
    securityTitle: "უსაფრთხოება და სანდოობა",
    security: [
      "TLS-დაშიფრული მონაცემები გადაცემისა და შენახვის დროს",
      "როლებზე დაფუძნებული წვდომა თქვენთვის და თქვენი გუნდისთვის",
      "99.9% პლატფორმის ხელმისაწვდომობის მიზანი მონიტორინგით",
      "მონაცემები თქვენი რჩება — ნებისმიერ დროს ექსპორტირებადი",
    ],
    demoLink: "მოითხოვეთ პლატფორმის დემო",
  },
};

export function TechnologyBody() {
  const { lang } = useLang();
  const c = CONTENT[lang];

  return (
    <>
      {/* Capabilities */}
      <Section variant="light">
        <SectionHeadingT
          align="center"
          eyebrowKey="pg.technology.platformEyebrow"
          titleKey="pg.technology.platformTitle"
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {c.capabilities.map((cap, i) => (
            <Reveal key={cap.title} delay={0.05 * (i % 3)}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-soft bg-surface p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-electric-100/0 blur-2xl transition-all duration-500 group-hover:bg-electric-100/70" />
                <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-electric-100 text-electric-600 transition-transform duration-300 group-hover:scale-105">
                  <cap.icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <h3 className="relative mt-5 font-display text-lg font-bold text-strong">{cap.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted">{cap.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Dashboard */}
      <Section variant="dark">
        <div className="pointer-events-none absolute inset-0 bg-noise opacity-30" />
        <div className="relative grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
          <Reveal>
            <DashboardMockup className="max-w-3xl" />
          </Reveal>
          <div>
            <SectionHeadingT
              dark
              eyebrowKey="pg.technology.towerEyebrow"
              titleKey="pg.technology.towerTitle"
              descKey="pg.technology.towerSub"
            />
            <ul className="mt-8 space-y-4">
              {c.tower.map((item) => (
                <li key={item.slice(0, 20)} className="flex items-start gap-3 text-sm leading-relaxed text-navy-100">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-400">
                    <Check className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Integrations */}
      <Section variant="mist">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeadingT
              eyebrowKey="pg.technology.integrationsEyebrow"
              titleKey="pg.technology.integrationsTitle"
              descKey="pg.technology.integrationsSub"
            />
            <Reveal delay={0.1}>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {c.integrations.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-soft bg-surface p-5 shadow-card">
                    <item.icon className="h-5 w-5 text-electric-500" strokeWidth={1.75} />
                    <h3 className="mt-3 text-sm font-bold text-strong">{item.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{item.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-8 text-white shadow-lift sm:p-10">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />
              <div className="pointer-events-none absolute inset-0 bg-grid-dark" />
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/20 blur-[70px]" />
              <ShieldCheck className="relative h-8 w-8 text-cyan-400" />
              <h3 className="relative mt-5 font-display text-2xl font-bold">{c.securityTitle}</h3>
              <ul className="relative mt-5 space-y-3 text-sm text-navy-100">
                {c.security.map((item) => (
                  <li key={item.slice(0, 20)} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="group relative mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
              >
                {c.demoLink}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
