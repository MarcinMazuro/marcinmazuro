"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { dictionary } from "@/lib/dictionary";
import { localePath, type Lang } from "@/lib/i18n";
import { otherLang, rememberLang, switchHref } from "@/lib/langSwitch";
import { OPEN_PALETTE_EVENT, SECTIONS } from "@/lib/navigation";

function subscribe(notify: () => void) {
  window.addEventListener("scroll", notify, { passive: true });
  return () => window.removeEventListener("scroll", notify);
}

export function Navigation({ lang }: { lang: Lang }) {
  const t = dictionary(lang).nav;
  const pathname = usePathname();
  // The bar gets a background only once the page has scrolled off the top
  const scrolled = useSyncExternalStore(
    subscribe,
    () => window.scrollY > 24,
    () => false,
  );

  return (
    <header
      style={{ viewTransitionName: "navigation" }}
      className={cn(
        "no-print fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled ? "border-line bg-canvas/80 backdrop-blur-md" : "border-transparent",
      )}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 font-mono text-sm 3xl:max-w-7xl">
        <Link href={localePath(lang, "/")} className="text-fg">
          <span className="text-accent">~/</span>marcin-mazuro
        </Link>
        <div className="flex items-center gap-5">
          <ul className="hidden items-center gap-6 md:flex">
            {SECTIONS.map((s) => (
              <li key={s.route}>
                <Link href={localePath(lang, s.route)} className="text-fg-muted transition-colors hover:text-fg">
                  {t[s.key]}
                </Link>
              </li>
            ))}
            <li>
              <Link href={localePath(lang, "/cv")} className="text-fg-muted transition-colors hover:text-fg">
                {t.cv}
              </Link>
            </li>
          </ul>
          {/* A plain link: the other language has its own root layout (<html lang>),
              so this is a full page load anyway */}
          <a
            href={switchHref(lang, pathname)}
            hrefLang={otherLang(lang)}
            onClick={() => rememberLang(otherLang(lang))}
            aria-label={t.switchLang}
            title={t.switchLang}
            className="text-xs text-fg-muted uppercase transition-colors hover:text-fg"
          >
            {otherLang(lang)}
          </a>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
            className="flex items-center gap-2 rounded-md border border-line bg-surface px-2.5 py-1 text-xs text-fg-muted transition-colors hover:border-fg-muted/50 hover:text-fg"
            aria-label={t.palette}
          >
            <kbd className="font-mono">⌘K</kbd>
          </button>
        </div>
      </nav>
    </header>
  );
}
