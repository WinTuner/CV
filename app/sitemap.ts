import { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog-data'
import { SITE_URL } from "@/lib/site"
import { SUPPORTED_LANGUAGES, localePath } from '@/constants/languages'

type RouteOptions = {
  lastModified: Date
  changeFrequency: 'daily' | 'weekly' | 'monthly'
  priority: number
}

/** One entry per language, each carrying the full hreflang set. */
function localized(path: string, options: RouteOptions): MetadataRoute.Sitemap {
  const languages = {
    'x-default': `${SITE_URL}${localePath(path, 'en')}`,
    ...Object.fromEntries(
      SUPPORTED_LANGUAGES.map((l) => [l.hreflang, `${SITE_URL}${localePath(path, l.code)}`]),
    ),
  }

  return SUPPORTED_LANGUAGES.map((l) => ({
    url: `${SITE_URL}${localePath(path, l.code)}`,
    ...options,
    alternates: { languages },
  }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    ...localized('/', { lastModified: now, changeFrequency: 'weekly', priority: 1 }),
    ...localized('/blog', { lastModified: now, changeFrequency: 'daily', priority: 0.9 }),
    ...localized('/projects', { lastModified: now, changeFrequency: 'weekly', priority: 0.8 }),
    ...localized('/workbench', { lastModified: now, changeFrequency: 'weekly', priority: 0.7 }),
    ...localized('/introduction', { lastModified: now, changeFrequency: 'monthly', priority: 0.6 }),
    ...localized('/case-study/muanjai', { lastModified: now, changeFrequency: 'monthly', priority: 0.85 }),
    ...blogPosts.flatMap((post) =>
      localized(`/blog/${post.slug}`, {
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: post.featured ? 0.9 : 0.7,
      }),
    ),
  ]
}
