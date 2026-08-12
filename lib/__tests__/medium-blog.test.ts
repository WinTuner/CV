import { describe, expect, it } from "vitest";
import { extractFirstImage, stripTrackingPixels } from "@/lib/medium-blog";

describe("extractFirstImage", () => {
	it("skips Medium tracking pixels and returns the first real image", () => {
		const content = `<img src="https://medium.com/_/stat?event=post.clientViewed&postId=abc"/><img src="https://miro.medium.com/v2/resize:fit:1400/1_abc.jpeg"/>`;
		expect(extractFirstImage(content)).toBe(
			"https://miro.medium.com/v2/resize:fit:1400/1_abc.jpeg",
		);
	});

	it("skips data URIs and falls through to the next image", () => {
		const content = `<img src="data:image/png;base64,AAAA"/><img src="https://example.com/photo.jpg"/>`;
		expect(extractFirstImage(content)).toBe("https://example.com/photo.jpg");
	});

	it("returns an empty string when only tracking pixels are present", () => {
		const content = `<img src="https://medium.com/_/stat?event=post.clientViewed&postId=abc"/>`;
		expect(extractFirstImage(content)).toBe("");
	});

	it("returns an empty string when there are no images", () => {
		expect(extractFirstImage("<p>no images here</p>")).toBe("");
	});
});

describe("stripTrackingPixels", () => {
	it("removes Medium stat img tags from post content", () => {
		const content = `<figure><img src="https://medium.com/_/stat?event=post.clientViewed"/></figure><p>Hello</p>`;
		expect(stripTrackingPixels(content)).toBe("<figure></figure><p>Hello</p>");
	});

	it("leaves regular images untouched", () => {
		const content = `<p><img src="https://example.com/a.jpg" alt="a"/></p>`;
		expect(stripTrackingPixels(content)).toBe(content);
	});
});
