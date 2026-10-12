import type { Metadata } from "next";
import { OSOBA } from "@/lib/dane";

export const metadata: Metadata = { title: "Prywatność" };

export default function Prywatnosc() {
  return (
    <main className="mx-auto max-w-2xl px-5 pt-28 pb-20">
      <h1 className="text-3xl font-semibold tracking-tight">Prywatność</h1>
      <div className="mt-8 space-y-4 leading-relaxed text-tekst-miekki">
        <p>
          Administratorem danych z formularza kontaktowego jest {OSOBA.imie} ({OSOBA.email}).
        </p>
        <p>
          Zbieram tylko to, co wpiszesz w formularz: imię, e-mail, opcjonalnie nazwę firmy i treść wiadomości.
          Używam ich wyłącznie do odpowiedzi. Dane leżą w Google Cloud (Firestore, region UE) i usuwam je po
          zakończeniu rozmowy, najpóźniej po 12 miesiącach.
        </p>
        <p>
          Strona nie używa ciasteczek śledzących ani zewnętrznej analityki. Masz prawo do wglądu w swoje dane, ich
          poprawienia i usunięcia - wystarczy mail.
        </p>
      </div>
    </main>
  );
}
