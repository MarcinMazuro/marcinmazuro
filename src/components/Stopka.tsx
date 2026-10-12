import Link from "next/link";
import { OSOBA } from "@/lib/dane";

/**
 * Wersja i region wpisane przy budowaniu obrazu (Dockerfile, ARG WERSJA).
 * Drobiazg, który programista od razu zauważy: strona wie, z którego commita
 * pochodzi.
 */
const WERSJA = process.env.WERSJA ?? "lokalnie";

export function Stopka() {
  return (
    <footer className="bez-druku border-t border-linia">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 font-mono text-xs text-tekst-miekki sm:flex-row sm:items-center sm:justify-between 3xl:max-w-7xl">
        <p>
          © {new Date().getFullYear()} {OSOBA.imie} ·{" "}
          <Link href="/prywatnosc" className="hover:text-tekst">
            prywatność
          </Link>
        </p>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-akcent" aria-hidden />
            cloud run · europe-west1
          </span>
          <span>commit {WERSJA}</span>
          <a href={OSOBA.github} className="hover:text-tekst">
            github
          </a>
        </p>
      </div>
    </footer>
  );
}
