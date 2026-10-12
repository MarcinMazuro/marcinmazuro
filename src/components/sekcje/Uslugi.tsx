import Link from "next/link";
import { NaglowekSekcji } from "./NaglowekSekcji";

const CO_DOSTAJESZ = [
  "Strona na własnej domenie, szybka na telefonie",
  "Rezerwacja terminów i płatności online (BLIK, Przelewy24, karta)",
  "Panel do samodzielnej edycji treści, bloga i cen",
  "Formularze, newsletter, statystyki zgodne z RODO",
  "Hosting w Google Cloud, kopie zapasowe, monitoring",
];

/**
 * Zalążek oferty stron dla firm. Docelowo: rezerwacja rozmowy w kalendarzu
 * (ten sam mechanizm terminów co na agnieszkabielawa.pl).
 */
export function Uslugi() {
  return (
    <section id="uslugi" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-5 3xl:max-w-7xl">
        <div className="rounded-2xl border border-linia bg-gradient-to-br from-powierzchnia to-tlo p-8 sm:p-12">
          <NaglowekSekcji numer="06" nazwa="uslugi" tytul="Strona internetowa dla Twojej firmy" />
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="leading-relaxed text-tekst-miekki">
                Robię strony dla małych firm i specjalistów, którzy chcą przenieść klientów z Instagrama i telefonu
                na własną stronę: z zapisami, płatnościami i panelem, w którym sami zmieniacie treści.
              </p>
              <p className="mt-4 leading-relaxed text-tekst-miekki">
                Przykład:{" "}
                <a href="https://agnieszkabielawa.pl" target="_blank" rel="noopener" className="text-akcent-2 hover:underline">
                  agnieszkabielawa.pl
                </a>{" "}
                - strona dietetyczki z zakupem konsultacji, ankietą i rezerwacją terminu.
              </p>
              <Link
                href="/#kontakt"
                className="mt-8 inline-block rounded-md bg-akcent px-5 py-2.5 font-mono text-sm font-medium text-tlo transition-transform hover:-translate-y-0.5"
              >
                Umów bezpłatną rozmowę
              </Link>
            </div>
            <ul className="space-y-3">
              {CO_DOSTAJESZ.map((c) => (
                <li key={c} className="flex gap-3 text-sm">
                  <span className="font-mono text-akcent">✓</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
