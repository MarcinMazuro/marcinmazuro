import type { Metadata } from "next";
import { CERTYFIKATY, DOSWIADCZENIE, okres, OSOBA, PROJEKTY, UMIEJETNOSCI } from "@/lib/dane";
import { PrzyciskDruku } from "./PrzyciskDruku";

export const metadata: Metadata = { title: "CV" };

const naglowek = "mb-3 border-b border-linia pb-1 font-mono text-xs uppercase tracking-wider text-akcent";

/** CV na jednej stronie A4, generowane z tych samych danych co strona główna. */
export default function Cv() {
  return (
    <main className="mx-auto max-w-3xl px-5 pt-24 pb-16 print:max-w-none print:p-0">
      <div className="bez-druku mb-8 flex items-center justify-between rounded-md border border-linia bg-powierzchnia px-4 py-3">
        <p className="font-mono text-xs text-tekst-miekki">Wersja do druku, generowana z danych strony.</p>
        <PrzyciskDruku />
      </div>

      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{OSOBA.imie}</h1>
        <p className="mt-1 font-mono text-sm text-tekst-miekki">
          {OSOBA.rola} · {OSOBA.lokalizacja}
        </p>
        <p className="mt-2 font-mono text-xs text-tekst-miekki">
          {OSOBA.email} · {OSOBA.github.replace("https://", "")}
        </p>
        <p className="mt-4 text-sm leading-relaxed">{OSOBA.oMnie}</p>
      </header>

      <section className="mt-8 break-inside-avoid">
        <h2 className={naglowek}>Doświadczenie</h2>
        <div className="space-y-5">
          {DOSWIADCZENIE.map((d) => (
            <div key={d.id} className="break-inside-avoid">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-medium">
                  {d.stanowisko} <span className="text-tekst-miekki">· {d.firma}</span>
                </h3>
                <span className="shrink-0 font-mono text-xs text-tekst-miekki">{okres(d)}</span>
              </div>
              <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-sm">
                {d.osiagniecia.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
              <p className="mt-1.5 font-mono text-[11px] text-tekst-miekki">{d.stack.join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className={naglowek}>Projekty</h2>
        <div className="space-y-4">
          {PROJEKTY.map((p) => (
            <div key={p.slug} className="break-inside-avoid text-sm">
              <h3 className="font-medium">
                {p.nazwa} <span className="font-mono text-xs text-tekst-miekki">{p.rok}</span>
              </h3>
              <p className="mt-1">{p.rozwiazanie}</p>
              <p className="mt-1 text-tekst-miekki">{p.wynik}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-8 sm:grid-cols-2 print:grid-cols-2">
        <div>
          <h2 className={naglowek}>Umiejętności</h2>
          <p className="text-sm leading-relaxed">
            {[...UMIEJETNOSCI]
              .sort((a, b) => b.poziom - a.poziom)
              .map((u) => u.nazwa)
              .join(" · ")}
          </p>
        </div>
        <div>
          <h2 className={naglowek}>Certyfikaty</h2>
          <ul className="space-y-1 text-sm">
            {CERTYFIKATY.map((c) => (
              <li key={c.nazwa}>
                {c.wystawca} {c.nazwa} <span className="text-tekst-miekki">({c.rok ?? "w trakcie"})</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
