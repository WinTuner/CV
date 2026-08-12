"use client";

import { useEffect, useRef } from "react";

/**
 * Thin progress bar pinned to the top of the viewport that tracks how far the
 * page has been scrolled. Uses a rAF-throttled scroll handler and writes the
 * width directly to the DOM, so scrolling never triggers a re-render.
 */
export function ScrollProgress() {
	const barRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const bar = barRef.current;
		if (!bar) return;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			bar.style.display = "none";
			return;
		}

		let frame = 0;

		const update = () => {
			frame = 0;
			const scrollable =
				document.documentElement.scrollHeight - window.innerHeight;
			const progress =
				scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
			bar.style.width = `${Math.round(progress * 100)}%`;
		};

		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};

		update();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll, { passive: true });

		return () => {
			if (frame) cancelAnimationFrame(frame);
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, []);

	return (
		<div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5">
			<div
				ref={barRef}
				className="h-full w-0 bg-primary"
			/>
		</div>
	);
}
