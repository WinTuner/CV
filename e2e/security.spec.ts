import { test, expect } from "@playwright/test";

test.describe("security headers", () => {
	test("baseline hardening headers ship on every route", async ({ request }) => {
		for (const route of ["/", "/projects", "/introduction"]) {
			const response = await request.get(route);
			expect(response.ok()).toBeTruthy();
			const headers = response.headers();
			expect(headers["x-content-type-options"]).toBe("nosniff");
			expect(headers["x-frame-options"]).toBe("DENY");
			expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
			expect(headers["content-security-policy-report-only"]).toContain(
				"default-src 'self'",
			);
		}
	});

	test("no CSP violations on interactive pages", async ({ page }) => {
		const violations: string[] = [];
		page.on("console", (msg) => {
			if (msg.type() === "error" && /content security policy/i.test(msg.text())) {
				violations.push(msg.text());
			}
		});
		for (const route of ["/", "/projects", "/introduction", "/blog"]) {
			await page.goto(route);
			await page.waitForTimeout(500);
		}
		expect(violations).toEqual([]);
	});
});
