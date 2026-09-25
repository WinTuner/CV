import { useEffect, useState } from "react";
import type { WipItem } from "./github";

/**
 * Shared 60s live-refresh for the GitHub workbench / WIP list, mirroring
 * `useLiveGithubContributions`.
 *
 * Polls the server-side `/api/wip` route, which serves a 2-min in-memory
 * cache + 1h ISR (`app/api/wip/route.ts`), so the refresh is cheap and
 * never trips the GitHub REST rate limit.
 *
 * @param initial Server-rendered WIP items to show before the first poll.
 * @param enabled When false, keeps current data and skips polling
 *   (e.g. pause while the section is offscreen via `useInView`).
 * @returns The WIP items plus freshness metadata: `updatedAt` is the
 *   timestamp of the last successful refresh (or mount), `isLive` mirrors
 *   `enabled` so widgets can render an honest live/stale indicator.
 */
export function useLiveGithubWip(
	initial: WipItem[],
	enabled = true,
): { wipItems: WipItem[]; updatedAt: number; isLive: boolean } {
	const [wipItems, setWipItems] = useState<WipItem[]>(initial);
	// Hydration-safe: initial 0 renders the static label on both server
	// and hydration HTML (`LivePill` hides the time while `updatedAt <= 0`).
	// The real timestamp is set in the effect below, which only runs on
	// the client after hydration — so the first paint always matches.
	const [updatedAt, setUpdatedAt] = useState<number>(0);

	useEffect(() => {
		if (!enabled) return;

		// eslint-disable-next-line react-hooks/set-state-in-effect -- post-hydration freshness stamp, not render input
		setUpdatedAt(Date.now());

		const refresh = () => {
			fetch("/api/wip")
				.then((res) => {
					if (!res.ok) throw new Error("Status code " + res.status);
					return res.json();
				})
				.then((parsed) => {
					if (Array.isArray(parsed) && parsed.length > 0) {
						setWipItems(parsed as WipItem[]);
						setUpdatedAt(Date.now());
					}
				})
				.catch((err) =>
					console.warn(
						"Failed live WIP refresh, keeping current list:",
						err,
					),
				);
		};

		refresh();
		const interval = setInterval(refresh, 60_000);
		return () => clearInterval(interval);
	}, [enabled]);

	return { wipItems, updatedAt, isLive: enabled };
}
