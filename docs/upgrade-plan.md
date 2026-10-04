# Upgrade Plan — WinTuner CV (Full)

> Generated Sep 2026. Covers toolchain, content, perf, a11y, testing, infra.
> Baseline: Next 16.3.5, React 19.3.0, Tailwind v4.3.3, Node 22. See `package.json:32` deps.

## Goals

- Keep stack current without breaking ISR/SSG.
- Close recruiter-facing content gaps (`docs/improvement-checklist.md:33`).
- Cut first-load JS from ~680KB (`docs/performance.md:37`) toward budgets `budgets.json:7` 800KiB script.
- Pass axe + Lighthouse `lighthouserc.json:22` perf≥0.85, a11y≥0.9.
- Harden CI (`tsc`+lint+test+build already in `.github/workflows/ci.yml:41`).

## Non-Goals

- No DB/CMS migration (still bundled `lib/blog-data.tsx:20` + Notion fallback `lib/notion-blog.ts`).
- No third language (EN/TH stays `constants/cv-data.ts:11` `LanguageMap`).
- No major Node jump (stay `engines >=22` `package.json:19`).

---

## Phase 0 — Audit (done)

- `npm outdated` (Sep 2026): next 16.3.5→16.3.6, eslint-config-next 16.3.5→16.3.6, bundle-analyzer 16.3.5→16.3.6, jsdom 30.0.1→30.1.1, lucide 1.45→1.48, tailwind-merge 3.6.0→3.7.0, html2canvas-pro 2.4.2→2.4.5; majors deferred (eslint 9→10, analytics 1.6→2.0, TS 5.9→7, vitest 4→5, @types/node 22→26)
- `npm audit` clean (0 vuln).
- `depcheck` false-positives for `@tailwindcss/typography`, `tailwindcss`, `postcss`, `tw-animate-css` (used via CSS import, keep).
- Bundle `~680KB` home (`docs/performance.md:37`), `jspdf`+`html2canvas-pro` already lazy `components/public/introduction/download-resume-button.tsx:28`, `CommandPalette` eager `components/header.tsx:9`.

---

## Phase 1 — Toolchain & Config (WS1)

**Owner:** DX. **Risk:** low.

1. `package.json:68` remove `pnpm.overrides` (npm project uses `package-lock.json`).
2. `tsconfig.json:7` `target ES6 → ES2022` (Next 16 + Node 22 supports top-level await, smaller emit). Keep `module: esnext`, `moduleResolution: bundler`.
3. Selective bumps (patch/minor safe, test each):
   - `react`+`react-dom` 19.2.3→19.2.8
   - `@radix-ui/react-avatar` 1.1.2→1.2.0+ , `react-slot` 1.1.1→1.2.3+
   - `@vercel/analytics` ^1.1.4→^1.6.x (defer 2.0 to separate PR)
   - `lucide-react` 0.454→0.511+ (verify icons: Home, FileText, etc. `components/command-palette.tsx:6`)
   - `tailwind-merge` 2.5.5→3.6 keep (test `cn()` `lib/utils.ts`)
   - `tw-animate-css` 1.3.3→1.4.0
   - `vitest` 4.1.10→4.1.11
   - Keep `eslint 9.39` + `typescript 5.9` + `@types/node 22` (defer majors to WS5).
4. `next.config.mjs:17` keep `optimizePackageImports` list, add `tailwind-merge` already there? Verify.
5. Verify: `npx tsc --noEmit && npm run lint && npm test && npm run build && npm run analyze` inspect route stats.

---

## Phase 2 — Performance (WS3)

**Owner:** perf. **Risk:** low.

1. `components/header.tsx:9` `CommandPalette` eager → `next/dynamic` `ssr:false` + loading `null`. Two mount points `header.tsx:128` + `215` share same dynamic.
2. Already done: `download-resume-button.tsx:28` lazy — no change.
3. Optional: `github-contribution-graph.tsx`, `skills-matrix.tsx`, `projects-grid.tsx` behind `dynamic` if Lighthouse perf <0.85 on mobile after Phase 1. Measure first.
4. Re-measure `ANALYZE=true npm run build` vs `docs/performance.md:37` table. Tighten `budgets.json:7` 800→750 if gain >30KB.

Verify: `npx lighthouse http://localhost:3000 --view` home + `/introduction`, `/projects`, `/blog`.

---

## Phase 3 — Accessibility & SEO (WS4)

**Owner:** a11y. **Risk:** low.

- `components/header.tsx:53` mobile menu focus trap: keep Escape handler, add Tab loop (first↔last focusable) or use `focus-trap-react`. Search `header.tsx:184` grid rows.
- `components/contact-section.tsx:166` form: add `aria-live="polite"` regions for `error` `isSent` states, `role="status"` on success, `aria-describedby` on inputs (search `contact-section.tsx:218` error p).
- `components/contact-section.tsx:175` inputs already have labels, but ensure `aria-invalid` when error.
- Touch targets: `header.tsx:143` social icons `h-9 w-9` → ensure `min 44px` on mobile via `h-11 w-11` already on mobile menu `header.tsx:224`, fix tag chips in `introduction-content.tsx:414` skills `px-2.5 py-1` → bump to `min-h-[44px]` on interactive elements.
- Contrast: verify `globals.css:17` `--primary #0b7187` on `--background #f2fbff` hits 4.5:1 (use axe).
- Lightbox `introduction-content.tsx:514` already `role=dialog aria-modal` good; add `aria-label` to close btn already `aria-label="Close modal"` `540`.
- SEO: verify `lib/structured-data.ts` Article JSON-LD per post not duplicating `sitemap.ts` canonical (check `docs/improvement-checklist.md:56`).

Verify: `npx @axe-core/cli http://localhost:3000` + manual Tab/Escape/200% zoom.

---

## Phase 4 — Content (WS2)

**Owner:** content. **Risk:** med (copy).

- `constants/cv-data.ts:314` experiences `June 2026 - Present` future date → correct to `June 2025 - Present` or real start. Same `th` block `340`.
- `constants/cv-data.ts:46` professionalExperience → consider new case-study page `/case-study/muanjai` or blog post `lib/blog-data.tsx` covering RAG/Pathumma/ThaiSC, PromptPay, webhook hardening (high ROI per `docs/improvement-checklist.md:33`).
- `lib/blog-data.tsx:707` `blogTranslations` empty `content: ""` for 2 posts → fill TH excerpt/content or keep fallback `localizePost:732` uses EN content but TH title/excerpt should be non-empty.
- `lib/blog-data.tsx:20` add 2026 H2 post if needed; dates Apr 2025–Jan 2026 stale.
- `lib/github.ts:86` fallbackProjects → update `sample-boot-*` academic entries with richer descriptions or hide `category: academic` from featured filter if weak for recruiters (`docs/improvement-checklist.md:36`). Fix `AutoOS` URL hardcode `tinodin` vs `WinTuner`.
- `lib/github.ts` repo fetch should reuse `GITHUB_TOKEN` for higher rate limit (currently only `getGithubRecentActivity:571` uses token).

Verify: `npm run build` + bilingual toggle shows TH without blank, `/projects` cards show concrete metrics.

---

## Phase 5 — Testing & CI (WS5)

- `eslint.config.mjs:1` flat config already `core-web-vitals`+`typescript`.
- `.github/workflows/ci.yml:34` lint step → `npm run lint -- --max-warnings=0` to fail on warnings.
- Add `npm audit --audit-level=high` step (non-blocking warn) after `npm ci`.
- Keep Vitest `vitest.config.mts:5` jsdom; expand coverage: `lib/github.ts`, `lib/fuzzy.ts`, `language-provider`.
- Playwright E2E (defer but scaffold): `language toggle`, `project filters`, `?print=true` → `playwright.config.ts`.

---

## Phase 6 — Infra & Cleanup (WS6)

- `next.config.mjs:41` `remotePatterns hostname ** ` → restrict to `avatars.githubusercontent.com`, `raw.githubusercontent.com`, `images.unsplash.com`, `**notion*`, etc. or keep `**` with comment if intentional permissive.
- `public/` prune unused `placeholder*` if unreferenced (`rg placeholder` check).
- `scripts/optimize-images.mjs` re-run after image replace.
- Ensure `GITHUB_TOKEN` in Vercel env; `lib/site.ts:5` canonical fallback stays `thanatphong.vercel.app`.

---

## Verification Checklist (per phase)

```bash
npx tsc --noEmit
npm run lint -- --max-warnings=0
npm test
npm run build
ANALYZE=true npm run build  # check .next/diagnostics/route-bundle-stats.json
npx lighthouse http://localhost:3000 --view
npx @axe-core/cli http://localhost:3000
```

CI mirrors `.github/workflows/ci.yml:22` Node 22 + `treosh/lighthouse-ci-action@v12` + `budgets.json`.

## Execution Order

1. WS1 config+selective bumps → commit
2. WS3 perf lazy → commit
3. WS4 a11y → commit
4. WS2 content → commit
5. WS5 CI/test → commit
6. WS6 infra → commit
7. Final verify + `docs/improvement-checklist.md` update (mark items done)

Rollback per `docs/deployment.md:67` Vercel instant or `git checkout <sha> && npm ci && npm run build`.

---

**Last updated:** Sep 2026
**Oct 2026 round:** WS1–WS6 executed — Next 16.3.8, lucide 1.51,
html2canvas-pro 2.5.0, sharp 0.35.5, @types/node 22.20.5; unit tests 51→75
(`fuzzy`, `blog-data`, `github-urls`); E2E 18/18 incl. CSP zero-violations
(report-only kept — needs prod soak before enforce). Perf follow-up:
CI LH gate tripped at 0.82 on `/` (pre-existing on main — LCP == TTI
under Moto-G4 throttling, hero portrait starved by full-page bundle
parse/hydration); fixed by code-splitting below-fold home sections via
`next/dynamic` ssr:true (`app/page.tsx`, same SSR HTML) — lab 0.80→0.86+,
LCP 4.4s→~3.4s. Residual CLS ~0.12 is hero font-swap reflow, left alone
(fixing needs a typography change — candidate for next round).
Deferred: eslint 10, analytics 2.0, TS 7, vitest 5,
@types/node 26; `braces` audit chain needs breaking eslint-config-next downgrade.
**Source:** `docs/upgrade-plan.md` replaces ad-hoc checklist for this upgrade.
