import { Firestore } from "@google-cloud/firestore";

let instancja: Firestore | null = null;

/**
 * Połączenie z Firestore tworzone leniwie.
 *
 * Nie wolno go inicjować na poziomie modułu: build w Cloud Build nie ma
 * poświadczeń i prerendering by się wywalił.
 */
export function baza(): Firestore {
  if (!instancja) {
    instancja = new Firestore({
      projectId: process.env.GOOGLE_CLOUD_PROJECT ?? "marcinmazuro",
      ignoreUndefinedProperties: true,
    });
  }
  return instancja;
}

export const KOLEKCJE = {
  zgloszenia: "zgloszenia-kontaktowe",
} as const;
