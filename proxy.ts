import { NextResponse, type NextRequest } from "next/server";
import {
	LANGUAGE_COOKIE,
	detectLanguage,
	isSupportedLanguage,
	stripLocalePath,
} from "@/constants/languages";

const COOKIE_OPTIONS = { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" } as const;

/**
 * Every page lives under a language prefix (`/th/projects`). The prefix is
 * rewritten away, so the app keeps one unprefixed route tree and reads the
 * language from the `x-locale` header. Unprefixed requests are redirected to
 * the visitor's preferred language.
 */
export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const { locale, path } = stripLocalePath(pathname);

	if (locale) {
		const url = request.nextUrl.clone();
		url.pathname = path;

		const headers = new Headers(request.headers);
		headers.set("x-locale", locale);
		headers.set("x-path", path);

		// No Set-Cookie here: the response stays cacheable per URL.
		return NextResponse.rewrite(url, { request: { headers } });
	}

	const cookieLanguage = request.cookies.get(LANGUAGE_COOKIE)?.value;
	const preferred = isSupportedLanguage(cookieLanguage)
		? cookieLanguage
		: detectLanguage(request.headers.get("accept-language"));

	const url = request.nextUrl.clone();
	url.pathname = `/${preferred}${path === "/" ? "" : path}`;

	const response = NextResponse.redirect(url, 307);
	response.cookies.set(LANGUAGE_COOKIE, preferred, COOKIE_OPTIONS);
	return response;
}

export const config = {
	matcher: ["/((?!api|_next|_vercel|.*\\.[a-zA-Z0-9]+$).*)"],
};
