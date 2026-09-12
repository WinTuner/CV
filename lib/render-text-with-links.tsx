import type { ReactNode } from "react";

/**
 * Renders markdown-style `[text](url)` links inside a plain string.
 * Shared by CV components (introduction page, home experience timeline).
 *
 * Only http(s) and mailto targets become anchors — anything else
 * (`javascript:`, `data:`, ...) renders as inert text so a malicious
 * content contribution cannot smuggle an executable URL into the page.
 */
function toSafeHref(raw: string): string | null {
	const target = raw.trim();
	if (/^(https?:\/\/|mailto:)/i.test(target)) return target;
	if (/^\/[^/\\]/.test(target) || target.startsWith("#")) return target;
	return null;
}

export const renderTextWithLinks = (text: string): ReactNode => {
	const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
	const parts: ReactNode[] = [];
	let lastIndex = 0;
	let match;
	let found = false;

	while ((match = regex.exec(text)) !== null) {
		found = true;
		if (match.index > lastIndex) {
			parts.push(text.substring(lastIndex, match.index));
		}
		const safeHref = toSafeHref(match[2]);
		parts.push(
			safeHref ? (
				<a
					key={match.index}
					href={safeHref}
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary hover:underline font-semibold"
				>
					{match[1]}
				</a>
			) : (
				<span key={match.index}>
					{match[1]}
				</span>
			),
		);
		lastIndex = regex.lastIndex;
	}

	if (!found) return text;

	if (lastIndex < text.length) {
		parts.push(text.substring(lastIndex));
	}

	return parts;
};
