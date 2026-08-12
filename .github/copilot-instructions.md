# GitHub Copilot / AI Agent Instructions — WinTuner CV

Quick orienting notes for AI agents working in this repository.

## Goal

Help contributors make safe, small improvements to a Next.js 16 (App Router) +
React 19 + TypeScript + Tailwind v4 personal portfolio / CV site with an
editorial light-first design, bilingual (EN/TH) content, GitHub-powered
projects and activity, a Notion-backed blog, and API routes for
newsletter/contact webhooks.

## How the project is structured (big picture)

- `app/` — App Router pages and layouts (server components by default) plus
  API routes under `app/api/` (`contact`, `subscribe`, `search`, `activity`).
  `app/layout.tsx` holds global fonts, metadata, providers, and global widgets.
- `components/` — UI. `components/ui/` are base primitives, `components/hero/`
  holds the hero portrait + typewriter, `components/public/<route>/` are
  page-specific feature components. Client components use `"use client"` at
  the top.
- `lib/` — single-source utilities and data: `github.ts` (GitHub API + fallback
  data), `blog-data.tsx` (bundled blog posts), `notion-blog.ts`,
  `medium-blog.ts`, `cv-data.ts` (in `constants/`), plus small hooks
  (`use-in-view`, `use-is-mounted`, `use-live-github-activity`).
- `app/globals.css` — Tailwind v4 CSS-first design tokens (`@theme inline`),
  animations, and print styles.
- `docs/` — architecture, performance, accessibility, deployment, development,
  and an improvement checklist. Keep them in sync when behavior changes.
- `public/` — static assets (icons, OG images, project screenshots).

## Important conventions and patterns

- Server components by default; add `"use client"` only where browser APIs or
  hooks are needed.
- Theme: `next-themes` in `app/layout.tsx`, `defaultTheme="light"`, storage key
  `theme-mode`. Language: custom `LanguageProvider` (EN/TH), persisted via the
  `site-language` cookie + `localStorage`.
- Bilingual copy: every user-facing string should exist for both `en` and `th`
  (see `constants/cv-data.ts` and `lib/hero-utils.ts` for the pattern).
- `cn` (`lib/utils.ts`, clsx + twMerge) is the canonical way to compose class
  names.
- Tailwind utilities are defined in `app/globals.css` — prefer editing design
  tokens there instead of scattering inline values.
- Animation/visibility: `use-in-view` powers `animate-fade-in-up` reveals;
  respect the `prefers-reduced-motion` handling that hook already provides.
- Real-time data: the workbench pages poll `/api/activity` every 30s via
  `useLiveGithubActivity`. Do not hit GitHub's API directly from the browser.

## Developer workflows & common commands

The project uses **npm** (Node 22+, matching CI). Do not use pnpm/yarn.

- `npm install`
- `npm run dev` — local dev server
- `npm run build` — production build (type-checks + lints in CI too)
- `npm run start` — serve the built app (used by Lighthouse CI)
- `npm run lint` — ESLint (`eslint .`)
- `npm test` — Vitest unit/component tests (jsdom + Testing Library)
- `npx tsc --noEmit` — standalone type check
- `npm run analyze` — bundle analysis (`ANALYZE=true next build`); also inspect
  `.next/diagnostics/route-bundle-stats.json`

## Automated checks (do not skip)

CI (`.github/workflows/ci.yml`) runs on every push/PR to `main`:

1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm test`
4. `npm run build`
5. Lighthouse CI (`treosh/lighthouse-ci-action@v12`) against `lighthouserc.json`
   — performance ≥ 0.85, accessibility ≥ 0.9, best-practices ≥ 0.9, SEO ≥ 0.9,
   plus `budgets.json` resource budgets.

There **are** automated tests in this repo (currently ~48). When you add or
change behavior, add or update tests in `lib/__tests__/` (or
`components/__tests__/`) and make sure `npm test` passes.

## When making changes (AI agent checklist)

1. Keep changes small and focused (one logical change per PR).
2. Match surrounding conventions: tabs for indentation, `cn()` for class
   names, bilingual copy, existing animation classes.
3. Run `npx tsc --noEmit && npm run lint && npm test` and fix everything.
4. If the change is user-visible, run `npm run dev` and verify in a browser
   (both EN and TH).
5. If you touch behavior, update the relevant file under `docs/`.
6. Never commit secrets: server-only values come from `.env.local`
   (`GITHUB_TOKEN`, `NOTION_API_KEY`, webhook URLs, Upstash creds) and are
   gitignored. Use `.env.example` placeholders only.

## Things AI agents should NOT assume

- `next.config.mjs` has `typescript.ignoreBuildErrors: false` — type errors
  WILL fail the build. Keep types strict.
- There is no `styles/` directory; all styling lives in `app/globals.css`.
- Blog content is NOT solely in `lib/blog-data.tsx` — posts can come from
  Notion (`NOTION_API_KEY`/`NOTION_DATABASE_ID`) and Medium, merged and
  de-duplicated. `blog-data.tsx` is the offline fallback.
- `npm` is the package manager, not `pnpm`.

## Helpful files to inspect during PRs

- `app/layout.tsx` — global layout, fonts, metadata, providers, global widgets
- `app/globals.css` — design tokens, Tailwind v4 inline theme, animations
- `constants/cv-data.ts` — all CV content (bilingual, typed by `types/cv.ts`)
- `lib/github.ts` — GitHub data fetching + curated fallbacks
- `next.config.mjs` and `package.json` — build behavior and scripts

## If something is unclear

Open an issue or start a discussion in the repository; maintainers are happy to
point you at the right file before you write code.
