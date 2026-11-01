"use client";

import { useEffect, useState } from "react";

/**
 * Seasonal Christmas decoration: slow snowfall over two soft glows (icy blue
 * and warm gold). Purely decorative (`aria-hidden`, pointer-events none) and
 * only mounted during the Christmas window (Nov 1 – Jan 6) so the rest of the
 * year is untouched. No text or color tokens change, so contrast is unaffected.
 */
const WINDOW_START_MONTH = 10; // November (0-based)
const WINDOW_START_DAY = 1;
const WINDOW_END_MONTH = 0; // January
const WINDOW_END_DAY = 6;

export function isChristmasWindow(now: Date) {
	const month = now.getMonth();
	const day = now.getDate();
	return (
		(month === WINDOW_START_MONTH && day >= WINDOW_START_DAY) ||
		month === 11 ||
		(month === WINDOW_END_MONTH && day <= WINDOW_END_DAY)
	);
}

// Deterministic so the snowfall is identical between renders and cheap on
// mobile: 24 flakes, speckled across the viewport.
const FLAKES = Array.from({ length: 24 }, (_, i) => ({
	left: (i / 24) * 100 + ((i * 37) % 4),
	size: 3 + ((i * 7) % 7),
	duration: 12 + ((i * 5) % 16),
	delay: -((i * 3) % 20),
	drift: ((i * 13) % 80) - 40,
	opacity: 0.55 + ((i * 11) % 4) * 0.12,
}));

export function ChristmasLayer() {
	const [active, setActive] = useState(false);

	useEffect(() => {
		// The date only exists on the client; mounting after hydration keeps the
		// server render (and every off-season visit) free of this decoration.
		// eslint-disable-next-line react-hooks/set-state-in-effect -- date is client-only
		if (isChristmasWindow(new Date())) setActive(true);
	}, []);

	useEffect(() => {
		if (!active) return;
		document.documentElement.dataset.christmas = "true";
		return () => {
			delete document.documentElement.dataset.christmas;
		};
	}, [active]);

	if (!active) return null;

	return (
		<div aria-hidden="true" className="christmas print:hidden">
			<span className="christmas-glow christmas-glow-cool" />
			<span className="christmas-glow christmas-glow-warm" />
			{FLAKES.map((flake) => (
				<span
					key={flake.left}
					className="christmas-flake"
					style={{
						left: `${flake.left}%`,
						fontSize: `${flake.size + 9}px`,
						opacity: flake.opacity,
						animationDuration: `${flake.duration}s`,
						animationDelay: `${flake.delay}s`,
						["--drift" as string]: `${flake.drift}px`,
					}}
				>
					❄
				</span>
			))}		</div>
	);
}
