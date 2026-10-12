import { Odsloniecie } from "@/components/Odsloniecie";
import { DOSWIADCZENIE, okres } from "@/lib/dane";
import { NaglowekSekcji } from "./NaglowekSekcji";

/** Doświadczenie podane jak `git log --graph` - najnowsze na górze. */
export function Doswiadczenie() {
  return (
    <section id="doswiadczenie" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-5 3xl:max-w-7xl">
        <NaglowekSekcji numer="01" nazwa="git log --career" tytul="Doświadczenie" />
        <ol className="relative border-l border-linia pl-8">
          {DOSWIADCZENIE.map((d, i) => (
            <li key={d.id} className="relative pb-12 last:pb-0">
              <span
                aria-hidden
                className={`absolute -left-[37px] top-1.5 size-2.5 rounded-full ring-4 ring-tlo ${i === 0 ? "bg-akcent" : "bg-tekst-miekki"}`}
              />
              <Odsloniecie>
                <p className="font-mono text-xs text-tekst-miekki">
                  <span className="text-ostrzezenie">commit {d.id}</span>
                  {i === 0 && d.do === null && <span className="text-akcent-2"> (HEAD -&gt; main)</span>}
                  <span className="ml-3">{okres(d)}</span>
                </p>
                <h3 className="mt-2 text-xl font-medium">
                  {d.stanowisko} <span className="text-tekst-miekki">@ {d.firma}</span>
                </h3>
                <p className="mt-2 text-tekst-miekki">{d.opis}</p>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {d.osiagniecia.map((o) => (
                    <li key={o} className="flex gap-2">
                      <span className="font-mono text-akcent">+</span>
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {d.stack.map((s) => (
                    <li key={s} className="rounded border border-linia px-2 py-0.5 font-mono text-[11px] text-tekst-miekki">
                      {s}
                    </li>
                  ))}
                </ul>
              </Odsloniecie>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
