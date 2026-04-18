import { NextResponse } from 'next/server'

export const revalidate = 3600

const FEEDS: Record<string, string> = {
  math:       'https://www.sciencedaily.com/rss/mind_brain/mathematics.xml',
  physics:    'https://www.sciencedaily.com/rss/matter_energy/physics.xml',
  chemistry:  'https://www.sciencedaily.com/rss/matter_energy/chemistry.xml',
  biology:    'https://www.sciencedaily.com/rss/plants_animals/biology.xml',
  astronomy:  'https://www.sciencedaily.com/rss/space_time/astronomy.xml',
  languages:  'https://www.sciencedaily.com/rss/mind_brain/language.xml',
  anatomy:    'https://www.sciencedaily.com/rss/health_medicine/human_biology.xml',
  geometry:   'https://www.sciencedaily.com/rss/mind_brain/mathematics.xml',
}

function parseRSS(xml: string) {
  const items: { title: string; link: string; pubDate: string; description: string }[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let m
  while ((m = itemRegex.exec(xml)) !== null) {
    const block = m[1]
    const get = (tag: string) => {
      const match = block.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`))
      return match ? match[1].trim() : ''
    }
    items.push({
      title: get('title'),
      link: get('link') || get('guid'),
      pubDate: get('pubDate'),
      description: get('description').replace(/<[^>]+>/g, '').slice(0, 180),
    })
    if (items.length >= 6) break
  }
  return items
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const subject = searchParams.get('subject') || 'physics'
  const feedUrl = FEEDS[subject] || FEEDS.physics

  try {
    const res = await fetch(feedUrl, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error('Feed error')
    const xml = await res.text()
    const items = parseRSS(xml)
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch education news' }, { status: 500 })
  }
}
