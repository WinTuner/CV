import { blogPosts, localizePost, type BlogLanguage, type BlogPost, getPostBySlug } from "@/lib/blog-data"

type NotionProperty = {
  type: string
  [key: string]: unknown
}

type NotionPage = {
  id: string
  properties: Record<string, NotionProperty>
}

type NotionListResponse = {
  results: NotionPage[]
  next_cursor: string | null
  has_more: boolean
}

const notionApiVersion = "2022-06-28"

const globalForNotion = globalThis as unknown as {
  notionPostsCache?: { data: BlogPost[]; timestamp: number }
}

const CACHE_DURATION = 120 * 1000 // 2 minutes in-memory cache

function hasNotionConfig() {
  return Boolean(process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID)
}

function getTextValue(property?: NotionProperty): string {
  if (!property) return ""

  if (property.type === "title" || property.type === "rich_text") {
    const items = Array.isArray(property[property.type]) ? (property[property.type] as Array<{ plain_text?: string }>) : []
    return items.map((item) => item.plain_text ?? "").join("")
  }

  if (property.type === "select") {
    return typeof property.select === "object" && property.select && "name" in property.select
      ? String((property.select as { name?: string }).name ?? "")
      : ""
  }

  if (property.type === "url") {
    return typeof property.url === "string" ? property.url : ""
  }

  if (property.type === "number") {
    return typeof property.number === "number" ? String(property.number) : ""
  }

  if (property.type === "date") {
    return typeof property.date === "object" && property.date && "start" in property.date
      ? String((property.date as { start?: string }).start ?? "")
      : ""
  }

  return ""
}

function getBooleanValue(property?: NotionProperty): boolean {
  return Boolean(property && property.type === "checkbox" && property.checkbox)
}

function getMultiSelectValues(property?: NotionProperty): string[] {
  if (!property || property.type !== "multi_select" || !Array.isArray(property.multi_select)) return []
  return (property.multi_select as Array<{ name?: string }>)
    .map((item) => item.name?.trim())
    .filter((value): value is string => Boolean(value))
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0E00-\u0E7F]+/g, "-")
    .replace(/^-+|-+$/g, "") || "untitled-post"
}

async function notionFetch(path: string, init?: RequestInit) {
  const response = await fetch(`https://api.notion.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_KEY ?? ""}`,
      "Notion-Version": notionApiVersion,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    throw new Error(`Notion request failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

async function fetchAllDatabasePages(): Promise<NotionPage[]> {
  if (!hasNotionConfig()) return []

  const databaseId = process.env.NOTION_DATABASE_ID as string
  const pages: NotionPage[] = []
  let cursor: string | undefined

  do {
    const payload = cursor ? { start_cursor: cursor } : {}
    const data = (await notionFetch(`/databases/${databaseId}/query`, {
      method: "POST",
      body: JSON.stringify(payload),
    })) as NotionListResponse

    pages.push(...data.results)
    cursor = data.has_more ? data.next_cursor ?? undefined : undefined
  } while (cursor)

  return pages
}

async function fetchPageBlocks(pageId: string): Promise<string> {
  if (!hasNotionConfig()) return ""

  type NotionBlock = { id: string; type: string; has_children?: boolean; [key: string]: unknown }
  const blocks: NotionBlock[] = []
  let cursor: string | undefined

  do {
    const query = cursor ? `?page_size=100&start_cursor=${cursor}` : "?page_size=100"
    const data = (await notionFetch(`/blocks/${pageId}/children${query}`)) as NotionListResponse
    blocks.push(...(data.results as unknown as NotionBlock[]))
    cursor = data.has_more ? data.next_cursor ?? undefined : undefined
  } while (cursor)

  const lines: string[] = []

  for (const block of blocks) {
    const richText = (block[block.type] as { rich_text?: Array<{ plain_text?: string }>; text?: Array<{ plain_text?: string }>; language?: string } | undefined) ?? {}
    const text = (richText.rich_text ?? richText.text ?? []).map((item) => item.plain_text ?? "").join("")

    if (block.type.startsWith("heading_")) {
      const level = block.type === "heading_1" ? "#" : block.type === "heading_2" ? "##" : "###"
      if (text) lines.push(`${level} ${text}`)
      continue
    }

    if (block.type === "paragraph") {
      if (text) lines.push(text)
      continue
    }

    if (block.type === "bulleted_list_item") {
      if (text) lines.push(`- ${text}`)
      continue
    }

    if (block.type === "numbered_list_item") {
      if (text) lines.push(`1. ${text}`)
      continue
    }

    if (block.type === "quote") {
      if (text) lines.push(`> ${text}`)
      continue
    }

    if (block.type === "code") {
      const language = typeof richText.language === "string" ? richText.language : "text"
      lines.push(`\`\`\`${language}`)
      if (text) lines.push(text)
      lines.push("\`\`\`")
      continue
    }

    if (block.type === "divider") {
      lines.push("---")
    }
  }

  return lines.join("\n\n")
}

function mapNotionPageToPost(page: NotionPage): Promise<BlogPost> | BlogPost {
  const fallbackPost = getPostBySlug(
    getTextValue(page.properties.Slug) || toSlug(getTextValue(page.properties.Title) || getTextValue(page.properties.Name) || page.id),
  )

  const slug = getTextValue(page.properties.Slug) || fallbackPost?.slug || toSlug(getTextValue(page.properties.Title) || getTextValue(page.properties.Name) || page.id)
  const title = getTextValue(page.properties.Title) || getTextValue(page.properties.Name) || fallbackPost?.title || slug
  const excerpt = getTextValue(page.properties.Excerpt) || fallbackPost?.excerpt || ""
  const date = getTextValue(page.properties.Date) || fallbackPost?.date || new Date().toISOString()
  const readTime = getTextValue(page.properties["Read Time"]) || fallbackPost?.readTime || "5 min read"
  const category = getTextValue(page.properties.Category) || fallbackPost?.category || "general"
  const tags = getMultiSelectValues(page.properties.Tags).length > 0 ? getMultiSelectValues(page.properties.Tags) : fallbackPost?.tags || []
  const featured = getBooleanValue(page.properties.Featured) || fallbackPost?.featured || false
  const color = getTextValue(page.properties.Color) || fallbackPost?.color || "from-primary/20 to-accent/20"
  const authorName = getTextValue(page.properties["Author Name"]) || getTextValue(page.properties.Author) || fallbackPost?.author.name || "Thanatphong Tarin"
  const authorAvatar = getTextValue(page.properties.Avatar) || fallbackPost?.author.avatar || "/developer-portrait-v3.png"
  const authorRole = getTextValue(page.properties.Role) || fallbackPost?.author.role || "Writer"

  const contentFromProperty = getTextValue(page.properties.Content)

  return Promise.resolve(fetchPageBlocks(page.id)).then((contentFromBlocks) => ({
    id: Number.parseInt(page.id.replace(/\D/g, "").slice(0, 6) || "0", 10) || Date.now(),
    slug,
    title,
    excerpt,
    content: contentFromBlocks || contentFromProperty || fallbackPost?.content || "",
    date,
    readTime,
    category,
    tags,
    author: {
      name: authorName,
      avatar: authorAvatar,
      role: authorRole,
    },
    featured,
    color,
  }))
}

async function getPostsFromNotionOrFallback(): Promise<BlogPost[]> {
  const now = Date.now()
  if (globalForNotion.notionPostsCache && (now - globalForNotion.notionPostsCache.timestamp < CACHE_DURATION)) {
    return globalForNotion.notionPostsCache.data
  }

  const pages = await fetchAllDatabasePages()

  if (!pages.length) {
    return blogPosts
  }

  const mappedPosts = await Promise.all(pages.map((page) => mapNotionPageToPost(page)))
  const result = mappedPosts.length > 0 ? mappedPosts : blogPosts

  globalForNotion.notionPostsCache = { data: result, timestamp: now }
  return result
}

export async function getLocalizedBlogPostsFromBackend(language: BlogLanguage): Promise<BlogPost[]> {
  const posts = await getPostsFromNotionOrFallback()
  return posts.map((post) => localizePost(post, language))
}

export async function getLocalizedPostBySlugFromBackend(slug: string, language: BlogLanguage): Promise<BlogPost | undefined> {
  const posts = await getPostsFromNotionOrFallback()
  const post = posts.find((item) => item.slug === slug)
  return post ? localizePost(post, language) : undefined
}

export async function getLocalizedRelatedPostsFromBackend(currentSlug: string, language: BlogLanguage, limit = 3): Promise<BlogPost[]> {
  const posts = await getPostsFromNotionOrFallback()
  const currentPost = posts.find((post) => post.slug === currentSlug)

  if (!currentPost) return []

  return posts
    .filter((post) => post.slug !== currentSlug)
    .filter((post) => post.category === currentPost.category || post.tags.some((tag) => currentPost.tags.includes(tag)))
    .slice(0, limit)
    .map((post) => localizePost(post, language))
}
