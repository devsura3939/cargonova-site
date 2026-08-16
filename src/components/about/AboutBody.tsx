"use client";

import Link from "next/link";
import { ArrowRight, Target, Eye, ShieldCheck, Award, Users, Truck, Network, Leaf, Scale, HeartHandshake } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeadingT } from "@/components/shared/SectionHeadingT";
import { Reveal } from "@/components/shared/Reveal";
import { useLang, type Lang } from "@/lib/i18n";

type V = { title: string; text: string };
type P = { name: string; role: string; note: string };

const CONTENT: Record<Lang, {
  story: string[];
  mission: string;
  vision: string;
  values: V[];
  ops: V[];
  team: P[];
  safetyTitle: string;
  safety: string[];
  certs: V[];
  credsNote: string;
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
  numbers: { value: string; label: string }[];
}> = {
  en: {
    story: [
      "CargoNova started in 2012 with three trucks and one scheduled lane between Berlin and Warsaw. The founding bet was that shippers didn't need more promises — they needed a carrier that treated a schedule as a contract.",
      "That lane grew into a corridor. The corridor grew into a network. Today we move more than 10,000 shipments a year across 30+ regions, with 14 owned hubs, a 240-vehicle vetted network, and a control tower that watches every load around the clock.",
      "The technology we run on — live tracking, smart routing, telemetry, and digital documentation — exists for one reason: to make our delivery windows hold. The platform is the tool; reliability is the product.",
    ],
    mission:
      "To make freight predictable. We do that by running a dense network with committed schedules, measuring every delivery, and treating the exceptions — not the averages — as the real work.",
    vision:
      "A Europe where road freight is bought on service levels and measured in outcomes — where \"logistics partner\" means what it says, and supply chains stop losing money to delivery uncertainty.",
    values: [
      { title: "Commitments are contracts", text: "If we confirm a window, we defend it. When we can't, you hear it from us before it affects your operation — not after." },
      { title: "Safety before speed", text: "Every vehicle is inspected before dispatch, every driver is trained on securing your cargo, and every exception is reviewed." },
      { title: "The network is the product", text: "We invest in corridors, hubs, and telematics rather than marketing claims. Reliability compounds when the network is dense." },
      { title: "Efficiency is sustainability", text: "Fewer empty kilometers, better routing, and modern equipment reduce cost and emissions at the same time. We pursue both." },
    ],
    ops: [
      { title: "Planned, then monitored", text: "Every shipment is planned against corridor data before it moves, then watched by the control tower 24/7. Exceptions surface in minutes, not hours." },
      { title: "Measured, then published", text: "On-time performance, damage rate, and exception response are tracked per corridor and reported monthly — internally and to our program clients." },
      { title: "Owned, end to end", text: "A dedicated coordinator owns each shipment from booking to signed POD. No handoffs between departments, no 'not my desk' moments." },
    ],
    team: [
      { name: "Elena Varga", role: "Managing Director", note: "15 years in European road freight, previously network director at a top-10 EU carrier." },
      { name: "Jonas Keller", role: "Head of Operations", note: "Runs the control tower and corridor network from Berlin. Believes schedules are promises." },
      { name: "Priya Raman", role: "Chief Commercial Officer", note: "Builds logistics programs for mid-market and enterprise clients across Europe." },
      { name: "Marek Nowak", role: "Head of Fleet & Safety", note: "Owns vehicle readiness, driver programs, and the zero-compromise dispatch checklist." },
    ],
    safetyTitle: "Safety, structured",
    safety: [
      "Pre-dispatch inspection checklist on every vehicle — tires, brakes, temp units, securing gear",
      "Drivers trained on load securing per cargo type, refreshed annually",
      "Telematics monitoring of speed and driving behavior on every trip",
      "Incident review with root-cause analysis on every exception",
      "Defensive-driving and fatigue-management standards on long-haul lanes",
    ],
    certs: [
      { title: "ISO 9001 — Quality management", text: "Certified quality processes across operations. (Placeholder — certification documents to be added.)" },
      { title: "GDP-aligned pharma handling", text: "Temperature-controlled procedures aligned with EU GDP for pharmaceutical cargo." },
      { title: "ADR-trained drivers", text: "Hazmat-capable drivers and certified equipment for approved dangerous-goods lanes." },
    ],
    credsNote:
      "We only publish credentials we can document. Anything marked placeholder on this page will be completed before it's presented to a customer.",
    ctaTitle: "See how we operate on your freight",
    ctaText:
      "A quote, a lane test, or a full program review — the fastest way to judge a carrier is to give them one load.",
    ctaButton: "Request a quote",
    numbers: [
      { value: "10,000+", label: "shipments a year" },
      { value: "98.7%", label: "on-time delivery" },
      { value: "14", label: "owned and operated hubs" },
      { value: "240+", label: "vetted vehicles in network" },
      { value: "30+", label: "regions served" },
      { value: "24/7", label: "control tower coverage" },
    ],
  },
  ka: {
    story: [
      "CargoNova დაარსდა 2012 წელს სამი სატვირთოთი და ერთი დაგეგმილი მიმართულებით ბერლინსა და ვარშავას შორის. დამფუძნებლების მთავარი აზრი იყო: გამგზავნებს მეტი დაპირებები კი არ სჭირდებოდათ, არამედ გადამზიდავი, რომელიც განრიგს კონტრაქტად ეპყრობა.",
      "მიმართულება გადაიზარდა დერეფნად, დერეფანი კი — ქსელად. დღეს ჩვენ წელიწადში 10 000-ზე მეტ გადაზიდვას ვასრულებთ 30-ზე მეტ რეგიონში, გვაქვს 14 საკუთარი ჰაბი, 240-ზე მეტი შემოწმებული სატრანსპორტო საშუალების ქსელი და საკონტროლო ცენტრი, რომელიც თითოეულ ტვირთს საათის განმავლობაში აკვირდება.",
      "ტექნოლოგია, რომელზეც ჩვენ ვმუშაობთ — ცოცხალი თვალთვალი, ჭკვიანი მარშრუტიზაცია, ტელემეტრია და ციფრული დოკუმენტაცია — ერთი მიზნისთვის არსებობს: მიწოდების ვადები რომ საიმედოდ დავიცვათ. პლატფორმა ხელსაწყოა; სანდოობა — პროდუქტი.",
    ],
    mission:
      "ტვირთი პროგნოზირებადი გავხადოთ. ამას ვაღწევთ მკვრივი ქსელით, ფიქსირებული განრიგებით, ყოველი მიწოდების გაზომვით და გამონაკლისების — არა საშუალო მაჩვენებლების — რეალურ სამუშაოდ მიჩნევით.",
    vision:
      "ისეთი ევროპა, სადაც სახმელეთო ტვირთი იყიდება მომსახურების დონით და ფასდება შედეგებით — სადაც „ლოგისტიკური პარტნიორი“ სწორედ იმას ნიშნავს, რასაც ამბობს, და მიწოდების ქსელები ფულს აღარ კარგავენ დროის გაურკვევლობაზე.",
    values: [
      { title: "დაპირება კონტრაქტია", text: "თუ ვადას დავადასტურებთ, მას დავიცავთ. როცა არ შეგვიძლია, ამის შესახებ ჯერ თქვენ გაიგებთ — მანამ, სანამ ეს თქვენს ოპერაციას იმოქმედებს." },
      { title: "უსაფრთხოება სიჩქარეზე წინ", text: "ყოველი სატვირთო შემოწმებულია გაგზავნამდე, ყოველი მძღოლი გაწვრთნილია ტვირთის დამაგრებაში და ყოველი გამონაკლისი განიხილება." },
      { title: "ქსელია პროდუქტი", text: "ჩვენ ვდებთ დერეფნებში, ჰაბებსა და ტელემატიკაში, ვიდრე მარკეტინგულ განცხადებებში. სანდოობა მკვრივ ქსელში მრავლდება." },
      { title: "ეფექტურობა მდგრადობაა", text: "ნაკლები ცარიელი კილომეტრი, უკეთესი მარშრუტები და თანამედროვე აღჭურვილობა ერთდროულად ამცირებს ხარჯებსა და ემისიებს. ორივეს ვაღწევთ." },
    ],
    ops: [
      { title: "ჯერ დაგეგმვა, მერე კონტროლი", text: "ყოველი გადაზიდვა დაგეგმილია დერეფნის მონაცემებზე დაყრდნობით გადაადგილებამდე, შემდეგ კი 24/7 საკონტროლო ცენტრს აკვირდება. გამონაკლისები წუთებში ვლინდება, საათებში კი არა." },
      { title: "გავზომოთ, მერე გამოვაქვეყნოთ", text: "ვადების დაცვა, დაზიანებების მაჩვენებელი და გამონაკლისებზე რეაგირება ყოველ დერეფანზე ფიქსირდება და ყოველთვიურად ქვეყნდება — შიდა და პროგრამულ კლიენტებთან." },
      { title: "საკუთრებაში, თავიდან ბოლომდე", text: "დანიშნული კოორდინატორი ყოველ ტვირთს დაჯავშნიდან ხელმოწერილ დოკუმენტამდე მიჰყავს. არც განყოფილებებს შორის გადაცემა და არც „ეს ჩემი საქმე არ არის“." },
    ],
    team: [
      { name: "ელენა ვარგა", role: "მმართველი დირექტორი", note: "15 წელი ევროპულ სახმელეთო გადაზიდვებში, აქამდე ქსელის დირექტორი ევროკავშირის ტოპ-10 გადამზიდავში." },
      { name: "იონას კელერი", role: "ოპერაციების ხელმძღვანელი", note: "მართავს საკონტროლო ცენტრსა და დერეფნების ქსელს ბერლინიდან. მიაჩნია, რომ განრიგი დაპირებაა." },
      { name: "პრია რამანი", role: "კომერციული დირექტორი", note: "აშენებს ლოგისტიკურ პროგრამებს საშუალო და მსხვილი ბიზნესისთვის ევროპაში." },
      { name: "მარეკ ნოვაკი", role: "ავტოპარკისა და უსაფრთხოების ხელმძღვანელი", note: "პასუხისმგებელია ავტოპარკის მზადყოფნაზე, მძღოლების პროგრამებსა და დისპეჩერების მკაცრ ჩამონათვალზე." },
    ],
    safetyTitle: "უსაფრთხოება, სტრუქტურირებულად",
    safety: [
      "ყოველი სატვირთოს წინასწარი შემოწმების ჩამონათვალი — საბურავები, მუხრუჭები, ტემპერატურული დანადგარები, დამაგრების აღჭურვილობა",
      "მძღოლების ტრენინგი ტვირთის დამაგრებაში ტვირთის ტიპის მიხედვით, ყოველწლიური განახლებით",
      "სიჩქარისა და მართვის სტილის ტელემატიკური კონტროლი ყოველ მგზავრობაზე",
      "ინციდენტების განხილვა მიზეზების სრული ანალიზით ყოველ გამონაკლისზე",
      "თავდაცვითი მართვისა და დაღლილობის მართვის სტანდარტები საქალაქთაშორისო მიმართულებებზე",
    ],
    certs: [
      { title: "ISO 9001 — ხარისხის მართვა", text: "სერტიფიცირებული ხარისხის პროცესები ოპერაციებში. (ადგილი დაცულია — სერტიფიკატის დოკუმენტები დაემატება.)" },
      { title: "GDP-სთან შესაბამისი ფარმა მოპყრობა", text: "ტემპერატურული რეჟიმის პროცედურები ევროკავშირის GDP სტანდარტების შესაბამისად ფარმაცევტული ტვირთისთვის." },
      { title: "ADR-გაწვრთნილი მძღოლები", text: "საშიშ ტვირთებთან მუშაობის უნარის მქონე მძღოლები და სერტიფიცირებული აღჭურვილობა ნებადართული მიმართულებებისთვის." },
    ],
    credsNote:
      "ჩვენ ვაქვეყნებთ მხოლოდ იმ სერტიფიკატებს, რომელთა დოკუმენტირებაც შეგვიძლია. ამ გვერდზე მონიშნული ნებისმიერი ადგილის შინაარსი დასრულდება კლიენტისთვის წარდგენამდე.",
    ctaTitle: "ნახეთ, როგორ ვმუშაობთ თქვენს ტვირთზე",
    ctaText:
      "შეთავაზება, ტესტური მიმართულება თუ პროგრამის სრული მიმოხილვა — გადამზიდავის შესაფასებლად ყველაზე სწრაფი გზა ერთი დატვირთვის მიცემაა.",
    ctaButton: "მოითხოვეთ შეთავაზება",
    numbers: [
      { value: "10 000+", label: "გადაზიდვა წელიწადში" },
      { value: "98.7%", label: "ვადების დაცვა" },
      { value: "14", label: "საკუთარი ჰაბი" },
      { value: "240+", label: "შემოწმებული ავტოპარკი" },
      { value: "30+", label: "მომსახურე რეგიონი" },
      { value: "24/7", label: "საკონტროლო ცენტრი" },
    ],
  },
};

export function AboutBody() {
  const { lang } = useLang();
  const c = CONTENT[lang];

  return (
    <>
      {/* Story */}
      <Section variant="light">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeadingT eyebrowKey="pg.about.storyEyebrow" titleKey="pg.about.storyTitle" />
              <Reveal delay={0.1}>
                <div className="mt-6 space-y-5 text-pretty leading-relaxed text-muted">
                  {c.story.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                </div>
              </Reveal>
            </div>
            {/* Numbers panel */}
            <Reveal delay={0.15}>
              <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-8 text-white shadow-lift sm:p-10">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />
                <div className="pointer-events-none absolute inset-0 bg-grid-dark" />
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-electric-500/25 blur-[80px]" />
                <div className="relative grid grid-cols-2 gap-6 sm:grid-cols-3">
                  {c.numbers.map((n) => (
                    <div key={n.label}>
                      <p className="font-display text-3xl font-extrabold text-white">{n.value}</p>
                      <p className="mt-1 text-xs font-medium leading-snug text-navy-300">{n.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Mission / Vision */}
      <Section variant="dark">
        <div className="pointer-events-none absolute inset-0 bg-noise opacity-30" />
        <div className="relative grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm sm:p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-electric-500/20 text-electric-300">
                <Target className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-white">{lang === "ka" ? "მისია" : "Mission"}</h2>
              <p className="mt-3 text-pretty leading-relaxed text-navy-200">{c.mission}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm sm:p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400">
                <Eye className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-white">{lang === "ka" ? "ხედვა" : "Vision"}</h2>
              <p className="mt-3 text-pretty leading-relaxed text-navy-200">{c.vision}</p>
            </div>
          </Reveal>
        </div>

        {/* Values */}
        <div className="relative mt-16">
          <SectionHeadingT dark align="center" eyebrowKey="pg.about.valuesEyebrow" titleKey="pg.about.valuesTitle" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {c.values.map((v, i) => {
              const ValueIcon = [Scale, ShieldCheck, Network, Leaf][i % 4];
              return (
                <Reveal key={v.title} delay={0.06 * i}>
                  <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/[0.06]">
                    <ValueIcon className="h-6 w-6 text-cyan-400" strokeWidth={1.75} />
                    <h3 className="mt-4 font-display text-lg font-bold text-white">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy-200">{v.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Operations + Leadership */}
      <Section variant="mist">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeadingT eyebrowKey="pg.about.opsEyebrow" titleKey="pg.about.opsTitle" />
              <Reveal delay={0.1}>
                <div className="mt-8 space-y-5">
                  {c.ops.map((item) => (
                    <div key={item.title} className="flex gap-4 rounded-2xl border border-soft bg-surface p-5 shadow-card">
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-electric-500" />
                      <div>
                        <h3 className="font-display font-bold text-strong">{item.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <div>
              <SectionHeadingT eyebrowKey="pg.about.teamEyebrow" titleKey="pg.about.teamTitle" />
              <div className="mt-8 space-y-4">
                {c.team.map((person, i) => (
                  <Reveal key={person.name} delay={0.05 * i}>
                    <div className="flex items-start gap-4 rounded-2xl border border-soft bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy-900 font-display text-lg font-bold text-cyan-400">
                        {person.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                      <div>
                        <h3 className="font-display font-bold text-strong">{person.name}</h3>
                        <p className="text-xs font-semibold uppercase tracking-wide text-electric-600">{person.role}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted">{person.note}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Safety + certifications */}
      <Section variant="light">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-8 text-white shadow-lift sm:p-10">
                <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />
                <div className="pointer-events-none absolute inset-0 bg-grid-dark" />
                <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-cyan-500/15 blur-[80px]" />
                <ShieldCheck className="relative h-8 w-8 text-cyan-400" />
                <h2 className="relative mt-5 font-display text-2xl font-extrabold tracking-tight">{c.safetyTitle}</h2>
                <ul className="relative mt-5 space-y-3 text-sm leading-relaxed text-navy-100">
                  {c.safety.map((item) => (
                    <li key={item.slice(0, 24)} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <div>
              <SectionHeadingT eyebrowKey="pg.about.certsEyebrow" titleKey="pg.about.certsTitle" />
              <Reveal delay={0.1}>
                <div className="mt-8 space-y-4">
                  {c.certs.map((cert, i) => {
                    const CertIcon = [Award, Truck, Users][i % 3];
                    return (
                    <div key={cert.title} className="flex gap-4 rounded-2xl border border-soft bg-surface p-5 shadow-card">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-electric-100 text-electric-600">
                        <CertIcon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-display font-bold text-strong">{cert.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{cert.text}</p>
                      </div>
                    </div>
                    );
                  })}
                  <div className="flex items-center gap-3 rounded-2xl bg-surface-muted p-4">
                    <HeartHandshake className="h-5 w-5 shrink-0 text-electric-500" />
                    <p className="text-xs leading-relaxed text-ink">{c.credsNote}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA band */}
      <Section variant="light" className="pt-0">
        <Reveal>
          <div className="mx-auto flex max-w-3xl flex-col items-center rounded-3xl border border-soft bg-surface-muted p-10 text-center sm:p-12">
            <h2 className="text-balance font-display text-3xl font-extrabold tracking-tight text-strong sm:text-4xl">
              {c.ctaTitle}
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-muted sm:text-lg">{c.ctaText}</p>
            <Link
              href="/quote"
              className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-electric-500 px-8 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-electric-400"
            >
              {c.ctaButton}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
