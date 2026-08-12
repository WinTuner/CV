# Contributing to WinTuner CV

Thanks for your interest! This is the open-source codebase behind
[wintuner.dev](https://wintuner.dev) — a personal portfolio / CV site. It is
bilingual (EN/TH), so most user-facing changes touch both languages.

## Quick start

Prerequisites: **Node.js 22+** and **npm**.

```bash
npm install
npm run dev       # http://localhost:3000
```

Everything is optional — the site works with zero env vars and falls back to
bundled content. If you want richer data, copy `.env.example` to `.env.local`.

## What we look for

- **Small, focused PRs** — one logical change per PR.
- **Type safety** — `next.config.mjs` enforces `ignoreBuildErrors: false`, so
  the build fails on type errors.
- **Tests** — Vitest + React Testing Library live in `lib/__tests__/` and
  `components/__tests__/`. Add tests when you change behavior.
- **Docs in sync** — if behavior changes, update the matching file in `docs/`.
- **No secrets** — never commit real API keys, webhook URLs, or tokens. Use
  `.env.local` (gitignored) and reference `.env.example` instead.

## Before opening a PR

Run the full local gate — CI runs exactly this:

```bash
npx tsc --noEmit
npm run lint
npm test
npm run build
```

All four should pass. CI additionally runs Lighthouse CI against
`lighthouserc.json`; if your change moves a category below the asserted
thresholds (perf ≥ 0.85, a11y ≥ 0.9, best-practices ≥ 0.9, SEO ≥ 0.9), it will
fail.

## Common changes

### Add or fix a CV entry

Edit `constants/cv-data.ts` (typed by `types/cv.ts`). Every entry needs both
`en` and `th` strings.

### Add or fix a blog post

Bundled fallback posts live in `lib/blog-data.tsx`. If `NOTION_API_KEY` +
`NOTION_DATABASE_ID` are configured, Notion is the source of truth and the
bundled posts are only the offline fallback.

### Add a page or route

- Page → new file under `app/` (or `app/(public)/` if it shares the site
  header/footer).
- API route → new file under `app/api/`, follow the pattern in
  `app/api/search/route.ts` (server-side, caches in the lib layer).

### Content conventions

- Bilingual: every user-facing string exists for both `en` and `th`.
- Styling: use Tailwind utilities + the `cn()` helper; design tokens live in
  `app/globals.css`.
- Real-time: reuse `lib/lanyard-presence.ts` (one shared WebSocket) and
  `lib/use-live-github-activity.ts` (30s poll of `/api/activity`) — do not open
  duplicate connections or call GitHub from the browser.

## Branching & commit style

- Branch from `main`, name it something descriptive (`fix/terminal-time`,
  `feat/print-resume`, ...).
- Conventional commits are preferred (`feat:`, `fix:`, `docs:`, `test:`, ...).

## Report a bug or security issue

Bugs → open an issue. Security vulnerabilities → see
[SECURITY.md](./SECURITY.md); do not open a public issue for those.

## Code of conduct

Be respectful and constructive. Harassment of any kind is not tolerated.

---

Questions? Open a discussion or reach out on [GitHub](https://github.com/WinTuner).
