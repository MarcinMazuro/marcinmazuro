import { Firestore } from "@google-cloud/firestore";

let instance: Firestore | null = null;

/**
 * Lazily created Firestore client.
 *
 * Must not be created at module level: the Cloud Build container has no
 * credentials and prerendering would fail.
 */
export function db(): Firestore {
  if (!instance) {
    instance = new Firestore({
      projectId: process.env.GOOGLE_CLOUD_PROJECT ?? "marcinmazuro",
      ignoreUndefinedProperties: true,
    });
  }
  return instance;
}

export const COLLECTIONS = {
  contactMessages: "contact-messages",
} as const;
