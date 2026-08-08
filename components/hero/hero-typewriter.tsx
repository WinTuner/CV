"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../language-provider";
import { roles } from "@/lib/hero-utils";

/**
 * Self-contained typewriter effect.
 *
 * Lives in its own component so the per-character state updates (roughly every
 * 100ms) re-render only this tiny span — never the whole hero section, its
 * terminal widget, or the Discord card below it.
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
						setTimeout(() => setIsDeleting(true), 2000);
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
			isDeleting ? 50 : 100,
		);
		return () => clearTimeout(timeout);
	}, [displayText, isDeleting, currentRole, currentRoles]);

	return (
		<span className="bg-gradient-to-l from-primary/50 to-accent text-transparent bg-clip-text typing-cursor inline-block min-h-[1.2em]">
			{displayText || "\u00A0"}
		</span>
	);
}
