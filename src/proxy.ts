import { NextResponse, type NextRequest } from "next/server";
import { LANG_COOKIE, resolve } from "@/lib/i18n";

/**
 * Maps public URLs onto app/[lang]/. The decision itself is a pure function
 * in lib/i18n.ts (resolve) with unit tests - this file only applies it.
 */
export function proxy(request: NextRequest) {
  const decision = resolve(
    request.nextUrl.pathname,
    request.cookies.get(LANG_COOKIE)?.value,
    request.headers.get("accept-language"),
  );

  if (decision.kind === "next") return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = decision.to;
  if (decision.kind === "rewrite") return NextResponse.rewrite(url);
  return NextResponse.redirect(url, decision.permanent ? 308 : 307);
}

export const config = {
  // Skip the API, Next internals and files with an extension (robots.txt, icon.svg, humans.txt)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
