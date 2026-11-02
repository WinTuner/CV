import { NextResponse } from "next/server";
import { DISCORD_USER_ID } from "@/lib/site";

/**
 * Presence proxy for the hero Discord card.
 *
 * The browser must not call Lanyard directly: that cross-origin request makes
 * Lighthouse flag a third-party cookie (Cloudflare's `__cf_bm`) and forces a
 * CSP `connect-src` exception. Proxying keeps the call same-origin and lets
 * the CDN cache it for 30s.
 */
export const revalidate = 30;

export async function GET() {
	if (!DISCORD_USER_ID) {
		return NextResponse.json({ error: "not configured" }, { status: 404 });
	}

	try {
		const response = await fetch(
			`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`,
			{ next: { revalidate: 30 } },
		);
		if (!response.ok) {
			return NextResponse.json({ error: "lanyard unavailable" }, { status: 502 });
		}

		const json = (await response.json()) as {
			data?: {
				discord_user?: {
					id?: string;
					username?: string;
					global_name?: string | null;
					avatar?: string | null;
				};
				discord_status?: string;
				activities?: Array<{ type: number; name: string }>;
			};
		};
		const data = json.data;
		if (!data?.discord_user?.id) {
			return NextResponse.json({ error: "no presence" }, { status: 502 });
		}

		return NextResponse.json(
			{
				id: data.discord_user.id,
				name: data.discord_user.global_name || data.discord_user.username,
				avatar: data.discord_user.avatar ?? null,
				status: data.discord_status ?? "offline",
				activities: (data.activities ?? []).map((a) => ({
					type: a.type,
					name: a.name,
				})),
			},
			{
				headers: {
					"Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=600",
				},
			},
		);
	} catch {
		return NextResponse.json({ error: "unreachable" }, { status: 502 });
	}
}
