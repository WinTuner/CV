import { test, expect } from "@playwright/test";

test.describe("language routing", () => {
	test("switches language through the URL prefix and persists across reload", async ({ page }) => {
		await page.goto("/en");

		// Open the language dropdown and pick Thai.
		await page.getByRole("button", { name: /Select language/ }).click();
		await page.getByRole("option", { name: /ไทย/ }).click();

		// URL carries the /th prefix and Thai copy renders on screen.
		await expect(page).toHaveURL(/\/th$/);
		await expect(page.getByText("มาสร้างอะไร").first()).toBeVisible();

		// Choice survives a reload (URL prefix + cookie).
		await page.reload();
		await expect(page).toHaveURL(/\/th$/);
		await expect(page.getByText("มาสร้างอะไร").first()).toBeVisible();
	});

	test("redirects an unprefixed path to a language prefix", async ({ page }) => {
		await page.goto("/introduction");
		await expect(page).toHaveURL(/\/(en|th|ja|zh)\/introduction$/);
	});

	test("renders the language of a prefixed deep link", async ({ page }) => {
		await page.goto("/th/introduction");
		await expect(
			page.getByText("เรซูเม่ / ประวัติย่อ", { exact: false }).first(),
		).toBeVisible();
	});
});
