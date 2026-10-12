# Portfolio Marcina Mazuro - brief dla agenta

Osobista strona Marcina (mazuromarcin@gmail.com, konto gcloud
mazuromarcin1@gmail.com): Data Engineer aspirujący na GCP Data Architect.
Cel: CV, projekty, doświadczenie, kontakt - ma robić wrażenie na
programistach. Docelowo także pozyskiwanie klientów na strony dla firm
(rezerwacja rozmów). Rozmowy po polsku.

Projekt siostrzany: `../AgnieszkaBielawa` (agnieszkabielawa.pl) - stąd
skopiowany stack, CI, Terraform i wzorce (tu: `protection.ts`, `validation.ts`,
`usePrefersReducedMotion`, `Reveal`; u Agnieszki pod polskimi nazwami). Przed większą zmianą przeczytaj
`../AgnieszkaBielawa/.claude/docs/pulapki.md` - te same pułapki obowiązują tu.

## Stack
Next.js 16.3.8 (App Router) + React 19.2 + Tailwind v4 + Motion. Cloud Run
`marcinmazuro-web` w `europe-west1`, Firestore `eur3`, wszystko w Terraform
(`terraform/`, stan w `gs://marcinmazuro-tfstate/production`). Projekt GCP
`marcinmazuro` (numer 251571632782). CI: GitHub Actions (WIF, repo
`MarcinMazuro/marcinmazuro`) -> Cloud Build -> Cloud Run.

## Mapa kodu
Cały kod, komentarze, nazwy plików, testy, Terraform i CI są PO ANGIELSKU
(polecenie Marcina 2026-10-12). Po polsku są tylko treści strony (wersja pl)
i dokumenty w `.claude/`.

- Dwa języki: polski pod `/` (bez prefiksu), angielski pod `/en`. Strony w
  `src/app/[lang]/` (generowane statycznie dla pl i en), `src/proxy.ts`
  przepisuje adresy, logika w `resolve()` w `src/lib/i18n.ts` (testy w
  `tests/i18n.test.ts`). Polskie slugi: `PL_SLUGS` (`/privacy` -> `/prywatnosc`).
  Przeglądarka po angielsku na `/` -> 307 na `/en`, chyba że jest ciasteczko `lang`.
- `src/lib/content.ts` - JEDYNE źródło treści CV; teksty jako `{ pl, en }`.
  Placeholdery oznaczone `TODO(content)`.
- `src/lib/dictionary.ts` - teksty interfejsu; `en` ma typ `pl`, więc brak
  klucza = błąd kompilacji.
- `src/lib/console/` - `sql.ts` parser podzbioru GoogleSQL, `commands.ts`
  tabele (nazwy tabel i kolumn w języku strony), help, SHOW TABLES, DESCRIBE.
- `src/components/` - `SqlConsole`, `CommandPalette` (⌘K), `DataPipeline`
  (SMIL), `sections/` numerowane 01-07.
- `/api/contact` -> Firestore `contact-messages` (limit + honeypot, zgoda
  zapisana dosłownie w języku formularza). `/api/health` dla monitoringu.
- Globalne 404: `src/app/global-not-found.tsx` (flaga `experimental.globalNotFound`).
- Stopka pokazuje SHA commita (`ARG VERSION` w Dockerfile z `cloudbuild.yaml`).
- Cloud Run działa na koncie `web-app@` (tylko `datastore.user`).

## Zasady (przeniesione od Agnieszki)
- Bez pauz i półpauz w treściach (obu językach): tylko `-`. Kontrola: `grep -rn '—\|–' src/`
- Efekty z wersją dla reduced motion przez `usePrefersReducedMotion`, nie `useReducedMotion` z Motion.
- Wejścia animują tylko `y`, nigdy opacity (treść widoczna bez JS).
- Roboty zablokowane (`robots.ts`, `noindex` w layoucie) do premiery.
- Zmiany najpierw lokalnie (`PORT=3001 npm run start` po build - 3000 zajmuje
  zwykle strona Agnieszki), wdrożenie dopiero na słowo Marcina.
- Commity PO ANGIELSKU, opisowe, BEZ linii `Co-Authored-By` ani innej wzmianki o Claude (polecenia Marcina 2026-10-12).

## Polecenia
```bash
npm run lint && npm test && npm run build
cd terraform && terraform plan   # oczekiwane: No changes
```
