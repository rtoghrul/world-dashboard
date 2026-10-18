import type { Metadata } from 'next'
import { SITE_NAME } from './site'

/**
 * Metadata for one page. Next.js replaces (not merges) nested `openGraph`/`twitter` objects,
 * so every page has to set its own image and site name, or it would lose the root ones.
 */
export function pageMetadata(path: string, title: string, description: string, extra: Partial<Metadata> = {}): Metadata {
  const image = { url: `/api/og?title=${encodeURIComponent(title)}`, width: 1200, height: 630, alt: `${title} | ${SITE_NAME}` }
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: 'website', siteName: SITE_NAME, title: `${title} | ${SITE_NAME}`, description, url: path, images: [image] },
    twitter: { card: 'summary_large_image', title: `${title} | ${SITE_NAME}`, description, images: [image.url] },
    ...extra,
  }
}
