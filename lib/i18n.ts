import {
	DEFAULT_LANGUAGE,
	isSupportedLanguage,
	type SupportedLanguageCode,
} from "@/constants/languages";

/**
 * Server helper: read `site-language` cookie and normalize.
 * Use in Server Components (`cookies()`) and API routes.
 */
export function resolveLanguageFromCookie(cookieValue: unknown): SupportedLanguageCode {
	if (isSupportedLanguage(cookieValue)) return cookieValue;
	return DEFAULT_LANGUAGE;
}

/**
 * Parse `Accept-Language` header to best match supported language.
 * `header` is the raw string e.g. `th, en-US;q=0.9, ja;q=0.8`
 */
export function resolveLanguageFromHeader(header: string | null): SupportedLanguageCode | null {
	if (!header) return null;
	const parts = header
		.split(",")
		.map((p) => p.split(";")[0]?.trim().toLowerCase())
		.filter(Boolean) as string[];
	for (const part of parts) {
		// direct match `th` or `th-th` → `th`
		const base = part.split("-")[0];
		if (isSupportedLanguage(part)) return part as SupportedLanguageCode;
		if (isSupportedLanguage(base)) return base as SupportedLanguageCode;
	}
	return null;
}

export { DEFAULT_LANGUAGE, isSupportedLanguage, type SupportedLanguageCode };
