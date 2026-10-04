import { describe, expect, it } from "vitest";
import { fuzzyMatch, fuzzySearch, slugify } from "@/lib/fuzzy";

describe("fuzzyMatch", () => {
	it("returns null for empty or whitespace-only queries", () => {
		expect(fuzzyMatch("", "hello")).toBeNull();
		expect(fuzzyMatch("   ", "hello")).toBeNull();
	});

	it("returns null when the query is not a subsequence of the target", () => {
		expect(fuzzyMatch("xyz", "hello")).toBeNull();
		expect(fuzzyMatch("helloworld!", "hello")).toBeNull();
	});

	it("matches exact and case-insensitive queries", () => {
		const exact = fuzzyMatch("hello", "hello");
		expect(exact).not.toBeNull();
		expect(exact?.indices).toEqual([0, 1, 2, 3, 4]);

		const upper = fuzzyMatch("HELLO", "hello");
		expect(upper).not.toBeNull();
		expect(upper?.indices).toEqual(exact?.indices);
	});

	it("matches non-contiguous subsequences in order", () => {
		const m = fuzzyMatch("hlo", "hello");
		expect(m).not.toBeNull();
		expect(m?.indices).toEqual([0, 2, 4]);
	});

	it("scores contiguous matches higher than spread ones", () => {
		const tight = fuzzyMatch("abc", "abcxxx")?.score ?? 0;
		const spread = fuzzyMatch("abc", "axbxcx")?.score ?? 0;
		expect(tight).toBeGreaterThan(spread);
	});

	it("rewards word-start matches", () => {
		const wordStart = fuzzyMatch("d", "abc def")?.score ?? 0;
		const midWord = fuzzyMatch("e", "abc def")?.score ?? 0;
		expect(wordStart).toBeGreaterThan(midWord);
	});
});

describe("fuzzySearch", () => {
	const items = ["Muanjai", "DotDoctor", "aim4-mod", "AutoOS"];

	it("returns [] for blank queries", () => {
		expect(fuzzySearch("  ", items, (s) => s)).toEqual([]);
	});

	it("filters non-matches and ranks best first", () => {
		const results = fuzzySearch("auto", items, (s) => s);
		expect(results.map((r) => r.item)).toEqual(["AutoOS"]);
	});

	it("supports object items via getSearchText", () => {
		const posts = [{ title: "Next.js Guide" }, { title: "Rust WASM" }];
		const results = fuzzySearch("rust", posts, (p) => p.title);
		expect(results).toHaveLength(1);
		expect(results[0].item.title).toBe("Rust WASM");
	});
});

describe("slugify", () => {
	it("lowercases, trims, and hyphenates", () => {
		expect(slugify("  Hello World! ")).toBe("hello-world");
		expect(slugify("Next.js 16 Guide")).toBe("next-js-16-guide");
	});

	it("preserves Thai script and strips edge hyphens", () => {
		expect(slugify("สวัสดี ชาวโลก")).toBe("สวัสดี-ชาวโลก");
		expect(slugify("--hello--")).toBe("hello");
	});
});
