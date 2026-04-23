export interface MediumPost {
  id: number
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  tags: string[]
  featured: boolean
  color: string
  externalUrl: string
  author: {
    name: string
    avatar: string
    role: string
  }
}

const FEED_URL = "https://medium.com/feed/@thanatphong2719"

function decodeHtml(text: string) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function stripHtml(input: string) {
  return decodeHtml(input)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function extractFirst(text: string, regex: RegExp): string {
  const match = text.match(regex)
  return match?.[1]?.trim() ?? ""
}

function buildExcerpt(content: string) {
  const plain = stripHtml(content)
  return plain.length > 180 ? `${plain.slice(0, 177)}...` : plain
}

function estimateReadTime(content: string) {
  const words = stripHtml(content).split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}

function formatDate(dateText: string) {
  const date = new Date(dateText)
  if (Number.isNaN(date.getTime())) return dateText
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function slugFromLink(link: string, fallbackId: number) {
  const lastPart = link.split("/").filter(Boolean).pop() ?? ""
  const slug = lastPart.replace(/[?#].*$/, "")
  return slug || `medium-post-${fallbackId}`
}

export async function getMediumPosts(limit = 12): Promise<MediumPost[]> {
  const response = await fetch(FEED_URL, { next: { revalidate: 900 } })
  if (!response.ok) {
    throw new Error(`Failed to fetch Medium feed: ${response.status}`)
  }

  const xml = await response.text()
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? []

  return items.slice(0, limit).map((item, index) => {
    const title = extractFirst(item, /<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)
    const link = extractFirst(item, /<link>([\s\S]*?)<\/link>/)
    const pubDate = extractFirst(item, /<pubDate>([\s\S]*?)<\/pubDate>/)
    const content = extractFirst(item, /<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/)
    const categories = [...item.matchAll(/<category><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g)].map((m) => m[1])

    return {
      id: index + 1,
      slug: slugFromLink(link, index + 1),
      title: decodeHtml(title),
      excerpt: buildExcerpt(content),
      date: formatDate(pubDate),
      readTime: estimateReadTime(content),
      category: "medium",
      tags: categories.slice(0, 5),
      featured: index === 0,
      color: "from-primary/20 to-accent/20",
      externalUrl: link,
      author: {
        name: "Thanatphong Tarin",
        avatar: "/developer-portrait.png",
        role: "Writer",
      },
    }
  })
}

const mediumBlogApi = {
  getMediumPosts,
}

export default mediumBlogApi
