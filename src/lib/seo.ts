import type { Metadata } from "next";
import { brand } from "@/lib/constants";

type SeoArgs = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
};

/**
 * Builds consistent Metadata for every page: title template, description,
 * canonical URL, Open Graph and Twitter cards.
 */
export function buildMetadata({
  title,
  description = brand.description,
  path = "/",
  image = "/images/og-default.svg",
  type = "website",
}: SeoArgs): Metadata {
  const url = `${brand.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: brand.name,
      type,
      images: [{ url: `${brand.url}${image}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: brand.url,
    slogan: brand.tagline,
    description: brand.description,
    email: brand.contact.email,
    telephone: brand.contact.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tbilisi",
      addressCountry: "GE",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: brand.contact.salesEmail,
        availableLanguage: ["English", "Georgian"],
      },
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: brand.contact.supportEmail,
        availableLanguage: ["English", "Georgian"],
      },
    ],
  };
}

export function serviceJsonLd(
  name: string,
  description: string,
  path: string,
  provider = brand.name,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${brand.url}${path}`,
    provider: { "@type": "Organization", name: provider },
    areaServed: "Europe",
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${brand.url}${item.path}`,
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: `${brand.url}${article.path}`,
    datePublished: article.publishedAt,
    author: { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: brand.name },
  };
}
