# Deployment

The site is a standard Next.js 16 app with ISR. It runs anywhere a Node
server runs — Vercel, Netlify, Railway, or your own VPS.

## Vercel (recommended)

1. Push the repo to GitHub (origin is `WinTuner/…`).
2. In Vercel, **Add New Project** → import the repo.
   - Framework preset: **Next.js** (auto-detected)
   - Build command: `npm run build`
   - Install command: `npm ci`
3. Configure environment variables (see below) and deploy.

Every push to `main` deploys automatically; PRs get preview deployments.

### Custom domain

Add the domain in Vercel (Settings → Domains) and point a CNAME/A record at
Vercel's DNS. SSL is provisioned automatically. `lib/site.ts` uses
`NEXT_PUBLIC_SITE_URL` for the canonical URL and defaults to the production
URL, so builds succeed even without env vars.

## Environment Variables

Everything is optional — the site degrades gracefully when unset:

| Variable | Purpose | Default behavior |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for sitemap/OG/RSS | Production URL |
| `GITHUB_TOKEN` | Higher GitHub API rate limits + real contribution calendar | Bundled fallback data |
| `NOTION_API_KEY`, `NOTION_DATABASE_ID` | Blog via Notion CMS | Bundled posts |
| — (no env var) | Medium posts merge from the RSS feed URL hardcoded in `lib/medium-blog.ts` | No Medium posts |
| `NEWSLETTER_WEBHOOK_URL` | Newsletter signup endpoint | `501` + graceful UI |
| `CONTACT_WEBHOOK_URL` | Contact form endpoint | `501` + graceful UI |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Optional rate limiting for webhooks | — |

## CI (GitHub Actions)

`.github/workflows/ci.yml` runs on every push/PR to `main`:
`npm ci` → `npx tsc --noEmit` → `npm run lint` → `npm test` → `npm run build`.
A red CI blocks merging; keep the build green before deploying.

## Caching & Data Freshness

| Data | Strategy |
| --- | --- |
| GitHub repos / WIP / activity | `revalidate = 3600` + 2-min in-memory cache |
| GitHub contribution calendar | `revalidate = 3600` (GraphQL, token only) |
| Homepage GitHub aggregate | `revalidate = 900` |
| Blog posts (Notion/Medium) | ISR with a revalidation schedule |
| Static assets | Next.js immutable caching under `/_next/static` |

## Self-Hosting (alternative)

```bash
npm ci
npm run build
npm start          # serves the ISR build on :3000
```

Behind nginx: proxy `http://localhost:3000`, enable gzip, and cache
`/_next/static` immutably. For a Docker setup use `output: 'standalone'` in
`next.config.mjs`. Prefer Vercel unless you have an operational reason to
self-host.

## Rollback

- **Vercel**: Instant rollback to any previous deployment from the dashboard.
- **Self-hosted**: `git checkout <sha> && npm ci && npm run build && restart`.

## Monitoring

- **Vercel Analytics + Speed Insights** are already wired in
  `app/layout.tsx` — real-user page views and Core Web Vitals appear in the
  Vercel dashboard after the next deploy.
- Optional: Sentry or an uptime monitor (UptimeRobot) for the production URL.

---

**Last updated**: August 2026
