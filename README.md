# WinTuner — Digital Laboratory

Personal portfolio / CV site for **Thanatphong Tarin (WinTuner)** — a digital
workshop where code meets curiosity. Experiments, prototypes, blog posts, and
open-source artifacts.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 and
Radix UI primitives. Fully bilingual (EN/TH) via a client-side language
provider.

## Pages

| Route | Description |
| --- | --- |
| `/` | Landing page — terminal hero, live GitHub activity, Discord & Spotify presence, skills matrix |
| `/introduction` | CV / introduction with education timeline and expandable image lightbox |
| `/projects` | Featured projects pulled from the GitHub API (ISR, 1h) |
| `/blog` | Blog — Notion-backed posts (with local fallback) merged with Medium, category/tag/search filtering |
| `/workbench` | Curated tool stack |

## Getting started

Prerequisites:

- **Node.js 22+** (matches CI)
- **npm** (the repo uses `package-lock.json`; `pnpm` also works)

```bash
# install dependencies
npm install

# run development server
npm run dev
```

Open <http://localhost:3000>.

### Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Development server (`next dev`) |
| `npm run build` | Production build (`next build`) |
| `npm start` | Serve the built app (`next start`) |
| `npm run lint` | ESLint (`eslint .`) |
| `npm test` | Vitest unit/component tests |
| `npm run analyze` | Bundle analysis via `next experimental-analyze` |

## Project layout

- `app/` — App Router pages, layouts, API routes (`/api/contact`, `/api/subscribe`), `sitemap.ts`, `robots.ts`, `feed.xml`
- `components/` — UI primitives (`ui/`), hero terminal widgets (`hero/`), and per-page feature components (`public/`)
- `lib/` — data fetching (`github.ts`, `notion-blog.ts`, `medium-blog.ts`, `lanyard.ts`), content (`blog-data.tsx`, `cv-data.ts`), themes, and small hooks
- `constants/` `types/` — shared config and TypeScript types
- `scripts/` — one-off tooling (image optimization, OG image generation)
- `docs/` — architecture, performance, accessibility, deployment notes
- `public/` — static assets (icons, OG images, project screenshots)

## Features

- **Bilingual (EN/TH)** — persisted language choice, all pages translated
- **Live GitHub presence** — repos, contribution activity, and events with ISR caching
- **Discord live status** — REST polling via Lanyard, offline/online states
- **Spotify now-playing widget** — deferred, memoized client widget
- **Blog** — Notion CMS integration with local fallback, Medium merge, tag/category/search, RSS feed (`/feed.xml`)
- **Newsletter + contact forms** — webhook-driven API routes (Formspree/Zapier/Make/Upstash), safe-by-default 501s when unconfigured
- **SEO** — dynamic sitemap, robots.txt, Open Graph images, JSON-LD structured data
- **Accessibility** — skip link, focus-managed mobile menu, reduced-motion support, ARIA labels on icon buttons
- **Performance** — ISR revalidation, deferred heavy widgets, memoized markdown parsing, direct-DOM cursor glow (zero re-renders)
- **Security** — sanitized blog HTML rendering, validated webhook URLs (SSRF guard), rate-limit-friendly data fetching

## Configuration

Copy `.env.example` to `.env.local` and fill in what you need. Everything is
optional:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (defaults to production URL) |
| `GITHUB_TOKEN` | Raise GitHub API rate limits during builds |
| `NOTION_API_KEY` / `NOTION_DATABASE_ID` | Blog via Notion; falls back to bundled posts |
| `NEWSLETTER_WEBHOOK_URL` / `UPSTASH_*` | Newsletter endpoint (Formspree, Buttondown, Zapier, Upstash Redis…) |
| `CONTACT_WEBHOOK_URL` | Contact form endpoint |

When a service is not configured, its API route returns `501` and the UI shows
a graceful fallback.

## Testing

```bash
npm test        # vitest run
npm run lint    # eslint .
npx tsc --noEmit
```

CI (`.github/workflows/ci.yml`) runs type check, lint, tests, and a production
build on every push/PR to `main`.

## Deployment

The site deploys as a static-friendly Next.js app (ISR for dynamic data) —
works out of the box on Vercel, Netlify, or any Node server. See
[`docs/deployment.md`](./docs/deployment.md) for details.

## Author

- **Thanatphong Tarin (WinTuner)** — <https://github.com/WinTuner>
