import { test, expect } from "@playwright/test";

test.describe("print flow", () => {
	test("?print=true auto-triggers window.print on the resume", async ({ page }) => {
		let printCalls = 0;
		await page.exposeFunction("notePrint", () => {
			printCalls += 1;
		});
		// Stub the native print dialog before the page can call it.
		await page.addInitScript(() => {
			(window as unknown as { print: () => void }).print = () => {
				(
					window as unknown as { notePrint: () => void }
				).notePrint();
			};
		});

		await page.goto("/introduction?print=true");

		// Resume content renders…
		await expect(page.getByRole("heading", { name: /Thanatphong Tarin/ }).first()).toBeVisible();

		// …and the auto-print timer fires exactly once.
		await expect.poll(() => printCalls, { timeout: 10_000 }).toBe(1);
	});

	test("manual print button calls window.print", async ({ page }) => {
		let printCalls = 0;
		await page.exposeFunction("notePrint", () => {
			printCalls += 1;
		});
		await page.addInitScript(() => {
			(window as unknown as { print: () => void }).print = () => {
				(
					window as unknown as { notePrint: () => void }
				).notePrint();
			};
		});

		await page.goto("/introduction");
		await page.getByRole("button", { name: /print \/ save pdf/i }).click();
		await expect.poll(() => printCalls, { timeout: 5_000 }).toBe(1);
	});

	test("photos stay visible when printing", async ({ page }) => {
		await page.goto("/introduction");
		await page.emulateMedia({ media: "print" });

		const photo = page.locator("#experience img").first();
		await expect(photo).toBeVisible();
		await expect(photo).toHaveJSProperty("complete", true);
	});
});
