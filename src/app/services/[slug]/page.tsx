import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { services, getService } from "@/data/services";
import { TranslatedPageHero } from "@/components/shared/TranslatedPageHero";
import { ServiceDetailBody } from "@/components/services/ServiceDetailBody";
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
        <div className="flex flex-wrap gap-3">
          {service.features.slice(0, 4).map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-1.5 text-xs font-semibold text-navy-100 backdrop-blur"
            >
              <Check className="h-3.5 w-3.5 text-cyan-400" />
              {f}
            </span>
          ))}
        </div>
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
