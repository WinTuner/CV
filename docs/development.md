# Development Workflow

## Getting Started

Prerequisites: **Node.js 22+** and **npm** (the lockfile is `package-lock.json`).

```bash
npm install
npm run dev        # http://localhost:3000
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (`eslint .`) |
| `npm test` | Vitest (unit + component tests) |
| `npm run analyze` | Bundle analysis (`ANALYZE=true next build` via `@next/bundle-analyzer`) |

Before pushing, run the same gates CI runs:

```bash
npx tsc --noEmit && npm run lint && npm test
```

## Conventions

- **Server-first**: don't add `"use client"` unless the component needs
  hooks, event handlers, or browser APIs.
- **Tabs** for indentation; existing style is tabs everywhere.
- **`cn()`** (`@/lib/utils`) composes Tailwind classes — use it for
  conditional styles.
- **Bilingual copy**: UI text lives in a `{ en, th }` object inside the
  component, selected via `useLanguage()`. Never hardcode English strings.
- **Theme tokens**: use semantic utilities (`bg-card`, `text-muted-foreground`,
  `border-border`, `text-primary`…). Custom colors are CSS variables in
  `app/globals.css`, exposed through `@theme inline`.
- **Animation classes**: reuse the named utilities in `globals.css`
  (`animate-fade-in-up`, `animate-shine`, `hover-lift`, `glass`, …) instead
  of inventing new keyframes.

## Editing Content

### CV / Resume content

All CV data lives in `constants/cv-data.ts` as `{ en, th }` maps typed by
`types/cv.ts`. Add experiences, awards, certifications, leadership entries,
or education there — the `/introduction` page renders it automatically.

### Blog posts

Two sources:

1. **Bundled posts**: `lib/blog-data.tsx` — add a `BlogPost` object
   (title, excerpt, markdown `content`, date, category, tags).
2. **Notion** (when `NOTION_API_KEY` is set): create a page in the connected
   database; schema is defined in `lib/notion-blog.ts`.

Medium posts merge automatically from the RSS feed URL hardcoded in
`lib/medium-blog.ts` (edit `FEED_URL` there to change the Medium account).

### Projects

GitHub repos drive `/projects` and the homepage grid through
`lib/github.ts` (category/status heuristics + curated descriptions for known
repos). To pin a specific repo's blurb, extend the `repo.name` special-cases
in `getGithubRepos()`, or edit the `fallbackProjects` array used offline.

### Interactive terminal

`components/hero/terminal-widget.tsx` — the CLI commands live in
`runCliCommand()`. Add a `case` for a new command and a line in the `help`
output. Quick links are the `links` map inside the `open` case.

## Adding a Page

1. Create `app/(public)/<route>/page.tsx` with `metadata` + `generateMetadata`.
2. Add a page-specific component under `components/public/<route>/`.
3. Register the link in `components/header.tsx` (`navItems`).

## Testing

- Unit/component tests live next to their subjects:
  `lib/__tests__/` and `components/__tests__/` (Vitest + Testing Library).
- Add a `?print=true`-style param test if you touch the resume print flow.
- Keep the existing tests green: `npm test`.

---

**Last updated**: August 2026
