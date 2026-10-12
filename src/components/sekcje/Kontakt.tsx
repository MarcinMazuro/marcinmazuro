import { FormularzKontaktowy } from "@/components/formularze/FormularzKontaktowy";
import { OSOBA } from "@/lib/dane";
import { NaglowekSekcji } from "./NaglowekSekcji";

export function Kontakt() {
  return (
    <section id="kontakt" className="scroll-mt-20 py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1fr_1.6fr] 3xl:max-w-7xl">
        <div>
          <NaglowekSekcji numer="07" nazwa="curl -X POST" tytul="Porozmawiajmy" />
          <p className="leading-relaxed text-tekst-miekki">
            Rekrutacja, projekt danych na GCP albo strona dla Twojej firmy - napisz, odpowiem w ciągu dwóch dni
            roboczych.
          </p>
          <dl className="mt-8 space-y-3 font-mono text-sm">
            <div className="flex gap-3">
              <dt className="w-20 text-tekst-miekki">email</dt>
              <dd>
                <a href={`mailto:${OSOBA.email}`} className="text-akcent-2 hover:underline">
                  {OSOBA.email}
                </a>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-20 text-tekst-miekki">github</dt>
              <dd>
                <a href={OSOBA.github} className="text-akcent-2 hover:underline">
                  {OSOBA.github.replace("https://", "")}
                </a>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-20 text-tekst-miekki">linkedin</dt>
              <dd>
                <a href={OSOBA.linkedin} className="text-akcent-2 hover:underline">
                  linkedin
                </a>
              </dd>
            </div>
          </dl>
        </div>
        <FormularzKontaktowy />
      </div>
    </section>
  );
}
