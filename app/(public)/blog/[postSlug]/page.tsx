import { notFound } from "next/navigation";
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  localePath,
} from "@/constants/languages";
import { getRequestLocale } from "@/lib/seo";
import { BlogPostContent } from "@/components/public/blog/blog-post-content";
import { generateBlogPostStructuredData } from "@/lib/structured-data";
import type { Metadata } from "next";
import {
  getLocalizedBlogPostsFromBackend,
  getLocalizedPostBySlugFromBackend,
  getLocalizedRelatedPostsFromBackend,
} from "@/lib/notion-blog";
import { Suspense } from "react";
import { SITE_URL } from "@/lib/site"
import { absoluteImg } from "@/lib/images"
import { toSafeJsonLd } from "@/lib/security"

export const revalidate = 3600

interface BlogPostPageProps {
  params: Promise<{ postSlug: string }>;
}

export async function generateStaticParams() {
  const posts = await getLocalizedBlogPostsFromBackend("en")

  return posts.map((post) => ({
    postSlug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { postSlug } = await params;
  const { language } = await getRequestLocale();
  const post = await getLocalizedPostBySlugFromBackend(postSlug, language);

  if (!post) {
    return {
      title: language === "th" ? "ไม่พบบทความ" : language === "ja" ? "記事が見つかりません" : language === "zh" ? "未找到文章" : "Post Not Found",
    };
  }

  const baseUrl = SITE_URL;
  const postPath = localePath(`/blog/${post.slug}`, language);
  const postUrl = `${baseUrl}${postPath}`;
  const ogImageUrl = absoluteImg(`/og-images/${post.slug}.png`, baseUrl);

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    keywords: post.tags,
    openGraph: {
      type: "article",
      url: postUrl,
      title: post.title,
      description: post.excerpt,
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    alternates: {
      canonical: postPath,
      languages: {
        "x-default": localePath(`/blog/${post.slug}`, DEFAULT_LANGUAGE),
        ...Object.fromEntries(
          SUPPORTED_LANGUAGES.map((l) => [l.hreflang, localePath(`/blog/${post.slug}`, l.code)]),
        ),
      },
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { postSlug } = await params;
  const { language } = await getRequestLocale();
  const post = await getLocalizedPostBySlugFromBackend(postSlug, language);

  if (!post) {
    notFound();
  }

  const baseUrl = SITE_URL;
  const postUrl = `${baseUrl}${localePath(`/blog/${post.slug}`, language)}`;
  const structuredData = generateBlogPostStructuredData(post, baseUrl, postUrl);
  const relatedPosts = await getLocalizedRelatedPostsFromBackend(post.slug, language)

return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toSafeJsonLd(structuredData) }}
      />
      <div id="main">
        {/* 2. ครอบด้วย Suspense ตรงนี้ครับ */}
        <Suspense fallback={<div className="min-h-screen animate-pulse bg-muted" />}>
          <BlogPostContent 
            post={post} 
            language={language} 
            relatedPosts={relatedPosts} 
          />
        </Suspense>
      </div>
    </>
  );
}


