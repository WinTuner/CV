"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../language-provider";
import { roles } from "@/lib/hero-utils";

/**
 * Self-contained typewriter effect for the serif headline accent line.
 *
 * Lives in its own component so the per-character state updates (roughly every
 * 100ms) re-render only this tiny span — never the whole hero section.
 */
export function HeroTypewriter() {
	const { language } = useLanguage();
	const currentRoles = roles[language];
	const [currentRole, setCurrentRole] = useState(0);
	const [displayText, setDisplayText] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		const targetText = currentRoles[currentRole];
		const timeout = setTimeout(
			() => {
				if (!isDeleting) {
					if (displayText.length < targetText.length) {
						setDisplayText(targetText.slice(0, displayText.length + 1));
					} else {
						setTimeout(() => setIsDeleting(true), 2200);
					}
				} else {
					if (displayText.length > 0) {
						setDisplayText(displayText.slice(0, -1));
					} else {
						setIsDeleting(false);
						setCurrentRole((prev) => (prev + 1) % currentRoles.length);
					}
				}
			},
			isDeleting ? 40 : 90,
		);
		return () => clearTimeout(timeout);
	}, [displayText, isDeleting, currentRole, currentRoles]);

	return (
		<span className="font-serif italic inline-block min-h-[1.15em] bg-gradient-to-r from-primary via-primary to-chart-2 bg-clip-text text-transparent">
			{displayText || "\u00A0"}
			<span className="typing-caret" aria-hidden="true" />
		</span>
	);
}
