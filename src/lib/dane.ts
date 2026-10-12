/**
 * Jedno źródło prawdy dla treści strony: CV, projekty, umiejętności.
 *
 * Z tych samych tablic korzystają sekcje strony, strona /cv i konsola SQL,
 * więc zmiana w jednym miejscu zmienia wszystko naraz.
 *
 * Wszystko oznaczone „DO UZUPEŁNIENIA" to placeholdery.
 */

export const OSOBA = {
  imie: "Marcin Mazuro",
  rola: "Data Engineer",
  cel: "GCP Data Architect",
  lokalizacja: "Polska · zdalnie", // DO UZUPEŁNIENIA
  email: "mazuromarcin@gmail.com",
  github: "https://github.com/MarcinMazuro",
  linkedin: "https://www.linkedin.com/in/", // DO UZUPEŁNIENIA
  // Jedno zdanie do nagłówka - DO UZUPEŁNIENIA
  haslo: "Projektuję potoki danych, które działają o 3 w nocy bez budzenia kogokolwiek.",
  // Akapit „o mnie" - DO UZUPEŁNIENIA
  oMnie:
    "Buduję platformy danych na Google Cloud: od ingestu strumieniowego, przez modelowanie w BigQuery, po infrastrukturę w Terraform i CI/CD. Interesuje mnie architektura - to, jak wybory podjęte w pierwszym tygodniu projektu wpływają na koszty i niezawodność w trzecim roku.",
} as const;

export type Doswiadczenie = {
  id: string;
  firma: string;
  stanowisko: string;
  od: string; // RRRR-MM
  do: string | null; // null = obecnie
  opis: string;
  osiagniecia: string[];
  stack: string[];
};

// DO UZUPEŁNIENIA - wszystkie wpisy są przykładowe
export const DOSWIADCZENIE: Doswiadczenie[] = [
  {
    id: "a1f3c9e",
    firma: "Firma (do uzupełnienia)",
    stanowisko: "Data Engineer",
    od: "2024-01",
    do: null,
    opis: "Platforma danych na GCP dla zespołów analitycznych.",
    osiagniecia: [
      "Migracja hurtowni do BigQuery, koszt zapytań niższy o X%",
      "Potoki strumieniowe Pub/Sub -> Dataflow -> BigQuery",
      "Infrastruktura jako kod w Terraform, CI/CD w Cloud Build",
    ],
    stack: ["BigQuery", "Dataflow", "Pub/Sub", "Composer", "Terraform", "Python"],
  },
  {
    id: "7be20d4",
    firma: "Firma (do uzupełnienia)",
    stanowisko: "Junior Data Engineer",
    od: "2022-06",
    do: "2023-12",
    opis: "Procesy ETL i raportowanie.",
    osiagniecia: ["Orkiestracja w Airflow", "Modele danych w dbt"],
    stack: ["Airflow", "dbt", "SQL", "Python", "Docker"],
  },
];

export type Projekt = {
  slug: string;
  nazwa: string;
  rok: number;
  opis: string;
  problem: string;
  rozwiazanie: string;
  wynik: string;
  stack: string[];
  link?: string;
  repo?: string;
};

export const PROJEKTY: Projekt[] = [
  {
    slug: "agnieszkabielawa",
    nazwa: "agnieszkabielawa.pl",
    rok: 2026,
    opis: "Strona i sklep dietetyczki klinicznej, od zera do produkcji.",
    problem:
      "Sprzedaż konsultacji przez Instagram: ręczne płatności, terminy w wiadomościach, brak własnej listy mailowej.",
    rozwiazanie:
      "Next.js na Cloud Run, Firestore, płatności Stripe (BLIK, P24), rezerwacja terminów, własny newsletter na Amazon SES z federacją tożsamości GCP -> AWS bez kluczy. Całość w Terraform, wdrożenia przez GitHub Actions z Workload Identity Federation.",
    wynik: "Pełna automatyzacja: zakup, ankieta, termin i maile bez ręcznej obsługi.",
    stack: ["Next.js", "Cloud Run", "Firestore", "Terraform", "Stripe", "Amazon SES"],
    link: "https://agnieszkabielawa.pl",
  },
  {
    slug: "streaming-pipeline",
    nazwa: "Potok strumieniowy (do uzupełnienia)",
    rok: 2025,
    opis: "Przykładowy projekt - podmień na prawdziwy.",
    problem: "Dane zdarzeń docierały do hurtowni z opóźnieniem 24 h.",
    rozwiazanie: "Pub/Sub -> Dataflow (Apache Beam) -> BigQuery z partycjonowaniem i klastrowaniem.",
    wynik: "Opóźnienie z 24 h do kilku sekund.",
    stack: ["Pub/Sub", "Dataflow", "Apache Beam", "BigQuery"],
  },
  {
    slug: "portfolio",
    nazwa: "Ta strona",
    rok: 2026,
    opis: "Portfolio z konsolą SQL nad własnym CV.",
    problem: "CV w PDF nie pokazuje, jak pracuję.",
    rozwiazanie:
      "Next.js 16 na Cloud Run, Terraform, CI/CD bez kluczy JSON. Konsola SQL z własnym parserem działa w przeglądarce na tych samych danych co strona.",
    wynik: "Możesz zapytać moje CV SQL-em.",
    stack: ["Next.js", "TypeScript", "Cloud Run", "Terraform"],
    repo: "https://github.com/MarcinMazuro",
  },
];

export type Umiejetnosc = {
  nazwa: string;
  kategoria: "GCP" | "Dane" | "Infrastruktura" | "Języki" | "Web";
  poziom: 1 | 2 | 3 | 4 | 5;
};

// DO UZUPEŁNIENIA - poziomy przykładowe
export const UMIEJETNOSCI: Umiejetnosc[] = [
  { nazwa: "BigQuery", kategoria: "GCP", poziom: 5 },
  { nazwa: "Dataflow", kategoria: "GCP", poziom: 4 },
  { nazwa: "Pub/Sub", kategoria: "GCP", poziom: 4 },
  { nazwa: "Cloud Composer", kategoria: "GCP", poziom: 4 },
  { nazwa: "Cloud Run", kategoria: "GCP", poziom: 4 },
  { nazwa: "Dataproc", kategoria: "GCP", poziom: 3 },
  { nazwa: "Dataplex", kategoria: "GCP", poziom: 3 },
  { nazwa: "SQL", kategoria: "Dane", poziom: 5 },
  { nazwa: "dbt", kategoria: "Dane", poziom: 4 },
  { nazwa: "Apache Beam", kategoria: "Dane", poziom: 4 },
  { nazwa: "Airflow", kategoria: "Dane", poziom: 4 },
  { nazwa: "Spark", kategoria: "Dane", poziom: 3 },
  { nazwa: "Terraform", kategoria: "Infrastruktura", poziom: 4 },
  { nazwa: "Docker", kategoria: "Infrastruktura", poziom: 4 },
  { nazwa: "CI/CD", kategoria: "Infrastruktura", poziom: 4 },
  { nazwa: "Python", kategoria: "Języki", poziom: 5 },
  { nazwa: "TypeScript", kategoria: "Języki", poziom: 3 },
  { nazwa: "Next.js", kategoria: "Web", poziom: 3 },
];

export type Certyfikat = {
  nazwa: string;
  wystawca: string;
  rok: number | null; // null = w trakcie
};

// DO UZUPEŁNIENIA
export const CERTYFIKATY: Certyfikat[] = [
  { nazwa: "Professional Data Engineer", wystawca: "Google Cloud", rok: null },
  { nazwa: "Professional Cloud Architect", wystawca: "Google Cloud", rok: null },
];

export function okres(d: Pick<Doswiadczenie, "od" | "do">): string {
  return `${d.od.replace("-", ".")} - ${d.do ? d.do.replace("-", ".") : "obecnie"}`;
}
