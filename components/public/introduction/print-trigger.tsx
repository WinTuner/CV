"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Triggers the print dialog when `?print=true` is present.
 *
 * Kept isolated in its own tiny component (with its own Suspense boundary
 * at the call site) so `useSearchParams` never bails out the whole resume
 * content to a loading fallback during prerender — the LCP element stays
 * in the SSR'd HTML. Same pattern as `LanguageToggleContent`.
 */
export function PrintTrigger() {
	const searchParams = useSearchParams();

	useEffect(() => {
		if (searchParams.get("print") === "true") {
			const timer = setTimeout(() => {
				window.print();
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [searchParams]);

	return null;
}
