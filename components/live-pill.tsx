"use client";

import { formatRelativeTime } from "@/lib/hero-utils";
import { useIsMounted } from "@/lib/use-is-mounted";
import type { SupportedLanguageCode } from "@/constants/languages";

interface LivePillProps {
	updatedAt: number;
	isLive: boolean;
	label: string;
	language: SupportedLanguageCode;
}

/**
 * Realtime freshness pill shared by all GitHub sections.
 *
 * Hydration-safe: renders only the static `label` on the server and during
 * hydration, then adds the relative time + `title` post-hydration via
 * `useIsMounted`. Rendering `Date.now()`-derived text inline would
 * mismatch server HTML and throw a React hydration error.
 */
export function LivePill({ updatedAt, isLive, label, language }: LivePillProps) {
	const mounted = useIsMounted();
	const showTime = mounted && updatedAt > 0;

	return (
		<span
			className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] text-primary"
			role="status"
			aria-live="off"
			{...(showTime
				? { title: `Updated ${new Date(updatedAt).toISOString()}` }
				: {})}
		>
			<span className="relative flex h-1.5 w-1.5">
				{isLive && (
					<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
				)}
				<span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
			</span>
			{showTime
				? `${label} · ${formatRelativeTime(new Date(updatedAt).toISOString(), language)}`
				: label}
		</span>
	);
}
