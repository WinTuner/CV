/**
 * Supported languages — single source of truth for i18n.
 * Add a new entry here and extend `*_translations` / `cv-data` maps;
 * the type-system and provider will pick it up automatically.
 */

export const SUPPORTED_LANGUAGES = [
	{ code: "en", label: "EN", nativeLabel: "English", flag: "🇬🇧", hreflang: "en-US" },
	{ code: "th", label: "TH", nativeLabel: "ไทย", flag: "🇹🇭", hreflang: "th-TH" },
	{ code: "ja", label: "JA", nativeLabel: "日本語", flag: "🇯🇵", hreflang: "ja-JP" },
	{ code: "zh", label: "ZH", nativeLabel: "中文", flag: "🇨🇳", hreflang: "zh-CN" },
] as const;

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: SupportedLanguageCode = "en";

export const LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((l) => l.code) as SupportedLanguageCode[];

export function isSupportedLanguage(value: unknown): value is SupportedLanguageCode {
	return typeof value === "string" && (LANGUAGE_CODES as string[]).includes(value);
}

export function pickTranslation<T>(map: Partial<Record<SupportedLanguageCode, T>>, lang: SupportedLanguageCode): T {
	if (map[lang] !== undefined) return map[lang] as T;
	if (map.en !== undefined) return map.en as T;
	const first = Object.values(map)[0];
	if (first !== undefined) return first as T;
	throw new Error("pickTranslation: empty map");
}

/** Cookie that stores the visitor's language. Read by the proxy and the provider. */
export const LANGUAGE_COOKIE = "site-language";

/**
 * Split a pathname into its locale prefix (if any) and the unprefixed path.
 * `/th/projects` -> { locale: "th", path: "/projects" }
 */
export function stripLocalePath(pathname: string): {
	locale: SupportedLanguageCode | null;
	path: string;
} {
	const segments = pathname.split("/");
	const first = segments[1];
	if (!isSupportedLanguage(first)) return { locale: null, path: pathname };
	const rest = `/${segments.slice(2).join("/")}`.replace(/\/+$/, "");
	return { locale: first, path: rest || "/" };
}

/** Prefix an internal path with the locale. External URLs and hashes pass through. */
export function localePath(href: string, locale: SupportedLanguageCode): string {
	if (!href.startsWith("/") || href.startsWith("//")) return href;
	const cut = href.search(/[?#]/);
	const path = cut === -1 ? href : href.slice(0, cut);
	const tail = cut === -1 ? "" : href.slice(cut);
	if (stripLocalePath(path).locale) return href;
	return `/${locale}${path === "/" ? "" : path}${tail}`;
}

/** Pick the first supported language from an Accept-Language header. */
export function detectLanguage(acceptLanguage: string | null): SupportedLanguageCode {
	if (!acceptLanguage) return DEFAULT_LANGUAGE;
	const ranked = acceptLanguage
		.split(",")
		.map((part) => {
			const [tag, quality] = part.trim().split(";q=");
			return { tag: (tag ?? "").toLowerCase(), quality: quality ? Number(quality) : 1 };
		})
		.sort((a, b) => b.quality - a.quality);
	for (const { tag } of ranked) {
		const base = tag.slice(0, 2);
		if (isSupportedLanguage(base)) return base;
	}
	return DEFAULT_LANGUAGE;
}
