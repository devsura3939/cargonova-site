/**
 * Fetch a REAL aircraft snapshot from OpenSky Network at build time.
 *
 * OpenSky's API is free and keyless but now locks CORS to its own origin, so
 * browsers cannot call it directly. Running this during `npm run build`
 * (via the prebuild hook) pulls the live ADS-B picture server-side and ships
 * it as a static JSON snapshot alongside the site — same-origin, no CORS.
 *
 * Every rebuild/deploy refreshes the snapshot, so the live map always shows
 * real aircraft that were actually airborne, stamped with the fetch time.
 * The script fails gracefully (keeps the previous snapshot) if OpenSky is
 * unreachable, so builds never break on a flaky upstream.
 */
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outFile = path.join(root, "public", "data", "aircraft-snapshot.json");

// Europe, Caucasus, Middle East, Central Asia — the network's home region.
const REGION = { lamin: 20, lomin: -25, lamax: 72, lomax: 65 };
const MAX_AIRCRAFT = 320;

async function main() {
  try {
    const { lamin, lomin, lamax, lomax } = REGION;
    const url = `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`OpenSky responded ${res.status}`);
    const json = await res.json();
    const states = Array.isArray(json?.states) ? json.states : null;
    if (!states) throw new Error("OpenSky returned no states");

    const aircraft = [];
    for (const s of states) {
      if (!s) continue;
      const [icao24, callsignRaw, originCountry, , , lon, lat, altRaw, onGround, velRaw, headingRaw] = s;
      const callsign = String(callsignRaw ?? "").trim().replace(/\s+/g, "");
      const altitudeM = altRaw ?? 0;
      if (onGround || altitudeM < 150) continue;
      if (callsign.length < 2) continue;
      aircraft.push({
        i: icao24,
        c: callsign,
        o: originCountry ?? "",
        la: lat,
        lo: lon,
        a: Math.round(altitudeM),
        v: Math.round(velRaw ?? 0),
        h: Math.round(headingRaw ?? 0),
      });
    }

    const payload = {
      fetchedAt: Date.now(),
      aircraft: aircraft.slice(0, MAX_AIRCRAFT),
    };

    mkdirSync(path.dirname(outFile), { recursive: true });
    writeFileSync(outFile, JSON.stringify(payload));
    process.stdout.write(
      `[snapshot] wrote ${payload.aircraft.length} aircraft to ${path.relative(root, outFile)}\n`,
    );
  } catch (err) {
    // Keep any previous snapshot; a stale snapshot beats a broken build.
    try {
      const prev = readFileSync(outFile, "utf8");
      process.stdout.write(
        `[snapshot] WARN ${err.message} — keeping previous snapshot (${JSON.parse(prev).aircraft?.length ?? 0} aircraft)\n`,
      );
    } catch {
      process.stdout.write(`[snapshot] WARN ${err.message} — no previous snapshot to keep\n`);
    }
  }
}

main();
