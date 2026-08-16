/**
 * Fixed, full-viewport animated wallpaper: slow-drifting pastel gradient
 * orbs over a faint grain texture. Pure CSS (transform + opacity only) so
 * it stays GPU-composited and cheap on mobile. Colors inherit the theme
 * tokens, so it adapts to light/dark automatically. Painted behind all
 * content via `-z-10` and disabled under `prefers-reduced-motion`.
 */
export function AnimatedBackground() {
	return (
		<div aria-hidden="true" className="bg-aurora print:hidden">
			<div className="aurora-orb aurora-orb-1" />
			<div className="aurora-orb aurora-orb-2" />
			<div className="aurora-orb aurora-orb-3" />
		</div>
	);
}