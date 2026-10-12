import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import "../globals.css";
import { CommandPalette } from "@/components/CommandPalette";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { PROFILE } from "@/lib/content";
import { dictionary } from "@/lib/dictionary";
import { isLang, LANGS, localePath, SITE_URL } from "@/lib/i18n";

// latin-ext is required for Polish diacritics
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Both languages are prerendered; anything else under [lang] is a 404
export const dynamicParams = false;

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${PROFILE.name} - ${PROFILE.role}, GCP`,
      template: `%s | ${PROFILE.name}`,
    },
    description: dictionary(lang).meta.description,
    alternates: {
      canonical: localePath(lang, "/"),
      languages: { pl: localePath("pl", "/"), en: localePath("en", "/"), "x-default": "/" },
    },
    robots: { index: false, follow: false }, // lifted at launch
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  return (
    <html lang={lang} className={`${geist.variable} ${geistMono.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <Navigation lang={lang} />
        <ViewTransition default="page">
          <div className="flex-1">{children}</div>
        </ViewTransition>
        <Footer lang={lang} />
        <CommandPalette lang={lang} />
      </body>
    </html>
  );
}
