<!-- generated-by: gsd-doc-writer -->
# API

The site exposes eight route handlers under `app/api/`. Six are read-only `GET`s that serve data already cached server-side, and two are `POST`s used by the contact form and newsletter form. Every handler is a thin wrapper: validation and rate limiting live in the route file, data fetching and caching live in `lib/github.ts`, `lib/notion-blog.ts`, and `lib/security.ts`.

There is no OpenAPI/Swagger spec and no API versioning — these routes exist to serve this site's own client components (terminal widget, workbench, project grid, contribution graph, command palette) rather than third-party consumers.

## Authentication

None. Every endpoint is public and accepts anonymous requests.

The GitHub and Notion credentials (`GITHUB_TOKEN`, `NOTION_*`) are read server-side inside `lib/github.ts` and `lib/notion-blog.ts`; clients never send credentials and never talk to `api.github.com` directly. That is the reason these proxies exist — they keep tokens server-side and keep unauthenticated GitHub rate limits under control via server caching. See [CONFIGURATION.md](CONFIGURATION.md) for the variable list.

`GET /api/contributors` is the only endpoint that takes user-controlled input. `owner` and `repo` are constrained to `^[A-Za-z0-9_.-]{1,100}$` in both the route and `lib/github.ts`, so the route cannot be used as an open GitHub proxy.

## Endpoints overview

Base URL: the deployment origin (`NEXT_PUBLIC_SITE_URL`, default `https://thanatphong.is-a.dev`).

| Method | Path | Description | Auth Required | Rate limited |
| --- | --- | --- | --- | --- |
| GET | `/api/activity` | Recent GitHub activity (commits, PRs, repo creation) | No | No |
| GET | `/api/contributors` | Upstream repo contributor list (`?owner=&repo=`) | No | No |
| GET | `/api/contributions` | Contribution calendar (weeks of days + total) | No | No |
| GET | `/api/repos` | Live GitHub projects, newest push first | No | No |
| GET | `/api/search` | Search index: projects + localized blog posts | No | No |
| GET | `/api/wip` | Top 3 active repos as "work in progress" items | No | No |
| POST | `/api/contact` | Forward a contact-form submission to a webhook | No | Yes (5/min) |
| POST | `/api/subscribe` | Capture a newsletter email (webhook or Upstash Redis) | No | Yes (5/min) |

All handlers set `Content-Type: application/json`. Every response body is JSON, including errors.

## Request/response formats

### GET /api/activity

No parameters. Returns an array of `ActivityItem` (`lib/github.ts`):

```json
[
  {
    "type": "pr",
    "project": "AutoOS",
    "message": { "en": "Opened pull request", "th": "เปิด pull request" },
    "time": "2026-06-23T12:00:00Z",
    "prAction": "opened",
    "prTitle": "Add simulator telemetry hooks"
  }
]
```

`type` is one of `commit | pr | create | branch`; `message` is either a `{ en, th }` object or a plain string. `prAction` (`opened | closed | merged`) and `prTitle` appear only on PR items. Falls back to curated static activity when GitHub is unreachable.

- Route segment: `export const revalidate = 30`
- `Cache-Control: public, max-age=15, s-maxage=60, stale-while-revalidate=300`
- `lib/github.ts`: 10-minute in-memory cache + 15-minute upstream ISR

### GET /api/contributors

| Query param | Required | Validation |
| --- | --- | --- |
| `owner` | Yes | `^[A-Za-z0-9_.-]{1,100}$` |
| `repo` | Yes | `^[A-Za-z0-9_.-]{1,100}$` |

Missing or malformed values both return `400 {"error":"Invalid owner or repo"}`. Valid requests return an array of `Contributor` (max 24, bots filtered out):

```json
[
  {
    "login": "tinodin",
    "avatarUrl": "https://avatars.githubusercontent.com/u/...",
    "profileUrl": "https://github.com/tinodin",
    "contributions": 412
  }
]
```

Returns `[]` rather than an error when GitHub fails, so callers can render nothing.

```
GET /api/contributors?owner=tinodin&repo=AutoOS
```

- Route segment: `export const dynamic = "force-dynamic"`
- `Cache-Control: public, max-age=300, s-maxage=3600, stale-while-revalidate=86400`
- `lib/github.ts`: 1-hour in-memory cache + 1-hour upstream ISR

### GET /api/contributions

No parameters. Returns `Contributions`:

```json
{
  "weeks": [
    {
      "days": [
        { "date": "2026-06-21", "count": 3, "level": 2 }
      ]
    }
  ],
  "total": 486
}
```

`level` is `0 | 1 | 2 | 3 | 4`. Falls back to a deterministic offline heatmap when GitHub is unreachable or `GITHUB_TOKEN` is unset (the GraphQL contribution query needs a token).

- Route segment: `export const revalidate = 30`
- `Cache-Control: public, max-age=30, s-maxage=120, stale-while-revalidate=600`
- `lib/github.ts`: 10-minute in-memory cache + 1-hour upstream ISR

### GET /api/repos

No parameters. Returns an array of `Project` sorted by `pushed_at` descending:

```json
[
  {
    "id": 123456789,
    "title": "AutoOS",
    "description": "…",
    "tags": ["TypeScript", "Next.js"],
    "status": "in-progress",
    "category": "…",
    "year": "2026",
    "stars": 12,
    "forks": 3,
    "url": "https://github.com/WinTuner/AutoOS",
    "homepage": "https://…",
    "featured": true,
    "highlight": false,
    "fork": false
  }
]
```

`status` is `shipped | in-progress | archived`. `homepage`, `featured`, `highlight`, and `fork` are optional. Falls back to curated static projects when GitHub is unreachable.

- Route segment: `export const revalidate = 30`
- `Cache-Control: public, max-age=30, s-maxage=120, stale-while-revalidate=600`
- `lib/github.ts`: 10-minute in-memory cache + 1-hour upstream ISR

### GET /api/search

No query parameters. The response language comes from the `site-language` cookie, validated against the supported codes in `constants/languages.ts` (`en`, `th`, `ja`, `zh`); anything unsupported — including a missing cookie — falls back to `en`.

Returns `{ projects, posts }` using the same `Project` shape as `/api/repos` and the full `BlogPost` shape from `lib/blog-data.tsx` (`id`, `slug`, `title`, `excerpt`, `content`, `date`, `readTime`, `category`, `tags`, `author`, `featured`, `color`). Note that post bodies are included in full — the endpoint is intended for the command palette, which needs titles and excerpts, and no field projection is applied.

- Route segment: `export const dynamic = "force-dynamic"`
- No explicit `Cache-Control` header; the underlying `getGithubRepos()` / `getLocalizedBlogPostsFromBackend()` caches absorb repeat calls.

### GET /api/wip

No parameters. Returns an array of `WipItem` (top 3 active repos):

```json
[
  {
    "id": 123456789,
    "name": "AutoOS",
    "description": "…",
    "progress": 60,
    "lastUpdated": "2026-06-23T12:00:00Z",
    "url": "https://github.com/WinTuner/AutoOS",
    "branch": "main",
    "commits": 128
  }
]
```

`commits` is `null` when the commit count could not be read from GitHub. Falls back to curated static items when GitHub is unreachable.

- Route segment: `export const revalidate = 30`
- `Cache-Control: public, max-age=30, s-maxage=120, stale-while-revalidate=600`
- `lib/github.ts`: 10-minute in-memory cache + 1-hour upstream ISR

### POST /api/contact

Request body:

```json
{ "name": "Ada", "email": "ada@example.com", "message": "Hello, I'd like to talk about a project." }
```

| Field | Required | Validation |
| --- | --- | --- |
| `name` | Yes | Trimmed, non-empty, max 120 chars |
| `email` | Yes | Trimmed, lowercased, must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| `message` | Yes | Trimmed, 10–5000 chars |

Unparseable JSON → `400 {"error":"Invalid request body"}`. A `name` that is empty or longer than 120 chars returns `400 {"error":"Please enter your name."}`.

The submission is forwarded as `{ name, email, message }` to `CONTACT_WEBHOOK_URL` (any service accepting a JSON POST). Success: `200 {"success":true}`. The route does not persist submissions itself and returns nothing beyond the acknowledgement.

Backend behavior:

- `CONTACT_WEBHOOK_URL` unset → `501` plus `Cache-Control: no-store`
- URL not an absolute `https:` URL (`isSafeWebhookUrl`) → `500 {"error":"Contact service is misconfigured."}` — configuration error, not client error
- Non-2xx from the webhook → `502 {"error":"Could not send the message. Please try again later."}`
- Network failure → `502 {"error":"Contact service unreachable. Please try again later."}`

### POST /api/subscribe

Request body: `{ "email": "ada@example.com" }`. Trimmed and lowercased; must match the same `EMAIL_RE`. Success returns `200 {"success":true,"email":"ada@example.com"}`.

Two backends, checked in this order:

1. `NEWSLETTER_WEBHOOK_URL` — JSON POST of `{ email }`. Non-2xx → `502`, network failure → `502`, non-`https:` URL → `500 {"error":"Subscription service is misconfigured."}`
2. `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` — `RPUSH newsletter:subscribers <email>` against the Upstash REST API. Failure → `502`

If neither backend is configured: `501 {"error":"Subscription service is not ready yet. Check back soon!"}` with `Cache-Control: no-store`.

## Error codes

Errors are JSON: `{ "error": "human-readable message" }`. The two POST routes never cache errors.

| Status | Meaning | Where |
| --- | --- | --- |
| `200` | Success | All routes |
| `400` | Missing/invalid input — bad JSON body, bad email, name length, message length, or invalid `owner`/`repo` | `contact`, `subscribe`, `contributors` |
| `429` | Rate limit exceeded; includes `Retry-After` in seconds | `contact`, `subscribe` |
| `500` | Deployer misconfiguration — webhook URL is not a safe absolute `https:` URL | `contact`, `subscribe` |
| `501` | Feature not configured — the relevant environment variable(s) are unset | `contact`, `subscribe` |
| `502` | Upstream webhook/Redis failed or was unreachable | `contact`, `subscribe` |

The `GET` routes do not produce error responses for upstream GitHub/Notion failures; they return static fallbacks (repos, activity, WIP) or empty/offline data (contributors, contributions) with `200`.

## Rate limits

Only the two `POST` routes are throttled, via `checkRateLimit()` in `lib/security.ts`:

- Limit: **5 requests per 60-second sliding window**, per client key
- Key: first hop of `x-forwarded-for` plus the request path — `contact` and `subscribe` therefore have independent buckets
- Response on exceed: `429` with `Retry-After: <seconds>` (minimum 1)
- Storage: in-memory `Map` on `globalThis`, per server instance

This is best-effort abuse friction, not a guarantee: multiple instances (as on Vercel) each keep their own counters, and counters reset on cold start. When `x-forwarded-for` is absent the key falls back to `"unknown:<path>"`, so all such callers share one bucket — expected behind a normal proxy, visible when hitting a dev server directly without one.

The `GET` routes are not rate limited at the route level; their protection is caching plus the GitHub token. `GET /api/contributors` relies on input allow-listing instead of throttling.
