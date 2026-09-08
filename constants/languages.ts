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

export function normalizeLanguage(value: unknown): SupportedLanguageCode {
	if (isSupportedLanguage(value)) return value;
	return DEFAULT_LANGUAGE;
}

export function getLanguageMeta(code: SupportedLanguageCode) {
	return SUPPORTED_LANGUAGES.find((l) => l.code === code) ?? SUPPORTED_LANGUAGES[0];
}

/**
 * Pick translation with fallback: requested → en → first available.
 * Works for any `Record<string, T>` map where `en` exists.
 */
export function pickTranslation<T>(map: Partial<Record<SupportedLanguageCode, T>>, lang: SupportedLanguageCode): T {
	if (map[lang] !== undefined) return map[lang] as T;
	if (map.en !== undefined) return map.en as T;
	const first = Object.values(map)[0];
	if (first !== undefined) return first as T;
	throw new Error("pickTranslation: empty map");
}
