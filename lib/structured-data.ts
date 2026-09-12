import type { BlogPost } from './blog-data'
import { AUTHOR_AVATAR, AUTHOR_NAME, CONTACT_MAILTO, GITHUB_USERNAME, SITE_URL, SOCIAL_LINKS } from './site'

export function generateBlogPostStructuredData(post: BlogPost, siteUrl: string, pageUrl?: string) {
  const resolvedPageUrl = pageUrl ?? `${siteUrl}/blog/${post.slug}`
  const published = new Date(post.date)
  const publishedIso = Number.isNaN(published.getTime()) ? undefined : published.toISOString()
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: `${siteUrl}/og-images/${post.slug}.png`,
    datePublished: publishedIso,
    dateModified: publishedIso,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: SOCIAL_LINKS.github,
    },
    publisher: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: SITE_URL,
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
    name: GITHUB_USERNAME,
    description: `A digital workshop where code meets curiosity. Experiments, prototypes, and open-source artifacts by ${AUTHOR_NAME}.`,
    url: url,
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: SOCIAL_LINKS.github,
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
    name: AUTHOR_NAME,
    alternateName: 'ธณัฐพงค์ ทะรินทร์',
    url: SITE_URL,
    image: `${SITE_URL}${AUTHOR_AVATAR}`,
    sameAs: [
      SOCIAL_LINKS.github,
      SOCIAL_LINKS.x,
      SOCIAL_LINKS.linkedin,
    ],
    jobTitle: 'Co-Founder & CTO',
    worksFor: [
      {
        '@type': 'Organization',
        name: 'Muanjai',
        url: SOCIAL_LINKS.lineOa,
      },
      {
        '@type': 'Organization',
        name: GITHUB_USERNAME,
      },
    ],
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'Chiang Mai University',
        department: 'College of Arts, Media and Technology (CAMT) — Digital Industry Integration (DII)',
      },
      {
        '@type': 'HighSchool',
        name: 'Chiang Rai Provincial Administrative Organization School',
      },
    ],
    knowsAbout: ['Agentic AI', 'RAG', 'LINE Messaging API', 'Next.js', 'Full-Stack Web', 'DevOps', 'PromptPay'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Chiang Mai',
      addressCountry: 'TH',
    },
    email: CONTACT_MAILTO,
  }
}
