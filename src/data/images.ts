/**
 * Photo registry — real photography served from Unsplash's CDN.
 * Every URL below was verified reachable (HTTP 200). Swap in your own
 * licensed brand photography by changing these paths; nothing else needs
 * to move. Attribution to photographers is provided in the footer.
 */

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=72&auto=format&fit=crop`;

export const images = {
  // Trucks & road freight
  semiHighway: u("1519003722824-194d4455a60c"),
  truckRoad: u("1587293852726-70cdb56c2866"),
  truckDusk: u("1580674285054-bed31e145f59"),
  highwayDusk: u("1544550581-5f7ceaf7f992"),
  aerialRoad: u("1625246333195-78d9c38ad449"),

  // Ports, containers & heavy cargo
  portCranes: u("1586528116311-ad8dd3c8310d"),
  containersAerial: u("1553413077-190dd305871c"),
  containersNight: u("1566576721346-d4a3b4eaeb55"),

  // Warehousing & operations
  warehouseForklift: u("1601584115197-04ecc0da31d7"),
  warehouseShelf: u("1578575437130-527eed3abbec"),
  opsTablet: u("1600880292203-757bb62b4baf"),
  automation: u("1605812860427-4024433a70fd"),
} as const;

export const unsplashAttribution =
  "Photography via Unsplash. Placeholder imagery — replace with licensed brand photography.";
