"use client";

/** PDF z przeglądarki zamiast osobnego pliku - CV nigdy się nie rozjedzie ze stroną. */
export function PrzyciskDruku() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md bg-akcent px-4 py-2 font-mono text-xs font-medium text-tlo"
    >
      Zapisz jako PDF
    </button>
  );
}
