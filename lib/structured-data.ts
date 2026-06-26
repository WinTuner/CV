import type { BlogPost } from './blog-data'

export function generateBlogPostStructuredData(post: BlogPost, siteUrl: string, pageUrl?: string) {
  const resolvedPageUrl = pageUrl ?? `${siteUrl}/blog/${post.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: `${siteUrl}/og-images/${post.slug}.png`,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: 'https://github.com/WinTuner',
    },
    publisher: {
      '@type': 'Person',
      name: 'Thanatphong Tarin',
      url: 'https://thanatphong.vercel.app',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': resolvedPageUrl,
    },
    articleSection: post.category,
    keywords: post.tags.join(', '),
    timeRequired: post.readTime,
  }
}

export function generateWebsiteStructuredData(url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'WinTuner',
    description: "A digital workshop where code meets curiosity. Experiments, prototypes, and open-source artifacts by Thanatphong Tarin.",
    url: url,
    author: {
      '@type': 'Person',
      name: 'Thanatphong Tarin',
      url: 'https://github.com/WinTuner',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/blog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generatePersonStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Thanatphong Tarin',
    url: 'https://thanatphong.vercel.app',
    image: 'https://thanatphong.vercel.app/developer-portrait.png',
    sameAs: [
      'https://github.com/WinTuner',
      'https://x.com/nut89189886',
      'https://www.linkedin.com/in/thanatphong-tarin-1b6619385/',
    ],
    jobTitle: 'Software Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'WinTuner',
    },
  }
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
