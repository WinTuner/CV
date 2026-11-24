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
 * Lenis ships in its own lazy chunk and boots once the page is idle, so the
 * very first wheel gets the same glide as every later one. Interaction events
 * boot it earlier if the user moves before idle fires.
 *
 * - `lerp: 0.15` glides without lagging behind the wheel.
 * - `anchors: { offset: -88 }` keeps `#projects` / `#experience` jumps clear
 *   of the fixed header, same offset as the CSS `scroll-margin-top`.
 * - Skipped entirely for `prefers-reduced-motion` users.
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

		// Safari lacks requestIdleCallback; fall back to a short timer.
		const idle = (
			window as unknown as {
				requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
			}
		).requestIdleCallback;
		const idleHandle = idle ? idle(boot, { timeout: 2000 }) : window.setTimeout(boot, 1200);

		for (const name of BOOT_EVENTS) {
			window.addEventListener(name, boot, { passive: true });
		}

		return () => {
			cancelled = true;
			cleanupListeners();
			if (idle) {
				window.cancelIdleCallback(idleHandle);
			} else {
				window.clearTimeout(idleHandle);
			}
			window.__lenis = undefined;
			lenis?.destroy();
		};
	}, []);

	return null;
}
