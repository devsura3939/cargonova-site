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
        <div role="tablist" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {["All", ...blogCategories].map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={category === cat}
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
        <label className="relative block md:w-72">
          <span className="sr-only">{t("blog.searchArticles")}</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("blog.searchPh")}
            className="h-11 w-full rounded-full border border-soft bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-electric-500 focus:outline-none focus:ring-4 focus:ring-electric-500/15"
          />
        </label>
      </div>

      {/* Featured */}
      {category === "All" && !query ? (
        <Link
          href={`/blog/${featured.slug}`}
          className="group relative mt-10 block overflow-hidden rounded-3xl bg-navy-900 text-white shadow-lift transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
        >
          <Image
            src={featured.image}
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover opacity-30 transition-all duration-700 group-hover:scale-105 group-hover:opacity-40"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/40" />
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-30" />
          <div className="relative p-8 sm:p-12">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span className="rounded-full bg-electric-500 px-3 py-1 text-white">{t("blog.featured")}</span>
              <span className="text-navy-300">{catLabel(featured.category)}</span>
              <span className="flex items-center gap-1 text-navy-300">
                <Clock className="h-3.5 w-3.5" /> {featured.readTime}
              </span>
            </div>
            <h2 className="mt-5 text-balance font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              {postTitle(featured.slug)}
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-navy-200">{postExcerpt(featured.slug)}</p>
            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm text-navy-300">
                {featured.author} · {formatDate(featured.publishedAt)}
              </p>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-inset ring-white/15 transition-all duration-300 group-hover:bg-electric-500">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
          </div>
        </Link>
      ) : null}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-soft bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={post.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-7 pt-5">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="rounded-full bg-electric-100 px-2.5 py-1 text-electric-600">{catLabel(post.category)}</span>
                <span className="flex items-center gap-1 text-muted">
                  <Clock className="h-3 w-3" /> {post.readTime}
                </span>
              </div>
              <h3 className="mt-4 text-balance font-display text-xl font-bold leading-snug text-strong transition-colors group-hover:text-electric-600 dark:group-hover:text-electric-400">
                {postTitle(post.slug)}
              </h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">{postExcerpt(post.slug)}</p>
              <div className="mt-5 flex items-center justify-between border-t border-soft pt-4">
                <p className="text-xs text-muted">{formatDate(post.publishedAt)}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-electric-600">
                  {t("blog.read")}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-3xl border border-dashed border-navy-200 bg-mist p-12 text-center dark:border-white/15">
          <p className="font-display text-lg font-bold text-strong">{t("blog.noResults")}</p>
          <p className="mt-2 text-sm text-muted">{t("blog.noResultsSub")}</p>
        </div>
      )}
    </div>
  );
}
