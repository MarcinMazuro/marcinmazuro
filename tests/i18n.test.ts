import { describe, expect, it } from "vitest";
import { localePath, prefersEnglish, resolve, routeOf } from "@/lib/i18n";

describe("locale paths", () => {
  it("Polish without a prefix and with Polish slugs, English under /en", () => {
    expect(localePath("pl", "/cv")).toBe("/cv");
    expect(localePath("pl", "/privacy")).toBe("/prywatnosc");
    expect(localePath("pl", "/#contact")).toBe("/#contact");
    expect(localePath("en", "/")).toBe("/en");
    expect(localePath("en", "/privacy")).toBe("/en/privacy");
    expect(localePath("en", "/#contact")).toBe("/en#contact");
  });

  it("routeOf is the inverse of localePath", () => {
    for (const route of ["/", "/cv", "/privacy"]) {
      expect(routeOf("pl", localePath("pl", route))).toBe(route);
      expect(routeOf("en", localePath("en", route))).toBe(route);
    }
  });

  it("Accept-Language: the higher weight wins", () => {
    expect(prefersEnglish("en-US,en;q=0.9")).toBe(true);
    expect(prefersEnglish("pl-PL,pl;q=0.9,en;q=0.8")).toBe(false);
    expect(prefersEnglish("de-DE,en;q=0.5")).toBe(true);
    expect(prefersEnglish("de-DE")).toBe(false);
    expect(prefersEnglish(null)).toBe(false);
  });
});

describe("proxy", () => {
  it("rewrites Polish URLs to /pl internally", () => {
    expect(resolve("/", undefined, null)).toEqual({ kind: "rewrite", to: "/pl" });
    expect(resolve("/cv", undefined, "en")).toEqual({ kind: "rewrite", to: "/pl/cv" });
    expect(resolve("/prywatnosc", undefined, null)).toEqual({ kind: "rewrite", to: "/pl/privacy" });
  });

  it("sends English browsers from / to /en unless a language was chosen", () => {
    expect(resolve("/", undefined, "en-GB")).toEqual({ kind: "redirect", to: "/en", permanent: false });
    expect(resolve("/", "pl", "en-GB")).toEqual({ kind: "rewrite", to: "/pl" });
  });

  it("keeps one canonical URL per page", () => {
    expect(resolve("/pl", undefined, null)).toEqual({ kind: "redirect", to: "/", permanent: true });
    expect(resolve("/pl/cv", undefined, null)).toEqual({ kind: "redirect", to: "/cv", permanent: true });
    expect(resolve("/pl/privacy", undefined, null)).toEqual({ kind: "redirect", to: "/prywatnosc", permanent: true });
    expect(resolve("/privacy", undefined, null)).toEqual({ kind: "redirect", to: "/prywatnosc", permanent: true });
  });

  it("serves English URLs as they are", () => {
    expect(resolve("/en", undefined, null)).toEqual({ kind: "next" });
    expect(resolve("/en/privacy", undefined, null)).toEqual({ kind: "next" });
  });

  it("/english or /plan is not a language prefix", () => {
    expect(resolve("/plan", undefined, null)).toEqual({ kind: "rewrite", to: "/pl/plan" });
    expect(resolve("/english", undefined, null)).toEqual({ kind: "rewrite", to: "/pl/english" });
  });
});
