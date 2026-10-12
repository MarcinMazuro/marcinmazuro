/** Nagłówek sekcji w stylu ścieżki w repozytorium: „01 / doświadczenie". */
export function NaglowekSekcji({ numer, nazwa, tytul }: { numer: string; nazwa: string; tytul: string }) {
  return (
    <div className="mb-10">
      <p className="font-mono text-xs text-akcent">
        {numer} <span className="text-tekst-miekki">/ {nazwa}</span>
      </p>
      <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{tytul}</h2>
    </div>
  );
}
