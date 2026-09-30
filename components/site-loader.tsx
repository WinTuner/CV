"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const MIN_DISPLAY_MS = 900;
const MAX_WAIT_MS = 2600;
const FADE_MS = 450;

/**
 * Initial site splash — minimal editorial loader.
 *
 * Full-screen `bg-background` overlay with a serif wordmark and a thin
 * progress line. Fades out once the page finishes loading (or after a
 * bounded timeout so a slow asset never traps the visitor). Renders nothing
 * after the fade, and skips the delay for reduced-motion users.
 */
export function SiteLoader() {
	const [visible, setVisible] = useState(true);
	const [leaving, setLeaving] = useState(false);

	useEffect(() => {
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (reduced) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-shot dismiss after mount
			setVisible(false);
			return undefined;
		}
		const finish = () => setLeaving(true);
		let minTimer: ReturnType<typeof setTimeout> | undefined;
		const maxTimer: ReturnType<typeof setTimeout> = setTimeout(finish, MAX_WAIT_MS);

		const start = Date.now();
		const scheduleFinish = () => {
			const elapsed = Date.now() - start;
			const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
			minTimer = setTimeout(finish, wait);
		};

		if (document.readyState === "complete") {
			scheduleFinish();
		} else {
			window.addEventListener("load", scheduleFinish, { once: true });
		}

		return () => {
			window.removeEventListener("load", scheduleFinish);
			if (minTimer) clearTimeout(minTimer);
			clearTimeout(maxTimer);
		};
	}, []);

	useEffect(() => {
		if (!leaving) return;
		const t = setTimeout(() => setVisible(false), FADE_MS);
		return () => clearTimeout(t);
	}, [leaving]);

	if (!visible) return null;

	return (
		<div
			role="status"
			aria-label="Loading site"
			className={cn(
				"fixed inset-0 z-[90] flex flex-col items-center justify-center gap-5 bg-background transition-opacity duration-500",
				leaving && "pointer-events-none opacity-0",
			)}
		>
			<p className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
				WinTuner
			</p>
			<p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
				digital laboratory
			</p>
			<div className="h-px w-40 overflow-hidden bg-border">
				<div className="h-full w-full origin-left animate-site-loader-bar bg-primary" />
			</div>
		</div>
	);
}
