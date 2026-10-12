/**
 * Minimalny silnik SQL nad danymi z CV, działający w przeglądarce.
 *
 * Obsługuje podzbiór składni BigQuery:
 *   SELECT * | kol[, kol] | COUNT(*) FROM tabela
 *   [WHERE warunek [AND warunek]...]
 *   [ORDER BY kol [ASC|DESC]] [LIMIT n]
 * warunek: kol (= | != | <> | < | > | <= | >= | LIKE) literał | kol IS [NOT] NULL
 *
 * Komunikaty błędów naśladują BigQuery, bo konsola udaje jego edytor.
 */

export type Wartosc = string | number | null;
export type Wiersz = Record<string, Wartosc>;
export type Tabele = Record<string, Wiersz[]>;

export type Wynik =
  | { ok: true; kolumny: string[]; wiersze: Wartosc[][]; bajty: number }
  | { ok: false; blad: string };

type Token =
  | { typ: "slowo"; wartosc: string }
  | { typ: "tekst"; wartosc: string }
  | { typ: "liczba"; wartosc: number }
  | { typ: "znak"; wartosc: string };

const SLOWA_KLUCZOWE = new Set([
  "SELECT", "FROM", "WHERE", "AND", "ORDER", "BY", "ASC", "DESC", "LIMIT",
  "LIKE", "IS", "NOT", "NULL", "COUNT",
]);

export class BladSql extends Error {}

export function tokenizuj(zapytanie: string): Token[] {
  const tokeny: Token[] = [];
  let i = 0;
  while (i < zapytanie.length) {
    const z = zapytanie[i];
    if (/\s/.test(z)) {
      i++;
    } else if (z === "'" || z === '"') {
      const koniec = zapytanie.indexOf(z, i + 1);
      if (koniec === -1) throw new BladSql(`Syntax error: Unclosed string literal at [1:${i + 1}]`);
      tokeny.push({ typ: "tekst", wartosc: zapytanie.slice(i + 1, koniec) });
      i = koniec + 1;
    } else if (/[0-9]/.test(z)) {
      const m = /^[0-9]+(\.[0-9]+)?/.exec(zapytanie.slice(i))!;
      tokeny.push({ typ: "liczba", wartosc: Number(m[0]) });
      i += m[0].length;
    } else if (/[A-Za-z_`]/.test(z)) {
      // Identyfikatory w odwrotnych apostrofach jak w BigQuery: `projekty`
      const m = /^`?([A-Za-z_][A-Za-z0-9_.]*)`?/.exec(zapytanie.slice(i))!;
      tokeny.push({ typ: "slowo", wartosc: m[1] });
      i += m[0].length;
    } else {
      const dwa = zapytanie.slice(i, i + 2);
      if (["!=", "<>", "<=", ">="].includes(dwa)) {
        tokeny.push({ typ: "znak", wartosc: dwa });
        i += 2;
      } else if ("*,()=<>;".includes(z)) {
        tokeny.push({ typ: "znak", wartosc: z });
        i++;
      } else {
        throw new BladSql(`Syntax error: Illegal input character "${z}" at [1:${i + 1}]`);
      }
    }
  }
  return tokeny;
}

type Warunek =
  | { kol: string; op: string; wartosc: Wartosc }
  | { kol: string; op: "IS NULL" | "IS NOT NULL" };

type Zapytanie = {
  kolumny: string[] | "*" | "COUNT";
  tabela: string;
  warunki: Warunek[];
  sortuj?: { kol: string; malejaco: boolean };
  limit?: number;
};

function parsuj(tokeny: Token[]): Zapytanie {
  let p = 0;
  const podglad = () => tokeny[p];
  const czySlowo = (s: string) => {
    const t = tokeny[p];
    return t?.typ === "slowo" && t.wartosc.toUpperCase() === s;
  };
  const oczekuj = (s: string) => {
    if (!czySlowo(s)) {
      const t = podglad();
      throw new BladSql(
        `Syntax error: Expected keyword ${s} but got ${t ? `"${t.wartosc}"` : "end of input"}`,
      );
    }
    p++;
  };
  const identyfikator = () => {
    const t = tokeny[p];
    if (t?.typ !== "slowo" || SLOWA_KLUCZOWE.has(t.wartosc.toUpperCase())) {
      throw new BladSql(`Syntax error: Expected identifier but got ${t ? `"${t.wartosc}"` : "end of input"}`);
    }
    p++;
    return t.wartosc.toLowerCase();
  };
  const znak = (s: string) => {
    const t = tokeny[p];
    if (t?.typ === "znak" && t.wartosc === s) {
      p++;
      return true;
    }
    return false;
  };

  const porownanie = (kol: string): Warunek => {
    let op: string;
    const t = podglad();
    if (t?.typ === "znak" && ["=", "!=", "<>", "<", ">", "<=", ">="].includes(t.wartosc)) {
      op = t.wartosc === "<>" ? "!=" : t.wartosc;
      p++;
    } else if (czySlowo("LIKE")) {
      op = "LIKE";
      p++;
    } else {
      throw new BladSql(`Syntax error: Expected comparison operator after ${kol}`);
    }
    const w = tokeny[p++];
    if (w?.typ !== "tekst" && w?.typ !== "liczba") {
      throw new BladSql("Syntax error: Expected literal in WHERE clause");
    }
    return { kol, op, wartosc: w.wartosc };
  };

  oczekuj("SELECT");

  let kolumny: Zapytanie["kolumny"];
  if (znak("*")) {
    kolumny = "*";
  } else if (czySlowo("COUNT")) {
    p++;
    if (!znak("(") || !znak("*") || !znak(")")) throw new BladSql("Syntax error: Only COUNT(*) is supported");
    kolumny = "COUNT";
  } else {
    kolumny = [identyfikator()];
    while (znak(",")) kolumny.push(identyfikator());
  }

  oczekuj("FROM");
  // Pełna nazwa jak w BigQuery (projekt.zbior.tabela) - liczy się ostatni człon
  const tabela = identyfikator().split(".").at(-1)!;

  const warunki: Warunek[] = [];
  if (czySlowo("WHERE")) {
    p++;
    for (;;) {
      const kol = identyfikator();
      if (czySlowo("IS")) {
        p++;
        const nie = czySlowo("NOT");
        if (nie) p++;
        oczekuj("NULL");
        warunki.push({ kol, op: nie ? "IS NOT NULL" : "IS NULL" });
      } else {
        warunki.push(porownanie(kol));
      }
      if (!czySlowo("AND")) break;
      p++;
    }
  }

  let sortuj: Zapytanie["sortuj"];
  if (czySlowo("ORDER")) {
    p++;
    oczekuj("BY");
    const kol = identyfikator();
    let malejaco = false;
    if (czySlowo("DESC")) {
      malejaco = true;
      p++;
    } else if (czySlowo("ASC")) {
      p++;
    }
    sortuj = { kol, malejaco };
  }

  let limit: number | undefined;
  if (czySlowo("LIMIT")) {
    p++;
    const t = tokeny[p++];
    if (t?.typ !== "liczba" || !Number.isInteger(t.wartosc)) {
      throw new BladSql("Syntax error: LIMIT expects an integer literal");
    }
    limit = t.wartosc;
  }

  znak(";");
  if (p < tokeny.length) {
    throw new BladSql(`Syntax error: Unexpected "${tokeny[p].wartosc}"`);
  }

  return { kolumny, tabela, warunki, sortuj, limit };
}

/** LIKE z % i _, bez rozróżniania wielkości liter - wygodniej w konsoli. */
function pasuje(wartosc: string, wzor: string): boolean {
  const re = wzor
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/%/g, ".*")
    .replace(/_/g, ".");
  return new RegExp(`^${re}$`, "is").test(wartosc);
}

function spelnia(w: Wiersz, war: Warunek): boolean {
  const v = w[war.kol];
  if (war.op === "IS NULL") return v === null || v === undefined;
  if (war.op === "IS NOT NULL") return v !== null && v !== undefined;
  const cel = (war as { wartosc: Wartosc }).wartosc;
  if (v === null || v === undefined || cel === null) return false;
  if (war.op === "LIKE") return pasuje(String(v), String(cel));
  const a = typeof cel === "number" ? Number(v) : String(v);
  switch (war.op) {
    case "=": return a === cel;
    case "!=": return a !== cel;
    case "<": return a < cel;
    case ">": return a > cel;
    case "<=": return a <= cel;
    case ">=": return a >= cel;
  }
  return false;
}

export function wykonaj(zapytanie: string, tabele: Tabele): Wynik {
  try {
    const z = parsuj(tokenizuj(zapytanie));
    const dane = tabele[z.tabela];
    if (!dane) {
      throw new BladSql(`Not found: Table ${z.tabela} was not found. Try: SHOW TABLES`);
    }
    const schemat = Object.keys(dane[0] ?? {});
    const sprawdzKolumne = (k: string) => {
      if (!schemat.includes(k)) throw new BladSql(`Unrecognized name: ${k}`);
    };
    z.warunki.forEach((w) => sprawdzKolumne(w.kol));
    if (z.sortuj) sprawdzKolumne(z.sortuj.kol);
    if (Array.isArray(z.kolumny)) z.kolumny.forEach(sprawdzKolumne);

    let wiersze = dane.filter((w) => z.warunki.every((war) => spelnia(w, war)));

    if (z.sortuj) {
      const { kol, malejaco } = z.sortuj;
      wiersze = [...wiersze].sort((a, b) => {
        const x = a[kol];
        const y = b[kol];
        // NULL na końcu, jak w BigQuery przy ASC
        if (x === y) return 0;
        if (x === null) return 1;
        if (y === null) return -1;
        const wynik = x < y ? -1 : 1;
        return malejaco ? -wynik : wynik;
      });
    }
    if (z.limit !== undefined) wiersze = wiersze.slice(0, z.limit);

    // „Przetworzone bajty" jak w BigQuery: rozmiar przeskanowanych kolumn
    const bajty = new TextEncoder().encode(JSON.stringify(dane)).length;

    if (z.kolumny === "COUNT") {
      return { ok: true, kolumny: ["f0_"], wiersze: [[wiersze.length]], bajty };
    }
    const kolumny = z.kolumny === "*" ? schemat : z.kolumny;
    return {
      ok: true,
      kolumny,
      wiersze: wiersze.map((w) => kolumny.map((k) => w[k] ?? null)),
      bajty,
    };
  } catch (blad) {
    if (blad instanceof BladSql) return { ok: false, blad: blad.message };
    throw blad;
  }
}
