import { BlogHero } from "@/components/public/blog/blog-hero";
import { BlogList } from "@/components/public/blog/blog-list";
import { BlogSidebar } from "@/components/public/blog/blog-sidebar";
import { cookies } from "next/headers";
import type { BlogLanguage } from "@/lib/blog-data";
import mediumBlogApi from "@/lib/medium-blog";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thanatphong.vercel.app';

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

export default async function BlogPage() {
  const cookieStore = await cookies();
  const cookieLanguage = cookieStore.get("site-language")?.value;
  const language: BlogLanguage = cookieLanguage === "th" ? "th" : "en";

  const posts = await mediumBlogApi.getMediumPosts()

  return (
    <div>
      <BlogHero />
      <section className="px-4 sm:px-6 py-16 sm:py-20 border-t border-border/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            <BlogList posts={posts} language={language} />
            <BlogSidebar />
          </div>
        </div>
      </section>
    </div>
  );
}
