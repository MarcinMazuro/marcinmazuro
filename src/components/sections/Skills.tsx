import { CATEGORIES, CATEGORY_LABELS, CERTIFICATIONS, SKILLS } from "@/lib/content";
import { dictionary } from "@/lib/dictionary";
import type { Lang } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

/** Skill level as a block bar, like a chart in a terminal. */
function LevelBar({ level, label }: { level: number; label: string }) {
  return (
    <span aria-label={label} className="font-mono text-xs tracking-tighter">
      <span className="text-accent">{"■".repeat(level)}</span>
      <span className="text-line">{"■".repeat(5 - level)}</span>
    </span>
  );
}

export function Skills({ lang }: { lang: Lang }) {
  const t = dictionary(lang).skills;
  return (
    <section id="stack" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-5 3xl:max-w-7xl">
        <SectionHeading index="03" command="cat stack.yaml" title={t.title} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <div key={c} className="rounded-xl border border-line bg-surface p-5">
              <h3 className="font-mono text-sm text-accent-2">{CATEGORY_LABELS[c][lang]}:</h3>
              <ul className="mt-3 space-y-2">
                {SKILLS.filter((s) => s.category === c).map((s) => (
                  <li key={s.name} className="flex items-center justify-between gap-4 text-sm">
                    <span>{s.name}</span>
                    <LevelBar level={s.level} label={t.level.replace("{n}", String(s.level))} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="rounded-xl border border-line bg-surface p-5">
            <h3 className="font-mono text-sm text-accent-2">{t.certifications}:</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {CERTIFICATIONS.map((c) => (
                <li key={c.name} className="flex items-center justify-between gap-4">
                  <span>
                    {c.name} <span className="text-fg-muted">· {c.issuer}</span>
                  </span>
                  <span className={`font-mono text-xs ${c.year ? "text-accent" : "text-warning"}`}>
                    {c.year ?? t.inProgress}
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
