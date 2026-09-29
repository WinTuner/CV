import { NextResponse } from "next/server";
import { getRepoContributors } from "@/lib/github";

export const dynamic = "force-dynamic";

const NAME_PATTERN = /^[A-Za-z0-9_.-]{1,100}$/;

/**
 * Live contributor list for an upstream repo:
 * `GET /api/contributors?owner=tinodin&repo=AutoOS`.
 *
 * Thin wrapper over `getRepoContributors()`, which keeps its own
 * in-memory (2 min) + ISR (1 h) caching and returns [] when GitHub is
 * unreachable. Owner/repo are allow-listed to plain GitHub names so the
 * route cannot be abused as an open proxy.
 */
export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const owner = searchParams.get("owner") ?? "";
	const repo = searchParams.get("repo") ?? "";
	if (!NAME_PATTERN.test(owner) || !NAME_PATTERN.test(repo)) {
		return NextResponse.json({ error: "Invalid owner or repo" }, { status: 400 });
	}
	return NextResponse.json(await getRepoContributors(owner, repo));
}
