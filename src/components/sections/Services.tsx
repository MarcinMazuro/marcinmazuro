import Link from "next/link";
import { dictionary } from "@/lib/dictionary";
import { localePath, type Lang } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

/**
 * Seed of the websites-for-businesses offer. Next step: booking a call in a
 * calendar (same scheduling logic as on agnieszkabielawa.pl).
 */
export function Services({ lang }: { lang: Lang }) {
  const t = dictionary(lang).services;
  return (
    <section id="services" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-5 3xl:max-w-7xl">
        <div className="rounded-2xl border border-line bg-gradient-to-br from-surface to-canvas p-8 sm:p-12">
          <SectionHeading index="06" command="services" title={t.title} />
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="leading-relaxed text-fg-muted">{t.pitch}</p>
              <p className="mt-4 leading-relaxed text-fg-muted">
                {t.example}{" "}
                <a
                  href="https://agnieszkabielawa.pl"
                  target="_blank"
                  rel="noopener"
                  className="text-accent-2 hover:underline"
                >
                  agnieszkabielawa.pl
                </a>{" "}
                {t.exampleDetail}
              </p>
              <Link
                href={localePath(lang, "/#contact")}
                className="mt-8 inline-block rounded-md bg-accent px-5 py-2.5 font-mono text-sm font-medium text-canvas transition-transform hover:-translate-y-0.5"
              >
                {t.cta}
              </Link>
            </div>
            <ul className="space-y-3">
              {t.features.map((f) => (
                <li key={f} className="flex gap-3 text-sm">
                  <span className="font-mono text-accent">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
