"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { obsluz, PRZYKLADY, type Odpowiedz } from "@/lib/konsola/polecenia";
import type { Wartosc } from "@/lib/konsola/sql";
import { useBezRuchu } from "@/lib/useBezRuchu";
import { URUCHOM_ZAPYTANIE } from "./PaletaPolecen";

type Wpis = { id: number; wejscie: string; odpowiedz: Exclude<Odpowiedz, { rodzaj: "czysc" }> };

let licznik = 0;

function Komorka({ v }: { v: Wartosc }) {
  if (v === null) return <span className="italic text-tekst-miekki/60">null</span>;
  if (typeof v === "number") return <span className="text-akcent-2">{v}</span>;
  return <>{v}</>;
}

function WynikTabeli({ o }: { o: Extract<Odpowiedz, { rodzaj: "tabela" }> }) {
  return (
    <div className="mt-2">
      <div className="overflow-x-auto rounded-md border border-linia">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="bg-powierzchnia-mocna text-tekst-miekki">
            <tr>
              <th className="border-b border-linia px-3 py-1.5 font-normal">Row</th>
              {o.kolumny.map((k) => (
                <th key={k} className="border-b border-linia px-3 py-1.5 font-normal">
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {o.wiersze.map((w, i) => (
              <tr key={i} className="odd:bg-white/[0.015]">
                <td className="px-3 py-1.5 text-tekst-miekki">{i + 1}</td>
                {w.map((v, j) => (
                  <td key={j} className="whitespace-nowrap px-3 py-1.5">
                    <Komorka v={v} />
                  </td>
                ))}
              </tr>
            ))}
            {o.wiersze.length === 0 && (
              <tr>
                <td colSpan={o.kolumny.length + 1} className="px-3 py-3 text-tekst-miekki">
                  There is no data to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-1.5 text-[11px] text-tekst-miekki">{o.stat}</p>
    </div>
  );
}

export function Konsola() {
  const [wpisy, setWpisy] = useState<Wpis[]>([]);
  const [wejscie, setWejscie] = useState("");
  const [historia, setHistoria] = useState<string[]>([]);
  const [pozycja, setPozycja] = useState(-1);
  const [pisze, setPisze] = useState(false);
  const kontener = useRef<HTMLDivElement>(null);
  const przewijane = useRef<HTMLDivElement>(null);
  const pole = useRef<HTMLInputElement>(null);
  const widoczna = useInView(kontener, { once: true, amount: 0.4 });
  const bezRuchu = useBezRuchu();

  const wykonajPolecenie = (tekst: string) => {
    const odpowiedz = obsluz(tekst);
    if (odpowiedz.rodzaj === "czysc") {
      setWpisy([]);
    } else {
      setWpisy((w) => [...w, { id: ++licznik, wejscie: tekst, odpowiedz }]);
    }
    if (tekst.trim()) setHistoria((h) => [tekst, ...h.filter((x) => x !== tekst)].slice(0, 50));
    setPozycja(-1);
    setWejscie("");
  };

  // Wpisywanie zapytania znak po znaku - z palety i przy pierwszym pokazaniu
  const wpiszIWykonaj = (sql: string) => {
    if (bezRuchu) {
      wykonajPolecenie(sql);
      return;
    }
    setPisze(true);
    let i = 0;
    const krok = () => {
      i++;
      setWejscie(sql.slice(0, i));
      if (i < sql.length) {
        setTimeout(krok, 14 + Math.random() * 22);
      } else {
        setTimeout(() => {
          wykonajPolecenie(sql);
          setPisze(false);
        }, 250);
      }
    };
    setTimeout(krok, 300);
  };

  const pierwszePokazanie = useRef(false);
  useEffect(() => {
    if (!widoczna || pierwszePokazanie.current) return;
    pierwszePokazanie.current = true;
    wpiszIWykonaj(PRZYKLADY[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widoczna]);

  useEffect(() => {
    const zPalety = (e: Event) => wpiszIWykonaj((e as CustomEvent<string>).detail);
    window.addEventListener(URUCHOM_ZAPYTANIE, zPalety);
    return () => window.removeEventListener(URUCHOM_ZAPYTANIE, zPalety);
  });

  useEffect(() => {
    const el = przewijane.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [wpisy]);

  return (
    <div
      ref={kontener}
      className="overflow-hidden rounded-xl border border-linia bg-powierzchnia font-mono text-sm shadow-2xl shadow-black/40"
    >
      <div className="flex items-center gap-2 border-b border-linia bg-powierzchnia-mocna px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-blad/70" />
        <span className="size-2.5 rounded-full bg-ostrzezenie/70" />
        <span className="size-2.5 rounded-full bg-akcent/70" />
        <span className="ml-3 text-xs text-tekst-miekki">bq query --project marcinmazuro --dataset cv</span>
      </div>

      <div
        ref={przewijane}
        onClick={() => pole.current?.focus()}
        className="h-[26rem] overflow-y-auto px-4 py-3"
      >
        <p className="text-xs text-tekst-miekki">
          Zapytaj moje CV w SQL. <span className="text-tekst">help</span> pokazuje składnię,{" "}
          <span className="text-tekst">SHOW TABLES</span> listę tabel.
        </p>

        {wpisy.map((w) => (
          <div key={w.id} className="mt-4">
            <p className="break-all">
              <span className="text-akcent">bq&gt;</span> {w.wejscie}
            </p>
            {w.odpowiedz.rodzaj === "tabela" && <WynikTabeli o={w.odpowiedz} />}
            {w.odpowiedz.rodzaj === "tekst" && (
              <pre className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-tekst-miekki">
                {w.odpowiedz.linie.join("\n")}
              </pre>
            )}
            {w.odpowiedz.rodzaj === "blad" && (
              <p className="mt-1 text-xs text-blad">Error: {w.odpowiedz.tresc}</p>
            )}
          </div>
        ))}

        <form
          className="mt-4 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!pisze) wykonajPolecenie(wejscie);
          }}
        >
          <label htmlFor="konsola-wejscie" className="text-akcent">
            bq&gt;
          </label>
          <input
            id="konsola-wejscie"
            ref={pole}
            value={wejscie}
            readOnly={pisze}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setWejscie(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" && historia.length) {
                e.preventDefault();
                const p = Math.min(pozycja + 1, historia.length - 1);
                setPozycja(p);
                setWejscie(historia[p]);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const p = pozycja - 1;
                setPozycja(Math.max(p, -1));
                setWejscie(p >= 0 ? historia[p] : "");
              }
            }}
            className="flex-1 bg-transparent text-tekst caret-akcent focus:outline-none"
            aria-label="Zapytanie SQL"
          />
        </form>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-linia px-4 py-3">
        {PRZYKLADY.map((p) => (
          <button
            key={p}
            type="button"
            disabled={pisze}
            onClick={() => wpiszIWykonaj(p)}
            className={cn(
              "max-w-full truncate rounded border border-linia px-2 py-1 text-[11px] text-tekst-miekki transition-colors",
              "hover:border-akcent/50 hover:text-tekst disabled:opacity-50",
            )}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
