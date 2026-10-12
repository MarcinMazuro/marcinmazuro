import type { Lang, Localized } from "./i18n";

/**
 * Single source of truth for the site's content: resume, projects, skills.
 *
 * The home page sections, the /cv page and the SQL console all read from
 * these arrays, so a change here updates everything at once. Prose comes in
 * Polish and English (Localized), everything else is shared.
 *
 * Anything marked "TODO(content)" is a placeholder.
 */

export const PROFILE = {
  name: "Marcin Mazuro",
  role: "Data Engineer",
  goal: "GCP Data Architect",
  location: { pl: "Polska · zdalnie", en: "Poland · remote" } satisfies Localized, // TODO(content)
  email: "mazuromarcin@gmail.com",
  github: "https://github.com/MarcinMazuro",
  linkedin: "https://www.linkedin.com/in/", // TODO(content)
  // One-liner for the hero - TODO(content)
  tagline: {
    pl: "Projektuję potoki danych, które działają o 3 w nocy bez budzenia kogokolwiek.",
    en: "I design data pipelines that run at 3 a.m. without waking anyone up.",
  } satisfies Localized,
  // About paragraph - TODO(content)
  about: {
    pl: "Buduję platformy danych na Google Cloud: od ingestu strumieniowego, przez modelowanie w BigQuery, po infrastrukturę w Terraform i CI/CD. Interesuje mnie architektura - to, jak wybory podjęte w pierwszym tygodniu projektu wpływają na koszty i niezawodność w trzecim roku.",
    en: "I build data platforms on Google Cloud: from streaming ingestion, through modelling in BigQuery, to infrastructure in Terraform and CI/CD. What interests me is architecture - how decisions made in the first week of a project shape its cost and reliability in year three.",
  } satisfies Localized,
} as const;

export type Job = {
  id: string;
  company: string;
  title: string;
  start: string; // YYYY-MM
  end: string | null; // null = current
  summary: Localized;
  highlights: Localized[];
  stack: string[];
};

// TODO(content) - all entries are samples
export const EXPERIENCE: Job[] = [
  {
    id: "a1f3c9e",
    company: "Company (TBD)",
    title: "Data Engineer",
    start: "2024-01",
    end: null,
    summary: {
      pl: "Platforma danych na GCP dla zespołów analitycznych.",
      en: "GCP data platform for analytics teams.",
    },
    highlights: [
      {
        pl: "Migracja hurtowni do BigQuery, koszt zapytań niższy o X%",
        en: "Warehouse migration to BigQuery, query cost down X%",
      },
      {
        pl: "Potoki strumieniowe Pub/Sub -> Dataflow -> BigQuery",
        en: "Streaming pipelines Pub/Sub -> Dataflow -> BigQuery",
      },
      {
        pl: "Infrastruktura jako kod w Terraform, CI/CD w Cloud Build",
        en: "Infrastructure as code in Terraform, CI/CD in Cloud Build",
      },
    ],
    stack: ["BigQuery", "Dataflow", "Pub/Sub", "Composer", "Terraform", "Python"],
  },
  {
    id: "7be20d4",
    company: "Company (TBD)",
    title: "Junior Data Engineer",
    start: "2022-06",
    end: "2023-12",
    summary: { pl: "Procesy ETL i raportowanie.", en: "ETL processes and reporting." },
    highlights: [
      { pl: "Orkiestracja w Airflow", en: "Orchestration in Airflow" },
      { pl: "Modele danych w dbt", en: "Data models in dbt" },
    ],
    stack: ["Airflow", "dbt", "SQL", "Python", "Docker"],
  },
];

export type Project = {
  slug: string;
  name: Localized;
  year: number;
  summary: Localized;
  problem: Localized;
  solution: Localized;
  result: Localized;
  stack: string[];
  url?: string;
  repo?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "agnieszkabielawa",
    name: { pl: "agnieszkabielawa.pl", en: "agnieszkabielawa.pl" },
    year: 2026,
    summary: {
      pl: "Strona i sklep dietetyczki klinicznej, od zera do produkcji.",
      en: "Website and shop for a clinical dietitian, from zero to production.",
    },
    problem: {
      pl: "Sprzedaż konsultacji przez Instagram: ręczne płatności, terminy w wiadomościach, brak własnej listy mailowej.",
      en: "Consultations sold through Instagram: manual payments, appointments arranged in DMs, no mailing list of her own.",
    },
    solution: {
      pl: "Next.js na Cloud Run, Firestore, płatności Stripe (BLIK, P24), rezerwacja terminów, własny newsletter na Amazon SES z federacją tożsamości GCP -> AWS bez kluczy. Całość w Terraform, wdrożenia przez GitHub Actions z Workload Identity Federation.",
      en: "Next.js on Cloud Run, Firestore, Stripe payments (BLIK, P24), appointment booking, a self-hosted newsletter on Amazon SES with keyless GCP -> AWS identity federation. Everything in Terraform, deployed by GitHub Actions with Workload Identity Federation.",
    },
    result: {
      pl: "Pełna automatyzacja: zakup, ankieta, termin i maile bez ręcznej obsługi.",
      en: "Fully automated: purchase, intake form, booking and emails with no manual work.",
    },
    stack: ["Next.js", "Cloud Run", "Firestore", "Terraform", "Stripe", "Amazon SES"],
    url: "https://agnieszkabielawa.pl",
  },
  {
    slug: "streaming-pipeline",
    name: { pl: "Potok strumieniowy (do uzupełnienia)", en: "Streaming pipeline (placeholder)" },
    year: 2025,
    summary: {
      pl: "Przykładowy projekt - podmień na prawdziwy.",
      en: "Sample project - to be replaced with a real one.",
    },
    problem: {
      pl: "Dane zdarzeń docierały do hurtowni z opóźnieniem 24 h.",
      en: "Event data reached the warehouse with a 24 h delay.",
    },
    solution: {
      pl: "Pub/Sub -> Dataflow (Apache Beam) -> BigQuery z partycjonowaniem i klastrowaniem.",
      en: "Pub/Sub -> Dataflow (Apache Beam) -> BigQuery with partitioning and clustering.",
    },
    result: { pl: "Opóźnienie z 24 h do kilku sekund.", en: "Latency down from 24 h to seconds." },
    stack: ["Pub/Sub", "Dataflow", "Apache Beam", "BigQuery"],
  },
  {
    slug: "portfolio",
    name: { pl: "Ta strona", en: "This website" },
    year: 2026,
    summary: { pl: "Portfolio z konsolą SQL nad własnym CV.", en: "A portfolio with a SQL console over my own CV." },
    problem: { pl: "CV w PDF nie pokazuje, jak pracuję.", en: "A PDF resume doesn't show how I work." },
    solution: {
      pl: "Next.js 16 na Cloud Run, Terraform, CI/CD bez kluczy JSON. Konsola SQL z własnym parserem działa w przeglądarce na tych samych danych co strona.",
      en: "Next.js 16 on Cloud Run, Terraform, CI/CD without JSON keys. A SQL console with a hand-written parser runs in the browser over the same data as the site.",
    },
    result: { pl: "Możesz zapytać moje CV SQL-em.", en: "You can query my resume in SQL." },
    stack: ["Next.js", "TypeScript", "Cloud Run", "Terraform"],
    repo: "https://github.com/MarcinMazuro/marcinmazuro",
  },
];

export const CATEGORIES = ["gcp", "data", "infrastructure", "languages", "web"] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, Localized> = {
  gcp: { pl: "gcp", en: "gcp" },
  data: { pl: "dane", en: "data" },
  infrastructure: { pl: "infrastruktura", en: "infrastructure" },
  languages: { pl: "języki", en: "languages" },
  web: { pl: "web", en: "web" },
};

export type Skill = {
  name: string;
  category: Category;
  level: 1 | 2 | 3 | 4 | 5;
};

// TODO(content) - sample levels
export const SKILLS: Skill[] = [
  { name: "BigQuery", category: "gcp", level: 5 },
  { name: "Dataflow", category: "gcp", level: 4 },
  { name: "Pub/Sub", category: "gcp", level: 4 },
  { name: "Cloud Composer", category: "gcp", level: 4 },
  { name: "Cloud Run", category: "gcp", level: 4 },
  { name: "Dataproc", category: "gcp", level: 3 },
  { name: "Dataplex", category: "gcp", level: 3 },
  { name: "SQL", category: "data", level: 5 },
  { name: "dbt", category: "data", level: 4 },
  { name: "Apache Beam", category: "data", level: 4 },
  { name: "Airflow", category: "data", level: 4 },
  { name: "Spark", category: "data", level: 3 },
  { name: "Terraform", category: "infrastructure", level: 4 },
  { name: "Docker", category: "infrastructure", level: 4 },
  { name: "CI/CD", category: "infrastructure", level: 4 },
  { name: "Python", category: "languages", level: 5 },
  { name: "TypeScript", category: "languages", level: 3 },
  { name: "Next.js", category: "web", level: 3 },
];

export type Certification = {
  name: string;
  issuer: string;
  year: number | null; // null = in progress
};

// TODO(content)
export const CERTIFICATIONS: Certification[] = [
  { name: "Professional Data Engineer", issuer: "Google Cloud", year: null },
  { name: "Professional Cloud Architect", issuer: "Google Cloud", year: null },
];

export function period(job: Pick<Job, "start" | "end">, lang: Lang): string {
  const present = lang === "pl" ? "obecnie" : "present";
  return `${job.start.replace("-", ".")} - ${job.end ? job.end.replace("-", ".") : present}`;
}
