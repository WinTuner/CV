import type { BlogPost } from './blog-data'
import { SITE_URL } from './site'

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
      url: 'https://github.com/WinTuner',
    },
    publisher: {
      '@type': 'Person',
      name: 'Thanatphong Tarin',
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
    alternateName: 'ธณัฐพงค์ ทะรินทร์',
    url: SITE_URL,
    image: `${SITE_URL}/developer-portrait-v3.png`,
    sameAs: [
      'https://github.com/WinTuner',
      'https://x.com/nut89189886',
      'https://www.linkedin.com/in/thanatphong-tarin-1b6619385/',
    ],
    jobTitle: 'Co-Founder & CTO',
    worksFor: [
      {
        '@type': 'Organization',
        name: 'Muanjai',
        url: 'https://line.me/R/ti/p/%40636owbhl',
      },
      {
        '@type': 'Organization',
        name: 'WinTuner',
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
    email: 'mailto:Thanatphong2719@gmail.com',
  }
}
