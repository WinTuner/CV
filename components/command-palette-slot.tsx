"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * Deferred Command Palette.
 *
 * The palette is only useful after the user presses ⌘K / Ctrl+K, but its chunk
 * (fuzzy search + many icons) used to ship with every route's initial JS via
 * the root layout. This slot stays tiny on every page; the heavy palette is
 * downloaded and mounted only on the first shortcut press.
 */
const Palette = dynamic(
	() => import("./command-palette").then((m) => m.CommandPalette),
	{ ssr: false },
);

export function CommandPaletteSlot() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				setMounted(true);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	if (!mounted) return null;
	return <Palette autoOpen />;
}
