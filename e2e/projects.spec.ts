import { test, expect } from "@playwright/test";

test.describe("projects page", () => {
	test("category filter narrows the grid and clear restores it", async ({ page }) => {
		await page.goto("/projects");

		const grid = page.locator("article");
		await expect(grid.first()).toBeVisible();
		const totalText = await page.getByText(/^\d+ projects?$/).first().textContent();
		const total = Number(totalText?.match(/\d+/)?.[0] ?? "0");
		expect(total).toBeGreaterThan(0);

		// Narrow to the in-progress status.
		await page.getByRole("button", { name: "in-progress", exact: true }).click();
		const narrowedText = await page
			.getByText(/^\d+ projects?$/)
			.first()
			.textContent();
		const narrowed = Number(narrowedText?.match(/\d+/)?.[0] ?? "0");
		expect(narrowed).toBeGreaterThan(0);
		expect(narrowed).toBeLessThanOrEqual(total);

		// Clearing filters restores the full list.
		await page.getByRole("button", { name: /clear filters/i }).click();
		await expect(page.getByText(`${total} projects`).first()).toBeVisible();
	});

	test("search filters cards by title", async ({ page }) => {
		await page.goto("/projects");

		await page.getByPlaceholder("Search projects...").fill("AutoOS");
		await expect(page.locator("article", { hasText: "AutoOS" }).first()).toBeVisible();
	});
});
