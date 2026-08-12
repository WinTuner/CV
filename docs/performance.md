# Performance

## Current Status

The codebase has already adopted the baseline optimizations:

| Area | Status |
| --- | --- |
| Image formats | ✅ AVIF + WebP configured, remote patterns allowed |
| Type safety | ✅ `ignoreBuildErrors: false`, `npx tsc --noEmit` runs in CI |
| Fonts | ✅ Geist + Geist Mono + Fraunces via `next/font`, `display: swap`, used as CSS vars |
| ISR / caching | ✅ GitHub & blog data revalidate on a schedule + 2-min in-memory cache |
| Loading states | ✅ `loading.tsx` skeletons for blog, projects, workbench, introduction |
| Error boundaries | ✅ `error.tsx` at root and per-route-group |
| Streaming | ✅ Suspense around async data fetching (home page streams the
  GitHub-backed sections; projects & workbench pages stream their lists) |
| Scroll performance | ✅ `content-visibility-auto` on below-the-fold sections |
| Hydration | ✅ Client widgets kept small and memoized; server-first sections |
| Progressive enhancement | ✅ `html.no-js` fallback keeps `opacity-0`-gated content
  visible until the JS bundle hydrates |
| Bundle | ✅ No unused Radix packages installed; only what's imported |

## What's Already In Place

- **Font loading**: `app/layout.tsx` loads Geist + Geist Mono + Fraunces
  (serif display) with `subsets`, `variable`, and `display: swap`, wired into
  `--font-sans` / `--font-mono` / `--font-serif` via `@theme inline`.
- **Image pipeline**: `next.config.mjs` enables AVIF/WebP and a permissive
  `remotePatterns` block (images are also pre-optimized by
  `scripts/optimize-images.mjs`).
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` disables the
  ambient animation set in `app/globals.css`.
- **Paint containment**: `.content-visibility-auto` on long sections.

## Bundle Size (measured August 2026)

First-load JS (uncompressed) per route, from `.next/diagnostics/route-bundle-stats.json`
(after the CommandPalette lazy-mount optimization):

| Route | First-load JS |
| --- | --- |
| `/` (home) | ~680KB |
| `/introduction` | ~648KB |
| `/blog` | ~631KB |

Notes:
- The bulk (~370KB) is the Next.js 16 + React 19 framework runtime that every
  App Router page pays for — not directly reducible.
- The command palette and Spotify player were removed in the editorial
  redesign, which also cut the terminal widget's ~71KB and its tab components.
- Re-check after any dependency change: `npx next build`, then inspect
  `.next/diagnostics/route-bundle-stats.json`.

## CI Guardrails

- **Lighthouse CI** — `.github/workflows/ci.yml` runs `treosh/lighthouse-ci-action`
  after each build (scores: performance ≥0.85, accessibility ≥0.95,
  best-practices ≥0.9, SEO ≥0.9) across `/`, `/introduction`, `/projects`, `/blog`.
- **Resource budgets** — `budgets.json` fails the build if scripts exceed
  800KiB or the total page weight exceeds 2500KiB on any audited URL.
- **Vercel Speed Insights** — ✅ installed (`@vercel/speed-insights/next`)
  alongside `@vercel/analytics` in `app/layout.tsx`; real-user Core Web
  Vitals now show in the Vercel dashboard.

## Remaining Opportunities

1. **Audit locally** for before/after comparisons:
   ```bash
   npm run build && npm start
   npx lighthouse http://localhost:3000 --view
   ```
2. **Dependency audit** — `npx depcheck` to confirm nothing is orphaned.
3. **More lazy components** — the GitHub contribution graph, skills matrix,
   and projects grid could be wrapped in `next/dynamic` if any route's first
   paint regresses.

## Notes

- The homepage streams the GitHub-backed sections (contribution graph, projects
  grid, workbench) behind Suspense boundaries, so the hero and static content
  paint immediately and only the data sections wait on the GitHub API. Each
  fetch still honors `revalidate = 900` + a 2-min in-memory cache.
- Below-the-fold sections gate entrance animations behind `useInView`; an
  inline script in `app/layout.tsx` removes the `no-js` class from `<html>` at
  parse time, and `html.no-js .opacity-0 { opacity: 1 }` in `app/globals.css`
  guarantees content is visible even before the JS bundle hydrates.
- The workbench pages poll `/api/activity` (server-cached) every 30s via
  `useLiveGithubActivity`; intervals are cleaned up on unmount.

---

**Last updated**: August 2026
