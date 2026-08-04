"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Observe when an element scrolls into view (fires once).
 *
 * Returns a ref to attach to the element and whether it has ever been
 * intersecting. Stops observing after the first intersection, so it is
 * safe to gate entrance animations on it (items stay visible once shown).
 *
 * Respects `prefers-reduced-motion`: when the user prefers reduced motion,
 * the element is treated as immediately visible.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
	options?: IntersectionObserverInit,
) {
	const ref = useRef<T>(null);
	const [isInView, setIsInView] = useState(false);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			// Intentional: reduced-motion users get content immediately, no animation gate
			// eslint-disable-next-line react-hooks/set-state-in-effect -- by design
			setIsInView(true);
			return;
		}

		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setIsInView(true);
				observer.disconnect();
			}
		}, options);

		observer.observe(element);
		return () => observer.disconnect();
		// eslint-disable-next-line react-hooks/exhaustive-deps -- options is configuration, re-observe on change is not needed
	}, []);

	return { ref, isInView };
}
