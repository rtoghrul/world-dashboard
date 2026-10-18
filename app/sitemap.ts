import type { MetadataRoute } from 'next'
import { menus } from '@/lib/menus'
import { factCategories } from '@/lib/facts'
import { SITE_URL } from '@/lib/site'

// Generated from the navigation menus so new sections are listed automatically
// and removed ones (which used to 404 here) drop out.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()
  const pages = ['/benefits', '/crypto', '/stocks', '/polymarket', '/savings', '/nearby', '/facts']
  const sectionPaths = Array.from(new Set(
    Object.entries(menus).flatMap(([id, section]) =>
      section.items.map(item => item.href || `/section/${item.section || id}/${item.id}`)
    )
  )).filter(p => !pages.includes(p))
  const factPaths = factCategories.map(c => `/facts/${c.id}`)

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'hourly', priority: 1 },
    ...pages.map(p => ({ url: `${SITE_URL}${p}`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.9 })),
    ...sectionPaths.map(p => ({ url: `${SITE_URL}${p}`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 })),
    ...factPaths.map(p => ({ url: `${SITE_URL}${p}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.6 })),
  ]
}
