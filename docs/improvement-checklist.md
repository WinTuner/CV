# Improvement Roadmap

A living, prioritized roadmap for the WinTuner portfolio. Unlike the older
checklist (which described a different project and is no longer accurate),
this reflects the current codebase. ✅ = already done, ⬜ = open.

---

## ✅ Completed Baseline

- [x] TypeScript strictness (`ignoreBuildErrors: false`, `tsc` in CI)
- [x] Image optimization enabled (AVIF/WebP + remote patterns)
- [x] Fonts via `next/font` with `display: swap` and CSS variables
- [x] Loading skeletons (`loading.tsx`) for blog, projects, workbench, introduction
- [x] Error boundaries (`error.tsx`) + custom `not-found.tsx`
- [x] Suspense/streaming on async routes (projects)
- [x] Sitemap, robots.txt, RSS feed, JSON-LD structured data
- [x] Blog search API + client filtering
- [x] Contact + newsletter webhooks with safe 501 defaults
- [x] Interactive terminal CLI (help/about/skills/projects/socials/open/…)
- [x] Command palette, back-to-top, scroll progress, easter egg
- [x] Print-optimized resume (`/introduction?print=true` + `@media print`)
- [x] Reduced-motion support, skip link, focus-managed mobile menu
- [x] CI (typecheck → lint → test → build) on every push/PR
- [x] Unit/component tests for lib + components
- [x] Docs rewritten to match this codebase (August 2026)

---

## 🔴 High Value (short term)

1. **Case-study content for Muanjai** — a dedicated deep-dive page (or blog
   post) covering the RAG-on-Thai-LLM work, PromptPay verification, and
   webhook hardening. Strongest recruiting asset on the site.
2. **Recruiter-facing project numbers** — surface concrete metrics
   (240+ CI tests, tech stack, "why") in `/projects` cards rather than
   GitHub auto-descriptions only.
3. **Vercel Speed Insights** — ✅ installed (`@vercel/speed-insights/next` in
   `app/layout.tsx`) to collect real-user Core Web Vitals alongside Analytics.
4. **Lighthouse CI** — ✅ `GoogleChrome/lighthouse-ci-action` in CI with
   score assertions (perf ≥0.85, a11y ≥0.95, BP ≥0.9, SEO ≥0.9) across 4
   routes; resource budgets in `budgets.json` (scripts ≤800KiB).
5. **Bundle analysis** — ✅ measured via `.next/diagnostics/route-bundle-stats.json`;
   Command Palette lazy-mounted to cut shared JS; see `docs/performance.md`.

---

## 🟡 Medium (when time allows)

6. **Playwright E2E** — smoke tests for the terminal CLI, language toggle,
   project filters, and the print flow.
7. **Accessibility sweep** — axe-core audit; contrast fixes for the yellow
   accent palette; `aria-live` for form feedback; touch targets ≥44px.
8. **Search indexing** — per-post Article JSON-LD already exists in
   `app/(public)/blog/[postSlug]/page.tsx`; verify posts are actually being
   indexed and that the RSS feed doesn't duplicate canonical URLs.

---

## 🟢 Low / Experimental

9. **Blog scaling** — if posts exceed ~30–50, move bundled content to MDX or
   make Notion the single source of truth.
10. **CMS/DB** — add only for comments, auth, or an admin dashboard (none
    needed today).
11. **More WOW** — 3D/canvas hero effects, embedded project demos, or a
    "wall of experiments" grid.
12. **i18n depth** — currently EN/TH; adding a third language means extending
    `constants/cv-data.ts` maps and every component copy object.

---

## Progress Tracker

| Area | Status |
| --- | --- |
| Performance baseline | ✅ done |
| Accessibility baseline | ✅ done (sweep open) |
| SEO baseline | ✅ done |
| Testing | unit ✅ / E2E ⬜ |
| Docs | ✅ rewritten Aug 2026 |
| Content (case studies) | ⬜ next |
| Analytics | page views ✅ / speed ✅ |
| Lighthouse CI + budgets | ✅ done |
| Bundle analysis + lazy palette | ✅ done |

**Recommended next phase**: items 1–2 (content case studies + project
metrics) — the highest return for a student-focused portfolio.
