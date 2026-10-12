# Portfolio Marcina Mazuro - brief dla agenta

Osobista strona Marcina (mazuromarcin@gmail.com, konto gcloud
mazuromarcin1@gmail.com): Data Engineer aspirujący na GCP Data Architect.
Cel: CV, projekty, doświadczenie, kontakt - ma robić wrażenie na
programistach. Docelowo także pozyskiwanie klientów na strony dla firm
(rezerwacja rozmów). Rozmowy po polsku.

Projekt siostrzany: `../AgnieszkaBielawa` (agnieszkabielawa.pl) - stąd
skopiowany stack, CI, Terraform i wzorce (`ochrona.ts`, `walidacja.ts`,
`useBezRuchu`, `Odsloniecie`). Przed większą zmianą przeczytaj
`../AgnieszkaBielawa/.claude/docs/pulapki.md` - te same pułapki obowiązują tu.

## Stack
Next.js 16.3.8 (App Router) + React 19.2 + Tailwind v4 + Motion. Cloud Run
`marcinmazuro-web` w `europe-west1`, Firestore `eur3`, wszystko w Terraform
(`terraform/`, stan w `gs://marcinmazuro-tfstate`). Projekt GCP
`marcinmazuro` (numer 251571632782). CI: GitHub Actions (WIF, repo
`MarcinMazuro/marcinmazuro`) -> Cloud Build -> Cloud Run.

## Mapa kodu
- `src/lib/dane.ts` - JEDYNE źródło treści CV (osoba, doświadczenie, projekty,
  umiejętności, certyfikaty). Placeholdery oznaczone „DO UZUPEŁNIENIA".
- `src/lib/konsola/sql.ts` - własny parser podzbioru GoogleSQL (testy w
  `testy/sql.test.ts`); `polecenia.ts` - tabele z `dane.ts`, help, SHOW TABLES,
  DESCRIBE. Nowe pole w `dane.ts` = rozważ kolumnę w `TABELE`.
- `src/components/Konsola.tsx` - terminal; sam wpisuje pierwsze zapytanie
  po wejściu w widok. `PaletaPolecen.tsx` - ⌘K.
- `src/components/PotokDanych.tsx` - animowany schemat GCP w hero (SMIL).
- `src/components/sekcje/` - sekcje strony głównej, numerowane 01-07.
- `/cv` - CV do druku (print CSS w `globals.css`, klasa `bez-druku`).
- `/api/kontakt` -> Firestore `zgloszenia-kontaktowe` (limit + pole-pułapka).
- Stopka pokazuje SHA commita (`ARG WERSJA` w Dockerfile z `cloudbuild.yaml`).

## Zasady (przeniesione od Agnieszki)
- Bez pauz i półpauz w treściach: tylko `-`. Kontrola: `grep -rn '—\|–' src/`
- Efekty z wersją dla reduced motion przez `useBezRuchu`, nie `useReducedMotion`.
- Wejścia animują tylko `y`, nigdy opacity (treść widoczna bez JS).
- Roboty zablokowane (`robots.ts`, `noindex` w layoucie) do premiery.
- Zmiany najpierw lokalnie (`PORT=3001 npm run start` po build - 3000 zajmuje
  zwykle strona Agnieszki), wdrożenie dopiero na słowo Marcina.
- Commity po polsku, opisowe, BEZ linii `Co-Authored-By` ani innej wzmianki o Claude (polecenie Marcina 2026-10-12).

## Polecenia
```bash
npm run lint && npm test && npm run build
cd terraform && terraform plan   # oczekiwane: No changes
```
