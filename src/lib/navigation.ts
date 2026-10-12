import type { Dictionary } from "./dictionary";

/** Navigation targets - shared by the nav bar and the command palette. */
export const SECTIONS = [
  { route: "/#experience", key: "experience" },
  { route: "/#projects", key: "projects" },
  { route: "/#console", key: "console" },
  { route: "/#services", key: "services" },
  { route: "/#contact", key: "contact" },
] as const satisfies readonly { route: string; key: keyof Dictionary["nav"] }[];

/** The palette opens on a window event, so the nav button needs no shared state. */
export const OPEN_PALETTE_EVENT = "open-palette";

/** The console listens for this event and runs the query sent from the palette. */
export const RUN_QUERY_EVENT = "run-query";
