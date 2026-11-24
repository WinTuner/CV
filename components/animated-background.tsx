/**
 * Fixed, full-viewport wallpaper: a faint dot grid and grain over the neutral
 * background. Painted behind all content via `-z-10`.
 */
export function AnimatedBackground() {
	return <div aria-hidden="true" className="bg-aurora print:hidden" />;
}
