"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { OTWORZ_PALETE, SEKCJE } from "@/lib/nawigacja";

function subskrybuj(powiadom: () => void) {
  window.addEventListener("scroll", powiadom, { passive: true });
  return () => window.removeEventListener("scroll", powiadom);
}

export function Nawigacja() {
  // Tło paska pojawia się dopiero po zjechaniu z samej góry
  const przewinieta = useSyncExternalStore(
    subskrybuj,
    () => window.scrollY > 24,
    () => false,
  );

  return (
    <header
      style={{ viewTransitionName: "nawigacja" }}
      className={cn(
        "bez-druku fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        przewinieta ? "border-linia bg-tlo/80 backdrop-blur-md" : "border-transparent",
      )}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 font-mono text-sm 3xl:max-w-7xl">
        <Link href="/" className="text-tekst">
          <span className="text-akcent">~/</span>marcin-mazuro
        </Link>
        <div className="flex items-center gap-6">
          <ul className="hidden items-center gap-6 md:flex">
            {SEKCJE.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="text-tekst-miekki transition-colors hover:text-tekst">
                  {s.etykieta}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/cv" className="text-tekst-miekki transition-colors hover:text-tekst">
                cv
              </Link>
            </li>
          </ul>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OTWORZ_PALETE))}
            className="flex items-center gap-2 rounded-md border border-linia bg-powierzchnia px-2.5 py-1 text-xs text-tekst-miekki transition-colors hover:border-tekst-miekki/50 hover:text-tekst"
            aria-label="Otwórz paletę poleceń"
          >
            <kbd className="font-mono">⌘K</kbd>
          </button>
        </div>
      </nav>
    </header>
  );
}
