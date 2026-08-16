"use client";

import { useMemo, useState } from "react";
import { Search, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/shared/Reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs, faqCategories, searchFaqs } from "@/data/faq";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { faqCategoryKa } from "@/data/faq";

export function FaqExplorer() {
  const { t, lang } = useLang();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const isKa = lang === "ka";

  const results = useMemo(() => {
    const searched = searchFaqs(query);
    return category === "All" ? searched : searched.filter((f) => f.category === category);
  }, [query, category]);

  const catLabel = (cat: string) => (isKa ? faqCategoryKa[cat] ?? cat : cat);
  const qText = (f: (typeof faqs)[number]) => (isKa && f.questionKa ? f.questionKa : f.question);
  const aText = (f: (typeof faqs)[number]) => (isKa && f.answerKa ? f.answerKa : f.answer);

  return (
    <>
      {/* Search */}
      <Section variant="dark" className="py-12">
        <Container className="max-w-2xl">
          <label className="relative block">
            <span className="sr-only">{t("faq.search")}</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("faq.searchPh")}
              className="h-13 w-full rounded-2xl border border-white/15 bg-white/10 pl-11 pr-4 text-sm text-white placeholder:text-navy-300 backdrop-blur focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/15"
            />
          </label>
        </Container>
      </Section>

      <Section variant="light" className="pt-16">
        <Container>
          {/* Category chips */}
          <Reveal>
            <div className="flex flex-wrap justify-center gap-2">
              {["All", ...faqCategories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200",
                    category === cat
                      ? "bg-navy-850 text-white"
                      : "border border-soft bg-surface text-ink hover:border-electric-400 hover:text-electric-600 dark:hover:text-electric-400",
                  )}
                >
                  {catLabel(cat)}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Accordion */}
          {results.length > 0 ? (
            <Reveal delay={0.05}>
              <Accordion type="single" collapsible className="mx-auto mt-12 max-w-3xl rounded-3xl border border-soft bg-surface px-6 shadow-card sm:px-8">
                {results.map((faq) => (
                  <AccordionItem key={faq.question} value={faq.question}>
                    <AccordionTrigger>
                      <span className="flex items-center gap-3">
                        <span className="hidden rounded-full bg-surface-muted px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted sm:inline-block">
                          {catLabel(faq.category)}
                        </span>
                        {qText(faq)}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>{aText(faq)}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          ) : (
            <Reveal delay={0.05}>
              <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-dashed border-navy-200 bg-mist p-12 text-center dark:border-white/15">
                <p className="font-display text-lg font-bold text-strong">{t("faq.noMatches")}</p>
                <p className="mt-2 text-sm text-muted">{t("faq.noMatchesSub")}</p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-electric-600 hover:text-electric-500"
                >
                  <MessageCircleQuestion className="h-4 w-4" />
                  {t("faq.contactSupport")}
                </Link>
              </div>
            </Reveal>
          )}

          <Reveal delay={0.1}>
            <p className="mx-auto mt-10 max-w-3xl rounded-2xl bg-mist p-5 text-center text-sm text-navy-700 dark:text-navy-200">
              {t("faq.stillHave")}{" "}
              <Link href="/contact" className="font-semibold text-electric-600 underline decoration-electric-300 underline-offset-4 hover:text-electric-500">
                {t("faq.contactTeam")}
              </Link>{" "}
              {t("faq.replies")}
            </p>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
