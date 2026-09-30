"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const COMPLETE_MS = 500;

/**
 * Minimal top progress line for client-side route changes.
 *
 * App Router has no router events, so this starts the bar on clicks to
 * internal links and completes it when `pathname` settles. Purely
 * decorative (`aria-hidden`) — the `SiteLoader` splash owns the
 * screen-reader announcement for the initial load.
 */
export function RouteProgress() {
	const pathname = usePathname();
	const [active, setActive] = useState(false);

	// Complete the bar once navigation settles.
	useEffect(() => {
		if (!active) return;
		const t = setTimeout(() => setActive(false), COMPLETE_MS);
		return () => clearTimeout(t);
	}, [pathname, active]);

	// Start the bar the moment an internal link is clicked, so feedback
	// appears before the new route renders.
	useEffect(() => {
		const onClick = (event: MouseEvent) => {
			if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) {
				return;
			}
			const anchor = (event.target as HTMLElement).closest?.("a[href]");
			if (!anchor) return;
			const href = anchor.getAttribute("href");
			if (!href || !href.startsWith("/") || href.startsWith("//")) return;
			if (anchor.getAttribute("target") === "_blank") return;
			// Same-page hash jumps don't trigger a route load.
			if (href.startsWith("#")) return;
			setActive(true);
		};
		document.addEventListener("click", onClick);
		return () => document.removeEventListener("click", onClick);
	}, []);

	if (!active) return null;

	return (
		<div
			aria-hidden="true"
			className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-0.5 bg-transparent"
		>
			<div
				className={cn(
					"h-full w-full origin-left animate-route-progress bg-primary",
				)}
			/>
		</div>
	);
}
