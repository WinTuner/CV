"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
	interface Window {
		__lenis?: Lenis;
	}
}

/**
 * Buttery inertial smooth-scroll for the whole site (Lenis).
 *
 * - `autoRaf: true` drives its own rAF loop — no manual loop needed.
 * - `lerp: 0.15` glides without lagging behind the wheel (0.1 felt buttery
 *   but sluggish).
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

		const lenis = new Lenis({
			autoRaf: true,
			// 0.15 tracks the wheel tightly (snappy) while keeping the glide.
			// 0.1 felt buttery but laggy — the "smooth but slow" complaint.
			lerp: 0.15,
			smoothWheel: true,
			anchors: {
				offset: -88,
			},
		});
		window.__lenis = lenis;

		return () => {
			window.__lenis = undefined;
			lenis.destroy();
		};
	}, []);

	return null;
}
