import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3100);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

/**
 * E2E suite: smoke specs for language toggle, project filters, print flow,
 * plus axe-core accessibility scans. The dev server is booted automatically;
 * point E2E_BASE_URL at a preview deploy to run the same specs remotely
 * (webServer is skipped when the port already answers).
 */
export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 2 : undefined,
	reporter: process.env.CI ? "github" : "list",
	use: {
		baseURL: BASE_URL,
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: {
		command: `npm run dev -- --port ${PORT}`,
		url: BASE_URL,
		reuseExistingServer: true,
		timeout: 120_000,
		env: {
			PORT: String(PORT),
		},
	},
});
