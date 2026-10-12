/** Prosta walidacja po stronie serwera - nigdy nie ufamy temu, co przyszło z formularza. */

export function czyEmail(wartosc: unknown): wartosc is string {
  return (
    typeof wartosc === "string" &&
    wartosc.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(wartosc)
  );
}

export function tekst(wartosc: unknown, maks: number): string | null {
  if (typeof wartosc !== "string") return null;
  const przyciety = wartosc.trim();
  if (przyciety.length === 0 || przyciety.length > maks) return null;
  return przyciety;
}
