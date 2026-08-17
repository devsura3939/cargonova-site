import { describe, expect, it } from "vitest";
import {
  isFlightNumber,
  flightNumberPart,
  airlineName,
  isCargoAirline,
  flightRadarUrl,
} from "@/lib/live-data";

describe("isFlightNumber", () => {
  it("accepts IATA and ICAO flight numbers", () => {
    expect(isFlightNumber("TK1984")).toBe(true);
    expect(isFlightNumber("LH452")).toBe(true);
    expect(isFlightNumber("THY1984")).toBe(true);
    expect(isFlightNumber("DLH452")).toBe(true);
    expect(isFlightNumber(" tk1984 ")).toBe(true);
  });

  it("rejects non-flight codes", () => {
    expect(isFlightNumber("CRG-582941")).toBe(false);
    expect(isFlightNumber("1Z999AA10123456784")).toBe(false);
    expect(isFlightNumber("123-45678901")).toBe(false);
    expect(isFlightNumber("12345678")).toBe(false);
    expect(isFlightNumber("A")).toBe(false);
  });
});

describe("flightNumberPart", () => {
  it("strips the airline prefix", () => {
    expect(flightNumberPart("TK1984")).toBe("1984");
    expect(flightNumberPart("THY1984")).toBe("1984");
  });
});

describe("airlineName", () => {
  it("maps common IATA/ICAO codes", () => {
    expect(airlineName("TK")).toBe("Turkish Airlines");
    expect(airlineName("LH")).toBe("Lufthansa");
    expect(airlineName("THY")).toBe("Turkish Airlines");
    expect(airlineName("FDX")).toBe("FedEx Express");
    expect(airlineName("UPS")).toBe("UPS Airlines");
  });

  it("falls back gracefully for unknown codes", () => {
    expect(airlineName("ZZ")).toBe("Airline");
  });
});

describe("isCargoAirline", () => {
  it("flags dedicated cargo operators", () => {
    expect(isCargoAirline("FX")).toBe(true);
    expect(isCargoAirline("5X")).toBe(true);
    expect(isCargoAirline("GEC")).toBe(true);
    expect(isCargoAirline("CWC")).toBe(true);
    expect(isCargoAirline("DHK")).toBe(true);
  });

  it("does not flag passenger carriers", () => {
    expect(isCargoAirline("TK")).toBe(false);
    expect(isCargoAirline("LH")).toBe(false);
  });
});

describe("flightRadarUrl", () => {
  it("builds a canonical FlightRadar24 lookup", () => {
    expect(flightRadarUrl("TK1984")).toBe("https://www.flightradar24.com/TK1984");
  });
});
