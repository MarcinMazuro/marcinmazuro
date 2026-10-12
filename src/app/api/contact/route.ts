import { NextResponse } from "next/server";
import { CONSENT, errorText, isTopic } from "@/lib/contact";
import { COLLECTIONS, db } from "@/lib/firestore";
import { isLang, type Lang } from "@/lib/i18n";
import { clientAddress, isHoneypotFilled, isRateLimited, rateLimitResponse } from "@/lib/protection";
import { isEmail, text } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = ((await request.json()) ?? {}) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: errorText("invalid", "en") }, { status: 400 });
  }

  const lang: Lang = isLang(body.lang) ? body.lang : "en";
  const fail = (key: Parameters<typeof errorText>[0], status = 400) =>
    NextResponse.json({ error: errorText(key, lang) }, { status });

  if (isRateLimited(`contact:${clientAddress(request)}`, { max: 5, seconds: 600 })) {
    return rateLimitResponse(errorText("rateLimited", lang));
  }

  // Bots get an ordinary success response so they don't learn they were filtered
  if (isHoneypotFilled(body)) {
    return NextResponse.json({ ok: true });
  }

  const name = text(body.name, 80);
  const message = text(body.message, 4000);

  if (!name) return fail("name");
  if (!isEmail(body.email)) return fail("email");
  if (!message) return fail("message");
  if (body.consent !== true) return fail("consent");

  const now = new Date().toISOString();

  try {
    await db()
      .collection(COLLECTIONS.contactMessages)
      .add({
        name,
        email: body.email.toLowerCase(),
        company: text(body.company, 120),
        topic: isTopic(body.topic) ? body.topic : "other",
        message,
        lang,
        // Consent text stored verbatim, in the language it was shown in
        consent: { version: CONSENT.version, text: CONSENT.text[lang], at: now },
        handled: false,
        receivedAt: now,
      });
  } catch (error) {
    console.error("Saving contact message failed:", error);
    return fail("failed", 500);
  }

  return NextResponse.json({ ok: true });
}
