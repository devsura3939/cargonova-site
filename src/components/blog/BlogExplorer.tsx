"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, Clock } from "lucide-react";
import { posts, blogCategories } from "@/data/blog";
import { cn } from "@/lib/utils";

export function BlogExplorer() {
  const [category, setCategory] = useState<string>("All");
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
    return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(iso));
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
                  : "border border-navy-200 bg-white text-navy-700 hover:border-electric-400 hover:text-electric-600",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <label className="relative block md:w-72">
          <span className="sr-only">Search articles</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            className="h-11 w-full rounded-full border border-navy-200 bg-white pl-10 pr-4 text-sm text-ink placeholder:text-slate/70 focus:border-electric-500 focus:outline-none focus:ring-4 focus:ring-electric-500/15"
          />
        </label>
      </div>

      {/* Featured */}
      {category === "All" && !query ? (
        <Link
          href={`/blog/${featured.slug}`}
          className="group relative mt-10 block overflow-hidden rounded-3xl bg-navy-900 p-8 text-white shadow-lift transition-all duration-300 hover:-translate-y-1 hover:shadow-glow sm:p-12"
        >
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />
          <div className="pointer-events-none absolute inset-0 bg-grid-dark" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-electric-500/25 blur-[90px]" />
          <div className="relative max-w-2xl">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span className="rounded-full bg-electric-500 px-3 py-1 text-white">Featured</span>
              <span className="text-navy-300">{featured.category}</span>
              <span className="flex items-center gap-1 text-navy-300">
                <Clock className="h-3.5 w-3.5" /> {featured.readTime}
              </span>
            </div>
            <h2 className="mt-5 text-balance font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              {featured.title}
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-navy-200">{featured.excerpt}</p>
            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm text-navy-300">
                {featured.author} · {formatDate(featured.publishedAt)}
              </p>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-inset ring-white/15 transition-all duration-300 group-hover:bg-electric-500">
                <ArrowRight className="h-4 w-4" />
              </span>
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
              className="group flex h-full flex-col rounded-3xl border border-navy-100 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="rounded-full bg-electric-100 px-2.5 py-1 text-electric-600">{post.category}</span>
                <span className="flex items-center gap-1 text-slate">
                  <Clock className="h-3 w-3" /> {post.readTime}
                </span>
              </div>
              <h3 className="mt-4 text-balance font-display text-xl font-bold leading-snug text-navy-900 transition-colors group-hover:text-electric-600">
                {post.title}
              </h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate">{post.excerpt}</p>
              <div className="mt-5 flex items-center justify-between border-t border-navy-100 pt-4">
                <p className="text-xs text-slate">{formatDate(post.publishedAt)}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-electric-600">
                  Read
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-3xl border border-dashed border-navy-200 bg-mist p-12 text-center">
          <p className="font-display text-lg font-bold text-navy-900">No articles found</p>
          <p className="mt-2 text-sm text-slate">
            Try a different search term or category.
          </p>
        </div>
      )}
    </div>
  );
}
