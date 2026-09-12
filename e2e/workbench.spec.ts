import { test, expect } from "@playwright/test";

test.describe("workbench", () => {
	test("activity panel shows a live freshness indicator", async ({ page }) => {
		await page.goto("/workbench");

		const pill = page.locator('span[role="status"]', { hasText: /live/i }).first();
		await expect(pill).toBeVisible();
		await expect(pill).toContainText(/ago|just now/);
	});
});
