import { describe, expect, it } from "vitest";
import { czyEmail, tekst } from "@/lib/walidacja";

describe("walidacja", () => {
  it("przyjmuje zwykłe adresy e-mail", () => {
    expect(czyEmail("marcin@example.com")).toBe(true);
    expect(czyEmail("a.b+c@domena.com.pl")).toBe(true);
  });

  it("odrzuca nie-adresy", () => {
    for (const zly of ["", "bez-malpy", "a@b", "a @b.pl", "a@b.c", 42, null, `${"a".repeat(250)}@b.pl`]) {
      expect(czyEmail(zly)).toBe(false);
    }
  });

  it("tekst przycina spacje i pilnuje długości", () => {
    expect(tekst("  Ala  ", 10)).toBe("Ala");
    expect(tekst("   ", 10)).toBeNull();
    expect(tekst("x".repeat(11), 10)).toBeNull();
    expect(tekst(123, 10)).toBeNull();
  });
});
