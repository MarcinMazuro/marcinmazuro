import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

/*
  The root layout lives under [lang], so unmatched URLs have no layout to
  render into. This page bypasses rendering entirely and must bring its own
  styles and fonts. It is bilingual because the language is unknown here.
*/

const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "404",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={geistMono.variable}>
      <body className="flex min-h-screen items-center justify-center px-5 font-mono">
        <div className="max-w-md">
          <p className="text-sm text-fg-muted">
            <span className="text-accent">bq&gt;</span> SELECT * FROM pages WHERE path = CURRENT_PATH()
          </p>
          <p className="mt-3 text-sm text-danger">Error: Not found: Page was not found.</p>
          <p className="mt-8 text-sm text-fg-muted">
            <Link href="/" className="text-accent-2 hover:underline">
              cd ~/
            </Link>{" "}
            ·{" "}
            <Link href="/en" className="text-accent-2 hover:underline">
              /en
            </Link>
          </p>
        </div>
      </body>
    </html>
  );
}
