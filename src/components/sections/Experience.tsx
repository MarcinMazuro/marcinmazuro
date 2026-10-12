import { Reveal } from "@/components/Reveal";
import { EXPERIENCE, period } from "@/lib/content";
import { dictionary } from "@/lib/dictionary";
import type { Lang } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

/** Experience rendered like `git log --graph` - newest on top. */
export function Experience({ lang }: { lang: Lang }) {
  return (
    <section id="experience" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-5 3xl:max-w-7xl">
        <SectionHeading index="01" command="git log --career" title={dictionary(lang).experience.title} />
        <ol className="relative border-l border-line pl-8">
          {EXPERIENCE.map((job, i) => (
            <li key={job.id} className="relative pb-12 last:pb-0">
              <span
                aria-hidden
                className={`absolute top-1.5 -left-[37px] size-2.5 rounded-full ring-4 ring-canvas ${i === 0 ? "bg-accent" : "bg-fg-muted"}`}
              />
              <Reveal>
                <p className="font-mono text-xs text-fg-muted">
                  <span className="text-warning">commit {job.id}</span>
                  {i === 0 && job.end === null && <span className="text-accent-2"> (HEAD -&gt; main)</span>}
                  <span className="ml-3">{period(job, lang)}</span>
                </p>
                <h3 className="mt-2 text-xl font-medium">
                  {job.title} <span className="text-fg-muted">@ {job.company}</span>
                </h3>
                <p className="mt-2 text-fg-muted">{job.summary[lang]}</p>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {job.highlights.map((h) => (
                    <li key={h.en} className="flex gap-2">
                      <span className="font-mono text-accent">+</span>
                      <span>{h[lang]}</span>
                    </li>
                  ))}
                </ul>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {job.stack.map((s) => (
                    <li key={s} className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-fg-muted">
                      {s}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
