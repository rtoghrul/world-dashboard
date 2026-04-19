import { NextResponse } from 'next/server'
import { fetchRss, parseRSS } from '@/lib/rss'
import { translateTexts } from '@/lib/translate'

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
  const lang = searchParams.get('lang') || 'en'
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
      .slice(0, 12) as { title: string; description: string; [key: string]: unknown }[]

    if (lang !== 'en' && items.length) {
      const titles = items.map((i) => i.title)
      const descs = items.map((i) => i.description)
      const [translatedTitles, translatedDescs] = await Promise.all([
        translateTexts(titles, lang),
        translateTexts(descs, lang),
      ])
      items.forEach((item, i) => {
        item.title = translatedTitles[i]
        item.description = translatedDescs[i]
      })
    }

    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch engineering news' }, { status: 500 })
  }
}
