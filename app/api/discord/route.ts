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

interface LanyardActivity {
	type: number;
	name: string;
	details?: string;
	state?: string;
}

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
					avatar_decoration_data?: { asset?: string } | null;
				};
				discord_status?: string;
				activities?: LanyardActivity[];
				listening_to_spotify?: boolean;
				spotify?: {
					song?: string;
					artist?: string;
					album?: string;
					album_art_url?: string;
					timestamps?: { start?: number; end?: number };
				} | null;
			};
		};
		const data = json.data;
		if (!data?.discord_user?.id) {
			return NextResponse.json({ error: "no presence" }, { status: 502 });
		}

		const spotify =
			data.listening_to_spotify && data.spotify?.song
				? {
						song: data.spotify.song,
						artist: data.spotify.artist ?? "",
						albumArt: data.spotify.album_art_url ?? null,
						start: data.spotify.timestamps?.start ?? null,
						end: data.spotify.timestamps?.end ?? null,
					}
				: null;

		return NextResponse.json(
			{
				id: data.discord_user.id,
				name: data.discord_user.global_name || data.discord_user.username,
				username: data.discord_user.username,
				avatar: data.discord_user.avatar ?? null,
				decoration: data.discord_user.avatar_decoration_data?.asset ?? null,
				status: data.discord_status ?? "offline",
				spotify,
				activities: (data.activities ?? [])
					.filter((a) => a.type !== 2 && a.type !== 4)
					.map((a) => ({ type: a.type, name: a.name, details: a.details ?? null })),
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
