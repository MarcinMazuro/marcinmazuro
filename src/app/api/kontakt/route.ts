import { NextResponse } from "next/server";
import { adresKlienta, odpowiedzLimitu, przekroczonyLimit, wpadlWPulapke } from "@/lib/ochrona";
import { baza, KOLEKCJE } from "@/lib/firestore";
import { czyEmail, tekst } from "@/lib/walidacja";
import { ZGODY } from "@/lib/zgody";
import { TEMATY, type Temat } from "@/lib/kontakt";

export const runtime = "nodejs";

export async function POST(zadanie: Request) {
  if (przekroczonyLimit(`kontakt:${adresKlienta(zadanie)}`, { ile: 5, sekund: 600 })) {
    return odpowiedzLimitu();
  }

  let dane: unknown;
  try {
    dane = await zadanie.json();
  } catch {
    return NextResponse.json({ blad: "Nieprawidłowe dane" }, { status: 400 });
  }

  const { imie, email, firma, temat, wiadomosc, zgoda } = (dane ?? {}) as Record<string, unknown>;

  // Bot dostaje zwykłą odpowiedź sukcesu, żeby nie wiedział, że go odsiano
  if (wpadlWPulapke((dane ?? {}) as Record<string, unknown>)) {
    return NextResponse.json({ ok: true });
  }

  const imieOk = tekst(imie, 80);
  const wiadomoscOk = tekst(wiadomosc, 4000);

  if (!imieOk) {
    return NextResponse.json({ blad: "Podaj imię" }, { status: 400 });
  }
  if (!czyEmail(email)) {
    return NextResponse.json({ blad: "Podaj poprawny adres e-mail" }, { status: 400 });
  }
  if (!wiadomoscOk) {
    return NextResponse.json({ blad: "Napisz kilka słów" }, { status: 400 });
  }
  if (zgoda !== true) {
    return NextResponse.json({ blad: "Potrzebna jest zgoda" }, { status: 400 });
  }

  const kiedy = new Date().toISOString();

  try {
    await baza()
      .collection(KOLEKCJE.zgloszenia)
      .add({
        imie: imieOk,
        email: (email as string).toLowerCase(),
        firma: tekst(firma, 120),
        temat: TEMATY.includes(temat as Temat) ? temat : "Inne",
        wiadomosc: wiadomoscOk,
        zgody: { wersja: ZGODY.wersja, kontakt: { tresc: ZGODY.kontakt, kiedy } },
        obsluzone: false,
        zgloszono: kiedy,
      });
  } catch (blad) {
    console.error("Zapis zgłoszenia nie powiódł się:", blad);
    return NextResponse.json({ blad: "Nie udało się wysłać. Spróbuj za chwilę." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
