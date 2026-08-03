/**
 * Generate missing Open Graph images (1200x630) for the sub-pages.
 *
 * Run: node scripts/generate-og-images.mjs
 *
 * Rasterizes an SVG template (site gradient + page title) with sharp —
 * the same sky->purple palette as the site theme.
 */
import sharp from "sharp";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const pages = [
	{
		file: "og-image-projects.png",
		kicker: "WinTuner · Digital Laboratory",
		title: "Projects & Experiments",
	},
	{
		file: "og-image-workbench.png",
		kicker: "WinTuner · Digital Laboratory",
		title: "Workbench — Active Experiments",
	},
	{
		file: "og-image-blog.png",
		kicker: "WinTuner · Digital Laboratory",
		title: "Blog — Technical Articles",
	},
];

function svg(kicker, title) {
	const esc = (s) =>
		s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	kicker = esc(kicker);
	title = esc(title);
	return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="55%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="rgba(9,9,11,0.45)"/>
  <rect x="80" y="80" width="1040" height="470" rx="24" fill="rgba(9,9,11,0.35)" stroke="rgba(255,255,255,0.18)"/>
  <text x="120" y="200" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="28" letter-spacing="4" fill="#7dd3fc">${kicker}</text>
  <text x="120" y="340" font-family="system-ui, sans-serif" font-size="64" font-weight="bold" fill="#ffffff">${title}</text>
  <text x="120" y="480" font-family="ui-monospace, monospace" font-size="24" fill="#e2e8f0">&gt; thanatphong.vercel.app</text>
</svg>`;
}

for (const page of pages) {
	await sharp(Buffer.from(svg(page.kicker, page.title)))
		.resize(1200, 630)
		.png({ compressionLevel: 9 })
		.toFile(resolve(root, "public", page.file));
	console.log(`generated public/${page.file}`);
}
