import { describe, expect, it } from "vitest";
import { EXAMPLES, run } from "@/lib/console/commands";
import { execute, tokenize, type Tables } from "@/lib/console/sql";
import { LANGS } from "@/lib/i18n";

const T: Tables = {
  people: [
    { name: "Ala", age: 30, city: "Gdańsk" },
    { name: "Ola", age: 25, city: null },
    { name: "Ela", age: 41, city: "Kraków" },
  ],
};

const ok = (sql: string) => {
  const r = execute(sql, T);
  if (!r.ok) throw new Error(r.error);
  return r;
};

describe("SQL engine", () => {
  it("SELECT * returns every column and row", () => {
    const r = ok("SELECT * FROM people");
    expect(r.columns).toEqual(["name", "age", "city"]);
    expect(r.rows).toHaveLength(3);
  });

  it("filters, sorts and limits", () => {
    expect(ok("select name from people where age >= 30 order by age desc limit 1;").rows).toEqual([["Ela"]]);
  });

  it("case-insensitive LIKE, AND, IS NULL", () => {
    expect(ok("SELECT name FROM people WHERE city LIKE '%gdań%'").rows).toEqual([["Ala"]]);
    expect(ok("SELECT name FROM people WHERE city IS NULL").rows).toEqual([["Ola"]]);
    expect(ok("SELECT name FROM people WHERE city IS NOT NULL AND age < 35").rows).toEqual([["Ala"]]);
  });

  it("sorts NULLs last", () => {
    expect(ok("SELECT city FROM people ORDER BY city").rows.at(-1)).toEqual([null]);
  });

  it("COUNT(*) and BigQuery-style fully qualified table names", () => {
    expect(ok("SELECT COUNT(*) FROM `project.cv.people` WHERE age <> 25").rows).toEqual([[2]]);
  });

  it("returns BigQuery-style errors instead of throwing", () => {
    expect(execute("SELECT nope FROM people", T)).toEqual({ ok: false, error: "Unrecognized name: nope" });
    expect(execute("SELECT * FROM missing", T).ok).toBe(false);
    expect(execute("SELECT * FROM people WHERE name = 'Ala", T).ok).toBe(false);
    expect(execute("DROP TABLE people", T).ok).toBe(false);
    expect(execute("SELECT * FROM people LIMIT 1 extra", T).ok).toBe(false);
  });

  it("LIKE does not interpret regex characters from input", () => {
    expect(ok("SELECT name FROM people WHERE name LIKE '.*'").rows).toEqual([]);
  });

  it("tokenizer recognises two-character operators", () => {
    expect(tokenize("a<=1").map((t) => t.value)).toEqual(["a", "<=", 1]);
  });
});

describe("console commands", () => {
  it.each(LANGS)("every example query works on real data (%s)", (lang) => {
    for (const q of EXAMPLES[lang]) {
      const out = run(q, lang);
      expect(out.kind, `${q}: ${out.kind === "error" ? out.message : ""}`).toBe("table");
    }
  });

  it("tables follow the page language", () => {
    expect(run("SELECT nazwa FROM umiejetnosci", "pl").kind).toBe("table");
    expect(run("SELECT name FROM skills", "en").kind).toBe("table");
    expect(run("SELECT name FROM skills", "pl").kind).toBe("error");
  });

  it("SHOW TABLES, DESCRIBE, help, clear", () => {
    expect(run("show tables;", "en").kind).toBe("table");
    const schema = run("DESCRIBE experience", "en");
    expect(schema.kind === "table" && schema.rows).toContainEqual(["end", "STRING"]);
    expect(run("help", "pl").kind).toBe("text");
    expect(run("clear", "en").kind).toBe("clear");
    expect(run("describe nope", "en").kind).toBe("error");
  });
});
