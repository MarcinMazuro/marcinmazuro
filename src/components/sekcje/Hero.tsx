import Link from "next/link";
import { PotokDanych } from "@/components/PotokDanych";
import { OSOBA } from "@/lib/dane";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36">
      <div aria-hidden className="tlo-siatka absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -z-10 h-[30rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--p-akcent-2)_18%,transparent),transparent)]"
      />

      <div className="mx-auto max-w-6xl px-5 3xl:max-w-7xl">
        <p className="font-mono text-sm text-tekst-miekki">
          <span className="text-akcent">$</span> whoami
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-7xl">{OSOBA.imie}</h1>
        <p className="mt-4 font-mono text-lg text-tekst-miekki sm:text-xl">
          {OSOBA.rola} <span className="text-akcent">-&gt;</span>{" "}
          <span className="kursor text-tekst">{OSOBA.cel}</span>
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-tekst-miekki text-pretty">{OSOBA.haslo}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/#konsola"
            className="rounded-md bg-akcent px-5 py-2.5 font-mono text-sm font-medium text-tlo transition-transform hover:-translate-y-0.5"
          >
            Zapytaj moje CV w SQL
          </Link>
          <Link
            href="/cv"
            className="rounded-md border border-linia bg-powierzchnia px-5 py-2.5 font-mono text-sm text-tekst transition-colors hover:border-tekst-miekki/50"
          >
            cv.pdf
          </Link>
          <Link
            href="/#kontakt"
            className="rounded-md px-5 py-2.5 font-mono text-sm text-tekst-miekki transition-colors hover:text-tekst"
          >
            kontakt -&gt;
          </Link>
        </div>

        <div className="mt-16 rounded-xl border border-linia bg-powierzchnia/60 p-4 backdrop-blur-sm sm:p-6">
          <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-tekst-miekki">
            <span>platforma-danych.tf</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 animate-pulse rounded-full bg-akcent" aria-hidden />
              running
            </span>
          </div>
          <PotokDanych />
        </div>
      </div>
    </section>
  );
}
