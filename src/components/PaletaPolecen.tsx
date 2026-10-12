"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { OSOBA } from "@/lib/dane";
import { PRZYKLADY } from "@/lib/konsola/polecenia";
import { OTWORZ_PALETE, SEKCJE } from "@/lib/nawigacja";

/** Konsola nasłuchuje tego zdarzenia i wykonuje zapytanie z palety. */
export const URUCHOM_ZAPYTANIE = "uruchom-zapytanie";

type Akcja = { id: string; grupa: string; etykieta: string; wykonaj: () => void };

export function PaletaPolecen() {
  const router = useRouter();
  const [otwarta, setOtwarta] = useState(false);
  const [fraza, setFraza] = useState("");
  const [wybrana, setWybrana] = useState(0);
  const [skopiowano, setSkopiowano] = useState(false);
  const pole = useRef<HTMLInputElement>(null);

  const zamknij = () => {
    setOtwarta(false);
    setFraza("");
    setWybrana(0);
  };

  const otworz = () => {
    setOtwarta(true);
    setSkopiowano(false);
  };

  useEffect(() => {
    const klawisz = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (otwarta) zamknij();
        else otworz();
      }
    };
    window.addEventListener("keydown", klawisz);
    window.addEventListener(OTWORZ_PALETE, otworz);
    return () => {
      window.removeEventListener("keydown", klawisz);
      window.removeEventListener(OTWORZ_PALETE, otworz);
    };
  }, [otwarta]);

  useEffect(() => {
    if (otwarta) pole.current?.focus();
  }, [otwarta]);

  const akcje = useMemo<Akcja[]>(
    () => [
      ...SEKCJE.map((s) => ({
        id: s.href,
        grupa: "Idź do",
        etykieta: s.etykieta,
        wykonaj: () => router.push(s.href),
      })),
      { id: "cv", grupa: "Idź do", etykieta: "cv (wersja do druku)", wykonaj: () => router.push("/cv") },
      {
        id: "email",
        grupa: "Akcje",
        etykieta: `kopiuj e-mail: ${OSOBA.email}`,
        wykonaj: () => {
          void navigator.clipboard.writeText(OSOBA.email);
          setSkopiowano(true);
        },
      },
      { id: "github", grupa: "Akcje", etykieta: "otwórz GitHub", wykonaj: () => window.open(OSOBA.github, "_blank") },
      ...PRZYKLADY.map((sql, i) => ({
        id: `sql-${i}`,
        grupa: "Zapytaj CV",
        etykieta: sql,
        wykonaj: () => {
          router.push("/#konsola");
          // Po przejściu konsola może się dopiero montować - dajemy jej chwilę
          setTimeout(() => window.dispatchEvent(new CustomEvent(URUCHOM_ZAPYTANIE, { detail: sql })), 300);
        },
      })),
    ],
    [router],
  );

  const pasujace = akcje.filter((a) => `${a.grupa} ${a.etykieta}`.toLowerCase().includes(fraza.toLowerCase()));

  const uruchom = (a: Akcja | undefined) => {
    if (!a) return;
    a.wykonaj();
    // Kopiowanie zostawia paletę otwartą, żeby było widać potwierdzenie
    if (a.id !== "email") zamknij();
  };

  if (!otwarta) return null;

  return (
    <div
      className="bez-druku fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[15vh] backdrop-blur-sm"
      onClick={zamknij}
    >
      <div
        role="dialog"
        aria-modal
        aria-label="Paleta poleceń"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-xl border border-linia bg-powierzchnia shadow-2xl shadow-black/50"
      >
        <div className="flex items-center gap-3 border-b border-linia px-4">
          <span className="font-mono text-akcent">&gt;</span>
          <input
            ref={pole}
            value={fraza}
            onChange={(e) => {
              setFraza(e.target.value);
              setWybrana(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") zamknij();
              else if (e.key === "ArrowDown") {
                e.preventDefault();
                setWybrana((w) => Math.min(w + 1, pasujace.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setWybrana((w) => Math.max(w - 1, 0));
              } else if (e.key === "Enter") uruchom(pasujace[wybrana]);
            }}
            placeholder="Wpisz polecenie..."
            className="h-12 flex-1 bg-transparent font-mono text-sm text-tekst placeholder:text-tekst-miekki/60 focus:outline-none"
          />
          <kbd className="font-mono text-[10px] text-tekst-miekki">esc</kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {pasujace.length === 0 && (
            <li className="px-3 py-6 text-center font-mono text-xs text-tekst-miekki">Brak wyników</li>
          )}
          {pasujace.map((a, i) => (
            <li key={a.id}>
              <button
                type="button"
                onMouseEnter={() => setWybrana(i)}
                onClick={() => uruchom(a)}
                className={cn(
                  "flex w-full items-baseline gap-3 rounded-md px-3 py-2 text-left font-mono text-xs",
                  i === wybrana ? "bg-powierzchnia-mocna text-tekst" : "text-tekst-miekki",
                )}
              >
                <span className="w-20 shrink-0 text-[10px] uppercase tracking-wider text-tekst-miekki/70">
                  {a.grupa}
                </span>
                <span className="truncate">{a.etykieta}</span>
                {a.id === "email" && skopiowano && <span className="ml-auto text-akcent">skopiowano</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
