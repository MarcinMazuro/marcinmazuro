import Link from "next/link";
import { PROFILE } from "@/lib/content";
import { dictionary } from "@/lib/dictionary";
import { localePath, type Lang } from "@/lib/i18n";

/**
 * Commit baked in at image build time (Dockerfile, ARG VERSION). A small
 * detail a developer notices straight away: the page knows which commit it
 * was built from.
 */
const VERSION = process.env.VERSION ?? "local";

export function Footer({ lang }: { lang: Lang }) {
  const t = dictionary(lang).footer;
  return (
    <footer className="no-print border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 font-mono text-xs text-fg-muted sm:flex-row sm:items-center sm:justify-between 3xl:max-w-7xl">
        <p>
          © {new Date().getFullYear()} {PROFILE.name} ·{" "}
          <Link href={localePath(lang, "/privacy")} className="hover:text-fg">
            {t.privacy}
          </Link>
        </p>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            cloud run · europe-west1
          </span>
          <span>commit {VERSION}</span>
          <a href={PROFILE.github} className="hover:text-fg">
            github
          </a>
        </p>
      </div>
    </footer>
  );
}
