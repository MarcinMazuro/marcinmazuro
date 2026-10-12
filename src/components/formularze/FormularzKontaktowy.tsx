"use client";

import Link from "next/link";
import { useState } from "react";
import { TEMATY } from "@/lib/kontakt";
import { POLE_PULAPKA } from "@/lib/ochrona";
import { ZGODY } from "@/lib/zgody";
import { PolePulapka } from "./PolePulapka";

type Stan = "gotowy" | "wysylam" | "udane" | "blad";

const pole =
  "mt-2 w-full rounded-md border border-linia bg-tlo px-4 py-3 font-sans text-sm text-tekst placeholder:text-tekst-miekki/50 focus:border-akcent/60 focus:outline-none";
const etykieta = "block font-mono text-xs text-tekst-miekki";

export function FormularzKontaktowy() {
  const [stan, setStan] = useState<Stan>("gotowy");
  const [komunikat, setKomunikat] = useState("");

  async function wyslij(zdarzenie: React.FormEvent<HTMLFormElement>) {
    zdarzenie.preventDefault();
    const dane = new FormData(zdarzenie.currentTarget);
    setStan("wysylam");
    setKomunikat("");

    try {
      const odpowiedz = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [POLE_PULAPKA]: dane.get(POLE_PULAPKA),
          imie: dane.get("imie"),
          email: dane.get("email"),
          firma: dane.get("firma"),
          temat: dane.get("temat"),
          wiadomosc: dane.get("wiadomosc"),
          zgoda: dane.get("zgoda") === "on",
        }),
      });
      const tresc = await odpowiedz.json();

      if (!odpowiedz.ok) {
        setStan("blad");
        setKomunikat(tresc.blad ?? "Coś poszło nie tak");
        return;
      }
      setStan("udane");
    } catch {
      setStan("blad");
      setKomunikat("Brak połączenia. Spróbuj jeszcze raz.");
    }
  }

  if (stan === "udane") {
    return (
      <div className="rounded-xl border border-akcent/40 bg-powierzchnia p-8 font-mono">
        <p className="text-akcent">200 OK</p>
        <p className="mt-3 font-sans leading-relaxed text-tekst-miekki">
          Wiadomość dotarła. Odpowiem w ciągu dwóch dni roboczych.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={wyslij} className="relative grid gap-5 rounded-xl border border-linia bg-powierzchnia p-6 sm:grid-cols-2 sm:p-8">
      <PolePulapka />
      <label className={etykieta}>
        imie
        <input name="imie" required maxLength={80} autoComplete="name" className={pole} />
      </label>

      <label className={etykieta}>
        email
        <input name="email" type="email" required autoComplete="email" className={pole} />
      </label>

      <label className={etykieta}>
        firma <span className="text-tekst-miekki/60">-- opcjonalnie</span>
        <input name="firma" maxLength={120} autoComplete="organization" className={pole} />
      </label>

      <label className={etykieta}>
        temat
        <select name="temat" defaultValue={TEMATY[0]} className={pole}>
          {TEMATY.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>

      <label className={`${etykieta} sm:col-span-2`}>
        wiadomosc
        <textarea name="wiadomosc" required rows={5} maxLength={4000} className={`${pole} resize-y`} />
      </label>

      <label className="flex items-start gap-3 text-xs leading-relaxed text-tekst-miekki sm:col-span-2">
        <input name="zgoda" type="checkbox" required className="mt-0.5 size-4 shrink-0 accent-[var(--p-akcent)]" />
        <span>
          {ZGODY.kontakt}{" "}
          <Link href="/prywatnosc" className="text-akcent-2 underline underline-offset-2">
            Prywatność
          </Link>
        </span>
      </label>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={stan === "wysylam"}
          className="rounded-md bg-akcent px-6 py-2.5 font-mono text-sm font-medium text-tlo transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {stan === "wysylam" ? "POST /api/kontakt..." : "Wyślij"}
        </button>
        {stan === "blad" && (
          <p role="alert" className="mt-3 font-mono text-xs text-blad">
            {komunikat}
          </p>
        )}
      </div>
    </form>
  );
}
