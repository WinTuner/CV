import { describe, expect, it } from "vitest";
import {
	blogPosts,
	getPostBySlug,
	getRelatedPosts,
	localizePost,
} from "@/lib/blog-data";

describe("localizePost", () => {
	it("returns the post unchanged for en", () => {
		const post = blogPosts[0];
		expect(localizePost(post, "en")).toBe(post);
	});

	it("applies translated title/excerpt while falling back to EN content when blank", () => {
		const post = getPostBySlug("mcp-protocol-llm-applications")!;
		const th = localizePost(post, "th");
		expect(th.title).toBe("โปรโตคอล MCP ในแอปพลิเคชัน LLM");
		expect(th.excerpt).not.toBe("");
		// All bundled translations ship content: "" by design — EN body applies.
		expect(th.content).toBe(post.content);
	});

	it("falls back to the EN post for untranslated slugs or languages", () => {
		const post = blogPosts[0];
		// ja/zh translations exist for this slug; an unknown slug has none.
		const orphan = { ...post, slug: "no-such-post" };
		expect(localizePost(orphan, "th")).toBe(orphan);
		expect(localizePost(orphan, "ja")).toBe(orphan);
	});

	it("never yields a blank title or excerpt in any supported language", () => {
		for (const post of blogPosts) {
			for (const lang of ["th", "ja", "zh"] as const) {
				const localized = localizePost(post, lang);
				expect(localized.title, `${post.slug}/${lang} title`).not.toBe("");
				expect(localized.excerpt, `${post.slug}/${lang} excerpt`).not.toBe("");
				expect(localized.content, `${post.slug}/${lang} content`).not.toBe("");
			}
		}
	});
});

describe("getPostBySlug / getRelatedPosts", () => {
	it("finds posts by slug and misses unknown slugs", () => {
		expect(getPostBySlug("rust-wasm-performance")?.id).toBe(5);
		expect(getPostBySlug("does-not-exist")).toBeUndefined();
	});

	it("returns related posts sharing category or tags, excluding self", () => {
		const related = getRelatedPosts("mcp-protocol-llm-applications");
		expect(related.length).toBeGreaterThan(0);
		expect(related.every((p) => p.slug !== "mcp-protocol-llm-applications")).toBe(true);
	});

	it("returns [] for unknown slugs", () => {
		expect(getRelatedPosts("does-not-exist")).toEqual([]);
	});
});
