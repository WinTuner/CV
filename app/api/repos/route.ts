import { NextResponse } from "next/server";
import { getGithubRepos } from "@/lib/github";

// Cached at the CDN for 30s, then revalidated in the background: the
// response is the same for every visitor, so this keeps polls cheap.
export const revalidate = 30;

/**
 * Live GitHub repos / projects list.
 *
 * Thin wrapper over `getGithubRepos()`, which keeps its own in-memory
 * (10 min) + ISR (1 h) caching and falls back to curated static projects
 * when GitHub is unreachable.
 *
 * Project grids poll this route every 60s instead of calling
 * `api.github.com` directly from the browser: it honors `GITHUB_TOKEN`
 * when set, stays well inside the unauthenticated rate limit thanks to
 * the server-side cache, and keeps repo mapping in one place.
 */
export async function GET() {
	return NextResponse.json(await getGithubRepos(), {
		headers: { "Cache-Control": "public, max-age=30, s-maxage=120, stale-while-revalidate=600" },
	});
}
