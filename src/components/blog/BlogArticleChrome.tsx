"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Clock, CalendarDays } from "lucide-react";
import type { BlogPost } from "@/types";
import { formatDateLang } from "@/lib/utils";
import { useLang, type DictKey } from "@/lib/i18n";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";

export function BlogArticleChrome({
  post,
  related,
  children,
}: {
  post: BlogPost;
  related: BlogPost[];
  children: React.ReactNode;
}) {
  const { t, lang } = useLang();
  const catLabel = (cat: string) => t(`blog.cat.${cat}` as DictKey);
  const postTitle = (slug: string) => t(`blog.post.${slug}.title` as DictKey);
  const postExcerpt = (slug: string) => t(`blog.post.${slug}.excerpt` as DictKey);

  return (
    <>
      {/* Article header */}
      <section className="relative overflow-hidden bg-ink-950 pb-16 pt-28 text-fog-50 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />
        <div className="pointer-events-none absolute inset-0 bg-grid-dark" />
        <div className="pointer-events-none absolute -top-40 right-[-10%] h-105 w-105 rounded-full bg-signal/20 blur-[120px]" />
        <Container className="relative">
          <Breadcrumb
            dark
            items={[
              { name: t("nav.insights"), path: "/blog" },
              { name: postTitle(post.slug), path: `/blog/${post.slug}` },
            ]}
          />
          <div className="mt-8 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="border border-signal/50 bg-signal/15 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-signal-400">
                {catLabel(post.category)}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-fog-500">
                <Clock className="h-3 w-3" /> {post.readTime} {t("blog.readTime")}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-fog-500">
                <CalendarDays className="h-3 w-3" /> {formatDateLang(post.publishedAt, lang)}
              </span>
            </div>
            <h1 className="mt-5 text-balance font-display text-3xl font-semibold leading-[1.06] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              {postTitle(post.slug)}
            </h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-fog-400 sm:text-lg">
              {postExcerpt(post.slug)}
            </p>
            <p className="mt-7 label text-fog-500">
              {t("blog.by")} {post.author}
            </p>
          </div>
        </Container>
      </section>

      {/* Body */}
      <Section variant="light">
        <Container className="max-w-3xl">
          <Reveal>
            <div className="relative mb-10 h-64 overflow-hidden border border-soft dark:border-white/10 sm:h-80">
              <Image
                src={post.image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 to-transparent" />
            </div>

            {children}

            <div className="mt-12 border border-soft bg-surface-muted p-7 sm:p-9 dark:border-white/10">
              <p className="label text-signal-600 dark:text-signal-400">{t("blog.practiceTitle")}</p>
              <p className="mt-3 text-pretty leading-relaxed text-ink dark:text-fog-300">{t("blog.practiceSub")}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/quote">
                    {t("cta.getQuote")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact">{t("blog.talkSpecialist")}</Link>
                </Button>
              </div>
            </div>

            <Link
              href="/blog"
              className="group mt-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-signal-600 transition-colors hover:text-signal dark:text-signal-400"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" />
              {t("blog.backAll")}
            </Link>
          </Reveal>
        </Container>
      </Section>

      {/* Related */}
      {related.length > 0 ? (
        <Section variant="mist">
          <Container>
            <h2 className="font-display text-2xl font-semibold tracking-[-0.025em] text-strong dark:text-fog-50">
              {t("blog.continueReading")}
            </h2>
            <div className="mt-8 grid gap-px bg-soft md:grid-cols-3 dark:bg-white/[0.08]">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex h-full flex-col bg-surface transition-colors duration-150 hover:bg-surface-hover dark:bg-ink-950 dark:hover:bg-white/[0.04]"
                >
                  <div className="relative h-36 overflow-hidden">
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-signal-600 dark:text-signal-400">
                      {catLabel(p.category)}
                    </span>
                    <h3 className="mt-2.5 flex-1 font-display text-base font-semibold leading-snug text-strong transition-colors group-hover:text-signal-600 dark:text-fog-50 dark:group-hover:text-signal-400">
                      {postTitle(p.slug)}
                    </h3>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-signal-600 dark:text-signal-400">
                      {t("blog.readArticle")}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
