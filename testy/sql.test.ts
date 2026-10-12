import { describe, expect, it } from "vitest";
import { tokenizuj, wykonaj, type Tabele } from "@/lib/konsola/sql";
import { obsluz, PRZYKLADY } from "@/lib/konsola/polecenia";

const T: Tabele = {
  ludzie: [
    { imie: "Ala", wiek: 30, miasto: "Gdańsk" },
    { imie: "Ola", wiek: 25, miasto: null },
    { imie: "Ela", wiek: 41, miasto: "Kraków" },
  ],
};

const ok = (sql: string) => {
  const w = wykonaj(sql, T);
  if (!w.ok) throw new Error(w.blad);
  return w;
};

describe("konsola SQL", () => {
  it("SELECT * zwraca wszystkie kolumny i wiersze", () => {
    const w = ok("SELECT * FROM ludzie");
    expect(w.kolumny).toEqual(["imie", "wiek", "miasto"]);
    expect(w.wiersze).toHaveLength(3);
  });

  it("filtruje, sortuje i limituje", () => {
    const w = ok("select imie from ludzie where wiek >= 30 order by wiek desc limit 1;");
    expect(w.wiersze).toEqual([["Ela"]]);
  });

  it("LIKE bez rozróżniania wielkości liter, AND, IS NULL", () => {
    expect(ok("SELECT imie FROM ludzie WHERE miasto LIKE '%gdań%'").wiersze).toEqual([["Ala"]]);
    expect(ok("SELECT imie FROM ludzie WHERE miasto IS NULL").wiersze).toEqual([["Ola"]]);
    expect(ok("SELECT imie FROM ludzie WHERE miasto IS NOT NULL AND wiek < 35").wiersze).toEqual([["Ala"]]);
  });

  it("NULL ląduje na końcu przy sortowaniu", () => {
    expect(ok("SELECT miasto FROM ludzie ORDER BY miasto").wiersze.at(-1)).toEqual([null]);
  });

  it("COUNT(*) i pełna nazwa tabeli jak w BigQuery", () => {
    expect(ok("SELECT COUNT(*) FROM `projekt.cv.ludzie` WHERE wiek <> 25").wiersze).toEqual([[2]]);
  });

  it("zwraca błędy w stylu BigQuery zamiast rzucać", () => {
    expect(wykonaj("SELECT nic FROM ludzie", T)).toEqual({ ok: false, blad: "Unrecognized name: nic" });
    expect(wykonaj("SELECT * FROM brak", T).ok).toBe(false);
    expect(wykonaj("SELECT * FROM ludzie WHERE imie = 'Ala", T).ok).toBe(false);
    expect(wykonaj("DROP TABLE ludzie", T).ok).toBe(false);
    expect(wykonaj("SELECT * FROM ludzie LIMIT 1 extra", T).ok).toBe(false);
  });

  it("LIKE nie interpretuje znaków regex z danych", () => {
    expect(ok("SELECT imie FROM ludzie WHERE imie LIKE '.*'").wiersze).toEqual([]);
  });

  it("tokenizer rozpoznaje operatory dwuznakowe", () => {
    expect(tokenizuj("a<=1").map((t) => t.wartosc)).toEqual(["a", "<=", 1]);
  });
});

describe("polecenia konsoli", () => {
  it("wszystkie przykładowe zapytania działają na prawdziwych danych", () => {
    for (const p of PRZYKLADY) expect(obsluz(p).rodzaj).toBe("tabela");
  });

  it("SHOW TABLES, DESCRIBE, help, clear", () => {
    expect(obsluz("show tables;").rodzaj).toBe("tabela");
    const opis = obsluz("DESCRIBE doswiadczenie");
    expect(opis.rodzaj === "tabela" && opis.wiersze).toContainEqual(["do", "STRING"]);
    expect(obsluz("help").rodzaj).toBe("tekst");
    expect(obsluz("clear").rodzaj).toBe("czysc");
    expect(obsluz("describe nic").rodzaj).toBe("blad");
  });
});
