<!-- generated-by: gsd-doc-writer -->
# Configuration

The site has no configuration library or schema. Behavior is controlled by three things:

1. **Environment variables** read directly with `process.env` (mostly in `lib/site.ts`, `lib/images.ts`, `lib/github.ts`, `lib/notion-blog.ts`, and the two API routes).
2. **`next.config.mjs`** — build/runtime behavior, image allowlist, redirects, headers.
3. **`lib/site.ts`** — the single source of truth for site identity constants, each overridable by an env var with a code default.

Nothing is strictly required: a clone with no `.env` file builds and runs with production defaults baked into `lib/site.ts`. Optional integrations (Notion blog, newsletter, contact form, Cloudinary images) simply fall back when unset.

Copy `.env.example` to `.env.local` to override anything locally:

```bash
cp .env.example .env.local
```

`.env`, `.env.local`, and the per-environment `.local` variants are git-ignored; only `.env.example` is tracked.

## Environment variables

### Public variables (`NEXT_PUBLIC_*`)

These are inlined into the client bundle at **build time**. Changing one requires a rebuild, not just a restart.

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | `https://thanatphong.is-a.dev` | Canonical origin. Used by `SITE_URL` in `lib/site.ts`, which feeds `metadataBase` (`app/layout.tsx`), `app/sitemap.ts`, `app/robots.ts`, `app/feed.xml/route.ts`, and per-page JSON-LD. Must include the scheme, no trailing slash expected. |
| `NEXT_PUBLIC_GITHUB_USERNAME` | No | `WinTuner` | GitHub login used for profile/repo URLs and the API user-agent (`lib/site.ts`). |
| `NEXT_PUBLIC_GITHUB_BASE_URL` | No | `https://github.com` | Web base for profile and repo links. |
| `NEXT_PUBLIC_AUTHOR_NAME` | No | `Thanatphong Tarin` | Author name in metadata, blog, and feed (`lib/site.ts`). |
| `NEXT_PUBLIC_AUTHOR_AVATAR` | No | `img("/developer-portrait-v3.png")` | Author avatar. Passed through `img()`, so a bare filename resolves to Cloudinary when configured. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | `Thanatphong2719@gmail.com` | Email shown in the UI and used to build `CONTACT_MAILTO`. |
| `NEXT_PUBLIC_GITHUB_URL` | No | derived `https://github.com/WinTuner` | Full profile URL in `SOCIAL_LINKS.github`. |
| `NEXT_PUBLIC_LINKEDIN_URL` | No | `https://www.linkedin.com/in/thanatphong-tarin` | LinkedIn link in `SOCIAL_LINKS`. |
| `NEXT_PUBLIC_GEARZ_URL` | No | `https://gearz.gg/Natto` | Gearz link in `SOCIAL_LINKS`. |
| `NEXT_PUBLIC_LINE_OA_URL` | No | `https://line.me/R/ti/p/%40636owbhl` | LINE OA link in `SOCIAL_LINKS`. |
| `NEXT_PUBLIC_MEDIUM_FEED_URL` | No | `https://medium.com/feed/@thanatphong2719` | Medium RSS feed. Lower precedence than `MEDIUM_FEED_URL`. Consumed via `MEDIUM_FEED_URL` in `lib/site.ts` by `lib/medium-blog.ts`. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No | unset | Renders `<meta name="google-site-verification">` through `metadata.verification` in `app/layout.tsx`. Unset = no tag. |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | No | unset | Renders `<meta name="msvalidate.01">` through the `verification.other` map in `app/layout.tsx`. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | No | `""` | When set, `img()` in `lib/images.ts` returns `https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto/<folder>/<id>`; when empty, local `/public` paths are returned. |
| `NEXT_PUBLIC_CLOUDINARY_FOLDER` | No | `cv` | Cloudinary folder (public ID prefix) used by `lib/images.ts` and `scripts/upload-to-cloudinary.mjs`. |

### Server-only variables

Never prefix these with `NEXT_PUBLIC_` — they would be inlined into the client bundle.

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `GITHUB_TOKEN` | No | unset | Adds an `Authorization: token …` header to GitHub REST calls (`lib/github.ts`) and enables the GraphQL contribution calendar. Without it, the contribution calendar falls back to generated data and REST calls are rate-limited to the anonymous quota. |
| `GITHUB_API_BASE_URL` | No | `https://api.github.com` | API origin; GraphQL URL is derived as `${base}/graphql` (`lib/site.ts`). |
| `MEDIUM_FEED_URL` | No | falls back to `NEXT_PUBLIC_MEDIUM_FEED_URL`, then the Medium URL above | Server-side override for the Medium RSS feed; takes precedence over the public variable (`lib/site.ts`). |
| `NOTION_API_KEY` | No | unset | Notion integration token (`lib/notion-blog.ts`). Blog reads from Notion only when **both** this and `NOTION_DATABASE_ID` are set; otherwise bundled posts in `lib/blog-data.tsx` are used. |
| `NOTION_DATABASE_ID` | No | unset | ID of the Notion database queried at `https://api.notion.com/v1/databases/<id>/query`. |
| `LTI_CLIENT_ID` | No | unset | Listed in `.env.example`, but no runtime code reads it — the only occurrence is inside a TypeScript code sample in the blog post body in `lib/blog-data.tsx`. Setting it has no effect on the site. |
| `NEWSLETTER_WEBHOOK_URL` | No | unset | `app/api/subscribe/route.ts` POSTs `{ "email": "..." }` here. Must be an absolute `https://` URL (`isSafeWebhookUrl` in `lib/security.ts`); otherwise the route returns `500`. |
| `UPSTASH_REDIS_REST_URL` | No | unset | Used only when `NEWSLETTER_WEBHOOK_URL` is unset. Together with the token, the route does `RPUSH newsletter:subscribers <email>` against the Upstash REST API. |
| `UPSTASH_REDIS_REST_TOKEN` | No | unset | Bearer token for the Upstash REST calls. Required together with the URL. |
| `CONTACT_WEBHOOK_URL` | No | unset | `app/api/contact/route.ts` POSTs `{ name, email, message }` here. Same `https://` validation; when unset the route returns `501`. |

When neither newsletter backend is configured, `/api/subscribe` returns `501`; when `CONTACT_WEBHOOK_URL` is unset, `/api/contact` returns `501`. Both are surfaced in the UI as a "coming soon" / email-me-directly message.

### Build, tooling, and platform variables

These are not app configuration, but the code branches on them.

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `NODE_ENV` | No | set by Next.js | In `next.config.mjs`: selects `distDir` (`.next-build` for non-Vercel production builds), enables console stripping, production asset caching, and drops `'unsafe-eval'` from the CSP. |
| `VERCEL` | No | unset | Set to `"1"` by Vercel. Forces `distDir` to `.next` and gates `<Analytics />` / `<SpeedInsights />` in `app/layout.tsx` (their scripts 404 outside Vercel). |
| `ANALYZE` | No | unset | `ANALYZE=true` enables `@next/bundle-analyzer` (`next.config.mjs`). `npm run analyze` sets it. |
| `CI` | No | unset | Set by GitHub Actions. Controls Playwright retries (2), workers (2), reporter (`github`), and `forbidOnly`. |
| `E2E_PORT` | No | `3100` | Port Playwright boots `next dev` on and targets at `http://localhost:<port>`. |
| `E2E_BASE_URL` | No | `http://localhost:<E2E_PORT>` | Overrides the base URL, e.g. to run the same specs against a preview deploy. |
| `CLOUDINARY_CLOUD_NAME` | Yes (upload script only) | unset | Cloudinary account cloud name for `npm run upload:images`. |
| `CLOUDINARY_API_KEY` | Yes (upload script only) | unset | Cloudinary API key for the upload script. |
| `CLOUDINARY_API_SECRET` | Yes (upload script only) | unset | Cloudinary API secret for the upload script. |

`scripts/upload-to-cloudinary.mjs` exits with an error if any of the three `CLOUDINARY_*` credentials are missing. It loads `.env.local` and then `.env` itself (first value wins) so it works without `dotenv`.

## Required vs optional settings

There is no startup validation or config schema — the app never fails to boot because a variable is missing. Requiredness only applies to the optional integrations:

- **Notion blog**: both `NOTION_API_KEY` and `NOTION_DATABASE_ID` must be present (`hasNotionConfig()` in `lib/notion-blog.ts`); otherwise bundled posts are served.
- **Newsletter**: `NEWSLETTER_WEBHOOK_URL` **or** the `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` pair. Partial Upstash config (one of the two) is ignored.
- **Image upload**: all three `CLOUDINARY_*` server credentials, enforced by an explicit check and `process.exit(1)`.
- **Webhook URLs**: must parse as absolute `https://` URLs with a hostname. Invalid values are rejected at request time with `500` and the message "… service is misconfigured."
- **GitHub**: `GITHUB_TOKEN` is optional; `lib/github.ts` degrades to anonymous requests and generated contribution data.

## Defaults

All defaults live in code, not in a config file:

- `lib/site.ts` — `SITE_URL`, `GITHUB_USERNAME`, `GITHUB_WEB_BASE`, `GITHUB_API_BASE`, `GITHUB_GRAPHQL_URL`, `GITHUB_USER_AGENT`, `GITHUB_PROFILE_URL`, `githubRepoUrl()`, `MEDIUM_FEED_URL`, `AUTHOR_NAME`, `AUTHOR_AVATAR`, `CONTACT_EMAIL`, `CONTACT_MAILTO`, and `SOCIAL_LINKS` (`github`, `linkedin`, `gearz`, `lineOa`). Every one is `process.env.X || "<default>"`, so an empty string in `.env` also falls back.
- `lib/images.ts` — empty cloud name means "use `/public`"; folder defaults to `cv`.
- `lib/security.ts` — rate limiting for the two POST routes is hard-coded (5 requests per 60s per client key), not configurable by env. It is an in-memory, per-instance throttle, not a distributed limit.
- `next.config.mjs` — `distDir` defaults to `.next`; production non-Vercel builds use `.next-build`, which keeps them from corrupting a running dev server's `.next` cache.

## Config file format

### `next.config.mjs`

The only application config module. Settings in use:

- **`distDir`** — `.next` on Vercel and in dev, `.next-build` for non-Vercel production builds (see `NODE_ENV`/`VERCEL` above).
- **`compress: true`**, **`poweredByHeader: false`**, **`reactStrictMode: true`**.
- **`typescript.ignoreBuildErrors: false`** — type errors fail the build.
- **`experimental.optimizePackageImports`** — barrel-file trimming for `lucide-react`, `lenis`, `@radix-ui/*`, `clsx`, `tailwind-merge`, `class-variance-authority`.
- **`compiler.removeConsole`** — in production only, drops `console.*` except `error` and `warn`.
- **`images`** — AVIF/WebP output, reduced `deviceSizes` / `imageSizes`, one-year `minimumCacheTTL`, and an explicit `remotePatterns` allowlist: `avatars.githubusercontent.com`, `raw.githubusercontent.com`, `github.com`, `images.unsplash.com`, `**.notion.so`, `**.notion.com`, `**.amazonaws.com`, `**.medium.com`, `miro.medium.com`, `cdn-images-*.medium.com`, `res.cloudinary.com`. Add an entry here before embedding images from a new external host.
- **`redirects()`** — requests whose host is `thanatphong.vercel.app` permanently redirect (308) to `https://thanatphong.is-a.dev`, gated on the incoming host to avoid a redirect loop.
- **`headers()`** — in production, immutable one-year caching for static asset extensions; always, baseline hardening (`X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`) plus a `Content-Security-Policy-Report-Only` header (report-only, not enforced). The CSP adds `'unsafe-eval'` only outside production for the Turbopack dev client.
- **Bundle analyzer** — enabled when `ANALYZE === 'true'`.

The canonical/legacy host names are literals in `next.config.mjs` (`canonicalHost`, `legacyHost`), not env vars; changing domains requires editing both that file and `NEXT_PUBLIC_SITE_URL`.

### `lib/site.ts`

Not a config file to edit for values — it is the typed accessor layer over the env vars above. Import from it (`import { SITE_URL } from "@/lib/site"`) instead of reading `process.env` directly so defaults and the Cloudinary-aware avatar resolution stay consistent. `GITHUB_GRAPHQL_URL` and `GITHUB_PROFILE_URL` are derived, not independent settings.

### `config/`

- `config/lighthouserc.json` — Lighthouse CI: four URLs (`/`, `/introduction`, `/projects`, `/blog`), 3 runs each, starts the server with `npm run start`, asserts performance ≥ 0.85 and accessibility / best-practices / SEO ≥ 0.9, uploads to temporary public storage.
- `config/budgets.json` — Lighthouse resource budgets for `/*`: 800 KB scripts, 2500 KB total.

### Other config files

| File | Purpose |
| --- | --- |
| `package.json` | Scripts (`dev`, `build`, `start`, `lint`, `test`, `test:watch`, `analyze`, `upload:images`) and the Node `>=22` engine requirement. |
| `vitest.config.mts` | jsdom environment, `**/*.test.{ts,tsx}`, global APIs, `vitest.setup.ts`, `@` alias to the repo root. |
| `playwright.config.ts` | Chromium-only e2e from `./e2e`, dev server on `E2E_PORT` (default 3100), CI-dependent retries/reporters. |
| `tsconfig.json` | Strict TypeScript, `@/*` path alias to the repo root, includes `.next` / `.next-build` generated types. |
| `eslint.config.mjs` | ESLint flat config (`eslint-config-next`). |
| `postcss.config.mjs` | Tailwind v4 PostCSS plugin. |
| `components.json` | shadcn/ui generator config (new-york style, neutral base, `app/globals.css`, Lucide icons). |

## Per-environment overrides

| Environment | How values are supplied |
| --- | --- |
| Local development | `.env.local` (git-ignored), created from `.env.example`. Next.js loads it automatically for `next dev` / `next build` / `next start`; the Cloudinary upload script reads it directly. |
| Local production build | Same `.env.local`. `NODE_ENV=production` switches `distDir` to `.next-build` and enables console stripping, immutable asset caching, and the strict CSP. |
| CI (`.github/workflows/ci.yml`) | Job-level `env`: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: asfwanaw`, `NEXT_PUBLIC_CLOUDINARY_FOLDER: cv`, and `GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}`. The Cloudinary cloud name and folder are literals in the workflow because photos are not in git and CI builds need them. `GH_TOKEN` is a repository secret. |
| Vercel production | Read from the Vercel project's environment settings; `VERCEL=1` is injected by the platform and switches `distDir` to `.next` and enables Analytics/Speed Insights. <!-- VERIFY: production environment variables are configured in the Vercel project dashboard (Settings → Environment Variables) for the thanatphong project --> |

If a public variable changes, redeploy/rebuild — `NEXT_PUBLIC_*` values are compiled into the client bundle and a restart alone will not pick them up.

## Secrets

- Never commit `.env`, `.env.local`, or any `*_KEY` / `*_SECRET` / `*_TOKEN` value. `.gitleaks.toml` and `.gitleaksignore` configure secret scanning.
- Values shown in `.env.example` (site URL, author name, social URLs, public Cloudinary cloud name/folder) are intentionally public.
- `GITHUB_TOKEN`, `NOTION_API_KEY`, `UPSTASH_REDIS_REST_TOKEN`, `CLOUDINARY_API_SECRET`, `LTI_CLIENT_ID`, and webhook URLs are server-only; keep them out of `NEXT_PUBLIC_*`.
