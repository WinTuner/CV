# Performance

## Current Status

The codebase has already adopted the baseline optimizations:

| Area | Status |
| --- | --- |
| Image formats | ✅ AVIF + WebP configured, remote patterns allowed |
| Type safety | ✅ `ignoreBuildErrors: false`, `npx tsc --noEmit` runs in CI |
| Fonts | ✅ Geist + Geist Mono via `next/font`, `display: swap`, used as CSS vars |
| ISR / caching | ✅ GitHub & blog data revalidate on a schedule + 2-min in-memory cache |
| Loading states | ✅ `loading.tsx` skeletons for blog, projects, workbench, introduction |
| Error boundaries | ✅ `error.tsx` at root and per-route-group |
| Streaming | ✅ Suspense around async data fetching (e.g. projects page) |
| Scroll performance | ✅ `content-visibility-auto` on below-the-fold sections |
| Hydration | ✅ Heavy widgets (Spotify, command palette) deferred; cursor glow updates DOM directly |
| Bundle | ✅ No unused Radix packages installed; only what's imported |

## What's Already In Place

- **Font loading**: `app/layout.tsx` loads Geist + Geist Mono with
  `subsets`, `variable`, and `display: swap`, wired into
  `--font-sans` / `--font-mono` via `@theme inline`.
- **Image pipeline**: `next.config.mjs` enables AVIF/WebP and a permissive
  `remotePatterns` block (images are also pre-optimized by
  `scripts/optimize-images.mjs`).
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` disables the
  ambient animation set in `app/globals.css`.
- **Paint containment**: `.content-visibility-auto` on long sections.

## Remaining Opportunities

1. **Bundle analysis** — run `npm run analyze` (`next experimental-analyze`)
   or add `@next/bundle-analyzer` and tune large first-load chunks.
2. **Audit with Lighthouse** locally:
   ```bash
   npm run build && npm start
   npx lighthouse http://localhost:3000 --view
   ```
3. **Vercel Speed Insights** — add `@vercel/speed-insights/next` alongside
   the existing `@vercel/analytics` to collect real-user Core Web Vitals.
4. **Dependency audit** — `npx depcheck` to confirm nothing is orphaned.
5. **Lazy components** — the GitHub contribution graph, skills matrix, and
   projects grid could be wrapped in `next/dynamic` or moved fully into
   Suspense if any route's first paint regresses.

## Notes

- The homepage fetches GitHub repos, WIP items, activity, and contributions
  in a single `Promise.all` on the server (`revalidate = 900`), so the
  initial HTML is complete and only fallback data is used during outages.
- The interactive terminal polls the GitHub events API client-side every 60s
  only while a live tab is visible; intervals are cleaned up on tab switch.

---

**Last updated**: August 2026
