import { Client } from "@notionhq/client"

// Initialize Notion Client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const DATABASE_ID = "34b53c4ab3eb80f0932ef966044aa4fb"

/**
 * Interface สำหรับข้อมูลบทความจาก Notion
 */
export interface NotionPost {
  id: string
  title: string
  slug: string
  date: string
  status: string
  excerpt: string
  tags: string[]
  content?: string
}

/**
 * ฟังก์ชัน Helper สำหรับดึงค่าจาก Property ต่างๆ ของ Notion
 */
const getPropertyValue = (prop: any): any => {
  if (!prop) return null

  switch (prop.type) {
    case "title":
      return prop.title?.map((t: any) => t.plain_text).join("") || ""
    case "rich_text":
      return prop.rich_text?.map((t: any) => t.plain_text).join("") || ""
    case "select":
      return prop.select?.name || ""
    case "multi_select":
      return prop.multi_select?.map((s: any) => s.name) || []
    case "date":
      return prop.date?.start || ""
    case "formula":
      return prop.formula?.string || prop.formula?.text || ""
    default:
      return null
  }
}

/**
 * ดึงรายการบทความทั้งหมดที่สถานะเป็น 'Published' เรียงตามวันที่ล่าสุด
 */
export async function getBlogPosts(): Promise<NotionPost[]> {
  try {
    const response = await (notion.databases as any).query({
      database_id: DATABASE_ID,
      filter: {
        property: "Status",
        select: {
          equals: "Published",
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    })

    return response.results.map((page: any) => {
      const p = page as any
      return {
        id: p.id,
        title: getPropertyValue(p.properties.Title),
        slug: getPropertyValue(p.properties.Slug),
        date: getPropertyValue(p.properties.Date),
        status: getPropertyValue(p.properties.Status),
        excerpt: getPropertyValue(p.properties.Excerpt),
        tags: getPropertyValue(p.properties.Tags),
      }
    })
  } catch (error) {
    console.error("Error fetching blog posts from Notion:", error)
    return []
  }
}

/**
 * ดึงเนื้อหาบทความหนึ่งรายการโดยหาจากค่า Slug
 */
export async function getSinglePost(slug: string): Promise<NotionPost | null> {
  try {
    const response = await (notion.databases as any).query({
      database_id: DATABASE_ID,
      filter: {
        property: "Slug",
        rich_text: {
          equals: slug,
        },
      },
    })

    if (response.results.length === 0) {
      return null
    }

    const p = response.results[0] as any
    
    // ดึงเนื้อหาภายในหน้า (Blocks)
    const content = await getPageContent(p.id)

    return {
      id: p.id,
      title: getPropertyValue(p.properties.Title),
      slug: getPropertyValue(p.properties.Slug),
      date: getPropertyValue(p.properties.Date),
      status: getPropertyValue(p.properties.Status),
      excerpt: getPropertyValue(p.properties.Excerpt),
      tags: getPropertyValue(p.properties.Tags),
      content,
    }
  } catch (error) {
    console.error(`Error fetching single post with slug ${slug}:`, error)
    return null
  }
}

/**
 * ดึง Blocks ทั้งหมดในหน้าและแปลงเป็น Markdown แบบง่าย
 */
export async function getPageContent(pageId: string): Promise<string> {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
    })

    const blocks = response.results as any[]
    const markdown = blocks.map((block) => {
      const type = block.type
      const value = block[type]

      switch (type) {
        case "paragraph":
          return value.rich_text?.map((t: any) => t.plain_text).join("") || ""
        case "heading_1":
          return `# ${value.rich_text?.map((t: any) => t.plain_text).join("")}`
        case "heading_2":
          return `## ${value.rich_text?.map((t: any) => t.plain_text).join("")}`
        case "heading_3":
          return `### ${value.rich_text?.map((t: any) => t.plain_text).join("")}`
        case "bulleted_list_item":
          return `- ${value.rich_text?.map((t: any) => t.plain_text).join("")}`
        case "numbered_list_item":
          return `1. ${value.rich_text?.map((t: any) => t.plain_text).join("")}`
        case "code":
          return `\`\`\`${value.language}\n${value.rich_text?.map((t: any) => t.plain_text).join("")}\n\`\`\``
        case "divider":
          return "---"
        default:
          return ""
      }
    })

    return markdown.join("\n\n")
  } catch (error) {
    console.error("Error fetching page content from Notion:", error)
    return ""
  }
}

/**
 * ตัวอย่างการใช้งานใน Server Component (Next.js App Router)
 * 
 * export default async function Page() {
 *   const posts = await getBlogPosts()
 *   return (
 *     <div>
 *       {posts.map(post => (
 *         <div key={post.id}>{post.title}</div>
 *       ))}
 *     </div>
 *   )
 * }
 */
