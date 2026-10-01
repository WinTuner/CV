"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Silky route change transition, modelled on the reference site's
 * ~180ms View-Transition fade (`cubic-bezier(0.76, 0, 0.24, 1)`).
 *
 * Re-keys a lightweight wrapper on `pathname` so each navigation replays the
 * `animate-page-in` keyframe. Pure CSS — no layout remount cost beyond what
 * the App Router already does, and disabled under reduced-motion.
 */
export function PageTransition({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	return (
		<div key={pathname} className="animate-page-in">
			{children}
		</div>
	);
}
