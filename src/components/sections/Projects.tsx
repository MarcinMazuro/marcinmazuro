import { Reveal } from "@/components/Reveal";
import { PROJECTS } from "@/lib/content";
import { dictionary } from "@/lib/dictionary";
import type { Lang } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

export function Projects({ lang }: { lang: Lang }) {
  const t = dictionary(lang).projects;
  return (
    <section id="projects" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-5 3xl:max-w-7xl">
        <SectionHeading index="02" command="ls ./projects" title={t.title} />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08} className="h-full">
              <article className="flex h-full flex-col rounded-xl border border-line bg-surface p-6 transition-colors hover:border-accent/40">
                <div className="flex items-baseline justify-between font-mono text-xs text-fg-muted">
                  <span>{p.slug}/</span>
                  <span>{p.year}</span>
                </div>
                <h3 className="mt-3 text-xl font-medium">{p.name[lang]}</h3>
                <p className="mt-2 text-sm text-fg-muted">{p.summary[lang]}</p>
                <dl className="mt-5 space-y-3 text-sm">
                  {(
                    [
                      [t.problem, p.problem],
                      [t.solution, p.solution],
                      [t.result, p.result],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label}>
                      <dt className="font-mono text-[11px] tracking-wider text-accent uppercase">{label}</dt>
                      <dd className="mt-1 leading-relaxed text-fg/90">{value[lang]}</dd>
                    </div>
                  ))}
                </dl>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <li key={s} className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-fg-muted">
                      {s}
                    </li>
                  ))}
                </ul>
                {(p.url || p.repo) && (
                  <div className="mt-auto flex gap-4 pt-6 font-mono text-xs">
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener" className="text-accent-2 hover:underline">
                        {t.website} -&gt;
                      </a>
                    )}
                    {p.repo && (
                      <a href={p.repo} target="_blank" rel="noopener" className="text-accent-2 hover:underline">
                        {t.code} -&gt;
                      </a>
                    )}
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
