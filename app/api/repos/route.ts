import { NextResponse } from "next/server";
import { getGithubRepos } from "@/lib/github";

export const dynamic = "force-dynamic";

/**
 * Live GitHub repos / projects list.
 *
 * Thin wrapper over `getGithubRepos()`, which keeps its own in-memory
 * (2 min) + ISR (1 h) caching and falls back to curated static projects
 * when GitHub is unreachable.
 *
 * Project grids poll this route every 60s instead of calling
 * `api.github.com` directly from the browser: it honors `GITHUB_TOKEN`
 * when set, stays well inside the unauthenticated rate limit thanks to
 * the server-side cache, and keeps repo mapping in one place.
 */
export async function GET() {
	return NextResponse.json(await getGithubRepos());
}
