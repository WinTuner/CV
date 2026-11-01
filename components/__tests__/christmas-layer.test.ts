import { describe, expect, it } from "vitest";
import { isChristmasWindow } from "@/components/christmas-layer";

describe("isChristmasWindow", () => {
	it("runs from Nov 1 through Jan 6 only", () => {
		expect(isChristmasWindow(new Date(2026, 9, 31, 23))).toBe(false);
		expect(isChristmasWindow(new Date(2026, 10, 1, 0))).toBe(true);
		expect(isChristmasWindow(new Date(2026, 11, 25, 12))).toBe(true);
		expect(isChristmasWindow(new Date(2027, 0, 6, 23))).toBe(true);
		expect(isChristmasWindow(new Date(2027, 0, 7, 0))).toBe(false);
		expect(isChristmasWindow(new Date(2027, 6, 1, 12))).toBe(false);
	});
});
