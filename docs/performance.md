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

## Bundle Size (measured October 2026)

First-load JS (uncompressed) per route, from `.next/diagnostics/route-bundle-stats.json`
(after the CommandPalette lazy-mount optimization; re-measured
September 2026 after the 16.3.6 patch round — down ~20–40KB per route;
re-measured October 2026 after adding Lenis smooth-scroll — lazy chunk,
off the first-load bundle; re-measured Oct 2026 after the 16.3.8 patch
round; re-measured Oct 20, 2026 — up ~25KB per route vs the September
figures, still under the 800KiB budget):

| Route | First-load JS |
| --- | --- |
| `/` (home) | ~682KB |
| `/introduction` | ~653KB |
| `/blog` | ~610KB |
| `/projects` | ~603KB |

Notes:
- The bulk (~370KB) is the Next.js 16 + React 19 framework runtime that every
  App Router page pays for — not directly reducible.
- Lenis (~25KB uncompressed) ships as a lazy chunk booted on
  `requestIdleCallback`, so it costs nothing at first paint; all routes
  stay well under the 800KiB script budget.
- Reveal/transition keyframes animate transform + opacity only (no `filter`
  or `will-change` layers) to keep the Lighthouse performance score green.
- The command palette and Spotify player were removed in the editorial
  redesign, which also cut the terminal widget's ~71KB and its tab components.
- Re-check after any dependency change: `npx next build`, then inspect
  `.next/diagnostics/route-bundle-stats.json`.

## CI Guardrails

- **Lighthouse CI** — `.github/workflows/ci.yml` runs `treosh/lighthouse-ci-action`
  after each build (scores: performance ≥0.85, accessibility ≥0.95,
  best-practices ≥0.9, SEO ≥0.9) across `/`, `/introduction`, `/projects`, `/blog`.
- **Resource budgets** — `config/budgets.json` fails the build if scripts exceed
  800KiB or the total page weight exceeds 2500KiB on any audited URL.
- **Vercel Speed Insights** — ✅ installed (`@vercel/speed-insights/next`)
  alongside `@vercel/analytics` in `app/layout.tsx`; real-user Core Web
  Vitals now show in the Vercel dashboard.

## Local Lighthouse audit (October 20, 2026)

Medians of 2–3 runs per route, simulated mobile, production build served
by `npm start`, Playwright Chromium (no system Chrome on the machine).
Absolute numbers run ~5–8 points lower than CI/GitHub runners mainly
because of local TTFB (~450ms vs ~100–200ms on Vercel edge) — treat
these as *relative* signals, and Vercel Speed Insights as the
production source of truth.

| Route | Perf | LCP | TBT |
| --- | --- | --- | --- |
| `/` | ~77–79 | ~5.1s | ~150–240ms |
| `/introduction` | ~84 | ~4.5s | ~50ms |
| `/projects` | ~74–76 | ~5.1s | ~250–390ms |
| `/blog` | ~86–88 | ~4.0s | ~20–75ms |
| `/workbench` | ~90 | ~3.6s | ~42ms |
| `/case-study/muanjai` | ~88 | ~3.9s | ~36ms |

Dead ends measured on 2026-10-20 — all neutral (± noise), don't retry
without a new signal:

- **Trimming fonts** (dropping Archivo + Instrument Serif, ~49KB less
  preloaded woff2): +1–2 pts at best. The LCP text on font-heavy routes
  waits for the Fraunces swap (`lcp-breakdown` shows ~1.2s "element
  render delay" = swap), and Fraunces can't shrink: the design uses it
  at both 400 italic (hero typewriter) and 500 (headings).
- **`<link rel="preload">` for the Cloudinary hero**: neutral in
  Lantern (it already prioritizes the LCP image); the `preconnect` +
  `fetchPriority=high` already in place cover the real-browser case.
- **Same-origin hero** (Cloudinary disabled → `/_next/image`): neutral
  locally; third-party connection setup is not the bottleneck.

What did move things:

- `/projects` hero (kicker + h1 + search) un-gated from
  `opacity-0` + `useInView`: as a client component the whole block was
  invisible until hydration + IntersectionObserver. LCP is now
  server-painted (the same pattern `/blog` already used with a
  CSS-only `animate-fade-in-up`, no `opacity-0`).
- PWA/Apple icons re-encoded (palette PNG, quality 80): 683KB → 170KB
  total; `apple-icon.png` alone 48KB → 13KB, which also cuts what
  Lighthouse charges to every audited page's byte weight.
  Re-run via `node scripts/optimize-images.mjs`.

## Remaining Opportunities

1. `/projects` TBT (~250–390ms) is the last route-specific drag: the
   card grid uses `transition-all` on every card; switching to explicit
   properties (`transition-[border-color,box-shadow]`) is the obvious
   candidate but was not measured yet.
2. **Dependency audit** — `npx depcheck` to confirm nothing is orphaned.
3. Home's simulated LCP (~5.1s) is dominated by the throttled
   critical-path transfer (HTML 33KB + CSS 23KB + fonts ~140KB + hero).
   If prod Speed Insights ever shows mobile LCP > 2.5s, the remaining
   lever is the DOM itself (home SSR HTML is ~342KB).

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

**Last updated**: October 2026
