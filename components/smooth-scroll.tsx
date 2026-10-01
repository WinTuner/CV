"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

declare global {
	interface Window {
		__lenis?: Lenis;
	}
}

/**
 * Buttery inertial smooth-scroll for the whole site (Lenis).
 *
 * Loaded lazily and started idle so it never taxes first paint: Lenis ships
 * in its own chunk (dynamic `import`, off the first-load bundle) and boots
 * on `requestIdleCallback`. Before it arrives, anchor jumps and BackToTop
 * fall back to native CSS `scroll-behavior: smooth` — same feel, zero cost.
 *
 * - `lerp: 0.15` glides without lagging behind the wheel.
 * - `anchors: { offset: -88 }` keeps `#projects` / `#experience` jumps clear
 *   of the fixed header, same offset as the CSS `scroll-margin-top`.
 * - Skipped entirely for `prefers-reduced-motion` users and before hydration.
 * - The instance is exposed on `window.__lenis` so one-off buttons
 *   (e.g. BackToTop) can scroll through Lenis instead of jumping natively.
 */
export function SmoothScroll() {
	useEffect(() => {
		if (typeof window === "undefined") return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const idleWindow = window as unknown as Window & {
			requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
			cancelIdleCallback?: (id: number) => void;
		};

		let lenis: Lenis | undefined;
		let cancelled = false;

		const init = () => {
			import("lenis").then(({ default: LenisClass }) => {
				if (cancelled) return;
				lenis = new LenisClass({
					autoRaf: true,
					lerp: 0.15,
					smoothWheel: true,
					anchors: {
						offset: -88,
					},
				});
				window.__lenis = lenis;
			});
		};

		let cancelIdle: (() => void) | undefined;
		if (typeof idleWindow.requestIdleCallback === "function") {
			const id = idleWindow.requestIdleCallback(init, { timeout: 1200 });
			cancelIdle = () => idleWindow.cancelIdleCallback?.(id);
		} else {
			const id = window.setTimeout(init, 250);
			cancelIdle = () => window.clearTimeout(id);
		}

		return () => {
			cancelled = true;
			cancelIdle?.();
			window.__lenis = undefined;
			lenis?.destroy();
		};
	}, []);

	return null;
}
