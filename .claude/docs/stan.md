# Stan projektu

Ostatnia aktualizacja: 2026-10-12. Na produkcji: `fe9ad79`,
https://marcinmazuro-web-zipuebeujq-ew.a.run.app (repo publiczne
https://github.com/MarcinMazuro/marcinmazuro).

## Zrobione
- Projekt GCP `marcinmazuro`, billing, kubełek stanu Terraform.
- Terraform zastosowany: API, Artifact Registry, Firestore eur3, Cloud Run
  (obraz startowy Google, min 0 / max 3), konta usług, WIF dla GitHuba.
- Szkic strony: hero z potokiem, doświadczenie (git log), projekty, stack,
  konsola SQL, „ta strona też jest projektem", strony dla firm, kontakt, /cv.
- 18 testów (Vitest), lint, build.

## Czeka
1. Prawdziwe treści w `src/lib/dane.ts` (doświadczenie, projekty, LinkedIn).
2. Domena (Cloud DNS + mapowanie w europe-west1, wzór w ../AgnieszkaBielawa/terraform/dns.tf).
3. Wersja angielska.
4. Rezerwacja rozmów dla klientów (wzór: `src/lib/sklep/terminy.ts`,
   `rezerwacje.ts` u Agnieszki) + powiadomienia mailem.
5. Premiera: zdjąć noindex/Disallow, sitemap.

## Uwagi
- Cloud Build bez `machineType`: nowy projekt nie ma limitu na E2_HIGHCPU_8
  (FAILED_PRECONDITION). Można poprosić o limit, jeśli build będzie za wolny
  (teraz ok. 4-5 min).
- `public/` musi mieć choć jeden plik w gicie, inaczej Dockerfile pada na COPY.
