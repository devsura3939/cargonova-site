import type { MetadataRoute } from "next";
import { brand } from "@/lib/constants";
import { services } from "@/data/services";
import { posts } from "@/data/blog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: brand.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...[
      "/services",
      "/industries",
      "/tracking",
      "/live-map",
      "/coverage",
      "/fleet",
      "/technology",
      "/about",
      "/careers",
      "/blog",
      "/faq",
      "/contact",
      "/quote",
      "/privacy",
      "/terms",
    ].map((route) => ({
      url: `${brand.url}${route}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${brand.url}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${brand.url}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...servicePages, ...blogPages];
}
