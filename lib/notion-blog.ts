import { blogPosts, localizePost, type BlogLanguage, type BlogPost, getPostBySlug } from "@/lib/blog-data"
import { AUTHOR_AVATAR, AUTHOR_NAME } from "@/lib/site"
import { slugify } from "@/lib/fuzzy"

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
  return slugify(value) || "untitled-post"
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

type NotionBlock = { id: string; type: string; has_children?: boolean; [key: string]: unknown }

function getBlockText(block: NotionBlock): { text: string; language: string } {
  const payload = (block[block.type] as { rich_text?: Array<{ plain_text?: string }>; text?: Array<{ plain_text?: string }>; language?: string } | undefined) ?? {}
  const text = (payload.rich_text ?? payload.text ?? []).map((item) => item.plain_text ?? "").join("")
  const language = typeof payload.language === "string" ? payload.language : "text"
  return { text, language }
}

const HEADING_PREFIX: Record<string, string> = {
  heading_1: "#",
  heading_2: "##",
  heading_3: "###",
}

function blockToMarkdown(block: NotionBlock): string | null {
  const { text, language } = getBlockText(block)

  if (block.type in HEADING_PREFIX) {
    return text ? `${HEADING_PREFIX[block.type]} ${text}` : null
  }

  switch (block.type) {
    case "paragraph":
      return text || null
    case "bulleted_list_item":
      return text ? `- ${text}` : null
    case "numbered_list_item":
      return text ? `1. ${text}` : null
    case "quote":
      return text ? `> ${text}` : null
    case "code":
      return `\`\`\`${language}\n${text}\n\`\`\``
    case "divider":
      return "---"
    default:
      return null
  }
}

async function fetchPageBlocks(pageId: string): Promise<string> {
  if (!hasNotionConfig()) return ""

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
    const line = blockToMarkdown(block)
    if (line) lines.push(line)
  }

  return lines.join("\n\n")
}

async function mapNotionPageToPost(page: NotionPage): Promise<BlogPost> {
  const props = page.properties
  const titleText = getTextValue(props.Title) || getTextValue(props.Name)
  const slugText = getTextValue(props.Slug)
  const fallbackPost = getPostBySlug(slugText || toSlug(titleText || page.id))

  const slug = slugText || fallbackPost?.slug || toSlug(titleText || page.id)
  const tags = getMultiSelectValues(props.Tags)

  const contentFromProperty = getTextValue(props.Content)
  const contentFromBlocks = await fetchPageBlocks(page.id)

  return {
    id: Number.parseInt(page.id.replace(/\D/g, "").slice(0, 6) || "0", 10) || Date.now(),
    slug,
    title: titleText || fallbackPost?.title || slug,
    excerpt: getTextValue(props.Excerpt) || fallbackPost?.excerpt || "",
    content: contentFromBlocks || contentFromProperty || fallbackPost?.content || "",
    date: getTextValue(props.Date) || fallbackPost?.date || new Date().toISOString(),
    readTime: getTextValue(props["Read Time"]) || fallbackPost?.readTime || "5 min read",
    category: getTextValue(props.Category) || fallbackPost?.category || "general",
    tags: tags.length > 0 ? tags : fallbackPost?.tags || [],
    author: {
      name: getTextValue(props["Author Name"]) || getTextValue(props.Author) || fallbackPost?.author.name || AUTHOR_NAME,
      avatar: getTextValue(props.Avatar) || fallbackPost?.author.avatar || AUTHOR_AVATAR,
      role: getTextValue(props.Role) || fallbackPost?.author.role || "Writer",
    },
    featured: getBooleanValue(props.Featured) || fallbackPost?.featured || false,
    color: getTextValue(props.Color) || fallbackPost?.color || "from-primary/20 to-accent/20",
  }
}

async function getPostsFromNotionOrFallback(): Promise<BlogPost[]> {
  const now = Date.now()
  if (globalForNotion.notionPostsCache && (now - globalForNotion.notionPostsCache.timestamp < CACHE_DURATION)) {
    return globalForNotion.notionPostsCache.data
  }

  try {
    const pages = await fetchAllDatabasePages()

    if (!pages.length) {
      return blogPosts
    }

    const mappedPosts = await Promise.all(pages.map((page) => mapNotionPageToPost(page)))
    const result = mappedPosts.length > 0 ? mappedPosts : blogPosts

    globalForNotion.notionPostsCache = { data: result, timestamp: now }
    return result
  } catch (error) {
    console.error("Notion fetch failed, falling back to static posts:", error)
    return blogPosts
  }
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
