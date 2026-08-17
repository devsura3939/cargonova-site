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
      <section className="relative overflow-hidden bg-navy-900 pb-16 pt-28 text-white sm:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />
        <div className="pointer-events-none absolute inset-0 bg-grid-dark" />
        <div className="pointer-events-none absolute -top-40 right-[-10%] h-105 w-105 rounded-full bg-electric-500/20 blur-[120px]" />
        <Container className="relative">
          <Breadcrumb
            dark
            items={[
              { name: t("nav.insights"), path: "/blog" },
              { name: postTitle(post.slug), path: `/blog/${post.slug}` },
            ]}
          />
          <div className="mt-8 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span className="rounded-full bg-electric-500 px-3 py-1 text-white">
                {catLabel(post.category)}
              </span>
              <span className="flex items-center gap-1.5 text-navy-300">
                <Clock className="h-3.5 w-3.5" /> {post.readTime} {t("blog.readTime")}
              </span>
              <span className="flex items-center gap-1.5 text-navy-300">
                <CalendarDays className="h-3.5 w-3.5" /> {formatDateLang(post.publishedAt, lang)}
              </span>
            </div>
            <h1 className="mt-5 text-balance font-display text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl">
              {postTitle(post.slug)}
            </h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-navy-200 sm:text-lg">
              {postExcerpt(post.slug)}
            </p>
            <p className="mt-7 text-sm font-semibold text-navy-300">
              {t("blog.by")} {post.author}
            </p>
          </div>
        </Container>
      </section>

      {/* Body */}
      <Section variant="light">
        <Container className="max-w-3xl">
          <Reveal>
            <div className="relative mb-10 h-64 overflow-hidden rounded-3xl shadow-card sm:h-80">
              <Image
                src={post.image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/30 to-transparent" />
            </div>

            {children}

            <div className="mt-12 rounded-3xl border border-soft bg-surface-muted p-7 sm:p-9">
              <h2 className="font-display text-xl font-bold text-strong">{t("blog.practiceTitle")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t("blog.practiceSub")}</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/quote"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-electric-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-electric-400"
                >
                  {t("cta.getQuote")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-soft bg-surface px-6 text-sm font-semibold text-ink transition-colors hover:border-electric-400 hover:text-electric-600 dark:hover:text-electric-400"
                >
                  {t("blog.talkSpecialist")}
                </Link>
              </div>
            </div>

            <Link
              href="/blog"
              className="group mt-10 inline-flex items-center gap-2 text-sm font-semibold text-electric-600 transition-colors hover:text-electric-500"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              {t("blog.backAll")}
            </Link>
          </Reveal>
        </Container>
      </Section>

      {/* Related */}
      {related.length > 0 ? (
        <Section variant="mist">
          <Container>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-strong">
              {t("blog.continueReading")}
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-soft bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
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
                    <span className="text-xs font-semibold text-electric-600">{catLabel(p.category)}</span>
                    <h3 className="mt-2.5 flex-1 font-display text-base font-bold leading-snug text-strong transition-colors group-hover:text-electric-600 dark:group-hover:text-electric-400">
                      {postTitle(p.slug)}
                    </h3>
                    <span className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-electric-600">
                      {t("blog.readArticle")}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
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
