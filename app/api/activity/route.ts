import { NextResponse } from "next/server";
import { getGithubRecentActivity } from "@/lib/github";

// Cached at the CDN for 30s, then revalidated in the background: the
// response is the same for every visitor, so this keeps polls cheap.
export const revalidate = 30;

/**
 * Live GitHub activity for the terminal widget and the workbench page.
 *
 * Thin wrapper over `getGithubRecentActivity()`, which keeps its own
 * in-memory (2 min) + ISR (15 min) caching and falls back to curated
 * static activity when GitHub is unreachable.
 *
 * The widgets poll this route every 30s instead of calling
 * `api.github.com` directly from the browser: it honors `GITHUB_TOKEN`
 * when set, stays well inside the unauthenticated rate limit thanks to
 * the server-side cache, and keeps PR/commit parsing in one place.
 */
export async function GET() {
	return NextResponse.json(await getGithubRecentActivity(), {
		headers: { "Cache-Control": "public, max-age=15, s-maxage=60, stale-while-revalidate=300" },
	});
}
