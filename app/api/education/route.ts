import { NextResponse } from 'next/server'
import { fetchRss, parseRSS } from '@/lib/rss'

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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const subject = searchParams.get('subject') || 'physics'
  const feedUrl = FEEDS[subject] || FEEDS.physics

  try {
    const xml = await fetchRss(feedUrl, 3600)
    if (!xml) throw new Error('Feed error')
    const items = parseRSS(xml, 'ScienceDaily').slice(0, 6)
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch education news' }, { status: 500 })
  }
}
