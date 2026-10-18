// Canonical site URL used for metadata, sitemap and robots.txt.
// Set NEXT_PUBLIC_SITE_URL when the site moves to a custom domain.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://world-dashboard-delta-umber.vercel.app').replace(/\/$/, '')
export const SITE_NAME = 'World Dashboard'
