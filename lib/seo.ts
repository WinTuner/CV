import { headers } from "next/headers";
import type { Metadata } from "next";
import {
	DEFAULT_LANGUAGE,
	SUPPORTED_LANGUAGES,
	isSupportedLanguage,
	type SupportedLanguageCode,
} from "@/constants/languages";

/** Locale and unprefixed path the proxy attached to this request. */
export async function getRequestLocale(): Promise<{
	language: SupportedLanguageCode;
	path: string;
}> {
	const headerStore = await headers();
	const value = headerStore.get("x-locale");
	return {
		language: isSupportedLanguage(value) ? value : DEFAULT_LANGUAGE,
		path: headerStore.get("x-path") ?? "/",
	};
}

/** Self canonical plus one hreflang per language, for an unprefixed path. */
export function localeAlternates(path: string, language: SupportedLanguageCode) {
	const suffix = path === "/" ? "" : path.replace(/\/+$/, "");
	return {
		canonical: `/${language}${suffix}`,
		languages: {
			"x-default": `/${DEFAULT_LANGUAGE}${suffix}`,
			...Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l.hreflang, `/${l.code}${suffix}`])),
		},
	};
}

/**
 * Static page metadata plus the language-aware canonical, hreflang and
 * Open Graph URL for the page's own path.
 */
export async function withLocaleAlternates(meta: Metadata, path: string): Promise<Metadata> {
	const { language } = await getRequestLocale();
	const alternates = localeAlternates(path, language);
	const suffix = path === "/" ? "" : path;

	return {
		...meta,
		alternates,
		openGraph: meta.openGraph ? { ...meta.openGraph, url: `/${language}${suffix}` } : undefined,
	};
}
