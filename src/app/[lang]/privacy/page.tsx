import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROFILE } from "@/lib/content";
import { dictionary } from "@/lib/dictionary";
import { isLang, localePath } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return {
    title: dictionary(lang).privacy.title,
    alternates: {
      canonical: localePath(lang, "/privacy"),
      languages: { pl: localePath("pl", "/privacy"), en: localePath("en", "/privacy") },
    },
  };
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dictionary(lang).privacy;

  return (
    <main className="mx-auto max-w-2xl px-5 pt-28 pb-20">
      <h1 className="text-3xl font-semibold tracking-tight">{t.title}</h1>
      <div className="mt-8 space-y-4 leading-relaxed text-fg-muted">
        {t.paragraphs.map((p) => (
          <p key={p}>{p.replace("{name}", PROFILE.name).replace("{email}", PROFILE.email)}</p>
        ))}
      </div>
    </main>
  );
}
