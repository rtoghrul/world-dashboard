import { NextResponse } from 'next/server'
import { fetchRss, parseRSS } from '@/lib/rss'
import { translateTexts } from '@/lib/translate'

export const revalidate = 3600

const FEEDS: Record<string, string[]> = {
  math: [
    'https://phys.org/rss-feed/mathematics-news/',
    'https://www.sciencedaily.com/rss/mind_brain/mathematics.xml',
  ],
  physics: [
    'https://phys.org/rss-feed/physics-news/',
    'https://www.sciencedaily.com/rss/matter_energy/physics.xml',
  ],
  chemistry: [
    'https://phys.org/rss-feed/chemistry-news/',
    'https://www.sciencedaily.com/rss/matter_energy/chemistry.xml',
  ],
  biology: [
    'https://phys.org/rss-feed/biology-news/',
    'https://www.sciencedaily.com/rss/plants_animals/biology.xml',
  ],
  astronomy: [
    'https://phys.org/rss-feed/space-news/',
    'https://www.sciencedaily.com/rss/space_time/astronomy.xml',
  ],
  languages: [
    'https://phys.org/rss-feed/science-news/',
    'https://www.sciencedaily.com/rss/mind_brain/language.xml',
  ],
  anatomy: [
    'https://phys.org/rss-feed/medicine-news/',
    'https://www.sciencedaily.com/rss/health_medicine/human_biology.xml',
  ],
  geometry: [
    'https://phys.org/rss-feed/mathematics-news/',
    'https://www.sciencedaily.com/rss/mind_brain/mathematics.xml',
  ],
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const subject = searchParams.get('subject') || 'physics'
  const lang = searchParams.get('lang') || 'en'
  const feeds = FEEDS[subject] || FEEDS.physics

  try {
    const results = await Promise.allSettled(
      feeds.map(async (url) => {
        const xml = await fetchRss(url, 3600)
        if (!xml) return []
        return parseRSS(xml, url)
      }),
    )

    const items = results
      .filter((r) => r.status === 'fulfilled')
      .flatMap((r) => (r as PromiseFulfilledResult<unknown[]>).value)
      .filter((item: any) => item?.title && item?.link)
      .slice(0, 8) as { title: string; description: string; [key: string]: unknown }[]

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
    return NextResponse.json({ error: 'Failed to fetch education news' }, { status: 500 })
  }
}
