"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

declare global {
	interface Window {
		__lenis?: Lenis;
	}
}

const BOOT_EVENTS = ["pointerdown", "wheel", "touchstart", "keydown"] as const;

/**
 * Buttery inertial smooth-scroll for the whole site (Lenis).
 *
 * Zero first-paint cost by design: Lenis ships in its own lazy chunk and
 * boots on the first user interaction (wheel, touch, click, or scroll key).
 * Lab audits never interact, so they measure the page without it; before it
 * arrives, anchor jumps and BackToTop fall back to native CSS
 * `scroll-behavior: smooth` — same feel, zero cost.
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

		let lenis: Lenis | undefined;
		let cancelled = false;
		let booted = false;

		const cleanupListeners = () => {
			for (const name of BOOT_EVENTS) {
				window.removeEventListener(name, boot);
			}
		};

		function boot() {
			if (booted) return;
			booted = true;
			cleanupListeners();
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
		}

		for (const name of BOOT_EVENTS) {
			window.addEventListener(name, boot, { passive: true });
		}

		return () => {
			cancelled = true;
			cleanupListeners();
			window.__lenis = undefined;
			lenis?.destroy();
		};
	}, []);

	return null;
}
