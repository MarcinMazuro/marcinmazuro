import { beforeEach, describe, expect, it } from "vitest";
import { clientAddress, isHoneypotFilled, isRateLimited, resetRateLimits } from "@/lib/protection";

describe("rate limiter", () => {
  beforeEach(() => resetRateLimits());

  it("lets requests through up to the limit, then blocks", () => {
    const t = 1_000_000;
    for (let i = 0; i < 5; i++) expect(isRateLimited("k:1", { max: 5, seconds: 60 }, t + i)).toBe(false);
    expect(isRateLimited("k:1", { max: 5, seconds: 60 }, t + 10)).toBe(true);
  });

  it("unblocks once the window has passed", () => {
    const t = 1_000_000;
    for (let i = 0; i < 5; i++) isRateLimited("k:2", { max: 5, seconds: 60 }, t);
    expect(isRateLimited("k:2", { max: 5, seconds: 60 }, t + 61_000)).toBe(false);
  });

  it("keeps keys independent", () => {
    for (let i = 0; i < 5; i++) isRateLimited("a", { max: 5, seconds: 60 }, 1);
    expect(isRateLimited("b", { max: 5, seconds: 60 }, 2)).toBe(false);
  });
});

describe("client address and honeypot", () => {
  it("takes the last x-forwarded-for entry (the one Cloud Run appends)", () => {
    const r = new Request("http://x", { headers: { "x-forwarded-for": "1.1.1.1, 2.2.2.2" } });
    expect(clientAddress(r)).toBe("2.2.2.2");
    expect(clientAddress(new Request("http://x"))).toBe("unknown");
  });

  it("detects a filled honeypot", () => {
    expect(isHoneypotFilled({ website: "http://spam" })).toBe(true);
    expect(isHoneypotFilled({ website: "  " })).toBe(false);
    expect(isHoneypotFilled({})).toBe(false);
  });
});
