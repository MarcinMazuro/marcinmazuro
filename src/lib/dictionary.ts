import type { Lang } from "./i18n";

/**
 * UI strings in both languages. The English dictionary is typed after the
 * Polish one, so a missing key is a compile error rather than a hole on the
 * page. Resume content lives separately, in content.ts.
 */

const pl = {
  meta: {
    description:
      "Data Engineer na Google Cloud: BigQuery, Dataflow, Pub/Sub, Terraform. Portfolio, CV, projekty i kontakt.",
  },
  nav: {
    experience: "doświadczenie",
    projects: "projekty",
    console: "konsola",
    services: "strony dla firm",
    contact: "kontakt",
    cv: "cv",
    palette: "Otwórz paletę poleceń",
    switchLang: "Switch to English",
  },
  palette: {
    placeholder: "Wpisz polecenie...",
    empty: "Brak wyników",
    goTo: "Idź do",
    actions: "Akcje",
    query: "Zapytaj CV",
    cv: "cv (wersja do druku)",
    copyEmail: "kopiuj e-mail",
    github: "otwórz GitHub",
    copied: "skopiowano",
    otherLang: "English version",
  },
  hero: {
    query: "Zapytaj moje CV w SQL",
    contact: "kontakt",
  },
  pipeline: {
    label:
      "Schemat platformy danych: aplikacje i Cloud Storage przez Pub/Sub i Dataflow do BigQuery, dalej do Looker i Vertex AI. Całość orkiestruje Cloud Composer.",
    apps: "Aplikacje",
    events: "zdarzenia",
    files: "pliki, CDC",
    stream: "strumień",
    warehouse: "hurtownia",
  },
  experience: { title: "Doświadczenie" },
  projects: {
    title: "Projekty: problem, rozwiązanie, wynik",
    problem: "problem",
    solution: "rozwiązanie",
    result: "wynik",
    website: "strona",
    code: "kod",
  },
  skills: { title: "Stack", certifications: "certyfikaty", inProgress: "w trakcie", level: "poziom {n} z 5" },
  console: {
    title: "Nie czytaj CV. Odpytaj je.",
    intro:
      "Doświadczenie, projekty i umiejętności z tej strony leżą w czterech tabelach. Konsola rozumie podzbiór GoogleSQL:",
    details: "Parser jest napisany od zera, bez bibliotek, i ma testy. Strzałki w górę i w dół przewijają historię.",
    hint: "Zapytaj moje CV w SQL.",
    showsSyntax: "pokazuje składnię,",
    listsTables: "listę tabel.",
    inputLabel: "Zapytanie SQL",
  },
  architecture: {
    title: "Ta strona też jest projektem",
    steps: [
      { what: "git push main", detail: "Każdy push na main to wdrożenie." },
      {
        what: "GitHub Actions",
        detail: "lint, testy, build. Logowanie do GCP przez Workload Identity Federation - zero kluczy JSON.",
      },
      { what: "Cloud Build", detail: "Obraz Dockera w trzech etapach, cache warstw z poprzedniej wersji." },
      { what: "Artifact Registry", detail: "Obraz otagowany krótkim SHA commita." },
      { what: "Cloud Run", detail: "europe-west1, osobne konto usługi z minimalnymi uprawnieniami." },
      { what: "Firestore", detail: "eur3, wiadomości z formularza. Limit zapytań i pole-pułapka na boty." },
    ],
  },
  services: {
    title: "Strona internetowa dla Twojej firmy",
    pitch:
      "Robię strony dla małych firm i specjalistów, którzy chcą przenieść klientów z Instagrama i telefonu na własną stronę: z zapisami, płatnościami i panelem, w którym sami zmieniacie treści.",
    example: "Przykład:",
    exampleDetail: "- strona dietetyczki z zakupem konsultacji, ankietą i rezerwacją terminu.",
    cta: "Umów bezpłatną rozmowę",
    features: [
      "Strona na własnej domenie, szybka na telefonie",
      "Rezerwacja terminów i płatności online (BLIK, Przelewy24, karta)",
      "Panel do samodzielnej edycji treści, bloga i cen",
      "Formularze, newsletter, statystyki zgodne z RODO",
      "Hosting w Google Cloud, kopie zapasowe, monitoring",
    ],
  },
  contact: {
    title: "Porozmawiajmy",
    intro:
      "Rekrutacja, projekt danych na GCP albo strona dla Twojej firmy - napisz, odpowiem w ciągu dwóch dni roboczych.",
    optional: "opcjonalnie",
    send: "Wyślij",
    success: "Wiadomość dotarła. Odpowiem w ciągu dwóch dni roboczych.",
    offline: "Brak połączenia. Spróbuj jeszcze raz.",
    failed: "Coś poszło nie tak",
    privacy: "Prywatność",
  },
  footer: { privacy: "prywatność" },
  cv: {
    title: "CV",
    banner: "Wersja do druku, generowana z danych strony.",
    print: "Zapisz jako PDF",
    experience: "Doświadczenie",
    projects: "Projekty",
    skills: "Umiejętności",
    certifications: "Certyfikaty",
  },
  privacy: {
    title: "Prywatność",
    paragraphs: [
      "Administratorem danych z formularza kontaktowego jest {name} ({email}).",
      "Zbieram tylko to, co wpiszesz w formularz: imię, e-mail, opcjonalnie nazwę firmy i treść wiadomości. Używam ich wyłącznie do odpowiedzi. Dane leżą w Google Cloud (Firestore, region UE) i usuwam je po zakończeniu rozmowy, najpóźniej po 12 miesiącach.",
      "Strona nie używa ciasteczek śledzących ani zewnętrznej analityki. Jedyne ciasteczko zapamiętuje wybrany język. Masz prawo do wglądu w swoje dane, ich poprawienia i usunięcia - wystarczy mail.",
    ],
  },
};

export type Dictionary = typeof pl;

const en: Dictionary = {
  meta: {
    description:
      "Data Engineer on Google Cloud: BigQuery, Dataflow, Pub/Sub, Terraform. Portfolio, resume, projects and contact.",
  },
  nav: {
    experience: "experience",
    projects: "projects",
    console: "console",
    services: "websites",
    contact: "contact",
    cv: "resume",
    palette: "Open command palette",
    switchLang: "Przełącz na polski",
  },
  palette: {
    placeholder: "Type a command...",
    empty: "No results",
    goTo: "Go to",
    actions: "Actions",
    query: "Query CV",
    cv: "resume (print version)",
    copyEmail: "copy email",
    github: "open GitHub",
    copied: "copied",
    otherLang: "Wersja polska",
  },
  hero: {
    query: "Query my resume in SQL",
    contact: "contact",
  },
  pipeline: {
    label:
      "Data platform diagram: applications and Cloud Storage through Pub/Sub and Dataflow into BigQuery, then on to Looker and Vertex AI. Orchestrated by Cloud Composer.",
    apps: "Applications",
    events: "events",
    files: "files, CDC",
    stream: "stream",
    warehouse: "warehouse",
  },
  experience: { title: "Experience" },
  projects: {
    title: "Projects: problem, solution, result",
    problem: "problem",
    solution: "solution",
    result: "result",
    website: "website",
    code: "code",
  },
  skills: { title: "Stack", certifications: "certifications", inProgress: "in progress", level: "level {n} of 5" },
  console: {
    title: "Don't read my resume. Query it.",
    intro:
      "The experience, projects and skills on this page live in four tables. The console understands a subset of GoogleSQL:",
    details:
      "The parser is written from scratch, with no libraries, and it has tests. Arrow keys up and down scroll through history.",
    hint: "Query my resume in SQL.",
    showsSyntax: "shows the syntax,",
    listsTables: "lists the tables.",
    inputLabel: "SQL query",
  },
  architecture: {
    title: "This website is a project too",
    steps: [
      { what: "git push main", detail: "Every push to main is a deployment." },
      {
        what: "GitHub Actions",
        detail: "lint, tests, build. Authenticates to GCP via Workload Identity Federation - zero JSON keys.",
      },
      { what: "Cloud Build", detail: "Three-stage Docker image, layer cache from the previous release." },
      { what: "Artifact Registry", detail: "Image tagged with the short commit SHA." },
      { what: "Cloud Run", detail: "europe-west1, dedicated service account with least privilege." },
      { what: "Firestore", detail: "eur3, contact form messages. Rate limiting and a honeypot field against bots." },
    ],
  },
  services: {
    title: "A website for your business",
    pitch:
      "I build websites for small businesses and independent professionals who want to move clients from Instagram and the phone to a site of their own: with bookings, payments and an admin panel where you edit content yourself.",
    example: "Example:",
    exampleDetail: "- a dietitian's site with consultation purchase, intake form and appointment booking.",
    cta: "Book a free call",
    features: [
      "Your own domain, fast on mobile",
      "Online booking and payments (BLIK, Przelewy24, card)",
      "Admin panel to edit content, blog and prices yourself",
      "GDPR-compliant forms, newsletter and analytics",
      "Hosting on Google Cloud, backups, monitoring",
    ],
  },
  contact: {
    title: "Let's talk",
    intro:
      "Hiring, a data project on GCP or a website for your business - drop me a line, I reply within two business days.",
    optional: "optional",
    send: "Send",
    success: "Message received. I'll get back to you within two business days.",
    offline: "No connection. Please try again.",
    failed: "Something went wrong",
    privacy: "Privacy",
  },
  footer: { privacy: "privacy" },
  cv: {
    title: "Resume",
    banner: "Print version, generated from the site's data.",
    print: "Save as PDF",
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
    certifications: "Certifications",
  },
  privacy: {
    title: "Privacy",
    paragraphs: [
      "The controller of data submitted through the contact form is {name} ({email}).",
      "I only collect what you type into the form: name, email, optionally company name and the message. I use it solely to reply. The data is stored in Google Cloud (Firestore, EU region) and deleted once the conversation ends, at the latest after 12 months.",
      "This site uses no tracking cookies and no third-party analytics. The only cookie remembers your chosen language. You have the right to access, correct and delete your data - just send an email.",
    ],
  },
};

const DICTIONARIES: Record<Lang, Dictionary> = { pl, en };

export function dictionary(lang: Lang): Dictionary {
  return DICTIONARIES[lang];
}
