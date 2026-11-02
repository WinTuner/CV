# Development Workflow

## Getting Started

Prerequisites: **Node.js 22+** and **npm** (the lockfile is `package-lock.json`).

```bash
npm install
npm run dev        # http://localhost:3000
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (`eslint .`) |
| `npm test` | Vitest (unit + component tests) |
| `npm run analyze` | Bundle analysis (`ANALYZE=true next build` via `@next/bundle-analyzer`) |

Before pushing, run the same gates CI runs:

```bash
npx tsc --noEmit && npm run lint && npm test
```

## Conventions

- **Server-first**: don't add `"use client"` unless the component needs
  hooks, event handlers, or browser APIs.
- **Tabs** for indentation; existing style is tabs everywhere.
- **`cn()`** (`@/lib/utils`) composes Tailwind classes — use it for
  conditional styles.
- **Bilingual copy**: UI text lives in a `{ en, th }` object inside the
  component, selected via `useLanguage()`. Never hardcode English strings.
- **Theme tokens**: use semantic utilities (`bg-card`, `text-muted-foreground`,
  `border-border`, `text-primary`…). Custom colors are CSS variables in
  `app/globals.css`, exposed through `@theme inline`.
- **Animation classes**: reuse the named utilities in `globals.css`
  (`animate-fade-in-up`, `hover-lift`, …) instead of inventing new keyframes.

## Editing Content

### CV / Resume content

All CV data lives in `constants/cv-data.ts` as `{ en, th }` maps typed by
`types/cv.ts`. Add experiences, awards, certifications, leadership entries,
or education there — the `/introduction` page renders it automatically.

### Blog posts

Two sources:

1. **Bundled posts**: `lib/blog-data.tsx` — add a `BlogPost` object
   (title, excerpt, markdown `content`, date, category, tags).
2. **Notion** (when `NOTION_API_KEY` is set): create a page in the connected
   database; schema is defined in `lib/notion-blog.ts`.

Medium posts merge automatically from the RSS feed URL defined in
`lib/site.ts` as `MEDIUM_FEED_URL` (env-overridable) and imported by
`lib/medium-blog.ts`.

### Projects

GitHub repos drive `/projects` and the homepage grid through
`lib/github.ts` (category/status heuristics + curated descriptions for known
repos). To pin a specific repo's blurb, extend the `repo.name` special-cases
in `getGithubRepos()`, or edit the `fallbackProjects` array used offline.

### Hero section

`components/hero-section.tsx` renders the editorial hero; the typewriter
accent line lives in `components/hero/hero-typewriter.tsx` (roles defined in
`lib/hero-utils.ts`), and the framed portrait in
`components/hero/hero-portrait.tsx`.

## Adding a Page

1. Create `app/(public)/<route>/page.tsx` with `metadata` + `generateMetadata`.
2. Add a page-specific component under `components/public/<route>/`.
3. Register the link in `components/header.tsx` (`navItems`).

## Testing

- Unit/component tests live next to their subjects:
  `lib/__tests__/` and `components/__tests__/` (Vitest + Testing Library).
- Add a `?print=true`-style param test if you touch the resume print flow.
- Keep the existing tests green: `npm test`.

### End-to-end and accessibility tests

Playwright specs live in `e2e/` and cover language switching, project
filters, the resume print flow, the blog/RSS output, workbench freshness,
security headers, and axe-core accessibility scans (`e2e/a11y.spec.ts`).
`playwright.config.ts` starts the dev server on port 3100 automatically
(override with `E2E_PORT` or point `E2E_BASE_URL` at a preview deploy).

```bash
npx playwright install --with-deps chromium   # once
npx playwright test                           # all specs
npx playwright test --project=chromium        # what CI runs
npx playwright test e2e/print.spec.ts         # single spec
```

Specs are `*.spec.ts` inside `e2e/`, not `*.test.ts` — Vitest only picks up
files matching `**/*.test.{ts,tsx}`.

## Where New Code Goes

| Path | Use it for |
| --- | --- |
| `app/(public)/<route>/page.tsx` | Content pages that share the public `Header`/`Footer` layout |
| `app/api/<name>/route.ts` | JSON route handlers; keep them thin (see below) |
| `components/public/<route>/` | Components used by one page only |
| `components/ui/` | Reusable primitives (`button`, `input`, `avatar`, `skeleton`) |
| `components/hero/` | Hero-only pieces (portrait, typewriter) |
| `components/` (root) | Cross-page widgets (header, footer, grids, sections) |
| `lib/` | Server integrations, client hooks (`use-*.ts`), and pure helpers |
| `constants/` | Content data (CV, case study, languages) |
| `types/` | Shared type-only modules |
| `e2e/` | Playwright specs |
| `scripts/` | Manually run Node scripts; never imported at request time |

Naming follows the existing files: kebab-case for components and modules
(`hero-section.tsx`), `use-*.ts` for hooks, and `*.test.ts` / `*.test.tsx`
beside the code under test. The `@/*` alias maps to the repository root, so
imports read `@/lib/github`, `@/components/ui/button`.

## Code Style and Lint Enforcement

- **ESLint** uses the flat config `eslint.config.mjs`, extending
  `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.
  Build output (`.next`, `.next-build`, `out`, `.vercel`) is ignored.
- CI runs `npm run lint -- --max-warnings=0`, so warnings are failures.
- **TypeScript** is `strict: true` with `noEmit`; `next.config.mjs` sets
  `typescript.ignoreBuildErrors: false`, so `npm run build` also fails on
  type errors.
- There is no Prettier or EditorConfig file checked in — match the
  surrounding file by hand (tabs, double quotes, semicolons in TS/TSX).

## Adding an API Route

1. Create `app/api/<name>/route.ts` and export the HTTP method(s), e.g.
   `export async function GET()` / `POST()`.
2. Return `NextResponse.json(...)`. Validate every query/body field before
   using it — `app/api/contributors/route.ts` restricts `owner`/`repo` to
   `/^[A-Za-z0-9_.-]{1,100}$/`, and `app/api/contact/route.ts` validates and
   rate-limits with helpers from `lib/security.ts`.
3. Choose a cache posture explicitly:
   - `export const revalidate = 30` for shared, rarely changing data, plus a
     `Cache-Control` header (see `app/api/repos/route.ts`).
   - `export const dynamic = "force-dynamic"` when the response depends on
     cookies or request input (see `app/api/search/route.ts`).
4. Keep the handler a thin adapter over a `lib/` function. Do not call
   `api.github.com`, Notion, or a webhook directly from the browser or
   duplicate mapping logic in the route.

## Data-Layer Patterns

- **`lib/` owns the network.** Pages, components, and route handlers call
  `getGithubRepos()`, `getLocalizedBlogPostsFromBackend()`, etc. — nothing
  else calls an external API.
- **Cache at the fetch.** Server fetches pass `next: { revalidate: N }`
  (GitHub 1 h, events 15 min, Notion 60 s, Medium 15 min) and may layer a
  `globalThis` in-memory cache on top. Route-level `revalidate` and
  `Cache-Control` headers are the outer layers.
- **Always fall back.** GitHub/Notion/Medium helpers return curated static
  data (or `[]`) when the upstream fails or is rate-limited, so pages render
  without a token or network. Keep that contract when adding a data source.
- **Server-side cookies.** Read the language cookie with `cookies()` in
  server components/handlers rather than duplicating the client precedence
  rules (`?lang=` → cookie → `localStorage`).
- **Environment access stays server-side.** `GITHUB_TOKEN`, `NOTION_API_KEY`,
  `NOTION_DATABASE_ID`, and webhook URLs are read in `lib/` or route
  handlers, never in client components. See `docs/CONFIGURATION.md`.

## Commit and CI Expectations

- The default branch is `main`; CI (`.github/workflows/ci.yml`) runs on every
  push and pull request targeting it.
- CI has two jobs:
  1. **verify** — `npm ci`, `npm audit --audit-level=high` (warning only),
     `npx tsc --noEmit`, `npm run lint -- --max-warnings=0`, `npm test`,
     `npm run build`, then Lighthouse CI against
     `config/lighthouserc.json` (performance ≥ 0.85; accessibility, best
     practices, and SEO ≥ 0.90).
  2. **e2e** — runs only after `verify` passes; installs Chromium and runs
     `npx playwright test --project=chromium`, uploading `test-results/`
     traces on failure.
- Before pushing, run the local gates:
  `npx tsc --noEmit && npm run lint -- --max-warnings=0 && npm test`.
  Add `npx playwright test` when you touch UI, routing, or headers.
- CI supplies `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_FOLDER`,
  and the `GH_TOKEN` secret; a fork without `GH_TOKEN` still builds, but
  GitHub-backed Lighthouse runs are rate-limited.
- No commit-msg hook or formatting gate is configured, so keep commits
  scoped and describe the user-visible change.

---

**Last updated**: August 2026
