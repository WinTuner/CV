import { useEffect, useState } from "react";
import type { ActivityItem } from "./github";

/**
 * Shared 30s live-refresh for GitHub activity, used by the hero terminal
 * and the workbench "Recent Activity" panel.
 *
 * Polls the server-side `/api/activity` route, which serves a 2-min
 * in-memory cache (see `app/api/activity/route.ts`), so the refresh is
 * cheap and never trips the unauthenticated GitHub rate limit.
 *
 * @param initial Server-rendered activity to show before the first poll.
 * @param enabled When false, the widget keeps its current data and skips
 *   polling (e.g. the terminal only polls while a live tab is active).
 * @returns The activity list plus freshness metadata: `updatedAt` is the
 *   timestamp of the last successful refresh (or mount), `isLive` mirrors
 *   `enabled` so widgets can render an honest live/stale indicator.
 */
export function useLiveGithubActivity(
	initial: ActivityItem[],
	enabled = true,
): { activity: ActivityItem[]; updatedAt: number; isLive: boolean } {
	const [activity, setActivity] = useState<ActivityItem[]>(initial);
	const [updatedAt, setUpdatedAt] = useState<number>(() => Date.now());

	useEffect(() => {
		if (!enabled) return;

		const refresh = () => {
			fetch("/api/activity")
				.then((res) => {
					if (!res.ok) throw new Error("Status code " + res.status);
					return res.json();
				})
				.then((parsed) => {
					if (Array.isArray(parsed) && parsed.length > 0) {
						setActivity(parsed);
						setUpdatedAt(Date.now());
					}
				})
				.catch((err) =>
					console.warn(
						"Failed live activity refresh, keeping current list:",
						err,
					),
				);
		};

		refresh();
		const interval = setInterval(refresh, 30_000);
		return () => clearInterval(interval);
	}, [enabled]);

	return { activity, updatedAt, isLive: enabled };
}
