"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { EXAMPLES } from "@/lib/console/commands";
import { PROFILE } from "@/lib/content";
import { dictionary } from "@/lib/dictionary";
import { localePath, type Lang } from "@/lib/i18n";
import { otherLang, rememberLang, switchHref } from "@/lib/langSwitch";
import { OPEN_PALETTE_EVENT, RUN_QUERY_EVENT, SECTIONS } from "@/lib/navigation";

type Action = { id: string; group: string; label: string; run: () => void };

export function CommandPalette({ lang }: { lang: Lang }) {
  const dict = dictionary(lang);
  const t = dict.palette;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const close = () => {
    setOpen(false);
    setQuery("");
    setSelected(0);
  };

  const show = () => {
    setOpen(true);
    setCopied(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, show);
    };
  }, [open]);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  const actions = useMemo<Action[]>(
    () => [
      ...SECTIONS.map((s) => ({
        id: s.route,
        group: t.goTo,
        label: dict.nav[s.key],
        run: () => router.push(localePath(lang, s.route)),
      })),
      { id: "cv", group: t.goTo, label: t.cv, run: () => router.push(localePath(lang, "/cv")) },
      {
        id: "email",
        group: t.actions,
        label: `${t.copyEmail}: ${PROFILE.email}`,
        run: () => {
          void navigator.clipboard.writeText(PROFILE.email);
          setCopied(true);
        },
      },
      { id: "github", group: t.actions, label: t.github, run: () => window.open(PROFILE.github, "_blank") },
      {
        id: "lang",
        group: t.actions,
        label: t.otherLang,
        run: () => {
          rememberLang(otherLang(lang));
          window.location.assign(switchHref(lang, pathname));
        },
      },
      ...EXAMPLES[lang].map((sql, i) => ({
        id: `sql-${i}`,
        group: t.query,
        label: sql,
        run: () => {
          router.push(localePath(lang, "/#console"));
          // After navigating the console may still be mounting - give it a moment
          setTimeout(() => window.dispatchEvent(new CustomEvent(RUN_QUERY_EVENT, { detail: sql })), 300);
        },
      })),
    ],
    [dict, t, lang, router, pathname],
  );

  const visible = actions.filter((a) => `${a.group} ${a.label}`.toLowerCase().includes(query.toLowerCase()));

  const execute = (a: Action | undefined) => {
    if (!a) return;
    a.run();
    // Copying keeps the palette open so the confirmation is visible
    if (a.id !== "email") close();
  };

  if (!open) return null;

  return (
    <div
      className="no-print fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[15vh] backdrop-blur-sm"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal
        aria-label={dict.nav.palette}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-xl border border-line bg-surface shadow-2xl shadow-black/50"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <span className="font-mono text-accent">&gt;</span>
          <input
            ref={input}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") close();
              else if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelected((s) => Math.min(s + 1, visible.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelected((s) => Math.max(s - 1, 0));
              } else if (e.key === "Enter") execute(visible[selected]);
            }}
            placeholder={t.placeholder}
            className="h-12 flex-1 bg-transparent font-mono text-sm text-fg placeholder:text-fg-muted/60 focus:outline-none"
          />
          <kbd className="font-mono text-[10px] text-fg-muted">esc</kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {visible.length === 0 && <li className="px-3 py-6 text-center font-mono text-xs text-fg-muted">{t.empty}</li>}
          {visible.map((a, i) => (
            <li key={a.id}>
              <button
                type="button"
                onMouseEnter={() => setSelected(i)}
                onClick={() => execute(a)}
                className={cn(
                  "flex w-full items-baseline gap-3 rounded-md px-3 py-2 text-left font-mono text-xs",
                  i === selected ? "bg-surface-strong text-fg" : "text-fg-muted",
                )}
              >
                <span className="w-20 shrink-0 text-[10px] tracking-wider text-fg-muted/70 uppercase">{a.group}</span>
                <span className="truncate">{a.label}</span>
                {a.id === "email" && copied && <span className="ml-auto text-accent">{t.copied}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
