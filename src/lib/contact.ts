import type { Lang, Localized } from "./i18n";

/** Contact form topics - shared by the form and the API. */
export const TOPICS = {
  hiring: { pl: "Praca / rekrutacja", en: "Hiring" },
  data: { pl: "Projekt danych", en: "Data project" },
  website: { pl: "Strona dla firmy", en: "Website for a business" },
  other: { pl: "Inne", en: "Other" },
} as const satisfies Record<string, Localized>;

export type Topic = keyof typeof TOPICS;

export function isTopic(value: unknown): value is Topic {
  return typeof value === "string" && Object.hasOwn(TOPICS, value);
}

/**
 * Consent text stored verbatim with each message - GDPR requires being able
 * to show exactly what someone agreed to. Changing the text = new version.
 */
export const CONSENT = {
  version: "2026-10-12",
  text: {
    pl: "Zgadzam się na przetwarzanie moich danych w celu odpowiedzi na wiadomość. Dane usunę po zakończeniu rozmowy, najpóźniej po 12 miesiącach.",
    en: "I agree to the processing of my data in order to reply to my message. The data will be deleted once the conversation ends, at the latest after 12 months.",
  },
} as const satisfies { version: string; text: Localized };

/** API error messages, keyed so the client language decides the wording. */
export const ERRORS = {
  rateLimited: { pl: "Za dużo prób. Spróbuj ponownie za kilka minut.", en: "Too many attempts. Please try again in a few minutes." },
  invalid: { pl: "Nieprawidłowe dane", en: "Invalid data" },
  name: { pl: "Podaj imię", en: "Please enter your name" },
  email: { pl: "Podaj poprawny adres e-mail", en: "Please enter a valid email address" },
  message: { pl: "Napisz kilka słów", en: "Please write a few words" },
  consent: { pl: "Potrzebna jest zgoda", en: "Consent is required" },
  failed: { pl: "Nie udało się wysłać. Spróbuj za chwilę.", en: "Could not send. Please try again shortly." },
} as const satisfies Record<string, Localized>;

export function errorText(key: keyof typeof ERRORS, lang: Lang): string {
  return ERRORS[key][lang];
}
