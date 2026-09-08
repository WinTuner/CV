import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { BlogLanguage } from "@/lib/blog-data";
import { isSupportedLanguage, DEFAULT_LANGUAGE } from "@/constants/languages";
import { getGithubRepos } from "@/lib/github";
import { getLocalizedBlogPostsFromBackend } from "@/lib/notion-blog";

export const dynamic = "force-dynamic";

/**
 * Lightweight search index for the command palette.
 *
 * Returns the current GitHub projects and localized blog posts so the palette
 * can fuzzy-search them without shipping heavy data to every page. The lib
 * functions underneath keep their own in-memory/ISR caching.
 */
export async function GET() {
	const cookieStore = await cookies();
	const cookieLanguage = cookieStore.get("site-language")?.value;
	const language: BlogLanguage = isSupportedLanguage(cookieLanguage) ? (cookieLanguage as BlogLanguage) : DEFAULT_LANGUAGE;

	const [projects, posts] = await Promise.all([
		getGithubRepos(),
		getLocalizedBlogPostsFromBackend(language),
	]);

	return NextResponse.json({ projects, posts });
}
