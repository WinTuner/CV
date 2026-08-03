import { BlogHero } from "@/components/public/blog/blog-hero";
import { BlogList } from "@/components/public/blog/blog-list";
import { BlogSidebar } from "@/components/public/blog/blog-sidebar";
import { cookies } from "next/headers";
import type { BlogLanguage } from "@/lib/blog-data";
import { getLocalizedBlogPostsFromBackend } from "@/lib/notion-blog";
import mediumBlogApi from "@/lib/medium-blog";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site"

const baseUrl = SITE_URL;

export const metadata: Metadata = {
  title: "Blog",
  description: "Technical articles, experiments, and insights from the digital laboratory. Exploring systems programming, web development, AI, and more.",
  openGraph: {
    title: "Blog — WinTuner",
    description: "Technical articles, experiments, and insights from the digital laboratory.",
    url: `${baseUrl}/blog`,
    type: "website",
    images: [
      {
        url: `${baseUrl}/og-image-blog.png`,
        width: 1200,
        height: 630,
        alt: "WinTuner Blog",
      },
    ],
  },
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
};

interface BlogPageProps {
  searchParams: Promise<{
    category?: string
    tag?: string
    q?: string
  }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category, tag, q } = await searchParams
  const cookieStore = await cookies()
  const cookieLanguage = cookieStore.get("site-language")?.value
  const language: BlogLanguage = cookieLanguage === "th" ? "th" : "en"

  // Fetch both Notion/Local and Medium posts in parallel
  const [localPosts, mediumPosts] = await Promise.all([
    getLocalizedBlogPostsFromBackend(language),
    mediumBlogApi.getMediumPosts().catch(() => [])
  ])

  // Merge and sort all posts by date descending
  const allPosts = [...localPosts, ...mediumPosts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  // Filter posts based on query params
  let filteredPosts = allPosts

  if (category && category !== "all") {
    filteredPosts = filteredPosts.filter(post => 
      post.category.toLowerCase() === category.toLowerCase()
    )
  }

  if (tag) {
    filteredPosts = filteredPosts.filter(post => 
      post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    )
  }

  if (q) {
    const searchLow = q.toLowerCase()
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchLow) || 
      post.excerpt.toLowerCase().includes(searchLow) ||
      post.tags.some(t => t.toLowerCase().includes(searchLow))
    )
  }

  return (
    <div id="main">
      <BlogHero />
      <section className="px-4 sm:px-6 py-16 sm:py-20 border-t border-border/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            <div className="order-2 lg:order-1">
              <BlogList posts={filteredPosts} language={language} />
            </div>
            <div className="order-1 lg:order-2">
              <BlogSidebar posts={allPosts} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
