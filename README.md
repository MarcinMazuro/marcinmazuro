# Marcin Mazuro - portfolio

Osobista strona: CV, projekty, konsola SQL nad CV. Katalog siostrzany:
`../AgnieszkaBielawa` (agnieszkabielawa.pl, osobne repozytorium).

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # Vitest
npm run build
```

Infrastruktura: `terraform/` (projekt GCP `marcinmazuro`, `europe-west1`).
Wdrożenie: push na `main` -> GitHub Actions (WIF) -> Cloud Build -> Cloud Run.
