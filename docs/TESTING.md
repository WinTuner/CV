<!-- generated-by: gsd-doc-writer -->
# Testing

> WinTuner — Personal Site & CV. Two independent suites: Vitest unit/component
> tests and Playwright end-to-end tests (smoke + axe accessibility).

## Test framework and setup

### Unit / component suite — Vitest

| Piece | Version | Role |
| --- | --- | --- |
| `vitest` | ^4.1.11 | Test runner (`vitest.config.mts`) |
| `jsdom` | ^30.1.2 | DOM environment for component tests |
| `@testing-library/react` | ^16.3.3 | Rendering and `fireEvent` interaction |
| `@testing-library/jest-dom` | ^7.0.1 | DOM matchers (`toHaveAttribute`, `toBeVisible`, …) |

Configuration (`vitest.config.mts`):

- `environment: "jsdom"` — all tests run in a simulated browser.
- `include: ["**/*.test.{ts,tsx}"]` — only `*.test.*` files are picked up, so the
  Playwright `e2e/*.spec.ts` files never leak into the unit run.
- `globals: true` — `describe`/`it`/`expect` are global, though existing tests
  still import them explicitly from `vitest`.
- `setupFiles: ["./vitest.setup.ts"]`.
- `exclude: ["node_modules/**", ".next/**"]`.
- Alias `@` → project root (matches `tsconfig.json` paths), so imports read
  `@/lib/fuzzy`, `@/components/copy-email-button`.

Global setup (`vitest.setup.ts`) does three things:

1. Registers the `jest-dom` matchers via `@testing-library/jest-dom/vitest`.
2. Polyfills `localStorage` with a minimal in-memory `Map` store — Node 26
   defines an undefined global `localStorage`, which otherwise prevents jsdom
   from installing its own.
3. Stubs `window.matchMedia` (jsdom does not implement it) returning
   `matches: false`; individual tests override it with `vi.stubGlobal`.

No test requires a database, network access, or a running dev server — external
data (GitHub, Notion, Medium) is mocked or the pure helper is tested directly.

### E2E suite — Playwright

| Piece | Version | Role |
| --- | --- | --- |
| `@playwright/test` | ^1.63.0 | E2E runner (`playwright.config.ts`) |
| `@axe-core/playwright` | ^4.13.0 | WCAG 2.0 A/AA accessibility scans |

Configuration (`playwright.config.ts`):

- `testDir: "./e2e"`; a single project named `chromium` (Desktop Chrome).
- `fullyParallel: true`; `workers: 2` and `retries: 2` when `CI` is set,
  otherwise default workers and no retries.
- `reporter`: `github` in CI, `list` locally. `trace: "on-first-retry"`.
- `forbidOnly: !!process.env.CI` — a stray `test.only` fails the CI run.
- Port **3100** by default (`PORT = process.env.E2E_PORT ?? 3100`), overridable
  with `E2E_PORT`; the full base URL is overridable with `E2E_BASE_URL`.
- `webServer` boots `npm run dev -- --port 3100` automatically with a 120 s
  timeout and `reuseExistingServer: true` — if something already answers on the
  URL (e.g. a preview deploy pointed to by `E2E_BASE_URL`), no server is started.

## Running tests

### Unit / component tests

```bash
# Full suite, single run
npm test

# Watch mode
npm run test:watch

# Single file
npx vitest run lib/__tests__/fuzzy.test.ts

# Filter by test name
npx vitest run -t "fuzzyMatch"
```

| Script | Command | What it does |
| --- | --- | --- |
| `npm test` | `vitest run` | One-shot run of every `*.test.ts(x)` file |
| `npm run test:watch` | `vitest` | Re-runs affected tests on change |

### E2E tests

There is no `package.json` script for Playwright — invoke it directly. Install
the browser once per machine first:

```bash
npx playwright install --with-deps chromium

# Full suite (the dev server is started for you on port 3100)
npx playwright test

# Only the chromium project, as CI runs it
npx playwright test --project=chromium

# One spec file
npx playwright test e2e/a11y.spec.ts

# Interactive UI mode
npx playwright test --ui
```

Failures write traces and screenshots to `test-results/`.

### E2E spec coverage

| Spec | Covers |
| --- | --- |
| `e2e/language.spec.ts` | EN/TH toggle via the dropdown, `?lang=th` deep links, persistence across reload |
| `e2e/projects.spec.ts` | Category filter narrows the grid, clear restores it, search filters cards by title |
| `e2e/print.spec.ts` | `?print=true` auto-triggers `window.print` once, manual print button, photos stay visible when printing |
| `e2e/blog.spec.ts` | RSS feed entry point, post page content + JSON-LD |
| `e2e/workbench.spec.ts` | Activity panel live freshness indicator |
| `e2e/security.spec.ts` | Baseline hardening headers on every route, no CSP violations on interactive pages, theme-aware favicons |
| `e2e/a11y.spec.ts` | axe scan of `/`, `/projects`, `/introduction`, `/blog`, `/workbench`, `/case-study/muanjai` |

The axe spec freezes entrance animations (injected CSS overriding
`animation-duration`/`transition-duration`) and waits 500 ms so it measures the
final visual state, runs `AxeBuilder` with the `wcag2a` and `wcag2aa` tags, and
fails only on `critical` or `serious` impact violations.

The dev server serves real pages, so set the env vars from `.env.example` first
(`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `GITHUB_TOKEN`, …) — without them images
fall back to local files and live GitHub panels degrade, which can change what
the assertions see.

## Writing new tests

### Unit tests

- Location and naming: `components/__tests__/<name>.test.tsx` for React
  components, `lib/__tests__/<name>.test.ts` for pure helpers (`*.test.tsx`
  when the unit renders hooks/JSX). The include pattern is `**/*.test.{ts,tsx}`,
  so a colocated `foo.test.ts` next to `foo.ts` also works.
- Import the test API explicitly (`import { describe, expect, it, vi } from
  "vitest"`), matching the existing files, and import source through the `@`
  alias.
- Hooks are exercised either with `render` on a tiny harness component (see
  `lib/__tests__/use-in-view.test.tsx`) or with `renderHook` from
  `@testing-library/react` (see `lib/__tests__/use-live-github-repos.test.tsx`).
- Clean up global state in `afterEach`:
  `vi.restoreAllMocks()` and `vi.useRealTimers()` (see
  `components/__tests__/copy-email-button.test.tsx`). Use `vi.useFakeTimers()`
  plus `act(() => vi.advanceTimersByTime(...))` for debounce/timeout logic.
- Assert on roles and ARIA attributes (`getByRole`, `toHaveAttribute`,
  `[role="status"]`) rather than CSS classes — the component tests follow this
  pattern.
- Time-dependent UI (e.g. Christmas layer) takes an explicit date argument
  rather than mocking `Date` — see `components/__tests__/christmas-layer.test.ts`.

### E2E tests

- Add `e2e/<feature>.spec.ts`; wrap related cases in `test.describe("<feature>")`.
- Navigate with relative paths (`page.goto("/projects")`) — `baseURL` is
  supplied by the config.
- Prefer accessible locators (`getByRole`, `getByText`) over CSS selectors.
- Stub browser APIs before navigation with `page.addInitScript(...)`, as
  `print.spec.ts` does for `window.print`.
- For new pages, add the route to the `ROUTES` array in `e2e/a11y.spec.ts` so
  it gets the WCAG scan.

## Coverage requirements

No coverage threshold configured. There is no `coverage` block in
`vitest.config.mts`, no `@vitest/coverage-*` dependency, and CI does not assert
coverage numbers (it runs `npm test`, which is `vitest run`). A run is green or
red based on test pass/fail only.

To inspect coverage ad hoc, install a coverage provider locally and run
`npx vitest run --coverage`.

## CI integration

Workflow: `.github/workflows/ci.yml` (name **CI**), triggered on `push` and
`pull_request` to `main`, with `concurrency` cancelling stale runs. Both jobs run
on `ubuntu-24.04` with Node 22 and `npm ci`, and both set
`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_FOLDER`, and
`GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}`.

**Job `verify` — "Lint, Test, Build & Lighthouse"** (20-minute timeout):

1. `npm audit --audit-level=high` (warns, does not fail)
2. `npx tsc --noEmit`
3. `npm run lint -- --max-warnings=0`
4. `npm test` — the Vitest suite
5. `npm run build`
6. Lighthouse CI via `treosh/lighthouse-ci-action` using
   `config/lighthouserc.json` (also stores artifacts)

**Job `e2e` — "E2E + axe"** (`needs: verify`, 20-minute timeout):

1. Cache `~/.cache/ms-playwright`, keyed on the lockfile hash
2. `npx playwright install --with-deps chromium`, retried up to 3 times with a
   20 s backoff (the runner's apt mirror flakes)
3. `npx playwright test --project=chromium` — starts the dev server on port 3100
4. On failure, uploads `test-results/` as the `playwright-traces` artifact
   (7-day retention)

Playwright is not run if `verify` fails, so unit failures block the E2E job.

## Next steps

- [Development](development.md) — scripts, linting, and local workflow
- [Architecture](architecture.md) — how the tested modules fit together
- [Configuration](CONFIGURATION.md) — env vars the dev server and tests expect
