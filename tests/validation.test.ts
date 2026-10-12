import { describe, expect, it } from "vitest";
import { isEmail, text } from "@/lib/validation";

describe("validation", () => {
  it("accepts ordinary email addresses", () => {
    expect(isEmail("marcin@example.com")).toBe(true);
    expect(isEmail("a.b+c@domain.com.pl")).toBe(true);
  });

  it("rejects non-addresses", () => {
    for (const bad of ["", "no-at", "a@b", "a @b.pl", "a@b.c", 42, null, `${"a".repeat(250)}@b.pl`]) {
      expect(isEmail(bad)).toBe(false);
    }
  });

  it("text trims whitespace and enforces length", () => {
    expect(text("  Ala  ", 10)).toBe("Ala");
    expect(text("   ", 10)).toBeNull();
    expect(text("x".repeat(11), 10)).toBeNull();
    expect(text(123, 10)).toBeNull();
  });
});
