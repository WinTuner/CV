import { NextResponse } from "next/server";
import { getGithubContributions } from "@/lib/github";

// Cached at the CDN for 30s, then revalidated in the background: the
// response is the same for every visitor, so this keeps polls cheap.
export const revalidate = 30;

/**
 * Live GitHub contribution calendar.
 *
 * Thin wrapper over `getGithubContributions()`, which keeps its own
 * in-memory (10 min) + ISR (1 h) caching and falls back to a deterministic
 * offline heatmap when GitHub is unreachable or no token is set.
 *
 * The contribution graph polls this route every 60s instead of calling
 * GitHub GraphQL directly from the browser: it honors `GITHUB_TOKEN`
 * when set, stays inside rate limits thanks to the server-side cache,
 * and keeps calendar mapping in one place.
 */
export async function GET() {
	return NextResponse.json(await getGithubContributions(), {
		headers: { "Cache-Control": "public, max-age=30, s-maxage=120, stale-while-revalidate=600" },
	});
}
