import { NextResponse } from "next/server";
import { getGithubRecentActivity } from "@/lib/github";

export const dynamic = "force-dynamic";

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
	return NextResponse.json(await getGithubRecentActivity());
}
