"use client";

import { useEffect, useState } from "react";

/**
 * Seasonal Halloween decoration: drifting bats, two pumpkin-orange glows and
 * a corner cobweb. Purely decorative (`aria-hidden`, pointer-events none) and
 * only mounted during the Halloween window (Oct 24 – Nov 1) so the rest of the
 * year is untouched. No text or color tokens change, so contrast is unaffected.
 */
const HALLOWEEN_MONTH = 9; // October (0-based)
const HALLOWEEN_START_DAY = 24;
const HALLOWEEN_END_MONTH = 10; // November
const HALLOWEEN_END_DAY = 1;

export function isHalloweenWindow(now: Date) {
	const month = now.getMonth();
	const day = now.getDate();
	return (
		(month === HALLOWEEN_MONTH && day >= HALLOWEEN_START_DAY) ||
		(month === HALLOWEEN_END_MONTH && day <= HALLOWEEN_END_DAY)
	);
}

const BATS = [1, 2, 3, 4, 5] as const;

export function HalloweenLayer() {
	const [active, setActive] = useState(false);

	useEffect(() => {
		// The date only exists on the client; mounting after hydration keeps the
		// server render (and every non-Halloween visit) free of this decoration.
		// eslint-disable-next-line react-hooks/set-state-in-effect -- date is client-only
		if (isHalloweenWindow(new Date())) setActive(true);
	}, []);

	useEffect(() => {
		if (!active) return;
		document.documentElement.dataset.halloween = "true";
		return () => {
			delete document.documentElement.dataset.halloween;
		};
	}, [active]);

	if (!active) return null;

	return (
		<div aria-hidden="true" className="halloween print:hidden">
			<span className="halloween-glow halloween-glow-left" />
			<span className="halloween-glow halloween-glow-right" />
			<svg className="halloween-web" viewBox="0 0 120 120" fill="none" stroke="currentColor">
				<path d="M0 0h120M0 0l120 120M0 0l-4 60M0 0l24 96M0 0l60 60M0 0l-30-30" />
				<path d="M40 0a40 40 0 0 1-40 40M80 0a80 80 0 0 1-80 80M20 0a20 20 0 0 1-20 20" />
			</svg>
			{BATS.map((bat) => (
				<span key={bat} className={`halloween-bat halloween-bat-${bat}`}>
					<svg viewBox="0 0 64 30" fill="currentColor">
						<path d="M32 5c3 0 5 2 5 4.6 0 1.9-.8 3.6-1.9 4.7 5.2-4 12.4-6.2 19.4-4.1-3.3 3.7-6 7-6 10.7 0 3.4-3 6.1-6.8 6.1-2.7 0-4.6-1.5-5.9-3.5-1 1.7-2.4 2.9-3.8 2.9s-2.8-1.2-3.8-2.9c-1.3 2-3.2 3.5-5.9 3.5C19.4 27 16 24.3 16 20.9c0-3.7-2.7-7-6-10.7 7-2.1 14.2.1 19.4 4.1C28.3 13.2 27.5 11.5 27.5 9.6 27.5 7 29.5 5 32 5z" />
					</svg>
				</span>
			))}
		</div>
	);
}
