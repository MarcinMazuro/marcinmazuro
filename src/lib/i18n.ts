/**
 * The site has two languages. Polish lives without a prefix (/cv), English
 * under /en (/en/cv). Both are rendered from app/[lang]/ - proxy.ts maps
 * public URLs onto that tree.
 */

export const LANGS = ["pl", "en"] as const;
export type Lang = (typeof LANGS)[number];

export function isLang(value: unknown): value is Lang {
  return LANGS.includes(value as Lang);
}

/** A string in both languages - used for content in content.ts. */
export type Localized = Record<Lang, string>;

export const LANG_COOKIE = "lang";

/** Production origin for metadata (hreflang, Open Graph). Change once a domain is bought. */
export const SITE_URL = "https://marcinmazuro-web-zipuebeujq-ew.a.run.app";

/**
 * Route folders whose public Polish URL differs from the folder name.
 * Key: folder in app/[lang]/, value: Polish slug.
 */
export const PL_SLUGS: Record<string, string> = {
  privacy: "prywatnosc",
};

const toPl = (segment: string) => PL_SLUGS[segment] ?? segment;
const fromPl = (segment: string) => Object.entries(PL_SLUGS).find(([, pl]) => pl === segment)?.[0] ?? segment;

/** Public URL of a route in a language, e.g. localePath("pl", "/privacy") -> "/prywatnosc". */
export function localePath(lang: Lang, route: string): string {
  const [path, hash] = route.split("#");
  let result: string;
  if (lang === "pl") {
    result = path.split("/").map(toPl).join("/");
  } else {
    result = path === "/" ? "/en" : `/en${path}`;
  }
  return hash ? `${result}#${hash}` : result;
}

/** Route (folder path) behind a public URL - inverse of localePath. */
export function routeOf(lang: Lang, publicPath: string): string {
  if (lang === "en") return publicPath.replace(/^\/en(?=\/|$)/, "") || "/";
  return publicPath.split("/").map(fromPl).join("/");
}

/** Whether the browser prefers English over Polish (highest q-value wins). */
export function prefersEnglish(acceptLanguage: string | null): boolean {
  if (!acceptLanguage) return false;
  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [code, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { code: code.toLowerCase().slice(0, 2), weight: q ? Number(q.trim().slice(2)) : 1 };
    })
    .filter((l) => l.code === "pl" || l.code === "en")
    .sort((a, b) => b.weight - a.weight);
  return ranked[0]?.code === "en";
}

export type Decision =
  | { kind: "next" }
  | { kind: "rewrite"; to: string }
  | { kind: "redirect"; to: string; permanent: boolean };

/**
 * proxy.ts logic as a pure function so it can be unit tested.
 *  /pl/...        -> 308 to the unprefixed URL (one canonical URL per page)
 *  /privacy       -> 308 to /prywatnosc (Polish slug)
 *  /prywatnosc    -> internally /pl/privacy
 *  /en/...        -> served as is
 *  /              -> 307 to /en if the browser prefers English and no language was chosen
 */
export function resolve(pathname: string, chosenLang: string | undefined, acceptLanguage: string | null): Decision {
  if (pathname === "/pl" || pathname.startsWith("/pl/")) {
    return { kind: "redirect", to: localePath("pl", pathname.slice(3) || "/"), permanent: true };
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return { kind: "next" };
  }

  // A folder name used where the Polish slug is expected (/privacy instead of /prywatnosc)
  const canonical = localePath("pl", pathname);
  if (canonical !== pathname) {
    return { kind: "redirect", to: canonical, permanent: true };
  }

  if (pathname === "/" && !chosenLang && prefersEnglish(acceptLanguage)) {
    return { kind: "redirect", to: "/en", permanent: false };
  }

  const route = routeOf("pl", pathname);
  return { kind: "rewrite", to: route === "/" ? "/pl" : `/pl${route}` };
}
