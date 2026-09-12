/**
 * Canonical site URL. Falls back to the production URL so builds work
 * without a .env file (e.g. local dev or CI without secrets).
 */
export const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL || "https://thanatphong.vercel.app";

/**
 * Centralized site identity — single source of truth for hardcoded
 * usernames, profile URLs, feed URLs, and contact details.
 * Every override is optional; defaults preserve current behavior.
 */
export const GITHUB_USERNAME =
	process.env.NEXT_PUBLIC_GITHUB_USERNAME || "WinTuner";

export const GITHUB_WEB_BASE =
	process.env.NEXT_PUBLIC_GITHUB_BASE_URL || "https://github.com";

export const GITHUB_API_BASE =
	process.env.GITHUB_API_BASE_URL || "https://api.github.com";

export const GITHUB_GRAPHQL_URL = `${GITHUB_API_BASE}/graphql`;

export const GITHUB_USER_AGENT = `${GITHUB_USERNAME}-Portfolio`;

export const GITHUB_PROFILE_URL = `${GITHUB_WEB_BASE}/${GITHUB_USERNAME}`;

export const githubRepoUrl = (name: string) =>
	`${GITHUB_WEB_BASE}/${GITHUB_USERNAME}/${name}`;

export const MEDIUM_FEED_URL =
	process.env.MEDIUM_FEED_URL ||
	process.env.NEXT_PUBLIC_MEDIUM_FEED_URL ||
	"https://medium.com/feed/@thanatphong2719";

export const AUTHOR_NAME =
	process.env.NEXT_PUBLIC_AUTHOR_NAME || "Thanatphong Tarin";

export const AUTHOR_AVATAR =
	process.env.NEXT_PUBLIC_AUTHOR_AVATAR || "/developer-portrait-v3.png";

export const CONTACT_EMAIL =
	process.env.NEXT_PUBLIC_CONTACT_EMAIL || "Thanatphong2719@gmail.com";

export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

export const SOCIAL_LINKS = {
	github: process.env.NEXT_PUBLIC_GITHUB_URL || GITHUB_PROFILE_URL,
	linkedin:
		process.env.NEXT_PUBLIC_LINKEDIN_URL ||
		"https://www.linkedin.com/in/thanatphong-tarin-1b6619385/",
	x: process.env.NEXT_PUBLIC_X_URL || "https://x.com/nut89189886",
	lineOa:
		process.env.NEXT_PUBLIC_LINE_OA_URL || "https://line.me/R/ti/p/%40636owbhl",
} as const;
