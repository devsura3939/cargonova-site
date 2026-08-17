/**
 * Leaflet tile configuration, as a pure function so the invariant
 * "subdomains is always a non-empty string" is unit-testable.
 *
 * Regression: passing `subdomains: undefined` (light theme) used to override
 * Leaflet's default "abc" — and since `getTileUrl` always calls
 * `_getSubdomain`, any rendered map crashed with
 * "Cannot read properties of undefined (reading 'length')".
 */
export type TileConfig = {
  url: string;
  subdomains: string;
  attribution: string;
};

export function tileConfig(dark: boolean): TileConfig {
  return dark
    ? {
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        subdomains: "abcd",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }
    : {
        url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        subdomains: "abc",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      };
}
