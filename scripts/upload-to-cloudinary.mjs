/**
 * Upload large /public photos to Cloudinary (keeps them OFF GitHub).
 *
 * Setup:
 *   CLOUDINARY_CLOUD_NAME=xxx
 *   CLOUDINARY_API_KEY=xxx
 *   CLOUDINARY_API_SECRET=xxx
 *   NEXT_PUBLIC_CLOUDINARY_FOLDER=cv (optional)
 *
 * Run: node scripts/upload-to-cloudinary.mjs
 *
 * Uploads every *.png/*.jpg in /public (except icons/favicon/manifest/svg)
 * with public_id = `<folder>/<filename-without-ext>`.
 * After success: git rm --cached the same files (see .gitignore).
 */
import { readdirSync, statSync } from "node:fs";
import { join, dirname, resolve, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pubDir = join(root, "public");

// Tiny .env.local loader (no extra deps) so `npm run upload:images` just works.
for (const f of [".env.local", ".env"]) {
	try {
		const { readFileSync, existsSync } = await import("node:fs");
		const p = join(root, f);
		if (!existsSync(p)) continue;
		for (const line of readFileSync(p, "utf8").split("\n")) {
			const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
			if (!m || process.env[m[1]] !== undefined) continue;
			let v = m[2].trim();
			if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
			process.env[m[1]] = v;
		}
	} catch {
		/* ignore */
	}
}

const cloud = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "cv";

if (!cloud || !apiKey || !apiSecret) {
	console.error("Missing CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET");
	process.exit(1);
}

// Tiny PWA icons stay in git — only upload photos/OG images.
const KEEP = new Set([
	"favicon.ico",
	"icon-light-32x32.png",
	"icon-dark-32x32.png",
	"apple-icon.png",
	"apple-touch-icon.png",
	"icon-192x192.png",
	"icon-512x512.png",
	"icon-maskable-512x512.png",
	"placeholder.svg",
	"site.webmanifest",
]);

const IMG_EXTS = [".png", ".jpg", ".jpeg", ".webp", ".avif"];

function collect(dir, prefix = "") {
	let out = [];
	let entries = [];
	try {
		entries = readdirSync(dir);
	} catch {
		return out;
	}
	for (const f of entries) {
		const full = join(dir, f);
		try {
			if (!statSync(full).isFile()) continue;
		} catch {
			continue;
		}
		if (prefix === "" && KEEP.has(f)) continue;
		if (f === "README.md") continue;
		if (!IMG_EXTS.includes(extname(f).toLowerCase())) continue;
		out.push(prefix + f);
	}
	return out;
}

// public/* photos + public/og-images/<slug>.png (matches lib/images.ts public_ids).
const files = [...collect(pubDir), ...collect(join(pubDir, "og-images"), "og-images/")];

if (files.length === 0) {
	console.log("Nothing to upload.");
	process.exit(0);
}

const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

for (const file of files) {
	const publicId = `${folder}/${basename(file, extname(file))}`;
	const buf = await import("node:fs/promises").then((m) => m.readFile(join(pubDir, file)));
	const form = new FormData();
	form.append("file", new Blob([buf]), file);
	form.append("public_id", publicId);
	form.append("overwrite", "true");

	const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
		method: "POST",
		headers: { Authorization: `Basic ${auth}` },
		body: form,
	});
	const json = await res.json();
	if (!res.ok) {
		console.error(`FAIL ${file}:`, json);
		process.exitCode = 1;
	} else {
		console.log(`OK ${file} -> ${json.secure_url}`);
	}
}

console.log("\nNext: git rm --cached public/<file> (already in .gitignore), then commit.");
