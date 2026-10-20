/**
 * One-shot image optimization for the public assets.
 *
 * Run: node scripts/optimize-images.mjs
 *
 * Resizes/compresses the oversized images committed to /public:
 *  - hero portrait       PNG 7.4MB            -> optimized PNG
 *  - app icons           1024x1024 PNG 1.4MB  -> real 32x32 / 180x180 PNG
 *  - og image            oversized PNG        -> 1200x630 compressed PNG
 *  - CV images           2.1MB / 1.8MB PNG    -> 800px compressed PNG
 *
 * After running, delete app/favicon.ico (1.7MB) — the layout metadata
 * already declares icon-light/dark PNGs, so the .ico is redundant.
 */
import sharp from "sharp";
import { statSync, renameSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pub = (p) => resolve(root, "public", p);

const jobs = [
	{
		in: "developer-portrait-v3.png",
		out: "developer-portrait-v3.png",
		resize: { width: 1200, withoutEnlargement: true },
		format: { webp: { quality: 95 } },
	},
	{
		in: "icon-light-32x32.png",
		out: "icon-light-32x32.png",
		resize: { width: 32, height: 32 },
		format: { png: { compressionLevel: 9, palette: true } },
	},
	{
		in: "icon-dark-32x32.png",
		out: "icon-dark-32x32.png",
		resize: { width: 32, height: 32 },
		format: { png: { compressionLevel: 9, palette: true } },
	},
	{
		// quality/effort matter here: the default palette quality (100)
		// left these at ~50KB each; 80/10 gives visually identical icons ~4x smaller.
		in: "apple-icon.png",
		out: "apple-icon.png",
		resize: { width: 180, height: 180, fit: "fill" },
		format: { png: { compressionLevel: 9, palette: true, quality: 80, effort: 10 } },
	},
	{
		in: "apple-touch-icon.png",
		out: "apple-touch-icon.png",
		resize: { width: 180, height: 180, fit: "fill" },
		format: { png: { compressionLevel: 9, palette: true, quality: 80, effort: 10 } },
	},
	{
		in: "icon-192x192.png",
		out: "icon-192x192.png",
		resize: { width: 192, height: 192, fit: "fill" },
		format: { png: { compressionLevel: 9, palette: true, quality: 80, effort: 10 } },
	},
	{
		in: "icon-512x512.png",
		out: "icon-512x512.png",
		resize: { width: 512, height: 512, fit: "fill" },
		format: { png: { compressionLevel: 9, palette: true, quality: 80, effort: 10 } },
	},
	{
		in: "icon-maskable-512x512.png",
		out: "icon-maskable-512x512.png",
		resize: { width: 512, height: 512, fit: "fill" },
		format: { png: { compressionLevel: 9, palette: true, quality: 80, effort: 10 } },
	},
	{
		in: "og-image.png",
		out: "og-image.png",
		resize: { width: 1200 },
		format: { png: { compressionLevel: 9 } },
	},
	{
		in: "tcc-uxui.png",
		out: "tcc-uxui.png",
		resize: { width: 800 },
		format: { png: { compressionLevel: 9 } },
	},
	{
		in: "hylife-hackathon.png",
		out: "hylife-hackathon.png",
		resize: { width: 800 },
		format: { png: { compressionLevel: 9 } },
	},
];

for (const job of jobs) {
	const input = pub(job.in);
	const output = pub(job.out);
	const before = statSync(input).size;
	let pipeline = sharp(input);
	if (job.resize) pipeline = pipeline.resize(job.resize);
	const formatName = Object.keys(job.format)[0];
	pipeline = pipeline[formatName](job.format[formatName]);
	// In-place jobs write to a temp file first, then replace the original.
	const tmp = output + ".tmp";
	await pipeline.toFile(tmp);
	renameSync(tmp, output);
	const after = statSync(output).size;
	console.log(
		`${job.in} -> ${job.out}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`,
	);
}

console.log("Done. Also run: git rm app/favicon.ico");
