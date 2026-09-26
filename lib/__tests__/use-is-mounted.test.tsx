import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { useIsMounted } from "@/lib/use-is-mounted";

function Probe({ seen }: { seen: boolean[] }) {
	const mounted = useIsMounted();
	seen.push(mounted);
	return null;
}

describe("useIsMounted", () => {
	it("is false on first render (hydration-safe), true after mount", () => {
		const seen: boolean[] = [];
		render(<Probe seen={seen} />);

		// First client render must match server HTML (false). The old
		// useSyncExternalStore implementation returned true immediately,
		// causing hydration mismatches in LivePill / theme-toggle.
		expect(seen[0]).toBe(false);
		expect(seen[seen.length - 1]).toBe(true);
	});
});
