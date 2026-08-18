"use client";

import { MapPin, Clock3, Briefcase, GraduationCap, HeartPulse, Plane, TrendingUp, ShieldCheck, Banknote } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeadingT } from "@/components/shared/SectionHeadingT";
import { Reveal } from "@/components/shared/Reveal";
import { CareerForm } from "@/components/forms/CareerForm";
import { useLang, type Lang } from "@/lib/i18n";

type Job = {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  summary: string;
  requirements: string[];
};

type Item = { title: string; text: string };

const CONTENT: Record<Lang, {
  benefits: (Item & { icon: typeof Plane })[];
  jobs: Job[];
  openBadge: string;
  lookingFor: string;
  applyTitle: string;
  applyText: string;
  driverTitle: string;
  driverText: string;
  tags: string[];
  applyNote1: string;
  applyNote2: string;
}> = {
  en: {
    benefits: [
      { icon: Banknote, title: "Fair, transparent pay", text: "Clear salary bands and driver pay that includes planned hours — no surprises at the end of the month." },
      { icon: Plane, title: "Planned schedules", text: "We plan your week so you can plan your life. Predictable routes, fixed departure times, home time respected." },
      { icon: GraduationCap, title: "Training paid for", text: "CPC, ADR, and load-securing certifications funded and scheduled during work time." },
      { icon: HeartPulse, title: "Health & wellbeing", text: "Private health coverage for drivers and their families, plus a fatigue-management program that means what it says." },
      { icon: TrendingUp, title: "Real growth paths", text: "Drivers to dispatchers, planners to network leads — most of our leadership started in operations." },
      { icon: ShieldCheck, title: "Modern equipment", text: "Telematics-equipped vehicles, maintained on schedule, inspected before every dispatch." },
    ],
    jobs: [
      {
        slug: "ftl-dispatch-coordinator",
        title: "FTL Dispatch Coordinator",
        department: "Operations",
        location: "Berlin, Germany",
        type: "Full-time",
        summary: "Own the daily dispatch of FTL movements across our core corridors — matching vetted capacity to customer commitments and keeping schedules honest.",
        requirements: [
          "2+ years in transport operations or dispatch",
          "Strong planning and exception-handling skills",
          "Comfort with transport management systems",
          "Fluent English; German a plus",
        ],
      },
      {
        slug: "driver-eu-corridors",
        title: "Professional Driver — EU Corridors",
        department: "Drivers",
        location: "Berlin / Home base",
        type: "Full-time · CDL class CE",
        summary: "Drive scheduled EU corridors in modern, telematics-equipped trucks. Predictable routes, fixed schedules, and a team that plans your week so you can plan your life.",
        requirements: [
          "Valid CE license and digital tachograph card",
          "Valid CPC qualification",
          "1+ years of long-haul EU experience",
          "Clean driving record",
        ],
      },
      {
        slug: "ltl-network-planner",
        title: "LTL Network Planner",
        department: "Network Design",
        location: "Berlin, Germany",
        type: "Full-time",
        summary: "Design and optimize the LTL network across Europe — hub pairings, lane frequencies, and consolidation logic that keep service fast and costs competitive.",
        requirements: [
          "Background in network or transport planning",
          "Comfort with data and optimization tools",
          "Systems thinking and attention to detail",
          "Fluent English; German or Polish a plus",
        ],
      },
      {
        slug: "quality-and-compliance-officer",
        title: "Quality & Compliance Officer",
        department: "Quality",
        location: "Berlin, Germany",
        type: "Full-time",
        summary: "Own audits, incident reviews, and compliance across the corridor network — turning exceptions into process improvements before they repeat.",
        requirements: [
          "Experience in logistics quality or compliance",
          "Analytical mindset and clear communication",
          "Familiarity with ISO 9001 or similar",
          "Willingness to travel to hubs regularly",
        ],
      },
      {
        slug: "sales-manager-ftl-programs",
        title: "Sales Manager — FTL Programs",
        department: "Sales",
        location: "Berlin, Germany",
        type: "Full-time",
        summary: "Build and grow contracted FTL programs with mid-market and enterprise shippers — from first conversation to corridor-level commitments.",
        requirements: [
          "Proven B2B sales in logistics or freight",
          "Consultative selling and negotiation skills",
          "Comfort presenting to senior stakeholders",
          "Fluent German and English",
        ],
      },
    ],
    openBadge: "Open",
    lookingFor: "What we're looking for",
    applyTitle: "Apply in two minutes",
    applyText:
      "No cover-letter gymnastics. Tell us who you are and why you're interested — we read everything.",
    driverTitle: "Driver recruitment — what we promise you",
    driverText:
      "Fixed corridor routes, planned home time, modern equipment, and pay that reflects the hours you actually drive. If you're a professional driver, talk to us before your next contract.",
    tags: ["CE license", "CPC valid", "1+ year EU long-haul", "Clean record"],
    applyNote1: "Apply through the form above, or email",
    applyNote2: "",
  },
  ka: {
    benefits: [
      { icon: Banknote, title: "სამართლიანი, გამჭვირვალე ანაზღაურება", text: "მკაფიო სახელფასო დიაპაზონები და მძღოლების ანაზღაურება დაგეგმილი საათების ჩათვლით — სიურპრიზების გარეშე თვის ბოლოს." },
      { icon: Plane, title: "დაგეგმილი განრიგი", text: "ჩვენ თქვენს კვირას ვგეგმავთ, რომ თქვენც დაგეგმოთ თქვენი ცხოვრება. პროგნოზირებადი მარშრუტები, ფიქსირებული გასვლის დროები, სახლში დრო პატივისცემით." },
      { icon: GraduationCap, title: "ანაზღაურებადი ტრენინგი", text: "CPC, ADR და ტვირთის დამაგრების სერტიფიკატები დაფინანსებულია და დაგეგმილია სამუშაო დროში." },
      { icon: HeartPulse, title: "ჯანმრთელობა და კეთილდღეობა", text: "კერძო სამედიცინო დაფარვა მძღოლებისა და მათი ოჯახებისთვის, პლუს დაღლილობის მართვის პროგრამა, რომელიც სიტყვას იცავს." },
      { icon: TrendingUp, title: "რეალური ზრდის გზები", text: "მძღოლებიდან დისპეტჩერებამდე, დამგეგმავებიდან ქსელის ხელმძღვანელებამდე — ჩვენი ლიდერების უმეტესობა ოპერაციებიდან დაიწყო." },
      { icon: ShieldCheck, title: "თანამედროვე აღჭურვილობა", text: "ტელემატიკით აღჭურვილი სატვირთოები, რეგულარული მოვლა და შემოწმება ყოველ გაგზავნამდე." },
    ],
    jobs: [
      {
        slug: "ftl-dispatch-coordinator",
        title: "FTL დისპეტჩერი-კოორდინატორი",
        department: "ოპერაციები",
        location: "ბერლინი, გერმანია",
        type: "სრული განაკვეთი",
        summary: "მართეთ FTL გადაზიდვების ყოველდღიური დისპეტჩერიზაცია ჩვენს ძირითად დერეფნებზე — შეადარეთ შემოწმებული ტევადობა კლიენტების ვალდებულებებს და დაიცავით განრიგის სანდოობა.",
        requirements: [
          "2+ წელი სატრანსპორტო ოპერაციებში ან დისპეტჩერიზაციაში",
          "დაგეგმვისა და გამონაკლისებთან მუშაობის კარგი უნარები",
          "თავდაჯერებული მუშაობა სატრანსპორტო მართვის სისტემებთან",
          "ინგლისურის თავისუფლად ცოდნა; გერმანული უპირატესობაა",
        ],
      },
      {
        slug: "driver-eu-corridors",
        title: "პროფესიონალი მძღოლი — ევროკავშირის დერეფნები",
        department: "მძღოლები",
        location: "ბერლინი / საბაზო ქალაქი",
        type: "სრული განაკვეთი · CE კლასი",
        summary: "მართეთ დაგეგმილი ევროკავშირის დერეფნები თანამედროვე, ტელემატიკით აღჭურვილ სატვირთოებზე. პროგნოზირებადი მარშრუტები, ფიქსირებული განრიგი და გუნდი, რომელიც თქვენს კვირას გეგმავს.",
        requirements: [
          "მოქმედი CE ლიცენზია და ციფრული ტახოგრაფის ბარათი",
          "მოქმედი CPC კვალიფიკაცია",
          "1+ წელი შორ მანძილზე მუშაობის გამოცდილება ევროკავშირში",
          "სუფთა მართვის ისტორია",
        ],
      },
      {
        slug: "ltl-network-planner",
        title: "LTL ქსელის დამგეგმავი",
        department: "ქსელის დიზაინი",
        location: "ბერლინი, გერმანია",
        type: "სრული განაკვეთი",
        summary: "დაგეგმეთ და ოპტიმიზაცია გაუკეთეთ LTL ქსელს ევროპის მასშტაბით — ჰაბების შეწყვილება, მიმართულებების სიხშირე და კონსოლიდაციის ლოგიკა, რომ სერვისი სწრაფი და ხარჯები კონკურენტუნარიანი დარჩეს.",
        requirements: [
          "ქსელის ან სატრანსპორტო დაგეგმვის გამოცდილება",
          "მუშაობა მონაცემებთან და ოპტიმიზაციის ინსტრუმენტებთან",
          "სისტემური აზროვნება და დეტალებზე ყურადღება",
          "ინგლისურის თავისუფლად ცოდნა; გერმანული ან პოლონური უპირატესობაა",
        ],
      },
      {
        slug: "quality-and-compliance-officer",
        title: "ხარისხისა და შესაბამისობის ოფიცერი",
        department: "ხარისხი",
        location: "ბერლინი, გერმანია",
        type: "სრული განაკვეთი",
        summary: "მართეთ აუდიტები, ინციდენტების განხილვა და შესაბამისობა დერეფნების ქსელში — აქციეთ გამონაკლისები პროცესების გაუმჯობესებად, სანამ განმეორდება.",
        requirements: [
          "ლოგისტიკური ხარისხის ან შესაბამისობის გამოცდილება",
          "ანალიტიკური აზროვნება და მკაფიო კომუნიკაცია",
          "ISO 9001-ის ან მსგავსი სტანდარტების ცოდნა",
          "რეგულარული მივლინებები ჰაბებში",
        ],
      },
      {
        slug: "sales-manager-ftl-programs",
        title: "გაყიდვების მენეჯერი — FTL პროგრამები",
        department: "გაყიდვები",
        location: "ბერლინი, გერმანია",
        type: "სრული განაკვეთი",
        summary: "შექმენით და განავითარეთ საკონტრაქტო FTL პროგრამები საშუალო და მსხვილი გამგზავნებისთვის — პირველი საუბრიდან დერეფნის დონის ვალდებულებებამდე.",
        requirements: [
          "დადასტურებული B2B გაყიდვები ლოგისტიკაში ან ტვირთებში",
          "კონსულტაციური გაყიდვისა და მოლაპარაკების უნარები",
          "თავდაჯერებული კომუნიკაცია უფროს მენეჯმენტთან",
          "გერმანულისა და ინგლისურის თავისუფლად ცოდნა",
        ],
      },
    ],
    openBadge: "ღიაა",
    lookingFor: "ვის ვეძებთ",
    applyTitle: "მიმართეთ ორ წუთში",
    applyText:
      "არავითარი ზედმეტი სამოტივაციო წერილი. მოგვიყევით ვინ ხართ და რატომ გაინტერესებთ — ყველაფერს ვკითხულობთ.",
    driverTitle: "მძღოლების დაქირავება — რას გპირდებით",
    driverText:
      "ფიქსირებული დერეფნის მარშრუტები, დაგეგმილი სახლში დრო, თანამედროვე აღჭურვილობა და ანაზღაურება, რომელიც ასახავს რეალურად გატარებულ საათებს. თუ პროფესიონალი მძღოლი ხართ, ესაუბრეთ ჩვენს გუნდს თქვენი შემდეგი კონტრაქტის დადებამდე.",
    tags: ["CE ლიცენზია", "მოქმედი CPC", "1+ წელი ევროკავშირში", "სუფთა ისტორია"],
    applyNote1: "მიმართეთ ზემოთ მოცემული ფორმით, ან მისწერეთ",
    applyNote2: "",
  },
};

export function CareersBody() {
  const { lang } = useLang();
  const c = CONTENT[lang];

  return (
    <>
      {/* Benefits */}
      <Section variant="light">
        <SectionHeadingT
          align="center"
          eyebrowKey="pg.careers.whyEyebrow"
          titleKey="pg.careers.whyTitle"
          descKey="pg.careers.whySub"
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {c.benefits.map((b, i) => (
            <Reveal key={b.title} delay={0.05 * (i % 3)}>
              <div className="h-full rounded-3xl border border-soft bg-surface p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-electric-100 text-electric-600">
                  <b.icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-strong">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Open roles */}
      <Section variant="mist">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <SectionHeadingT
              eyebrowKey="pg.careers.rolesEyebrow"
              titleKey="pg.careers.rolesTitle"
              descKey="pg.careers.rolesSub"
            />
            <div className="mt-10 space-y-4">
              {c.jobs.map((job, i) => (
                <Reveal key={job.slug} delay={0.04 * i}>
                  <div className="group rounded-3xl border border-soft bg-surface p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-lg font-bold text-strong">{job.title}</h3>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-muted">
                          <span className="flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5" /> {job.department}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock3 className="h-3.5 w-3.5" /> {job.type}
                          </span>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                        {c.openBadge}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{job.summary}</p>
                    <details className="group/details mt-4">
                      <summary className="cursor-pointer list-none text-sm font-semibold text-electric-600 transition-colors hover:text-electric-500">
                        {c.lookingFor}
                        <span className="ml-1 inline-block transition-transform duration-200 group-open/details:rotate-180">▾</span>
                      </summary>
                      <ul className="mt-3 space-y-1.5 rounded-2xl bg-surface-muted p-4 text-sm text-ink">
                        {job.requirements.map((req) => (
                          <li key={req} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-electric-500" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Application */}
          <div>
            <Reveal className="sticky top-24">
              <div className="rounded-3xl border border-soft bg-surface p-7 shadow-card sm:p-9">
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-strong">
                  {c.applyTitle}
                </h2>
                <p className="mt-2 text-sm text-muted">{c.applyText}</p>
                <div className="mt-7">
                  <CareerForm />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Driver recruitment */}
      <Section variant="light">
        <Container className="max-w-4xl">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-8 text-center text-white sm:p-12">
              <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />
              <div className="pointer-events-none absolute inset-0 bg-grid-dark" />
              <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-electric-500/25 blur-[80px]" />
              <div className="relative">
                <h2 className="text-balance font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {c.driverTitle}
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-pretty text-navy-200">{c.driverText}</p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  {c.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-navy-100">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-8 text-sm text-navy-300">
                  {c.applyNote1}{" "}
                  <a href="mailto:careers@brb-enterprise.com" className="font-semibold text-white underline decoration-cyan-400/60 underline-offset-4">
                    careers@brb-enterprise.com
                  </a>
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
