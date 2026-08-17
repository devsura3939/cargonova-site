import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services, getService } from "@/data/services";
import { TranslatedPageHero } from "@/components/shared/TranslatedPageHero";
import { ServiceDetailBody } from "@/components/services/ServiceDetailBody";
import { ServiceFeatureChips } from "@/components/services/ServiceFeatureChips";
import { CTASection } from "@/components/sections/CTASection";
import { buildMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { serviceTitleKey, serviceShortKey } from "@/lib/data-i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.title,
    description: service.short,
    path: `/services/${slug}`,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const index = services.findIndex((s) => s.slug === slug);
  const next = services[(index + 1) % services.length];
  const prev = services[(index - 1 + services.length) % services.length];

  const jsonLd = [
    serviceJsonLd(service.title, service.description, `/services/${slug}`),
    breadcrumbJsonLd([
      { name: "Services", path: "/services" },
      { name: service.title, path: `/services/${slug}` },
    ]),
    faqJsonLd(service.faqs),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TranslatedPageHero
        crumbKey="nav.services"
        crumbPath="/services"
        eyebrowKey="pg.svc.eyebrow"
        titleKey={serviceTitleKey[slug]}
        descKey={serviceShortKey[slug]}
      >
        <ServiceFeatureChips service={service} />
      </TranslatedPageHero>

      <ServiceDetailBody
        service={service}
        slug={slug}
        prev={{ slug: prev.slug, title: prev.title }}
        next={{ slug: next.slug, title: next.title }}
      />

      <CTASection />
    </>
  );
}
