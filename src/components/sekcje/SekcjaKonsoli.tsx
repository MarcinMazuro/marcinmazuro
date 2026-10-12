import { Konsola } from "@/components/Konsola";
import { NaglowekSekcji } from "./NaglowekSekcji";

export function SekcjaKonsoli() {
  return (
    <section id="konsola" className="scroll-mt-20 py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1fr_1.6fr] lg:items-start 3xl:max-w-7xl">
        <div>
          <NaglowekSekcji numer="04" nazwa="bq query" tytul="Nie czytaj CV. Odpytaj je." />
          <p className="leading-relaxed text-tekst-miekki">
            Doświadczenie, projekty i umiejętności z tej strony leżą w czterech tabelach. Konsola rozumie podzbiór
            GoogleSQL: <code className="font-mono text-tekst">WHERE</code>,{" "}
            <code className="font-mono text-tekst">LIKE</code>, <code className="font-mono text-tekst">ORDER BY</code>,{" "}
            <code className="font-mono text-tekst">COUNT(*)</code>.
          </p>
          <p className="mt-4 leading-relaxed text-tekst-miekki">
            Parser jest napisany od zera, bez bibliotek, i ma testy. Strzałki w górę i w dół przewijają historię.
          </p>
        </div>
        <Konsola />
      </div>
    </section>
  );
}
