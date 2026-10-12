import type { MetadataRoute } from "next";

/**
 * All crawlers are blocked until launch.
 *
 * A noindex header alone is not enough: some crawlers fetch content before
 * processing it, and the domain shows up in Certificate Transparency logs
 * the moment a certificate is issued.
 *
 * AT LAUNCH: switch to allow "/", add a sitemap and drop robots from the
 * metadata in app/[lang]/layout.tsx.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
