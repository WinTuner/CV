"use client";

import { useEffect, useState } from "react";

/**
 * Returns true after the component has hydrated on the client.
 *
 * Must stay false through the hydration render (first client render must
 * match server HTML), flipping to true only in a post-hydration effect.
 * `useSyncExternalStore(subscribe, () => true, () => false)` is NOT a
 * substitute here: on the client — including the hydration pass — React
 * reads `getSnapshot` (true) while the server rendered `getServerSnapshot`
 * (false), producing a hydration mismatch.
 */
export function useIsMounted(): boolean {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect -- intentional post-hydration flag, not derived render input
		setMounted(true);
	}, []);

	return mounted;
}
