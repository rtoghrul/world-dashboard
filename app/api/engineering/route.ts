import { NextResponse } from 'next/server'
import { fetchRss, parseRSS } from '@/lib/rss'

export const revalidate = 900

const FEEDS: Record<string, string[]> = {
  automation: [
    'https://spectrum.ieee.org/feeds/topic/robotics.rss',
    'https://www.automationworld.com/rss.xml',
  ],
  electrical: [
    'https://www.eetimes.com/feed/',
    'https://spectrum.ieee.org/feeds/topic/semiconductors.rss',
  ],
  mechanical: [
    'https://www.asme.org/rss?topic=technology',
    'https://www.engineering.com/rss/',
  ],
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const topic = searchParams.get('topic') || 'automation'
  const feeds = FEEDS[topic] || FEEDS.automation

  try {
    const results = await Promise.allSettled(
      feeds.map(async (url) => {
        const xml = await fetchRss(url, revalidate)
        if (!xml) return []
        return parseRSS(xml, url)
      }),
    )

    const items = results
      .filter((r) => r.status === 'fulfilled')
      .flatMap((r) => (r as PromiseFulfilledResult<unknown[]>).value)
      .filter((item: any) => item?.title && item?.link)
      .slice(0, 12)

    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch engineering news' }, { status: 500 })
  }
}
