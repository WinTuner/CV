import { NextResponse } from "next/server";
import { getGithubContributions } from "@/lib/github";

export const dynamic = "force-dynamic";

/**
 * Live GitHub contribution calendar.
 *
 * Thin wrapper over `getGithubContributions()`, which keeps its own
 * in-memory (2 min) + ISR (1 h) caching and falls back to a deterministic
 * offline heatmap when GitHub is unreachable or no token is set.
 *
 * The contribution graph polls this route every 60s instead of calling
 * GitHub GraphQL directly from the browser: it honors `GITHUB_TOKEN`
 * when set, stays inside rate limits thanks to the server-side cache,
 * and keeps calendar mapping in one place.
 */
export async function GET() {
	return NextResponse.json(await getGithubContributions());
}
