import { useEffect, useState } from "react";
import type { Contributions } from "./github";

/**
 * Shared 60s live-refresh for the GitHub contribution calendar, mirroring
 * `useLiveGithubActivity` (30s poll).
 *
 * Polls the server-side `/api/contributions` route, which serves a 2-min
 * in-memory cache + 1h ISR (`app/api/contributions/route.ts`), so the
 * refresh is cheap and never trips the GitHub GraphQL rate limit.
 * 60s (not 30s) because the calendar changes slowly and each upstream
 * fetch is a GraphQL call.
 *
 * @param initial Server-rendered calendar to show before the first poll.
 * @param enabled When false, keeps current data and skips polling.
 * @returns The calendar plus freshness metadata: `updatedAt` is the
 *   timestamp of the last successful refresh (or mount), `isLive` mirrors
 *   `enabled` so widgets can render an honest live/stale indicator.
 */
export function useLiveGithubContributions(
	initial: Contributions,
	enabled = true,
): { contributions: Contributions; updatedAt: number; isLive: boolean } {
	const [contributions, setContributions] = useState<Contributions>(initial);
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
			fetch("/api/contributions")
				.then((res) => {
					if (!res.ok) throw new Error("Status code " + res.status);
					return res.json();
				})
				.then((parsed) => {
					if (
						parsed &&
						Array.isArray(parsed.weeks) &&
						typeof parsed.total === "number"
					) {
						setContributions(parsed as Contributions);
						setUpdatedAt(Date.now());
					}
				})
				.catch((err) =>
					console.warn(
						"Failed live contributions refresh, keeping current calendar:",
						err,
					),
				);
		};

		refresh();
		const interval = setInterval(refresh, 60_000);
		return () => clearInterval(interval);
	}, [enabled]);

	return { contributions, updatedAt, isLive: enabled };
}
