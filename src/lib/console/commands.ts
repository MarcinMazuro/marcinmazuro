import { CERTIFICATIONS, EXPERIENCE, PROFILE, PROJECTS, SKILLS } from "@/lib/content";
import type { Lang } from "@/lib/i18n";
import { execute, type Tables, type Value } from "./sql";

/**
 * Resume data flattened into tables - lists joined with commas so LIKE works.
 * Table and column names follow the page language: a Polish visitor queries
 * `umiejetnosci`, an English one queries `skills`.
 */
export function tables(lang: Lang): Tables {
  if (lang === "pl") {
    return {
      doswiadczenie: EXPERIENCE.map((j) => ({
        id: j.id,
        firma: j.company,
        stanowisko: j.title,
        od: j.start,
        do: j.end,
        stack: j.stack.join(", "),
      })),
      projekty: PROJECTS.map((p) => ({
        slug: p.slug,
        nazwa: p.name.pl,
        rok: p.year,
        stack: p.stack.join(", "),
        wynik: p.result.pl,
      })),
      umiejetnosci: SKILLS.map((s) => ({ nazwa: s.name, kategoria: s.category, poziom: s.level })),
      certyfikaty: CERTIFICATIONS.map((c) => ({ nazwa: c.name, wystawca: c.issuer, rok: c.year })),
    };
  }
  return {
    experience: EXPERIENCE.map((j) => ({
      id: j.id,
      company: j.company,
      title: j.title,
      start: j.start,
      end: j.end,
      stack: j.stack.join(", "),
    })),
    projects: PROJECTS.map((p) => ({
      slug: p.slug,
      name: p.name.en,
      year: p.year,
      stack: p.stack.join(", "),
      result: p.result.en,
    })),
    skills: SKILLS.map((s) => ({ name: s.name, category: s.category, level: s.level })),
    certifications: CERTIFICATIONS.map((c) => ({ name: c.name, issuer: c.issuer, year: c.year })),
  };
}

export const EXAMPLES: Record<Lang, string[]> = {
  pl: [
    "SELECT nazwa, poziom FROM umiejetnosci WHERE kategoria = 'gcp' ORDER BY poziom DESC",
    "SELECT nazwa, stack FROM projekty WHERE stack LIKE '%Terraform%'",
    "SELECT firma, stanowisko, od FROM doswiadczenie WHERE do IS NULL",
    "SELECT COUNT(*) FROM umiejetnosci WHERE poziom >= 4",
  ],
  en: [
    "SELECT name, level FROM skills WHERE category = 'gcp' ORDER BY level DESC",
    "SELECT name, stack FROM projects WHERE stack LIKE '%Terraform%'",
    "SELECT company, title, start FROM experience WHERE end IS NULL",
    "SELECT COUNT(*) FROM skills WHERE level >= 4",
  ],
};

const HELP: Record<Lang, string[]> = {
  pl: [
    "Dialekt: podzbiór GoogleSQL (BigQuery).",
    "  SHOW TABLES             lista tabel",
    "  DESCRIBE <tabela>       schemat tabeli",
    "  SELECT ... FROM ...     WHERE, AND, LIKE, IS NULL, ORDER BY, LIMIT, COUNT(*)",
    "  whoami | clear",
    "",
    "Spróbuj:",
  ],
  en: [
    "Dialect: a subset of GoogleSQL (BigQuery).",
    "  SHOW TABLES             list tables",
    "  DESCRIBE <table>        table schema",
    "  SELECT ... FROM ...     WHERE, AND, LIKE, IS NULL, ORDER BY, LIMIT, COUNT(*)",
    "  whoami | clear",
    "",
    "Try:",
  ],
};

export type Output =
  | { kind: "table"; columns: string[]; rows: Value[][]; stats: string }
  | { kind: "text"; lines: string[] }
  | { kind: "error"; message: string }
  | { kind: "clear" };

function columnType(rows: Tables[string], column: string): string {
  // Type of the first non-null value - columns like `end` may be NULL
  const v = rows.find((r) => r[column] !== null && r[column] !== undefined)?.[column];
  return typeof v === "number" ? "INT64" : "STRING";
}

function formatBytes(bytes: number): string {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}

export function run(input: string, lang: Lang): Output {
  const command = input.trim().replace(/;$/, "");
  const lower = command.toLowerCase();
  const data = tables(lang);

  if (!command) return { kind: "text", lines: [] };
  if (lower === "clear" || lower === "cls") return { kind: "clear" };

  if (lower === "help" || lower === "\\?" || lower === "pomoc") {
    return { kind: "text", lines: [...HELP[lang], ...EXAMPLES[lang].map((e) => `  ${e};`)] };
  }

  if (lower === "whoami") {
    const goal = lang === "pl" ? "w drodze do" : "on the way to";
    return { kind: "text", lines: [`${PROFILE.name} - ${PROFILE.role}, ${goal}: ${PROFILE.goal}`, PROFILE.email] };
  }

  if (lower === "show tables" || lower === "\\dt" || lower === "ls") {
    return {
      kind: "table",
      columns: ["table_name", "row_count"],
      rows: Object.entries(data).map(([name, rows]) => [name, rows.length]),
      stats: `${Object.keys(data).length} rows`,
    };
  }

  const describe = /^(?:describe|desc|\\d)\s+`?([a-z_.]+)`?$/i.exec(command);
  if (describe) {
    const name = describe[1].toLowerCase().split(".").at(-1)!;
    const rows = data[name];
    if (!rows) return { kind: "error", message: `Not found: Table ${name} was not found` };
    const columns = Object.keys(rows[0] ?? {});
    return {
      kind: "table",
      columns: ["column_name", "data_type"],
      rows: columns.map((c) => [c, columnType(rows, c)]),
      stats: `${columns.length} rows`,
    };
  }

  const started = performance.now();
  const result = execute(command, data);
  if (!result.ok) return { kind: "error", message: result.error };
  const seconds = (performance.now() - started) / 1000;
  return {
    kind: "table",
    columns: result.columns,
    rows: result.rows,
    stats: `Query complete (${seconds.toFixed(3)} sec elapsed, ${formatBytes(result.bytes)} processed) · ${result.rows.length} rows`,
  };
}
