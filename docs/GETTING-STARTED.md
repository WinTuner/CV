<!-- generated-by: gsd-doc-writer -->
# Getting Started

Get a local copy of the WinTuner portfolio site running in about two minutes.

This is a Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 site.
Every integration is optional — a fresh clone with no `.env` file builds and
runs with production defaults baked into `lib/site.ts`.

## Prerequisites

| Requirement | Version | Source |
| --- | --- | --- |
| Node.js | `>=22` | `engines.node` in `package.json` |
| npm | any recent version | `package-lock.json` is the committed lockfile |
| Git | any recent version | needed to clone the repo |

There is no `.nvmrc` or `.node-version` file in the repo; CI
(`.github/workflows/ci.yml`) pins `node-version: 22`, so Node 22 LTS is the
safe choice. `pnpm` also works against the same `package.json`, but npm is
what the lockfile and CI use.

No database, Docker, or global CLI tooling is required.

## Installation steps

1. Clone the repository:

   ```bash
   git clone https://github.com/WinTuner/CV.git
   cd CV
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. (Optional) Create a local env file. Nothing in it is required — this only
   turns on integrations such as the Notion blog, webhook forms, or
   Cloudinary-hosted photos:

   ```bash
   cp .env.example .env.local
   ```

   On Windows `cmd`/PowerShell, use `Copy-Item .env.example .env.local`.
   See [CONFIGURATION.md](./CONFIGURATION.md) for what each variable does —
   don't copy the whole reference into your head, most of it can stay blank.

## First run

```bash
npm run dev
```

Open <http://localhost:3000>. The dev script is `next dev --webpack`, so the
dev server runs on webpack (not Turbopack) and hot-reloads on save.

Confirm the install is healthy by visiting `/` (landing page), `/projects`
(GitHub-backed project list), and `/blog` (Notion-backed posts, local fallback
when Notion is unconfigured).

Run the unit/component suite as a second sanity check:

```bash
npm test
```

To serve a production build locally:

```bash
npm run build
npm start
```

Locally, `next.config.mjs` sends production output to `.next-build` instead of
`.next`, so a production build can never corrupt the live cache a running
`npm run dev` uses. On Vercel (`VERCEL=1`) it stays on `.next`. `npm start`
reads the same config, so no extra flags are needed.

## Common setup issues

- **Node version too old.** `package.json` declares `engines.node: ">=22"`.
  On Node 20 or earlier the install logs an `EBADENGINE` warning and the build
  can fail on Next 16 / React 19 APIs. Upgrade Node, then delete
  `node_modules` and reinstall.
- **`npm run dev` fails with a port conflict.** Port 3000 is already taken by
  another process. Run the dev server on a different port:
  `npm run dev -- --port 3001`.
- **Unexpected `ChunkLoadError` / stale client JS.** Usually a browser or dev
  server cache mismatch after heavy edits, not a broken install. Stop the dev
  server, delete `.next`, and restart `npm run dev`. Note that `next.config.mjs`
  deliberately keeps production output in `.next-build` so `npm run build`
  and `npm run dev` can coexist — don't "fix" that back to `.next`.
- **Forms and feeds return `501`.** Expected. `/api/contact` and
  `/api/subscribe` return `501` until `CONTACT_WEBHOOK_URL` /
  `NEWSLETTER_WEBHOOK_URL` (or Upstash) are set, and the UI shows a fallback
  message. Same pattern for the Notion blog (falls back to bundled posts) and
  Cloudinary images (falls back to local `public/` files).
- **Photos missing or 404 on a host without the image files.** Large photos
  live on Cloudinary rather than in git. Set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
  (and optionally `NEXT_PUBLIC_CLOUDINARY_FOLDER`) in your env file — see
  [CONFIGURATION.md](./CONFIGURATION.md).
- **Playwright e2e specs fail to launch a browser.** Install the browser
  binaries once with `npx playwright install`, then run
  `npx playwright test`. The suite boots its own dev server on port 3100
  (see `playwright.config.ts`), so it does not collide with your `:3000` dev
  server.

## Next steps

- [DEVELOPMENT](./development.md) — commands, code conventions, and where
  content lives.
- [ARCHITECTURE](./architecture.md) — how the app is structured and how data
  flows through it.
- [CONFIGURATION](./CONFIGURATION.md) — full environment variable reference and
  defaults.
- [DEPLOYMENT](./deployment.md) — build output, targets, and production notes.
- [README](../README.md) — feature list, routes, and API endpoints.
