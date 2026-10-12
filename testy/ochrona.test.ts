import { beforeEach, describe, expect, it } from "vitest";
import { adresKlienta, przekroczonyLimit, wpadlWPulapke, wyczyscLimity } from "@/lib/ochrona";

describe("limit zapytań", () => {
  beforeEach(() => wyczyscLimity());

  it("przepuszcza do limitu, potem blokuje", () => {
    const t = 1_000_000;
    for (let i = 0; i < 5; i++) expect(przekroczonyLimit("k:1", { ile: 5, sekund: 60 }, t + i)).toBe(false);
    expect(przekroczonyLimit("k:1", { ile: 5, sekund: 60 }, t + 10)).toBe(true);
  });

  it("odblokowuje po upływie okna", () => {
    const t = 1_000_000;
    for (let i = 0; i < 5; i++) przekroczonyLimit("k:2", { ile: 5, sekund: 60 }, t);
    expect(przekroczonyLimit("k:2", { ile: 5, sekund: 60 }, t + 61_000)).toBe(false);
  });

  it("liczy osobno dla każdego klucza", () => {
    for (let i = 0; i < 3; i++) przekroczonyLimit("a", { ile: 3, sekund: 60 }, 1);
    expect(przekroczonyLimit("a", { ile: 3, sekund: 60 }, 2)).toBe(true);
    expect(przekroczonyLimit("b", { ile: 3, sekund: 60 }, 2)).toBe(false);
  });

  it("bierze adres dopisany przez Cloud Run, nie podany przez klienta", () => {
    const z = new Request("http://x", { headers: { "x-forwarded-for": "6.6.6.6, 1.2.3.4" } });
    expect(adresKlienta(z)).toBe("1.2.3.4");
    expect(adresKlienta(new Request("http://x"))).toBe("nieznany");
  });

  it("pułapka łapie tylko wypełnione pole", () => {
    expect(wpadlWPulapke({ website: "http://spam" })).toBe(true);
    expect(wpadlWPulapke({ website: "" })).toBe(false);
    expect(wpadlWPulapke({})).toBe(false);
  });
});
