"use client";

import { useSyncExternalStore } from "react";

const ZAPYTANIE = "(prefers-reduced-motion: reduce)";

function subskrybuj(powiadom: () => void) {
  const mq = window.matchMedia(ZAPYTANIE);
  mq.addEventListener("change", powiadom);
  return () => mq.removeEventListener("change", powiadom);
}

/**
 * Czy użytkownik ograniczył animacje w systemie.
 *
 * Zamiast useReducedMotion z Motion: tamten od razu przy hydratacji zwraca
 * prawdę, więc komponent rysował inne drzewo niż serwer i React zgłaszał
 * błąd #418, przebudowując całą stronę. Tu przy hydratacji obowiązuje
 * wartość z serwera (false), a prawdziwa przychodzi zaraz potem.
 */
export function useBezRuchu(): boolean {
  return useSyncExternalStore(
    subskrybuj,
    () => window.matchMedia(ZAPYTANIE).matches,
    () => false,
  );
}
