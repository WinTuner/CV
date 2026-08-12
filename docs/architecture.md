# Architecture

> WinTuner — Digital Laboratory (personal portfolio / CV site for **Thanatphong Tarin**).

## Overview

A server-first Next.js 16 (App Router) application that doubles as a live
portfolio piece: a terminal hero, real-time GitHub / Discord / Spotify
presence, a bilingual CV, and a Notion-backed blog — all with graceful
fallbacks when external services are unavailable.

## Technology Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, TypeScript 5.9) |
| Styling | Tailwind CSS v4 (CSS-first, no `tailwind.config.js`) |
| UI primitives | Radix UI (`@radix-ui/react-avatar`, `react-slot`) |
| Icons | lucide-react + inline SVGs (`components/social-icons.tsx`) |
| Theme | next-themes (light/dark/system) + CSS custom properties |
| Language | Custom `LanguageProvider` (EN/TH), persisted via cookie + localStorage |
| Data fetching | Server Components + ISR + 2-min in-memory cache + hardcoded fallbacks |
| Testing | Vitest + React Testing Library + jsdom |
| Lint/Format | ESLint (flat config, `eslint.config.mjs`) + Prettier-style tabs |
| Package manager | npm (Node 22+, matches CI) |

## Project Structure

```
app/
├── layout.tsx                  # Root layout: fonts, metadata, providers, global widgets
├── page.tsx                    # Homepage (/), ISR revalidate=900
├── globals.css                 # Tailwind v4 + design tokens + animation + print styles
├── not-found.tsx, error.tsx    # Global error boundaries
├── sitemap.ts, robots.ts       # SEO output routes
├── feed.xml/route.ts           # RSS feed for the blog
├── api/
│   ├── contact/route.ts        # Contact form webhook (501 when unconfigured)
│   ├── subscribe/route.ts      # Newsletter webhook (501 when unconfigured)
│   ├── search/route.ts         # Blog search endpoint
│   └── activity/route.ts       # Live GitHub activity (polled every 30s)
└── (public)/                   # Route group: shared Header/Footer + CursorGlow
    ├── layout.tsx
    ├── introduction/page.tsx   # CV / resume (?print=true triggers PDF print flow)
    ├── projects/page.tsx       # GitHub-backed project showcase (Suspense + skeleton)
    ├── workbench/page.tsx      # Curated tool stack
    └── blog/
        ├── page.tsx            # Blog list (Notion + Medium merge)
        └── [postSlug]/page.tsx # Individual post
```

```
components/
├── ui/                         # Base primitives (button, input, avatar)
├── hero/                       # Terminal widget + tabs (status/git/neofetch/cli)
├── public/<route>/             # Page-specific feature components
├── header.tsx, footer.tsx      # Navigation & footer (client)
├── language-provider.tsx       # EN/TH context + persistence
├── theme-provider.tsx / theme-toggle / theme-changer
├── cursor-glow.tsx, scroll-progress.tsx, back-to-top.tsx, command-palette.tsx
├── spotify-player.tsx / spotify-player-slot.tsx
├── github-contribution-graph.tsx, skills-matrix.tsx, projects-grid.tsx,
│   workbench.tsx, status-marquee.tsx, contact-section.tsx, easter-egg.tsx
└── social-icons.tsx

lib/      # github.ts, lanyard.ts, lanyard-presence.ts (shared real-time
          #   WebSocket), notion-blog.ts, medium-blog.ts, blog-data.tsx,
          # cv-data.ts (in constants/), themes.ts, site.ts, structured-data.ts,
          # fuzzy.ts, hero-utils.ts, use-in-view.ts, use-is-mounted.ts,
          # use-live-github-activity.ts (30s activity poll), utils.ts
constants/cv-data.ts            # All CV content (bilingual), typed by types/cv.ts
scripts/  # generate-og-images.mjs, optimize-images.mjs
docs/     # This documentation set
```

## Data Flow

```
Static content (constants/cv-data.ts, lib/blog-data.tsx)
        ↓
Route component (app/…)            ← async data fetch (GitHub, Notion, Lanyard)
        ↓
Page-specific component (components/public/…)
        ↓
Base UI primitives (components/ui)
```

- **GitHub data** (`lib/github.ts`): repos, WIP items, recent activity, and the
  contribution calendar are fetched on the server with `next.revalidate`
  (1h) plus a 2-minute in-memory cache, and every call falls back to curated
  static data (including a deterministic PRNG-generated contribution heatmap)
  when the API is unreachable or rate-limited.
- **Blog** (`lib/notion-blog.ts` + `lib/medium-blog.ts`): Notion is the CMS
  with bundled posts in `lib/blog-data.tsx` as the offline fallback; Medium
  posts are merged in and de-duplicated.
- **Presence widgets** (`lib/lanyard-presence.ts`): the Discord status card
  and the Spotify player share ONE real-time Lanyard WebSocket — ref-counted
  (opens with the first subscriber, closes with the last), heartbeat + 5s→30s
  backoff reconnect. No more REST polling; presence changes push instantly.
  The player itself stays a deferred, memoized client widget to avoid
  hydration cost.
- **GitHub activity**: the hero terminal and workbench pages poll
  `/api/activity` every 30s. The route wraps `getGithubRecentActivity()`
  (server-side, `GITHUB_TOKEN`-aware, 2-min in-memory + 15-min ISR cache with
  curated fallback) so refreshes are cheap and never trip the unauthenticated
  GitHub rate limit.

## Client vs Server Components

Server-first by default. `"use client"` is used only where interactivity
requires it (menu state, theme, language, terminal, forms, observers). Static
sections such as the projects grid and skills matrix stay presentational.

## Styling & Theming

- All design tokens are CSS variables in `app/globals.css` (`:root` light,
  `.dark` dark), exposed through Tailwind v4's `@theme inline` block so
  utilities like `bg-primary` / `text-muted-foreground` map to them.
- `next-themes` toggles the `.dark` class; custom color themes
  (`lib/themes.ts`) swap the same variables at runtime via `theme-changer`.
- Language is orthogonal to theme: `LanguageProvider` reads a cookie on the
  server (for SSR-correct text) and `localStorage` on the client.

## Performance Patterns

- ISR revalidation + short in-memory caches to keep API pressure low.
- `content-visibility-auto` on below-the-fold sections (smooth long-page
  scrolling), deferred heavy widgets, memoized markdown parsing.
- Cursor glow updates DOM style directly (zero re-renders).
- Next.js font loader with `display: swap` for Geist + Geist Mono.

## Security Notes

- Blog HTML is sanitized before rendering.
- Webhook URLs for contact/newsletter are validated (SSRF guard) and the
  routes return `501` by default until configured.
- `next.config.mjs` keeps `ignoreBuildErrors: false` and type-checking on.

## Scalability Notes

Fine at the current scale (personal portfolio, <50 posts). If the blog grows
past ~30–50 posts, migrate bundled posts to MDX files or keep Notion as the
single source of truth. Comments, auth, or an admin dashboard would warrant a
database; see `docs/improvement-checklist.md`.

---

**Last updated**: August 2026
