import type { MetadataRoute } from "next";

/**
 * Do premiery blokujemy cały ruch robotów.
 *
 * Sam znacznik noindex w nagłówku nie wystarcza: część crawlerów pobiera
 * treść, zanim go przetworzy, a domena trafiła do publicznych logów
 * Certificate Transparency w momencie wystawienia certyfikatu - od tej chwili
 * jest regularnie skanowana.
 *
 * NA PREMIERĘ: zmienić na allow "/", dopisać sitemap i zdjąć robots
 * z metadanych w layout.tsx.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
