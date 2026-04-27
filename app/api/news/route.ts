import { NextResponse } from 'next/server'
import { translateTexts } from '@/lib/translate'

export const revalidate = 300

const RSS_FEEDS: Record<string, string[]> = {
  top: [
    'https://feeds.bbci.co.uk/news/world/rss.xml',
    'https://www.aljazeera.com/xml/rss/all.xml',
    'https://rss.cnn.com/rss/edition_world.rss',
  ],
  war: [
    'https://feeds.bbci.co.uk/news/world/rss.xml',
    'https://www.aljazeera.com/xml/rss/all.xml',
  ],
  politics: [
    'https://feeds.bbci.co.uk/news/politics/rss.xml',
    'https://rss.cnn.com/rss/edition.rss',
    'https://www.politico.com/rss/politics08.xml',
  ],
  economy: [
    'https://feeds.bbci.co.uk/news/business/rss.xml',
    'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',
  ],
  technology: [
    'https://techcrunch.com/feed/',
    'https://www.theverge.com/rss/index.xml',
  ],
  ai: [
    'https://techcrunch.com/category/artificial-intelligence/feed/',
    'https://feeds.feedburner.com/venturebeat/SZYF',
  ],
  industry: [
    'https://feeds.bbci.co.uk/news/business/rss.xml',
    'https://www.manufacturing.net/rss.xml',
  ],
  social: [
    'https://www.theverge.com/rss/index.xml',
    'https://techcrunch.com/category/social/feed/',
  ],
  cinema: [
    'https://variety.com/feed/',
    'https://www.hollywoodreporter.com/feed/',
  ],
  art: [
    'https://www.theartnewspaper.com/rss.xml',
    'https://www.smithsonianmag.com/rss/arts-culture/',
  ],
  sports: [
    'https://feeds.bbci.co.uk/sport/rss.xml',
    'https://www.espn.com/espn/rss/news',
  ],
  science: [
    'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
    'https://www.nasa.gov/rss/dyn/breaking_news.rss',
  ],
  health: [
    'https://feeds.bbci.co.uk/news/health/rss.xml',
    'https://www.who.int/rss-feeds/news-english.xml',
  ],
}

function extractThumbnail(block: string): string | null {
  const patterns = [
    /media:thumbnail[^>]+url="([^"]+)"/i,
    /media:content[^>]+url="([^"]+)"/i,
    /<enclosure[^>]+url="([^"]+)"[^>]+type="image/i,
    /og:image[^>]+content="([^"]+)"/i,
    /<img[^>]+src="([^"]+)"/i,
  ]
  for (const p of patterns) {
    const m = block.match(p)
    if (m && m[1] && m[1].startsWith('http')) return m[1]
  }
  const descImg = block.match(/<description[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"/i)
  if (descImg && descImg[1]?.startsWith('http')) return descImg[1]
  return null
}

function parseRSS(xml: string, source: string, category: string) {
  const items: { title: string; link: string; pubDate: string; description: string; thumbnail: string | null; source: string; category: string }[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]
    const get = (tag: string) => {
      const m = block.match(new RegExp(`<${tag}[^>]*>(?:<\\!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i'))
      return m ? m[1].trim() : ''
    }
    const linkMatch = block.match(/<link>([^<]+)<\/link>/) || block.match(/<link[^>]+href="([^"]+)"/)
    items.push({
      title: get('title'),
      link: linkMatch ? linkMatch[1].trim() : '',
      pubDate: get('pubDate') || get('dc:date'),
      description: get('description').replace(/<[^>]*>/g, '').slice(0, 150) + '...',
      thumbnail: extractThumbnail(block),
      source,
      category,
    })
    if (items.length >= 5) break
  }
  return items
}

async function fetchFeed(url: string, category: string) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WorldDashboard/1.0)' },
      next: { revalidate: 300 },
    })
    if (!res.ok) return []
    const xml = await res.text()
    const titleMatch = xml.match(/<channel>\s*<title>(?:<!\[CDATA\[)?([^\]<]+)/)
    const source = titleMatch ? titleMatch[1].trim() : url
    return parseRSS(xml, source, category)
  } catch {
    return []
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') || 'top'
  const lang = searchParams.get('lang') || 'en'
  const feeds = RSS_FEEDS[category] || RSS_FEEDS.top

  const results = await Promise.allSettled(feeds.map(url => fetchFeed(url, category)))
  const items = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => (r as PromiseFulfilledResult<unknown[]>).value)
    .slice(0, 12) as { title: string; description: string; [key: string]: unknown }[]

  if (lang !== 'en' && items.length) {
    const titles = items.map(i => i.title)
    const descs = items.map(i => i.description)
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
}
