import { Odsloniecie } from "@/components/Odsloniecie";
import { PROJEKTY } from "@/lib/dane";
import { NaglowekSekcji } from "./NaglowekSekcji";

export function Projekty() {
  return (
    <section id="projekty" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-5 3xl:max-w-7xl">
        <NaglowekSekcji numer="02" nazwa="ls ./projekty" tytul="Projekty: problem, rozwiązanie, wynik" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {PROJEKTY.map((p, i) => (
            <Odsloniecie key={p.slug} opoznienie={i * 0.08} className="h-full">
              <article className="group flex h-full flex-col rounded-xl border border-linia bg-powierzchnia p-6 transition-colors hover:border-akcent/40">
                <div className="flex items-baseline justify-between font-mono text-xs text-tekst-miekki">
                  <span>{p.slug}/</span>
                  <span>{p.rok}</span>
                </div>
                <h3 className="mt-3 text-xl font-medium">{p.nazwa}</h3>
                <p className="mt-2 text-sm text-tekst-miekki">{p.opis}</p>
                <dl className="mt-5 space-y-3 text-sm">
                  {(
                    [
                      ["problem", p.problem],
                      ["rozwiązanie", p.rozwiazanie],
                      ["wynik", p.wynik],
                    ] as const
                  ).map(([k, v]) => (
                    <div key={k}>
                      <dt className="font-mono text-[11px] uppercase tracking-wider text-akcent">{k}</dt>
                      <dd className="mt-1 leading-relaxed text-tekst/90">{v}</dd>
                    </div>
                  ))}
                </dl>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <li key={s} className="rounded border border-linia px-2 py-0.5 font-mono text-[11px] text-tekst-miekki">
                      {s}
                    </li>
                  ))}
                </ul>
                {(p.link || p.repo) && (
                  <div className="mt-auto flex gap-4 pt-6 font-mono text-xs">
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noopener" className="text-akcent-2 hover:underline">
                        strona -&gt;
                      </a>
                    )}
                    {p.repo && (
                      <a href={p.repo} target="_blank" rel="noopener" className="text-akcent-2 hover:underline">
                        kod -&gt;
                      </a>
                    )}
                  </div>
                )}
              </article>
            </Odsloniecie>
          ))}
        </div>
      </div>
    </section>
  );
}
