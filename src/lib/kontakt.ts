/** Tematy w formularzu kontaktowym - wspólne dla formularza i API. */
export const TEMATY = ["Praca / rekrutacja", "Projekt danych", "Strona dla firmy", "Inne"] as const;
export type Temat = (typeof TEMATY)[number];
