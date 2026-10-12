import { CERTYFIKATY, DOSWIADCZENIE, OSOBA, PROJEKTY, UMIEJETNOSCI } from "@/lib/dane";
import { wykonaj, type Tabele, type Wartosc } from "./sql";

/** Dane z CV spłaszczone do tabel - listy łączone przecinkami, żeby działał LIKE. */
export const TABELE: Tabele = {
  doswiadczenie: DOSWIADCZENIE.map((d) => ({
    id: d.id,
    firma: d.firma,
    stanowisko: d.stanowisko,
    od: d.od,
    do: d.do,
    stack: d.stack.join(", "),
  })),
  projekty: PROJEKTY.map((p) => ({
    slug: p.slug,
    nazwa: p.nazwa,
    rok: p.rok,
    stack: p.stack.join(", "),
    wynik: p.wynik,
  })),
  umiejetnosci: UMIEJETNOSCI.map((u) => ({ ...u })),
  certyfikaty: CERTYFIKATY.map((c) => ({ ...c })),
};

export const PRZYKLADY = [
  "SELECT nazwa, poziom FROM umiejetnosci WHERE kategoria = 'GCP' ORDER BY poziom DESC",
  "SELECT nazwa, stack FROM projekty WHERE stack LIKE '%Terraform%'",
  "SELECT firma, stanowisko, od FROM doswiadczenie WHERE do IS NULL",
  "SELECT COUNT(*) FROM umiejetnosci WHERE poziom >= 4",
];

export type Odpowiedz =
  | { rodzaj: "tabela"; kolumny: string[]; wiersze: Wartosc[][]; stat: string }
  | { rodzaj: "tekst"; linie: string[] }
  | { rodzaj: "blad"; tresc: string }
  | { rodzaj: "czysc" };

function typKolumny(tabela: Tabele[string], nazwa: string): string {
  // Typ z pierwszej niepustej wartości - kolumna „do" bywa NULL
  const v = tabela.find((w) => w[nazwa] !== null && w[nazwa] !== undefined)?.[nazwa];
  return typeof v === "number" ? "INT64" : "STRING";
}

function rozmiar(bajty: number): string {
  return bajty < 1024 ? `${bajty} B` : `${(bajty / 1024).toFixed(1)} KB`;
}

export function obsluz(wejscie: string): Odpowiedz {
  const polecenie = wejscie.trim().replace(/;$/, "");
  const male = polecenie.toLowerCase();

  if (!polecenie) return { rodzaj: "tekst", linie: [] };
  if (male === "clear" || male === "cls") return { rodzaj: "czysc" };

  if (male === "help" || male === "\\?" || male === "pomoc") {
    return {
      rodzaj: "tekst",
      linie: [
        "Dialekt: podzbiór GoogleSQL (BigQuery).",
        "  SHOW TABLES             lista tabel",
        "  DESCRIBE <tabela>       schemat tabeli",
        "  SELECT ... FROM ...     WHERE, AND, LIKE, IS NULL, ORDER BY, LIMIT, COUNT(*)",
        "  whoami | clear",
        "",
        "Spróbuj:",
        ...PRZYKLADY.map((p) => `  ${p};`),
      ],
    };
  }

  if (male === "whoami") {
    return {
      rodzaj: "tekst",
      linie: [`${OSOBA.imie} - ${OSOBA.rola}, w drodze do: ${OSOBA.cel}`, OSOBA.email],
    };
  }

  if (male === "show tables" || male === "\\dt" || male === "ls") {
    return {
      rodzaj: "tabela",
      kolumny: ["table_name", "row_count"],
      wiersze: Object.entries(TABELE).map(([n, w]) => [n, w.length]),
      stat: `${Object.keys(TABELE).length} rows`,
    };
  }

  const opis = /^(?:describe|desc|\\d)\s+`?([a-z_.]+)`?$/i.exec(polecenie);
  if (opis) {
    const nazwa = opis[1].toLowerCase().split(".").at(-1)!;
    const tabela = TABELE[nazwa];
    if (!tabela) return { rodzaj: "blad", tresc: `Not found: Table ${nazwa} was not found` };
    const kolumny = Object.keys(tabela[0] ?? {});
    return {
      rodzaj: "tabela",
      kolumny: ["column_name", "data_type"],
      wiersze: kolumny.map((k) => [k, typKolumny(tabela, k)]),
      stat: `${kolumny.length} rows`,
    };
  }

  const start = performance.now();
  const wynik = wykonaj(polecenie, TABELE);
  if (!wynik.ok) return { rodzaj: "blad", tresc: wynik.blad };
  const ms = performance.now() - start;
  return {
    rodzaj: "tabela",
    kolumny: wynik.kolumny,
    wiersze: wynik.wiersze,
    stat: `Query complete (${(ms / 1000).toFixed(3)} sec elapsed, ${rozmiar(wynik.bajty)} processed) · ${wynik.wiersze.length} rows`,
  };
}
