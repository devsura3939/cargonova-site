"use client";

import { useLang, type DictKey } from "@/lib/i18n";

/**
 * Maps between data-file slugs/ids and i18n dictionary keys so data-driven
 * content (services, fleet, regions, industries) renders in the active
 * language without duplicating strings in the data files.
 */

export const serviceTitleKey: Record<string, DictKey> = {
  "ground-freight": "svc.title.groundFreight",
  "full-truckload": "svc.title.ftl",
  ltl: "svc.title.ltl",
  express: "svc.title.express",
  refrigerated: "svc.title.refrigerated",
  oversized: "svc.title.oversized",
  warehousing: "svc.title.warehousing",
  "business-logistics": "svc.title.consulting",
};

export const serviceShortKey: Record<string, DictKey> = {
  "ground-freight": "svc.short.groundFreight",
  "full-truckload": "svc.short.ftl",
  ltl: "svc.short.ltl",
  express: "svc.short.express",
  refrigerated: "svc.short.refrigerated",
  oversized: "svc.short.oversized",
  warehousing: "svc.short.warehousing",
  "business-logistics": "svc.short.consulting",
};

/** Featured-card feature bullets, keyed by index (ground-freight features). */
export const featuredFeatureKey: DictKey[] = ["svc.gf.f1", "svc.gf.f2", "svc.gf.f3"];

export const fleetCategoryKey: Record<string, DictKey> = {
  all: "fleet.cat.all",
  express: "fleet.cat.express",
  standard: "fleet.cat.standard",
  refrigerated: "fleet.cat.refrigerated",
  heavy: "fleet.cat.heavy",
};

export const fleetIdealKey: Record<string, DictKey> = {
  "sprinter-van": "fleet.ideal.sprinter",
  "box-truck": "fleet.ideal.box",
  "semi-trailer": "fleet.ideal.semi",
};

export const regionNoteKey: Record<string, DictKey> = {
  dach: "cov.region.dachNote",
  benelux: "cov.region.beneluxNote",
  scandinavia: "cov.region.scandinaviaNote",
  csee: "cov.region.cseeNote",
  iberia: "cov.region.iberiaNote",
  caucasus: "cov.region.caucasusNote",
};

export const industryProblemKey: Record<string, DictKey> = {
  manufacturing: "ind.problem.manufacturing",
  retail: "ind.problem.retail",
  construction: "ind.problem.construction",
  automotive: "ind.problem.automotive",
  "food-beverage": "ind.problem.food",
  ecommerce: "ind.problem.ecommerce",
  healthcare: "ind.problem.healthcare",
  "industrial-equipment": "ind.problem.industrial",
};

/** Resolve a slug against a map, falling back to the slug itself. */
export function useDataT() {
  const { t } = useLang();
  const lookup = (map: Record<string, DictKey>, key: string) =>
    map[key] ? t(map[key]) : key;
  return {
    serviceTitle: (slug: string) => lookup(serviceTitleKey, slug),
    serviceShort: (slug: string) => lookup(serviceShortKey, slug),
    fleetCategory: (slug: string) => lookup(fleetCategoryKey, slug),
    fleetIdeal: (slug: string) => lookup(fleetIdealKey, slug),
    regionNote: (id: string) => lookup(regionNoteKey, id),
    industryProblem: (slug: string) => lookup(industryProblemKey, slug),
  };
}
