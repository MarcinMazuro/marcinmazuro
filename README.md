# marcinmazuro

Personal site of Marcin Mazuro - Data Engineer on the way to GCP Data Architect.
Resume, projects, and a SQL console that lets you query the resume itself.

Polish at `/`, English at `/en`.

## Highlights

- **SQL console over the resume** - a hand-written parser for a subset of GoogleSQL
  (`WHERE`, `LIKE`, `IS NULL`, `ORDER BY`, `LIMIT`, `COUNT(*)`), BigQuery-style
  errors and stats, no libraries. Tables follow the page language.
- **Command palette** (`⌘K` / `Ctrl+K`).
- **Single source of truth** - `src/lib/content.ts` feeds the home page, the
  printable `/cv` and the console.
- **i18n without a library** - `app/[lang]/` with both languages prerendered;
  `src/proxy.ts` maps public URLs and picks a language from `Accept-Language`.
  The routing logic is a pure, unit-tested function (`resolve` in `src/lib/i18n.ts`).
- **Keyless CI/CD** - GitHub Actions authenticates to GCP through Workload
  Identity Federation restricted to this repository.

## Stack

| Layer | Technology |
|---|---|
| App | Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Motion |
| Hosting | Cloud Run (`europe-west1`), scale to zero |
| Data | Firestore (`eur3`) - contact form messages |
| CI/CD | GitHub Actions (OIDC) -> Cloud Build -> Artifact Registry -> Cloud Run |
| Infrastructure | Terraform (`terraform/`), state in GCS |

## Local development

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # Vitest
npm run lint
npm run build
```

## Deployment

Every push to `main` runs lint, tests and build, then builds the image in
Cloud Build and deploys it to Cloud Run. The footer shows the deployed commit.

```bash
cd terraform && terraform plan   # expected: No changes
```

## Layout

```
src/
  app/[lang]/        pages (home, cv, privacy) rendered for pl and en
  app/api/           contact form, health check
  components/        sections, SQL console, command palette, pipeline diagram
  lib/content.ts     resume content (pl + en)
  lib/dictionary.ts  UI strings (pl + en, en typed after pl)
  lib/console/       SQL tokenizer, parser, executor and console commands
  proxy.ts           language routing
tests/               unit tests
terraform/           all GCP infrastructure
```
