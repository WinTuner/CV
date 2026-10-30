import { describe, expect, it } from "vitest";
import { isHalloweenWindow } from "@/components/halloween-layer";

describe("isHalloweenWindow", () => {
	it("runs from Oct 24 through Nov 1 only", () => {
		expect(isHalloweenWindow(new Date(2026, 9, 23, 12))).toBe(false);
		expect(isHalloweenWindow(new Date(2026, 9, 24, 0))).toBe(true);
		expect(isHalloweenWindow(new Date(2026, 9, 31, 23))).toBe(true);
		expect(isHalloweenWindow(new Date(2026, 10, 1, 23))).toBe(true);
		expect(isHalloweenWindow(new Date(2026, 10, 2, 0))).toBe(false);
		expect(isHalloweenWindow(new Date(2026, 11, 25, 12))).toBe(false);
	});
});
