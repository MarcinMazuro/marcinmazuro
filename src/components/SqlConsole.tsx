"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { EXAMPLES, run, type Output } from "@/lib/console/commands";
import type { Value } from "@/lib/console/sql";
import { dictionary } from "@/lib/dictionary";
import type { Lang } from "@/lib/i18n";
import { RUN_QUERY_EVENT } from "@/lib/navigation";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type Entry = { id: number; input: string; output: Exclude<Output, { kind: "clear" }> };

let nextId = 0;

function Cell({ value }: { value: Value }) {
  if (value === null) return <span className="text-fg-muted/60 italic">null</span>;
  if (typeof value === "number") return <span className="text-accent-2">{value}</span>;
  return <>{value}</>;
}

function ResultTable({ output }: { output: Extract<Output, { kind: "table" }> }) {
  return (
    <div className="mt-2">
      <div className="overflow-x-auto rounded-md border border-line">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="bg-surface-strong text-fg-muted">
            <tr>
              <th className="border-b border-line px-3 py-1.5 font-normal">Row</th>
              {output.columns.map((c) => (
                <th key={c} className="border-b border-line px-3 py-1.5 font-normal">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {output.rows.map((row, i) => (
              <tr key={i} className="odd:bg-white/[0.015]">
                <td className="px-3 py-1.5 text-fg-muted">{i + 1}</td>
                {row.map((v, j) => (
                  <td key={j} className="px-3 py-1.5 whitespace-nowrap">
                    <Cell value={v} />
                  </td>
                ))}
              </tr>
            ))}
            {output.rows.length === 0 && (
              <tr>
                <td colSpan={output.columns.length + 1} className="px-3 py-3 text-fg-muted">
                  There is no data to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-1.5 text-[11px] text-fg-muted">{output.stats}</p>
    </div>
  );
}

export function SqlConsole({ lang }: { lang: Lang }) {
  const t = dictionary(lang).console;
  const examples = EXAMPLES[lang];
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [typing, setTyping] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const inView = useInView(container, { once: true, amount: 0.4 });
  const reducedMotion = usePrefersReducedMotion();

  const submit = (command: string) => {
    const output = run(command, lang);
    if (output.kind === "clear") {
      setEntries([]);
    } else {
      setEntries((e) => [...e, { id: ++nextId, input: command, output }]);
    }
    if (command.trim()) setHistory((h) => [command, ...h.filter((x) => x !== command)].slice(0, 50));
    setHistoryIndex(-1);
    setInput("");
  };

  // Types a query character by character - used by the palette and on first view
  const typeAndRun = (sql: string) => {
    if (reducedMotion) {
      submit(sql);
      return;
    }
    setTyping(true);
    let i = 0;
    const step = () => {
      i++;
      setInput(sql.slice(0, i));
      if (i < sql.length) {
        setTimeout(step, 14 + Math.random() * 22);
      } else {
        setTimeout(() => {
          submit(sql);
          setTyping(false);
        }, 250);
      }
    };
    setTimeout(step, 300);
  };

  const shownOnce = useRef(false);
  useEffect(() => {
    if (!inView || shownOnce.current) return;
    shownOnce.current = true;
    typeAndRun(examples[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    const fromPalette = (e: Event) => typeAndRun((e as CustomEvent<string>).detail);
    window.addEventListener(RUN_QUERY_EVENT, fromPalette);
    return () => window.removeEventListener(RUN_QUERY_EVENT, fromPalette);
  });

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  return (
    <div
      ref={container}
      className="overflow-hidden rounded-xl border border-line bg-surface font-mono text-sm shadow-2xl shadow-black/40"
    >
      <div className="flex items-center gap-2 border-b border-line bg-surface-strong px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-danger/70" />
        <span className="size-2.5 rounded-full bg-warning/70" />
        <span className="size-2.5 rounded-full bg-accent/70" />
        <span className="ml-3 text-xs text-fg-muted">bq query --project marcinmazuro --dataset cv</span>
      </div>

      <div ref={scroller} onClick={() => field.current?.focus()} className="h-[26rem] overflow-y-auto px-4 py-3">
        <p className="text-xs text-fg-muted">
          {t.hint} <span className="text-fg">help</span> {t.showsSyntax} <span className="text-fg">SHOW TABLES</span>{" "}
          {t.listsTables}
        </p>

        {entries.map((e) => (
          <div key={e.id} className="mt-4">
            <p className="break-all">
              <span className="text-accent">bq&gt;</span> {e.input}
            </p>
            {e.output.kind === "table" && <ResultTable output={e.output} />}
            {e.output.kind === "text" && (
              <pre className="mt-1 text-xs leading-relaxed whitespace-pre-wrap text-fg-muted">
                {e.output.lines.join("\n")}
              </pre>
            )}
            {e.output.kind === "error" && <p className="mt-1 text-xs text-danger">Error: {e.output.message}</p>}
          </div>
        ))}

        <form
          className="mt-4 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!typing) submit(input);
          }}
        >
          <label htmlFor="console-input" className="text-accent">
            bq&gt;
          </label>
          <input
            id="console-input"
            ref={field}
            value={input}
            readOnly={typing}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" && history.length) {
                e.preventDefault();
                const i = Math.min(historyIndex + 1, history.length - 1);
                setHistoryIndex(i);
                setInput(history[i]);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const i = historyIndex - 1;
                setHistoryIndex(Math.max(i, -1));
                setInput(i >= 0 ? history[i] : "");
              }
            }}
            className="flex-1 bg-transparent text-fg caret-accent focus:outline-none"
            aria-label={t.inputLabel}
          />
        </form>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
        {examples.map((q) => (
          <button
            key={q}
            type="button"
            disabled={typing}
            onClick={() => typeAndRun(q)}
            className={cn(
              "max-w-full truncate rounded border border-line px-2 py-1 text-[11px] text-fg-muted transition-colors",
              "hover:border-accent/50 hover:text-fg disabled:opacity-50",
            )}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
