import { POLE_PULAPKA } from "@/lib/ochrona";

/** Pole niewidoczne dla ludzi i czytników ekranu - wypełnia je tylko bot. */
export function PolePulapka() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Strona internetowa
        <input type="text" name={POLE_PULAPKA} tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
