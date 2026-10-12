import { LANG_COOKIE, localePath, routeOf, type Lang } from "./i18n";

export function otherLang(lang: Lang): Lang {
  return lang === "pl" ? "en" : "pl";
}

/** URL of the current page in the other language. */
export function switchHref(lang: Lang, pathname: string): string {
  return localePath(otherLang(lang), routeOf(lang, pathname));
}

/** Remembers an explicit choice, so the proxy stops redirecting by Accept-Language. */
export function rememberLang(lang: Lang) {
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
}
