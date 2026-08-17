"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight, Clock } from "lucide-react";
import { posts, blogCategories } from "@/data/blog";
import { cn, formatDateLang } from "@/lib/utils";
import { useLang, type DictKey } from "@/lib/i18n";

export function BlogExplorer() {
  const { t, lang } = useLang();
  const [category, setCategory] = useState<string>("All");

  const catLabel = (cat: string) => t(`blog.cat.${cat}` as DictKey);
  const postTitle = (slug: string) => t(`blog.post.${slug}.title` as DictKey);
  const postExcerpt = (slug: string) => t(`blog.post.${slug}.excerpt` as DictKey);
  const [query, setQuery] = useState("");

  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.slug !== featured.slug);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rest.filter((p) => {
      const matchCat = category === "All" || p.category === category;
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [category, query, rest]);

  function formatDate(iso: string) {
    return formatDateLang(iso, lang);
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="tablist" aria-label="Filter by category" className="flex flex-wrap gap-1 border border-soft p-1 dark:border-white/10">
          {["All", ...blogCategories].map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={category === cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-150",
                category === cat
                  ? "bg-ink-950 text-fog-50 dark:bg-white/10"
                  : "text-muted hover:text-strong dark:hover:text-fog-50",
              )}
            >
              {catLabel(cat)}
            </button>
          ))}
        </div>
        <label className="relative block md:w-72">
          <span className="sr-only">{t("blog.searchArticles")}</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("blog.searchPh")}
            className="h-11 w-full border border-soft bg-surface pl-10 pr-4 font-mono text-[11px] uppercase tracking-[0.08em] text-ink placeholder:normal-case placeholder:tracking-normal placeholder:text-muted focus:border-signal focus:outline-none dark:border-white/10 dark:bg-ink-950 dark:text-fog-50"
          />
        </label>
      </div>

      {/* Featured */}
      {category === "All" && !query ? (
        <Link
          href={`/blog/${featured.slug}`}
          className="group relative mt-10 block overflow-hidden border border-white/10 bg-ink-950 text-fog-50"
        >
          <Image
            src={featured.image}
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover opacity-30 transition-all duration-700 group-hover:scale-105 group-hover:opacity-40"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40" />
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-30" />
          <div className="pointer-events-none absolute inset-0 bg-grid-dark" />
          <div className="relative p-8 sm:p-12">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="border border-signal/50 bg-signal/15 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-signal-400">
                {t("blog.featured")}
              </span>
              <span className="label text-fog-500">{catLabel(featured.category)}</span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-fog-500">
                <Clock className="h-3 w-3" /> {featured.readTime}
              </span>
            </div>
            <h2 className="mt-5 text-balance font-display text-3xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-4xl">
              {postTitle(featured.slug)}
            </h2>
            <p className="mt-4 max-w-xl text-pretty leading-relaxed text-fog-400">{postExcerpt(featured.slug)}</p>
            <div className="mt-8 flex items-center justify-between">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-fog-500">
                {featured.author} · {formatDate(featured.publishedAt)}
              </p>
              <span className="inline-flex h-10 w-10 items-center justify-center bg-white/[0.06] text-fog-50 transition-colors duration-150 group-hover:bg-signal group-hover:text-ink-950">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
          </div>
        </Link>
      ) : null}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-px bg-soft md:grid-cols-2 lg:grid-cols-3 dark:bg-white/[0.08]">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col bg-surface transition-colors duration-150 hover:bg-surface-hover dark:bg-ink-950 dark:hover:bg-white/[0.04]"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={post.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-2">
                <span className="border border-soft px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-signal-600 dark:border-white/12 dark:text-signal-400">
                  {catLabel(post.category)}
                </span>
                <span className="flex items-center gap-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted">
                  <Clock className="h-3 w-3" /> {post.readTime}
                </span>
              </div>
              <h3 className="mt-4 text-balance font-display text-xl font-semibold leading-snug text-strong transition-colors group-hover:text-signal-600 dark:text-fog-50 dark:group-hover:text-signal-400">
                {postTitle(post.slug)}
              </h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">{postExcerpt(post.slug)}</p>
              <div className="mt-5 flex items-center justify-between border-t border-soft pt-4 dark:border-white/10">
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                  {formatDate(post.publishedAt)}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-signal-600 dark:text-signal-400">
                  {t("blog.read")}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                </span>
              </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-10 border border-dashed border-soft p-12 text-center dark:border-white/15">
          <p className="font-display text-lg font-semibold text-strong dark:text-fog-50">{t("blog.noResults")}</p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{t("blog.noResultsSub")}</p>
        </div>
      )}
    </div>
  );
}
