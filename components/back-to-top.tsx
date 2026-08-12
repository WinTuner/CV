"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { useLanguage } from "./language-provider";
import { cn } from "@/lib/utils";

/**
 * Floating "back to top" button. Appears after the user scrolls past a
 * threshold and uses a rAF-throttled scroll listener so it stays cheap.
 */
export function BackToTop() {
	const [visible, setVisible] = useState(false);
	const { language } = useLanguage();

	useEffect(() => {
		let frame = 0;

		const update = () => {
			frame = 0;
			setVisible(window.scrollY > 480);
		};

		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			if (frame) cancelAnimationFrame(frame);
			window.removeEventListener("scroll", onScroll);
		};
	}, []);

	return (
		<button
			type="button"
			onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			aria-label={language === "th" ? "กลับขึ้นด้านบน" : "Back to top"}
			className={cn(
				"fixed bottom-8 right-8 z-50 flex h-11 w-11 items-center justify-center border border-border/70 bg-card text-muted-foreground shadow-sm transition-all duration-300 hover:border-primary/50 hover:text-primary",
				visible
					? "translate-y-0 opacity-100"
					: "pointer-events-none translate-y-4 opacity-0",
			)}
		>
			<ChevronUp className="h-5 w-5" />
		</button>
	);
}
