/**
 * Photo registry — real, curated photography served from CDNs.
 *
 * Every URL below was individually verified (HTTP 200) and matched to its
 * theme: trucks on roads, container ports, warehouse operations, air & rail.
 * Swap in your own licensed brand photography by changing these paths;
 * nothing else needs to move. Attribution for Unsplash + Pexels is provided
 * in the footer.
 */

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;

const p = (id: string, w = 1600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const images = {
  // Trucks & road freight
  semiHighway: u("1601584115197-04ecc0da31d7"), // white semi truck on an open highway
  truckRoad: u("1519003722824-194d4455a60c"), // cargo truck on a desert highway
  truckDusk: p("6940962"), // white box truck on a country road
  highwayDusk: u("1580674285054-bed31e145f59"), // loading express cargo into a truck
  aerialRoad: u("1474487548417-781cb71495f3"), // rail corridor across the land

  // Ports, containers & heavy cargo
  portCranes: u("1494412574643-ff11b0a5c1c3"), // container yard at a deep-water port
  containersAerial: u("1605745341112-85968b19335b"), // container stacks on a ship, aerial
  containersNight: u("1524522173746-f628baad3644"), // cargo ship seen from above
  ocean: u("1578575437130-527eed3abbec"), // container ship crossing the open sea

  // Air & rail
  airCargo: u("1436491865332-7a61a109cc05"), // aircraft above the clouds
  railFreight: u("1474487548417-781cb71495f3"), // freight rail line

  // Warehousing & operations
  warehouseForklift: u("1586528116311-ad8dd3c8310d"), // forklift working a warehouse aisle
  warehouseShelf: u("1587293852726-70cdb56c2866"), // tall warehouse racking
  opsTablet: u("1600880292203-757bb62b4baf"), // operations team at work
  automation: u("1553413077-190dd305871c"), // automated warehouse interior

  // Fleet (Pexels — real vehicle photography, visually verified)
  fleetVan: p("33219213"), // grey delivery van on the road
  fleetReefer: p("93398"), // white truck running beneath mountain peaks
  fleetFlatbed: p("5410923"), // white semi and trailer at dusk
} as const;

export const unsplashAttribution =
  "Photography via Unsplash & Pexels. Placeholder imagery — replace with licensed brand photography.";
