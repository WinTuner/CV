"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const MIN_DISPLAY_MS = 350;
const MAX_WAIT_MS = 1800;
const FADE_MS = 350;
const VISITED_KEY = "wintuner:visited";

/**
 * Initial site splash — minimal editorial loader.
 *
 * Full-screen `bg-background` overlay with a serif wordmark and a thin
 * progress line. Shows only while the page is still loading (then fades out,
 * or after a bounded timeout so a slow asset never traps the visitor). When
 * hydration lands after everything already painted — fast loads and lab
 * audits — it dismisses immediately instead of holding a covering overlay
 * over the LCP. Renders nothing after the fade, and skips the delay for
 * reduced-motion users.
 */
export function SiteLoader() {
	const [visible, setVisible] = useState(true);
	const [leaving, setLeaving] = useState(false);

	useEffect(() => {
		try {
			// Repeat views in the same tab skip the splash — the reference
			// site paints instantly on every navigation, and so should we.
			if (sessionStorage.getItem(VISITED_KEY)) {
				// eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-shot dismiss after mount
				setVisible(false);
				return undefined;
			}
		} catch {
			// Private mode without storage — fall through to the normal splash.
		}
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (reduced) {
			 
			setVisible(false);
			return undefined;
		}
		const finish = () => {
			try {
				sessionStorage.setItem(VISITED_KEY, "1");
			} catch {
				// Ignore storage failures (private mode).
			}
			setLeaving(true);
		};
		let minTimer: ReturnType<typeof setTimeout> | undefined;
		const maxTimer: ReturnType<typeof setTimeout> = setTimeout(finish, MAX_WAIT_MS);

		const start = Date.now();
		const scheduleFinish = () => {
			const elapsed = Date.now() - start;
			const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
			minTimer = setTimeout(finish, wait);
		};

		if (document.readyState === "complete") {
			// Hydrated after the page (and its LCP) already painted — dismiss
			// at once instead of covering content for MIN_DISPLAY_MS.
			 
			setVisible(false);
			return undefined;
		}
		window.addEventListener("load", scheduleFinish, { once: true });

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
				"fixed inset-0 z-[90] flex flex-col items-center justify-center gap-5 bg-background transition-opacity duration-300",
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
