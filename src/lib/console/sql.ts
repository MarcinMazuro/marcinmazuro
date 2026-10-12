/**
 * A tiny SQL engine over the resume data, running in the browser.
 *
 * Supports a subset of BigQuery syntax:
 *   SELECT * | col[, col] | COUNT(*) FROM table
 *   [WHERE condition [AND condition]...]
 *   [ORDER BY col [ASC|DESC]] [LIMIT n]
 * condition: col (= | != | <> | < | > | <= | >=) literal | col LIKE literal | col IS [NOT] NULL
 *
 * Error messages mimic BigQuery, since the console impersonates its editor.
 */

export type Value = string | number | null;
export type Row = Record<string, Value>;
export type Tables = Record<string, Row[]>;

export type QueryResult =
  | { ok: true; columns: string[]; rows: Value[][]; bytes: number }
  | { ok: false; error: string };

type Token =
  | { type: "word"; value: string }
  | { type: "string"; value: string }
  | { type: "number"; value: number }
  | { type: "symbol"; value: string };

const KEYWORDS = new Set([
  "SELECT", "FROM", "WHERE", "AND", "ORDER", "BY", "ASC", "DESC", "LIMIT",
  "LIKE", "IS", "NOT", "NULL", "COUNT",
]);

const COMPARISONS = ["=", "!=", "<>", "<", ">", "<=", ">="];

export class SqlError extends Error {}

export function tokenize(sql: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < sql.length) {
    const c = sql[i];
    if (/\s/.test(c)) {
      i++;
    } else if (c === "'" || c === '"') {
      const end = sql.indexOf(c, i + 1);
      if (end === -1) throw new SqlError(`Syntax error: Unclosed string literal at [1:${i + 1}]`);
      tokens.push({ type: "string", value: sql.slice(i + 1, end) });
      i = end + 1;
    } else if (/[0-9]/.test(c)) {
      const m = /^[0-9]+(\.[0-9]+)?/.exec(sql.slice(i))!;
      tokens.push({ type: "number", value: Number(m[0]) });
      i += m[0].length;
    } else if (/[A-Za-z_`]/.test(c)) {
      // Backtick-quoted identifiers as in BigQuery: `projects`
      const m = /^`?([A-Za-z_][A-Za-z0-9_.]*)`?/.exec(sql.slice(i))!;
      tokens.push({ type: "word", value: m[1] });
      i += m[0].length;
    } else {
      const pair = sql.slice(i, i + 2);
      if (["!=", "<>", "<=", ">="].includes(pair)) {
        tokens.push({ type: "symbol", value: pair });
        i += 2;
      } else if ("*,()=<>;".includes(c)) {
        tokens.push({ type: "symbol", value: c });
        i++;
      } else {
        throw new SqlError(`Syntax error: Illegal input character "${c}" at [1:${i + 1}]`);
      }
    }
  }
  return tokens;
}

type Condition =
  | { column: string; op: string; value: Value }
  | { column: string; op: "IS NULL" | "IS NOT NULL" };

type Query = {
  columns: string[] | "*" | "COUNT";
  table: string;
  where: Condition[];
  orderBy?: { column: string; descending: boolean };
  limit?: number;
};

const describe = (t: Token | undefined) => (t ? `"${t.value}"` : "end of input");

function parse(tokens: Token[]): Query {
  let p = 0;
  const isKeyword = (k: string) => {
    const t = tokens[p];
    return t?.type === "word" && t.value.toUpperCase() === k;
  };
  const expectKeyword = (k: string) => {
    if (!isKeyword(k)) throw new SqlError(`Syntax error: Expected keyword ${k} but got ${describe(tokens[p])}`);
    p++;
  };
  const identifier = () => {
    const t = tokens[p];
    if (t?.type !== "word" || KEYWORDS.has(t.value.toUpperCase())) {
      throw new SqlError(`Syntax error: Expected identifier but got ${describe(t)}`);
    }
    p++;
    return t.value.toLowerCase();
  };
  const symbol = (s: string) => {
    const t = tokens[p];
    if (t?.type === "symbol" && t.value === s) {
      p++;
      return true;
    }
    return false;
  };
  const comparison = (column: string): Condition => {
    let op: string;
    const t = tokens[p];
    if (t?.type === "symbol" && COMPARISONS.includes(t.value)) {
      op = t.value === "<>" ? "!=" : t.value;
      p++;
    } else if (isKeyword("LIKE")) {
      op = "LIKE";
      p++;
    } else {
      throw new SqlError(`Syntax error: Expected comparison operator after ${column}`);
    }
    const literal = tokens[p++];
    if (literal?.type !== "string" && literal?.type !== "number") {
      throw new SqlError("Syntax error: Expected literal in WHERE clause");
    }
    return { column, op, value: literal.value };
  };

  expectKeyword("SELECT");

  let columns: Query["columns"];
  if (symbol("*")) {
    columns = "*";
  } else if (isKeyword("COUNT")) {
    p++;
    if (!symbol("(") || !symbol("*") || !symbol(")")) throw new SqlError("Syntax error: Only COUNT(*) is supported");
    columns = "COUNT";
  } else {
    columns = [identifier()];
    while (symbol(",")) columns.push(identifier());
  }

  expectKeyword("FROM");
  // Fully qualified name as in BigQuery (project.dataset.table) - the last part counts
  const table = identifier().split(".").at(-1)!;

  const where: Condition[] = [];
  if (isKeyword("WHERE")) {
    p++;
    for (;;) {
      const column = identifier();
      if (isKeyword("IS")) {
        p++;
        const negated = isKeyword("NOT");
        if (negated) p++;
        expectKeyword("NULL");
        where.push({ column, op: negated ? "IS NOT NULL" : "IS NULL" });
      } else {
        where.push(comparison(column));
      }
      if (!isKeyword("AND")) break;
      p++;
    }
  }

  let orderBy: Query["orderBy"];
  if (isKeyword("ORDER")) {
    p++;
    expectKeyword("BY");
    const column = identifier();
    let descending = false;
    if (isKeyword("DESC")) {
      descending = true;
      p++;
    } else if (isKeyword("ASC")) {
      p++;
    }
    orderBy = { column, descending };
  }

  let limit: number | undefined;
  if (isKeyword("LIMIT")) {
    p++;
    const t = tokens[p++];
    if (t?.type !== "number" || !Number.isInteger(t.value)) {
      throw new SqlError("Syntax error: LIMIT expects an integer literal");
    }
    limit = t.value;
  }

  symbol(";");
  if (p < tokens.length) {
    throw new SqlError(`Syntax error: Unexpected "${tokens[p].value}"`);
  }

  return { columns, table, where, orderBy, limit };
}

/** LIKE with % and _, case-insensitive - friendlier in a console. */
function like(value: string, pattern: string): boolean {
  const re = pattern
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/%/g, ".*")
    .replace(/_/g, ".");
  return new RegExp(`^${re}$`, "is").test(value);
}

function matches(row: Row, cond: Condition): boolean {
  const v = row[cond.column];
  if (cond.op === "IS NULL") return v === null || v === undefined;
  if (cond.op === "IS NOT NULL") return v !== null && v !== undefined;
  const target = (cond as { value: Value }).value;
  if (v === null || v === undefined || target === null) return false;
  if (cond.op === "LIKE") return like(String(v), String(target));
  const a = typeof target === "number" ? Number(v) : String(v);
  switch (cond.op) {
    case "=": return a === target;
    case "!=": return a !== target;
    case "<": return a < target;
    case ">": return a > target;
    case "<=": return a <= target;
    case ">=": return a >= target;
  }
  return false;
}

export function execute(sql: string, tables: Tables): QueryResult {
  try {
    const q = parse(tokenize(sql));
    const data = tables[q.table];
    if (!data) {
      throw new SqlError(`Not found: Table ${q.table} was not found. Try: SHOW TABLES`);
    }
    const schema = Object.keys(data[0] ?? {});
    const checkColumn = (c: string) => {
      if (!schema.includes(c)) throw new SqlError(`Unrecognized name: ${c}`);
    };
    q.where.forEach((w) => checkColumn(w.column));
    if (q.orderBy) checkColumn(q.orderBy.column);
    if (Array.isArray(q.columns)) q.columns.forEach(checkColumn);

    let rows = data.filter((r) => q.where.every((cond) => matches(r, cond)));

    if (q.orderBy) {
      const { column, descending } = q.orderBy;
      rows = [...rows].sort((a, b) => {
        const x = a[column];
        const y = b[column];
        // NULLs last, as in BigQuery with ASC
        if (x === y) return 0;
        if (x === null) return 1;
        if (y === null) return -1;
        const order = x < y ? -1 : 1;
        return descending ? -order : order;
      });
    }
    if (q.limit !== undefined) rows = rows.slice(0, q.limit);

    // "Bytes processed" as in BigQuery: size of the scanned table
    const bytes = new TextEncoder().encode(JSON.stringify(data)).length;

    if (q.columns === "COUNT") {
      return { ok: true, columns: ["f0_"], rows: [[rows.length]], bytes };
    }
    const columns = q.columns === "*" ? schema : q.columns;
    return {
      ok: true,
      columns,
      rows: rows.map((r) => columns.map((c) => r[c] ?? null)),
      bytes,
    };
  } catch (error) {
    if (error instanceof SqlError) return { ok: false, error: error.message };
    throw error;
  }
}
