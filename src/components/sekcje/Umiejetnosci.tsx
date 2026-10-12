import { CERTYFIKATY, UMIEJETNOSCI, type Umiejetnosc } from "@/lib/dane";
import { NaglowekSekcji } from "./NaglowekSekcji";

const KATEGORIE: Umiejetnosc["kategoria"][] = ["GCP", "Dane", "Infrastruktura", "Języki", "Web"];

/** Poziom jako pasek z bloków, jak wykres w terminalu. */
function Pasek({ poziom }: { poziom: number }) {
  return (
    <span aria-label={`poziom ${poziom} z 5`} className="font-mono text-xs tracking-tighter">
      <span className="text-akcent">{"■".repeat(poziom)}</span>
      <span className="text-linia">{"■".repeat(5 - poziom)}</span>
    </span>
  );
}

export function Umiejetnosci() {
  return (
    <section id="stack" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-5 3xl:max-w-7xl">
        <NaglowekSekcji numer="03" nazwa="cat stack.yaml" tytul="Stack" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {KATEGORIE.map((k) => (
            <div key={k} className="rounded-xl border border-linia bg-powierzchnia p-5">
              <h3 className="font-mono text-sm text-akcent-2">{k.toLowerCase()}:</h3>
              <ul className="mt-3 space-y-2">
                {UMIEJETNOSCI.filter((u) => u.kategoria === k).map((u) => (
                  <li key={u.nazwa} className="flex items-center justify-between gap-4 text-sm">
                    <span>{u.nazwa}</span>
                    <Pasek poziom={u.poziom} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="rounded-xl border border-linia bg-powierzchnia p-5">
            <h3 className="font-mono text-sm text-akcent-2">certyfikaty:</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {CERTYFIKATY.map((c) => (
                <li key={c.nazwa} className="flex items-center justify-between gap-4">
                  <span>
                    {c.nazwa} <span className="text-tekst-miekki">· {c.wystawca}</span>
                  </span>
                  <span className={`font-mono text-xs ${c.rok ? "text-akcent" : "text-ostrzezenie"}`}>
                    {c.rok ?? "w trakcie"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
