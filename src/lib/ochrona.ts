import { NextResponse } from "next/server";

/**
 * Limit zapytań w pamięci instancji. Cloud Run ma kilka instancji, więc
 * limit jest przybliżony, ale skutecznie zatrzymuje pojedynczego bota
 * zasypującego formularz albo zgadującego hasło do panelu.
 */
const okna = new Map<string, number[]>();
let ostatnieSprzatanie = 0;

export function adresKlienta(zadanie: Request): string {
  // Cloud Run dopisuje prawdziwy adres na KOŃCU x-forwarded-for. Wcześniejsze
  // wpisy podaje sam klient, więc bot mógłby nimi obejść limit
  const naglowek = zadanie.headers.get("x-forwarded-for") ?? "";
  return naglowek.split(",").at(-1)?.trim() || "nieznany";
}

/** Zwraca true, gdy klient przekroczył limit. */
export function przekroczonyLimit(
  klucz: string,
  { ile, sekund }: { ile: number; sekund: number },
  teraz = Date.now(),
): boolean {
  const granica = teraz - sekund * 1000;

  // Raz na minutę wyrzucamy stare wpisy, żeby mapa nie rosła bez końca
  if (teraz - ostatnieSprzatanie > 60_000) {
    for (const [k, czasy] of okna) {
      if (czasy[czasy.length - 1] < teraz - 3_600_000) okna.delete(k);
    }
    ostatnieSprzatanie = teraz;
  }

  const czasy = (okna.get(klucz) ?? []).filter((t) => t > granica);
  if (czasy.length >= ile) {
    okna.set(klucz, czasy);
    return true;
  }
  czasy.push(teraz);
  okna.set(klucz, czasy);
  return false;
}

export function odpowiedzLimitu() {
  return NextResponse.json(
    { blad: "Za dużo prób. Spróbuj ponownie za kilka minut." },
    { status: 429 },
  );
}

/**
 * Pole-pułapka: ukryte przed ludźmi, ale boty wypełniają każde pole.
 * Nazwa celowo brzmi jak zwykłe pole formularza.
 */
export const POLE_PULAPKA = "website";

export function wpadlWPulapke(dane: Record<string, unknown>): boolean {
  const wartosc = dane[POLE_PULAPKA];
  return typeof wartosc === "string" && wartosc.trim().length > 0;
}

/** Testy: czyszczenie stanu limitów między przypadkami. */
export function wyczyscLimity() {
  okna.clear();
}
