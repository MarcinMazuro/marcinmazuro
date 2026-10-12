import { NextResponse } from "next/server";

/**
 * In-memory rate limiter, per instance. Cloud Run may run several instances,
 * so the limit is approximate, but it reliably stops a single bot flooding
 * the form.
 */
const windows = new Map<string, number[]>();
let lastSweep = 0;

export function clientAddress(request: Request): string {
  // Cloud Run appends the real address at the END of x-forwarded-for. Earlier
  // entries come from the client, so a bot could use them to dodge the limit
  const header = request.headers.get("x-forwarded-for") ?? "";
  return header.split(",").at(-1)?.trim() || "unknown";
}

/** Returns true once the client has exceeded the limit. */
export function isRateLimited(
  key: string,
  { max, seconds }: { max: number; seconds: number },
  now = Date.now(),
): boolean {
  const cutoff = now - seconds * 1000;

  // Once a minute drop stale entries so the map does not grow forever
  if (now - lastSweep > 60_000) {
    for (const [k, hits] of windows) {
      if (hits[hits.length - 1] < now - 3_600_000) windows.delete(k);
    }
    lastSweep = now;
  }

  const hits = (windows.get(key) ?? []).filter((t) => t > cutoff);
  if (hits.length >= max) {
    windows.set(key, hits);
    return true;
  }
  hits.push(now);
  windows.set(key, hits);
  return false;
}

export function rateLimitResponse(message: string) {
  return NextResponse.json({ error: message }, { status: 429 });
}

/**
 * Honeypot field: hidden from people, but bots fill in every field.
 * The name deliberately looks like an ordinary form field.
 */
export const HONEYPOT_FIELD = "website";

export function isHoneypotFilled(data: Record<string, unknown>): boolean {
  const value = data[HONEYPOT_FIELD];
  return typeof value === "string" && value.trim().length > 0;
}

/** Tests: reset limiter state between cases. */
export function resetRateLimits() {
  windows.clear();
}
