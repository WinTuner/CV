import { NextResponse } from "next/server";
import { getGithubWipItems } from "@/lib/github";

// Cached at the CDN for 30s, then revalidated in the background: the
// response is the same for every visitor, so this keeps polls cheap.
export const revalidate = 30;

/**
 * Live GitHub workbench / WIP list (top 3 active repos).
 *
 * Thin wrapper over `getGithubWipItems()`, which keeps its own in-memory
 * (10 min) + ISR (1 h) caching and falls back to curated static items
 * when GitHub is unreachable.
 *
 * Workbench sections poll this route every 60s instead of calling
 * `api.github.com` directly from the browser: it honors `GITHUB_TOKEN`
 * when set, stays well inside the unauthenticated rate limit thanks to
 * the server-side cache, and keeps WIP mapping in one place.
 */
export async function GET() {
	return NextResponse.json(await getGithubWipItems(), {
		headers: { "Cache-Control": "public, max-age=30, s-maxage=120, stale-while-revalidate=600" },
	});
}
