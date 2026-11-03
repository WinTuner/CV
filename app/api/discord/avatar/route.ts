import { DISCORD_USER_ID } from "@/lib/site";

/**
 * Same-origin proxy for Discord avatar assets.
 *
 * Discord serves these from `cdn.discordapp.com`, which answers through
 * Cloudflare and sets a `__cf_bm` third-party cookie — Lighthouse flags that as
 * a best-practices failure. Streaming the bytes through our own origin avoids
 * the cookie entirely and lets us cache for a day.
 *
 * `kind` is limited to avatar/decoration and every id is validated against the
 * Discord asset format, so this cannot be used as an open proxy.
 */
const ASSET_ID = /^a_[0-9a-f]{32}$/;
const AVATAR_ID = /^(a_)?[0-9a-f]{32}$/;
const USER_ID = /^\d{17,20}$/;

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const kind = searchParams.get("kind");
	const id = searchParams.get("id") ?? "";
	const user = searchParams.get("user") ?? DISCORD_USER_ID;

	let upstream: string;
	if (kind === "decoration" && ASSET_ID.test(id)) {
		upstream = `https://cdn.discordapp.com/avatar-decoration-presets/${id}.png?size=96`;
	} else if (kind === "avatar" && AVATAR_ID.test(id) && USER_ID.test(user)) {
		const ext = id.startsWith("a_") ? "gif" : "png";
		upstream = `https://cdn.discordapp.com/avatars/${user}/${id}.${ext}?size=160`;
	} else {
		return new Response("Bad request", { status: 400 });
	}

	const response = await fetch(upstream, { next: { revalidate: 86_400 } });
	if (!response.ok) {
		return new Response("Not found", { status: 404 });
	}

	return new Response(response.body, {
		headers: {
			"Content-Type": response.headers.get("content-type") ?? "image/png",
			"Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
		},
	});
}
