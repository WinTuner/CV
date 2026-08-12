import { describe, expect, it } from "vitest";
import { formatRelativeTime, getMessageText } from "@/lib/hero-utils";

describe("formatRelativeTime", () => {
	it("returns 'just now' for recent timestamps (en)", () => {
		expect(formatRelativeTime(new Date().toISOString(), "en")).toBe("just now");
	});

	it("returns 'just now' equivalent in th", () => {
		expect(formatRelativeTime(new Date().toISOString(), "th")).toBe("เมื่อสักครู่");
	});

	it("formats seconds/minutes/hours in en", () => {
		const oneHourAgo = new Date(Date.now() - 3600_000).toISOString();
		expect(formatRelativeTime(oneHourAgo, "en")).toBe("1 hour ago");
	});

	it("uses plural suffixes in en", () => {
		const twoDaysAgo = new Date(Date.now() - 2 * 86400_000).toISOString();
		expect(formatRelativeTime(twoDaysAgo, "en")).toBe("2 days ago");
	});

	it("formats in th", () => {
		const oneDayAgo = new Date(Date.now() - 86400_000).toISOString();
		expect(formatRelativeTime(oneDayAgo, "th")).toBe("1 วันที่แล้ว");
	});

	it("returns the raw string for invalid dates", () => {
		expect(formatRelativeTime("not-a-date", "en")).toBe("not-a-date");
	});
});

describe("getMessageText", () => {
	it("returns string messages as-is", () => {
		expect(getMessageText("commit message", "en")).toBe("commit message");
	});

	it("picks the requested language from a bilingual message", () => {
		const msg = { en: "Hello", th: "สวัสดี" };
		expect(getMessageText(msg, "th")).toBe("สวัสดี");
		expect(getMessageText(msg, "en")).toBe("Hello");
	});

	it("falls back to en when the language key is missing", () => {
		const msg = { en: "Hello", th: "สวัสดี" };
		expect(getMessageText(msg, "en")).toBe("Hello");
	});

	it("returns empty string for null/undefined", () => {
		expect(getMessageText(null, "en")).toBe("");
		expect(getMessageText(undefined, "th")).toBe("");
	});
});
