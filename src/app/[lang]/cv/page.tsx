import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CERTIFICATIONS, EXPERIENCE, period, PROFILE, PROJECTS, SKILLS } from "@/lib/content";
import { dictionary } from "@/lib/dictionary";
import { isLang, localePath } from "@/lib/i18n";
import { PrintButton } from "./PrintButton";

export async function generateMetadata({ params }: PageProps<"/[lang]/cv">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return {
    title: dictionary(lang).cv.title,
    alternates: {
      canonical: localePath(lang, "/cv"),
      languages: { pl: localePath("pl", "/cv"), en: localePath("en", "/cv") },
    },
  };
}

const heading = "mb-3 border-b border-line pb-1 font-mono text-xs tracking-wider text-accent uppercase";

/** A one-page A4 resume generated from the same data as the home page. */
export default async function CvPage({ params }: PageProps<"/[lang]/cv">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dictionary(lang).cv;

  return (
    <main className="mx-auto max-w-3xl px-5 pt-24 pb-16 print:max-w-none print:p-0">
      <div className="no-print mb-8 flex items-center justify-between rounded-md border border-line bg-surface px-4 py-3">
        <p className="font-mono text-xs text-fg-muted">{t.banner}</p>
        <PrintButton label={t.print} />
      </div>

      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{PROFILE.name}</h1>
        <p className="mt-1 font-mono text-sm text-fg-muted">
          {PROFILE.role} · {PROFILE.location[lang]}
        </p>
        <p className="mt-2 font-mono text-xs text-fg-muted">
          {PROFILE.email} · {PROFILE.github.replace("https://", "")}
        </p>
        <p className="mt-4 text-sm leading-relaxed">{PROFILE.about[lang]}</p>
      </header>

      <section className="mt-8">
        <h2 className={heading}>{t.experience}</h2>
        <div className="space-y-5">
          {EXPERIENCE.map((job) => (
            <div key={job.id} className="break-inside-avoid">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-medium">
                  {job.title} <span className="text-fg-muted">· {job.company}</span>
                </h3>
                <span className="shrink-0 font-mono text-xs text-fg-muted">{period(job, lang)}</span>
              </div>
              <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-sm">
                {job.highlights.map((h) => (
                  <li key={h.en}>{h[lang]}</li>
                ))}
              </ul>
              <p className="mt-1.5 font-mono text-[11px] text-fg-muted">{job.stack.join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className={heading}>{t.projects}</h2>
        <div className="space-y-4">
          {PROJECTS.map((p) => (
            <div key={p.slug} className="break-inside-avoid text-sm">
              <h3 className="font-medium">
                {p.name[lang]} <span className="font-mono text-xs text-fg-muted">{p.year}</span>
              </h3>
              <p className="mt-1">{p.solution[lang]}</p>
              <p className="mt-1 text-fg-muted">{p.result[lang]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-8 sm:grid-cols-2 print:grid-cols-2">
        <div>
          <h2 className={heading}>{t.skills}</h2>
          <p className="text-sm leading-relaxed">
            {[...SKILLS]
              .sort((a, b) => b.level - a.level)
              .map((s) => s.name)
              .join(" · ")}
          </p>
        </div>
        <div>
          <h2 className={heading}>{t.certifications}</h2>
          <ul className="space-y-1 text-sm">
            {CERTIFICATIONS.map((c) => (
              <li key={c.name}>
                {c.issuer} {c.name}{" "}
                <span className="text-fg-muted">({c.year ?? dictionary(lang).skills.inProgress})</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
