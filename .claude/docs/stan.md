# Stan projektu

Ostatnia aktualizacja: 2026-10-12.

## Zrobione
- Projekt GCP `marcinmazuro`, billing, kubełek stanu Terraform.
- Terraform zastosowany: API, Artifact Registry, Firestore eur3, Cloud Run
  (obraz startowy Google, min 0 / max 3), konta usług, WIF dla GitHuba.
- Szkic strony: hero z potokiem, doświadczenie (git log), projekty, stack,
  konsola SQL, „ta strona też jest projektem", strony dla firm, kontakt, /cv.
- 18 testów (Vitest), lint, build.

## Czeka
1. Repozytorium `MarcinMazuro/marcinmazuro` na GitHubie + pierwszy push
   (wtedy CI zbuduje i wdroży prawdziwy obraz).
2. Prawdziwe treści w `src/lib/dane.ts` (doświadczenie, projekty, LinkedIn).
3. Domena (Cloud DNS + mapowanie w europe-west1, wzór w ../AgnieszkaBielawa/terraform/dns.tf).
4. Wersja angielska.
5. Rezerwacja rozmów dla klientów (wzór: `src/lib/sklep/terminy.ts`,
   `rezerwacje.ts` u Agnieszki) + powiadomienia mailem.
6. Premiera: zdjąć noindex/Disallow, sitemap.
