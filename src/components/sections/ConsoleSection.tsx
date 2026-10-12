import { SqlConsole } from "@/components/SqlConsole";
import { dictionary } from "@/lib/dictionary";
import type { Lang } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

const SUPPORTED = ["WHERE", "LIKE", "ORDER BY", "COUNT(*)"];

export function ConsoleSection({ lang }: { lang: Lang }) {
  const t = dictionary(lang).console;
  return (
    <section id="console" className="scroll-mt-20 py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1fr_1.6fr] lg:items-start 3xl:max-w-7xl">
        <div>
          <SectionHeading index="04" command="bq query" title={t.title} />
          <p className="leading-relaxed text-fg-muted">
            {t.intro}{" "}
            {SUPPORTED.map((s, i) => (
              <span key={s}>
                <code className="font-mono text-fg">{s}</code>
                {i < SUPPORTED.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
          <p className="mt-4 leading-relaxed text-fg-muted">{t.details}</p>
        </div>
        <SqlConsole lang={lang} />
      </div>
    </section>
  );
}
