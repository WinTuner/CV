import { SITE_URL } from "@/lib/site"
import { getLocalizedBlogPostsFromBackend } from "@/lib/notion-blog"

export const revalidate = 3600

const escapeXml = (value: string) =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;")

export async function GET() {
	const posts = await getLocalizedBlogPostsFromBackend("en")

	const items = posts
		.map((post) => {
			const url = `${SITE_URL}/blog/${post.slug}`
			const pubDate = new Date(post.date)
			const validDate = Number.isNaN(pubDate.getTime())
				? new Date().toUTCString()
				: pubDate.toUTCString()
			return [
				"      <item>",
				`        <title>${escapeXml(post.title)}</title>`,
				`        <link>${url}</link>`,
				`        <guid isPermaLink="true">${url}</guid>`,
				`        <pubDate>${validDate}</pubDate>`,
				`        <description>${escapeXml(post.excerpt)}</description>`,
				`        <category>${escapeXml(post.category)}</category>`,
				...post.tags.map(
					(tag) => `        <category>${escapeXml(tag)}</category>`,
				),
				"      </item>",
			].join("\n")
		})
		.join("\n")

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>WinTuner — Thanatphong Tarin's Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Technical articles, experiments, and insights from the digital laboratory.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`

	return new Response(xml, {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
			"Cache-Control": "s-maxage=3600, stale-while-revalidate",
		},
	})
}
