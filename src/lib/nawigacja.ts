/** Cele nawigacji - wspólne dla paska i palety poleceń. */
export const SEKCJE = [
  { href: "/#doswiadczenie", etykieta: "doświadczenie" },
  { href: "/#projekty", etykieta: "projekty" },
  { href: "/#konsola", etykieta: "konsola" },
  { href: "/#uslugi", etykieta: "strony dla firm" },
  { href: "/#kontakt", etykieta: "kontakt" },
] as const;

/** Paleta otwiera się zdarzeniem, żeby przycisk w pasku nie musiał znać jej stanu. */
export const OTWORZ_PALETE = "otworz-palete";
