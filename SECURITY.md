# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| `main` (latest) | ✅ |

Only the latest commit on `main` receives security fixes. Patches are applied
to the codebase here and deployed to the live site.

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Preferred: use **GitHub private vulnerability reporting** on this repository
(Repo → Security → Report a vulnerability). If that's unavailable, email
[Thanatphong2719@gmail.com](mailto:Thanatphong2719@gmail.com) with the subject
`[SECURITY] <short summary>`.

Please include:

- The affected file(s) and a minimal reproduction, if possible.
- The impact you observed (e.g. "env var leaked to the client", "webhook SSRF").
- Whether it affects the deployed site, local development, or both.

You should receive an acknowledgment within 3–5 business days.

## What this project considers a vulnerability

- Exposure of server-only environment variables (`GITHUB_TOKEN`,
  `NOTION_API_KEY`, `NOTION_DATABASE_ID`, webhook URLs, `UPSTASH_*`) to
  clients or logs.
- Server-Side Request Forgery (SSRF) via the `/api/contact` or `/api/subscribe`
  webhook targets.
- Unsafe HTML/script injection in blog content rendering (posts are sanitized
  before rendering — a bypass would qualify).
- Cross-site scripting (XSS) or open-redirect in any user-controlled input.

## Non-goals / out of scope

- The site intentionally publishes personal CV information — that content is
  meant to be public.
- Rate-limit friction with the GitHub API or Lanyard from normal visitors is a
  known constraint, not a vulnerability.

## Safe defaults

- `.env*` files are gitignored; `.env.example` contains placeholders only.
- `/api/contact` and `/api/subscribe` return `501` until webhook URLs are
  configured, and validated (SSRF guard) when they are.
- `next.config.mjs` keeps type-checking on (`ignoreBuildErrors: false`).

Thank you for helping keep the project safe!
