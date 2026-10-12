import { NextResponse } from "next/server";
import { baza } from "@/lib/firestore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Sprawdzenie dla monitoringu: czy aplikacja odpowiada i widzi bazę.
 * Bez szczegółów błędu na zewnątrz - te są w logach.
 */
export async function GET() {
  try {
    await Promise.race([
      baza().listCollections(),
      new Promise((_, odrzuc) => setTimeout(() => odrzuc(new Error("baza nie odpowiada w 4 s")), 4000)),
    ]);
    return NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store" } });
  } catch (blad) {
    console.error("Sprawdzenie zdrowia: baza niedostępna:", blad);
    return NextResponse.json({ ok: false }, { status: 503, headers: { "cache-control": "no-store" } });
  }
}
