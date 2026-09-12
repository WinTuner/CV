import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = ["/", "/projects", "/introduction", "/blog", "/case-study/muanjai"] as const;

for (const route of ROUTES) {
	test(`axe: ${route} has no serious violations`, async ({ page }) => {
		await page.goto(route);
		// Freeze entrance animations so axe measures the final visual
		// state instead of mid-fade blended colors.
		await page.addStyleTag({
			content:
				"*,*::before,*::after{animation-duration:0.01ms!important;animation-delay:0ms!important;transition-duration:0.01ms!important}",
		});
		await page.waitForTimeout(500);

		const results = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa"])
			.analyze();

		const blocking = results.violations.filter((v) =>
			["critical", "serious"].includes(v.impact ?? ""),
		);
		expect(
			blocking.map((v) => `${v.id}: ${v.nodes.length} node(s)\n${v.help}`),
			`axe violations on ${route}`,
		).toEqual([]);
	});
}
