"use client"

import dynamic from "next/dynamic"

/**
 * Deferred mount for the Spotify player.
 *
 * The player only appears after the user scrolls away from the top, so
 * its chunk + hydration are deferred until the client mounts — keeping
 * it out of the initial JS payload and hydration work on every page.
 */
const SpotifyPlayerLazy = dynamic(
	() => import("./spotify-player").then((m) => m.SpotifyPlayer),
	{ ssr: false },
)

export function SpotifyPlayerSlot() {
	return <SpotifyPlayerLazy />
}
