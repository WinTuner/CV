import type { ReactNode } from "react";

/**
 * Renders markdown-style `[text](url)` links inside a plain string.
 * Shared by CV components (introduction page, home experience timeline).
 */
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
		parts.push(
			<a
				key={match.index}
				href={match[2]}
				target="_blank"
				rel="noopener noreferrer"
				className="text-primary hover:underline font-semibold"
			>
				{match[1]}
			</a>,
		);
		lastIndex = regex.lastIndex;
	}

	if (!found) return text;

	if (lastIndex < text.length) {
		parts.push(text.substring(lastIndex));
	}

	return parts;
};
