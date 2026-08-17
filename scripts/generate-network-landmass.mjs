/**
 * Generates src/data/landmass.ts — a projected, simplified SVG path for the
 * Europe / Caucasus / North-Africa window used by the homepage network map.
 *
 * Source: Natural Earth 110m countries (public domain) via
 * https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json
 *
 * Run:  node scripts/generate-network-landmass.mjs
 * Input: the geojson at the URL below (fetched automatically if missing).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "src/data/landmass.ts");
const SRC = path.join(ROOT, "scripts/.world.geo.json");

const GEO_URL =
  "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

// Map window (lon/lat) — covers Copenhagen..Tbilisi, Barcelona..Istanbul,
// plus the North-African coast so the map reads as a true region, not a crop.
const LON_MIN = -15;
const LON_MAX = 57;
const LAT_MIN = 26;
const LAT_MAX = 64;

const VIEW_W = 1000; // canvas width in SVG units
const PAD = 36; // padding inside the canvas

if (!fs.existsSync(SRC)) {
  console.log(`Fetching ${GEO_URL} …`);
  const res = await fetch(GEO_URL);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  fs.writeFileSync(SRC, await res.text());
}

const fc = JSON.parse(fs.readFileSync(SRC, "utf8"));

/* ── Sutherland–Hodgman polygon clip against the lon/lat window ── */
function clipRing(ring, [x0, x1, y0, y1]) {
  const inside = (p, edge) =>
    edge === 0 ? p[0] >= x0 : edge === 1 ? p[0] <= x1 : edge === 2 ? p[1] >= y0 : p[1] <= y1;
  const inter = (a, b, edge) => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    let t;
    if (edge === 0) t = (x0 - a[0]) / dx;
    else if (edge === 1) t = (x1 - a[0]) / dx;
    else if (edge === 2) t = (y0 - a[1]) / dy;
    else t = (y1 - a[1]) / dy;
    return [a[0] + t * dx, a[1] + t * dy];
  };
  let out = ring;
  for (let edge = 0; edge < 4; edge++) {
    const input = out;
    out = [];
    if (input.length === 0) break;
    for (let i = 0; i < input.length; i++) {
      const cur = input[i];
      const prev = input[(i - 1 + input.length) % input.length];
      const curIn = inside(cur, edge);
      const prevIn = inside(prev, edge);
      if (curIn) {
        if (!prevIn) out.push(inter(prev, cur, edge));
        out.push(cur);
      } else if (prevIn) {
        out.push(inter(prev, cur, edge));
      }
    }
  }
  return out;
}

function polygonArea(ring) {
  let a = 0;
  for (let i = 0, n = ring.length; i < n; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % n];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a) / 2;
}

/* ── Projection: equirectangular, latitude-compensated ── */
// 1° of longitude ≈ cos(midLat) × 1° of latitude, so x and y end up in the
// same "degree-equivalent" units and the map keeps a true Europe aspect.
const midLat = ((LAT_MIN + LAT_MAX) / 2) * (Math.PI / 180);
const KX = Math.cos(midLat);
function proj([lon, lat]) {
  return [(lon - LON_MIN) * KX, LAT_MAX - lat];
}

/* ── Douglas–Peucker simplification (2D, in projected units) ── */
function perpDist(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}
function simplify(pts, tol) {
  if (pts.length < 4) return pts;
  let maxD = -1;
  let idx = -1;
  const a = pts[0];
  const b = pts[pts.length - 1];
  for (let i = 1; i < pts.length - 1; i++) {
    const d = perpDist(pts[i], a, b);
    if (d > maxD) {
      maxD = d;
      idx = i;
    }
  }
  if (maxD > tol) {
    const left = simplify(pts.slice(0, idx + 1), tol);
    const right = simplify(pts.slice(idx), tol);
    return left.slice(0, -1).concat(right);
  }
  return [a, b];
}

/* ── Assemble country paths ── */
const window = [LON_MIN, LON_MAX, LAT_MIN, LAT_MAX];
const countries = [];
let totalPts = 0;

for (const f of fc.features) {
  const name = f.properties?.name ?? "?";
  const geom = f.geometry;
  const polys = geom?.type === "Polygon" ? [geom.coordinates] : geom?.type === "MultiPolygon" ? geom.coordinates : [];
  let rings = [];
  for (const poly of polys) {
    for (const ring of poly) {
      const clipped = clipRing(ring, window);
      if (clipped.length < 3) continue;
      const area = polygonArea(clipped);
      if (area < 0.02) continue; // slivers along the window edge
      // Interior rings (holes) are listed after the outer ring; keep them all —
      // for a filled silhouette the even-odd fill rule handles holes correctly.
      rings.push(clipped.map(proj));
    }
  }
  if (rings.length === 0) continue;
  // Simplify each ring in projected space (tolerance in canvas fraction).
  const TOL = 0.0012; // ~1.2 units on a 1000-wide canvas
  const simplified = rings.map((r) => simplify(r, TOL));
  totalPts += simplified.reduce((n, r) => n + r.length, 0);
  countries.push({ name, rings: simplified });
}

/* ── Fit into canvas ── */
let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
for (const c of countries) {
  for (const r of c.rings) {
    for (const [x, y] of r) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
const spanX = maxX - minX || 1;
const spanY = maxY - minY || 1;
const scale = (VIEW_W - PAD * 2) / spanX;
const H = Math.round(scale * spanY + PAD * 2);
const offX = PAD - minX * scale;
const offY = PAD - minY * scale;

const toSvg = (x, y) => `${(x * scale + offX).toFixed(1)},${(y * scale + offY).toFixed(1)}`;

function ringToD(ring) {
  let d = `M${toSvg(...ring[0])}`;
  for (let i = 1; i < ring.length; i++) d += `L${toSvg(...ring[i])}`;
  return d + "Z";
}

const paths = [];
for (const c of countries) {
  for (const r of c.rings) paths.push(ringToD(r));
}

const header = `/**
 * Generated by scripts/generate-network-landmass.mjs — do not edit by hand.
 * Natural Earth 110m land (public domain) clipped to the network-map window
 * (lon ${LON_MIN}..${LON_MAX}, lat ${LAT_MIN}..${LAT_MAX}), projected and simplified.
 * Regenerate: node scripts/generate-network-landmass.mjs
 */

/** SVG path data for the land silhouette (one subpath per clipped ring). */
export const LANDMASS_D = ${JSON.stringify(paths.join(" "))};

/** Canvas the path data lives in. */
export const LANDMASS_VIEWBOX = "0 0 ${VIEW_W} ${H}";

/** Projection constants — project(lat, lon) in the map component must match. */
export const LANDMASS_PROJECT = {
  kx: ${KX.toFixed(6)},
  lonMin: ${LON_MIN},
  latMax: ${LAT_MAX},
  scale: ${scale.toFixed(6)},
  offX: ${offX.toFixed(3)},
  offY: ${offY.toFixed(3)},
};
`;

fs.writeFileSync(OUT, header);
console.log(`Wrote ${OUT}`);
console.log(`Countries drawn: ${countries.length}, total points: ${totalPts}`);
console.log(`Path string length: ${(paths.join(" ").length / 1024).toFixed(1)} KB, viewBox: 0 0 ${VIEW_W} ${H}`);
