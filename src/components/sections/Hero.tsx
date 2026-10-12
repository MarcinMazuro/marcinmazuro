import Link from "next/link";
import { DataPipeline } from "@/components/DataPipeline";
import { PROFILE } from "@/lib/content";
import { dictionary } from "@/lib/dictionary";
import { localePath, type Lang } from "@/lib/i18n";

export function Hero({ lang }: { lang: Lang }) {
  const t = dictionary(lang).hero;
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -z-10 h-[30rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--c-accent-2)_18%,transparent),transparent)]"
      />

      <div className="mx-auto max-w-6xl px-5 3xl:max-w-7xl">
        <p className="font-mono text-sm text-fg-muted">
          <span className="text-accent">$</span> whoami
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-7xl">{PROFILE.name}</h1>
        <p className="mt-4 font-mono text-lg text-fg-muted sm:text-xl">
          {PROFILE.role} <span className="text-accent">-&gt;</span>{" "}
          <span className="cursor-blink text-fg">{PROFILE.goal}</span>
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-fg-muted">{PROFILE.tagline[lang]}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={localePath(lang, "/#console")}
            className="rounded-md bg-accent px-5 py-2.5 font-mono text-sm font-medium text-canvas transition-transform hover:-translate-y-0.5"
          >
            {t.query}
          </Link>
          <Link
            href={localePath(lang, "/cv")}
            className="rounded-md border border-line bg-surface px-5 py-2.5 font-mono text-sm text-fg transition-colors hover:border-fg-muted/50"
          >
            cv.pdf
          </Link>
          <Link
            href={localePath(lang, "/#contact")}
            className="rounded-md px-5 py-2.5 font-mono text-sm text-fg-muted transition-colors hover:text-fg"
          >
            {t.contact} -&gt;
          </Link>
        </div>

        <div className="mt-16 rounded-xl border border-line bg-surface/60 p-4 backdrop-blur-sm sm:p-6">
          <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-fg-muted">
            <span>data-platform.tf</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 animate-pulse rounded-full bg-accent" aria-hidden />
              running
            </span>
          </div>
          {/* Below ~640 px the labels would be unreadable - scroll sideways instead */}
          <div className="-mx-4 overflow-x-auto px-4 [scrollbar-color:var(--c-line)_transparent] [scrollbar-width:thin] sm:mx-0 sm:px-0">
            <div className="min-w-[640px]">
              <DataPipeline lang={lang} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
