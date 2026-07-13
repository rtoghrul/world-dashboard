import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://world-dashboard-delta-umber.vercel.app'
  const now = new Date().toISOString()

  const sections = [
    'news/top', 'news/war', 'news/politics', 'news/economy', 'news/tech', 'news/ai', 'news/science', 'news/sports', 'news/health',
    'markets/crypto-top', 'markets/bitcoin', 'markets/stocks-top', 'markets/gainers', 'markets/losers',
    'entertainment/movies', 'entertainment/series', 'entertainment/anime', 'entertainment/gaming',
    'viral/youtube', 'viral/tiktok', 'viral/instagram', 'viral/trending',
    'aitools/chatbots', 'aitools/image-gen', 'aitools/video-gen', 'aitools/writing', 'aitools/coding', 'aitools/free-tools',
    'software/android', 'software/ios', 'software/windows', 'software/mac', 'software/browser-ext',
    'education/science', 'education/engineering', 'education/courses',
    'health/pharmacy', 'health/symptoms', 'health/insurance', 'health/fitness',
    'travel/flight-hotel', 'travel/flight', 'travel/hotel',
    'weather/current',
  ]

  return [
    { url: base, lastModified: now, changeFrequency: 'hourly', priority: 1 },
    { url: `${base}/benefits`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    ...sections.map(s => ({
      url: `${base}/section/${s}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  ]
}
