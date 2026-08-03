"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns true after the component has hydrated on the client.
 *
 * Replaces the `setMounted(true)`-inside-effect hydration guard, which
 * triggers `react-hooks/set-state-in-effect` (cascading render anti-pattern).
 * `useSyncExternalStore` is the sanctioned way to detect client hydration.
 */
export function useIsMounted(): boolean {
	return useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false,
	);
}
