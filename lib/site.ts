/**
 * Canonical site URL. Falls back to the production URL so builds work
 * without a .env file (e.g. local dev or CI without secrets).
 */
export const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL || "https://thanatphong.vercel.app";
