"use client";

import { useEffect } from "react";

/**
 * Mouse spotlight for `.spotlight-card` elements (project/workbench grids).
 *
 * Single delegated `mousemove` listener writes `--mx`/`--my` (px, relative
 * to the hovered card) consumed by the `.spotlight-card::before` radial
 * gradient in `globals.css`. Zero cost when idle, skipped entirely on
 * coarse pointers and lab audits (no mouse), and invisible under
 * `prefers-reduced-motion` via CSS.
 */
export function SpotlightTracker() {
	useEffect(() => {
		if (window.matchMedia("(pointer: coarse)").matches) return;
		const onMove = (event: MouseEvent) => {
			const target = event.target as HTMLElement | null;
			const card = target?.closest?.(".spotlight-card") as HTMLElement | null;
			if (!card) return;
			const rect = card.getBoundingClientRect();
			card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
			card.style.setProperty("--my", `${event.clientY - rect.top}px`);
		};
		document.addEventListener("mousemove", onMove, { passive: true });
		return () => {
			document.removeEventListener("mousemove", onMove);
		};
	}, []);
	return null;
}
