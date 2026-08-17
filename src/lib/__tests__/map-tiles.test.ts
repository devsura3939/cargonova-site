import { describe, expect, it } from "vitest";
import { tileConfig } from "@/lib/mapTiles";

describe("RouteMap tile config", () => {
  it("always provides a non-empty subdomains string in both themes", () => {
    for (const dark of [false, true]) {
      const cfg = tileConfig(dark);
      expect(cfg.subdomains, `dark=${dark}`).toBeTypeOf("string");
      expect(cfg.subdomains.length, `dark=${dark}`).toBeGreaterThan(0);
    }
  });

  it("light theme keeps subdomains even though the URL has no {s} placeholder", () => {
    // Regression: `subdomains: undefined` was passed for light mode, overriding
    // Leaflet's default "abc". Leaflet's getTileUrl always calls _getSubdomain,
    // so any rendered map crashed with
    // "Cannot read properties of undefined (reading 'length')".
    const light = tileConfig(false);
    expect(light.url).not.toContain("{s}");
    expect(light.subdomains).toBe("abc");
  });

  it("dark theme targets the CARTO host with its own subdomains", () => {
    const dark = tileConfig(true);
    expect(dark.url).toContain("{s}");
    expect(dark.url).toContain("basemaps.cartocdn.com");
    expect(dark.subdomains).toBe("abcd");
  });
});
