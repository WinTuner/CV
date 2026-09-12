import { test, expect } from "@playwright/test";

test.describe("language toggle", () => {
	test("switches to Thai via dropdown and persists across reload", async ({ page }) => {
		await page.goto("/");

		// Open the language dropdown and pick Thai.
		await page.getByRole("button", { name: "Select language" }).click();
		await page.getByRole("option", { name: /ไทย/ }).click();

		// URL carries ?lang=th and Thai copy renders on screen.
		await expect(page).toHaveURL(/lang=th/);
		await expect(page.getByText("มาสร้างอะไร").first()).toBeVisible();

		// Choice survives a reload (cookie-backed provider).
		await page.reload();
		await expect(page).toHaveURL(/lang=th/);
		await expect(page.getByText("มาสร้างอะไร").first()).toBeVisible();
	});

	test("honours ?lang=th deep links on the introduction page", async ({ page }) => {
		await page.goto("/introduction?lang=th");
		await expect(
			page.getByText("เรซูเม่ / ประวัติย่อ", { exact: false }).first(),
		).toBeVisible();
	});
});
