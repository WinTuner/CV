/**
 * Central image resolver — keeps large photos OFF GitHub.
 *
 * - Local dev / no Cloudinary configured: returns `/xxx.png` (public/ fallback)
 * - Cloudinary configured (`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`): returns
 *   `https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto/<folder>/<id>`
 *
 * Upload once with: `node scripts/upload-to-cloudinary.mjs`
 * public_id convention = filename without extension, under `folder`.
 * e.g. `/autoos-hero.png` -> `<folder>/autoos-hero`
 */

export const CLOUDINARY_CLOUD_NAME =
	process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

export const CLOUDINARY_FOLDER =
	process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "cv";

function toPublicId(file: string): string {
	const base = file.split("/").pop() || file;
	return base.replace(/\.[a-zA-Z0-9]+$/, "");
}

export function img(file: string): string {
	if (!file || file.startsWith("http") || file.startsWith("data:")) return file;
	if (!CLOUDINARY_CLOUD_NAME) return file.startsWith("/") ? file : `/${file}`;
	const id = toPublicId(file);
	const folder = CLOUDINARY_FOLDER.replace(/^\/+|\/+$/g, "");
	const prefix = folder ? `${folder}/` : "";
	return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto/${prefix}${id}`;
}

/** Absolute URL for OG / JSON-LD (crawlers need https). */
export function absoluteImg(file: string, siteUrl: string): string {
	const resolved = img(file);
	if (resolved.startsWith("http")) return resolved;
	const base = siteUrl.replace(/\/+$/, "");
	return `${base}${resolved.startsWith("/") ? resolved : `/${resolved}`}`;
}
