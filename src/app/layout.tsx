import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ViewTransition } from "react";
import "./globals.css";
import { Nawigacja } from "@/components/Nawigacja";
import { PaletaPolecen } from "@/components/PaletaPolecen";
import { Stopka } from "@/components/Stopka";
import { OSOBA } from "@/lib/dane";

// latin-ext jest konieczny dla polskich znaków diakrytycznych
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

export const metadata: Metadata = {
  title: {
    default: `${OSOBA.imie} - ${OSOBA.rola}, GCP`,
    template: `%s | ${OSOBA.imie}`,
  },
  description:
    "Data Engineer na Google Cloud: BigQuery, Dataflow, Pub/Sub, Terraform. Portfolio, CV, projekty i kontakt.",
  robots: { index: false, follow: false }, // zdejmiemy przy premierze
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={`${geist.variable} ${geistMono.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <Nawigacja />
        <ViewTransition default="strona">
          <div className="flex-1">{children}</div>
        </ViewTransition>
        <Stopka />
        <PaletaPolecen />
      </body>
    </html>
  );
}
