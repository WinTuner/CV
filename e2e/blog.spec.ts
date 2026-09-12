import { test, expect } from "@playwright/test";

test.describe("blog", () => {
	test("RSS entry point serves the feed", async ({ page }) => {
		await page.goto("/blog");

		const rssLink = page.locator('a[href="/feed.xml"]').first();
		await expect(rssLink).toBeVisible();

		const response = await page.request.get("/feed.xml");
		expect(response.ok()).toBeTruthy();
		expect(response.headers()["content-type"]).toContain("rss+xml");
		const body = await response.text();
		expect(body).toContain("<rss");
		expect(body).toContain("<item>");
	});

	test("post page renders content and JSON-LD", async ({ page }) => {
		await page.goto("/blog");

		const firstPost = page.locator('a[href^="/blog/"]').first();
		await expect(firstPost).toBeVisible();
		await firstPost.click();

		await expect(page.locator("article").first()).toBeVisible();
		const jsonLd = await page
			.locator('script[type="application/ld+json"]')
			.first()
			.textContent();
		expect(jsonLd).toContain("BlogPosting");
	});
});
