import { NextRequest, NextResponse } from 'next/server'
import { translateTexts } from '@/lib/translate'

export const revalidate = 600

const SECTION_FEEDS: Record<string, Record<string, string[]>> = {
  crypto: {
    all: [
      'https://cointelegraph.com/rss',
      'https://www.coindesk.com/arc/outboundfeeds/rss/',
    ],
  },
  stocks: {
    all: [
      'https://feeds.bbci.co.uk/news/business/rss.xml',
      'https://www.cnbc.com/id/100003114/device/rss/rss.html',
      'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',
    ],
  },
  entertainment: {
    movie: [
      'https://variety.com/feed/',
      'https://www.hollywoodreporter.com/feed/',
    ],
    series: [
      'https://variety.com/feed/',
      'https://www.hollywoodreporter.com/feed/',
    ],
    cartoon: [
      'https://variety.com/feed/',
    ],
    all: [
      'https://variety.com/feed/',
      'https://www.hollywoodreporter.com/feed/',
    ],
  },
  travel: {
    all: [
      'https://feeds.bbci.co.uk/news/world/rss.xml',
      'https://www.theguardian.com/travel/rss',
    ],
  },
  weather: {
    all: [
      'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
    ],
  },
  viral: {
    all: [
      'https://www.reddit.com/r/popular/.rss',
      'https://www.theverge.com/rss/index.xml',
    ],
  },
  aitools: {
    all: [
      'https://techcrunch.com/category/artificial-intelligence/feed/',
      'https://feeds.feedburner.com/venturebeat/SZYF',
    ],
    writing: ['https://techcrunch.com/category/artificial-intelligence/feed/'],
    image: ['https://techcrunch.com/category/artificial-intelligence/feed/'],
    code: ['https://techcrunch.com/category/artificial-intelligence/feed/'],
    audio: ['https://techcrunch.com/category/artificial-intelligence/feed/'],
    video: ['https://techcrunch.com/category/artificial-intelligence/feed/'],
    research: ['https://feeds.feedburner.com/venturebeat/SZYF'],
  },
  software: {
    all: [
      'https://techcrunch.com/feed/',
      'https://www.theverge.com/rss/index.xml',
    ],
    windows: ['https://www.theverge.com/rss/index.xml'],
    mac: ['https://www.theverge.com/rss/index.xml'],
    ios: ['https://techcrunch.com/feed/'],
    android: ['https://techcrunch.com/feed/'],
    extensions: ['https://www.theverge.com/rss/index.xml'],
  },
  germany: {
    behoerden: ['https://www.tagesschau.de/xml/rss2/'],
    wohnung: ['https://www.tagesschau.de/xml/rss2/'],
    bildung: ['https://www.tagesschau.de/xml/rss2/'],
    arbeit: ['https://www.tagesschau.de/xml/rss2/'],
    aenderungen: ['https://www.tagesschau.de/xml/rss2/'],
    tools: ['https://www.tagesschau.de/xml/rss2/'],
    all: ['https://www.tagesschau.de/xml/rss2/'],
  },
  chinese: {
    all: ['https://techcrunch.com/feed/'],
    general: ['https://techcrunch.com/feed/'],
    fashion: ['https://www.theverge.com/rss/index.xml'],
    electronics: ['https://techcrunch.com/feed/'],
    home: ['https://www.theverge.com/rss/index.xml'],
    kids: ['https://www.theverge.com/rss/index.xml'],
    hobby: ['https://techcrunch.com/feed/'],
  },
  platforms: {
    all: ['https://techcrunch.com/feed/'],
    general: ['https://techcrunch.com/feed/'],
    clothes: ['https://www.theverge.com/rss/index.xml'],
    pharma: ['https://feeds.bbci.co.uk/news/health/rss.xml'],
    food: ['https://techcrunch.com/feed/'],
    electronics: ['https://techcrunch.com/feed/'],
    autoparts: ['https://techcrunch.com/feed/'],
    furniture: ['https://www.theverge.com/rss/index.xml'],
    international: ['https://techcrunch.com/feed/'],
  },
  women: {
    beauty: ['https://www.allure.com/feed/rss'],
    diet: ['https://feeds.bbci.co.uk/news/health/rss.xml'],
    fitness: ['https://feeds.bbci.co.uk/news/health/rss.xml'],
    parenting: ['https://feeds.bbci.co.uk/news/health/rss.xml'],
    fashion: ['https://www.theverge.com/rss/index.xml'],
    wellness: ['https://feeds.bbci.co.uk/news/health/rss.xml'],
    all: ['https://feeds.bbci.co.uk/news/health/rss.xml'],
  },
}

function extractThumbnail(block: string): string {
  const patterns = [
    /media:thumbnail[^>]+url="([^"]+)"/i,
    /media:content[^>]+url="([^"]+(?:\.jpg|\.jpeg|\.png|\.webp|\.gif)[^"]*)"/i,
    /media:content[^>]+url="([^"]+)"[^>]*(?:medium="image"|type="image)/i,
    /media:content[^>]+url="([^"]+)"/i,
    /<enclosure[^>]+url="([^"]+)"[^>]+type="image/i,
    /<enclosure[^>]+url="([^"]+)"/i,
    /<img[^>]+src="([^"]+)"/i,
  ]
  for (const p of patterns) {
    const m = block.match(p)
    if (m && m[1] && m[1].startsWith('http')) return m[1]
  }
  const cdataDesc = block.match(/<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i)
  if (cdataDesc) {
    const imgMatch = cdataDesc[1].match(/<img[^>]+src="([^"]+)"/i)
    if (imgMatch && imgMatch[1]?.startsWith('http')) return imgMatch[1]
  }
  return ''
}

function parseRSS(xml: string, sourceLabel: string): { title: string; link: string; pubDate: string; description: string; thumbnail: string; source: string }[] {
  const items: { title: string; link: string; pubDate: string; description: string; thumbnail: string; source: string }[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]
    const getTag = (tag: string) => {
      const m = block.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i'))
      return m ? m[1].trim() : ''
    }
    const linkMatch = block.match(/<link>([^<]+)<\/link>/) || block.match(/<link[^>]+href="([^"]+)"/)
    const title = getTag('title')
    if (!title) continue

    const rawDesc = getTag('description')
    const description = rawDesc.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").trim().slice(0, 200)
    const thumbnail = extractThumbnail(block)

    items.push({
      title,
      link: linkMatch ? linkMatch[1].trim() : '',
      pubDate: getTag('pubDate') || getTag('dc:date') || getTag('published'),
      description: description || '',
      thumbnail,
      source: sourceLabel,
    })
    if (items.length >= 6) break
  }
  return items
}

// Also handle Atom feeds (The Verge, etc.)
function parseAtom(xml: string, sourceLabel: string): { title: string; link: string; pubDate: string; description: string; thumbnail: string; source: string }[] {
  const items: { title: string; link: string; pubDate: string; description: string; thumbnail: string; source: string }[] = []
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
  let match
  while ((match = entryRegex.exec(xml)) !== null) {
    const block = match[1]
    const title = block.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i)?.[1]?.trim() || ''
    if (!title) continue
    const link = block.match(/<link[^>]*href="([^"]+)"/)?.[1] || ''
    const published = block.match(/<published>([^<]+)/)?.[1] || block.match(/<updated>([^<]+)/)?.[1] || ''
    const content = block.match(/<content[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content>/i)?.[1] || ''
    const summary = block.match(/<summary[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/summary>/i)?.[1] || ''
    const rawDesc = summary || content
    const description = rawDesc.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim().slice(0, 200)

    let thumbnail = ''
    const imgInContent = content.match(/<img[^>]+src="([^"]+)"/i)
    if (imgInContent && imgInContent[1]?.startsWith('http')) thumbnail = imgInContent[1]
    const mediaThumbnail = block.match(/<media:thumbnail[^>]+url="([^"]+)"/i)
    if (mediaThumbnail) thumbnail = mediaThumbnail[1]
    const mediaContent = block.match(/<media:content[^>]+url="([^"]+)"/i)
    if (mediaContent) thumbnail = mediaContent[1]

    items.push({ title, link, pubDate: published, description, thumbnail, source: sourceLabel })
    if (items.length >= 6) break
  }
  return items
}

async function fetchFeed(url: string): Promise<{ title: string; link: string; pubDate: string; description: string; thumbnail: string; source: string }[]> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WorldDashboard/1.0)' },
      next: { revalidate: 600 },
    })
    if (!res.ok) return []
    const xml = await res.text()
    const titleMatch = xml.match(/<(?:channel|feed)>\s*<title[^>]*>(?:<!\[CDATA\[)?([^\]<]+)/)
    const sourceLabel = titleMatch ? titleMatch[1].trim() : new URL(url).hostname

    if (xml.includes('<entry>')) {
      return parseAtom(xml, sourceLabel)
    }
    return parseRSS(xml, sourceLabel)
  } catch {
    return []
  }
}

export async function GET(req: NextRequest) {
  const section = req.nextUrl.searchParams.get('section') || ''
  const tab = req.nextUrl.searchParams.get('tab') || 'all'
  const lang = req.nextUrl.searchParams.get('lang') || 'en'

  const sectionFeeds = SECTION_FEEDS[section]
  if (!sectionFeeds) {
    return NextResponse.json({ items: [] })
  }

  const feedUrls = sectionFeeds[tab] || sectionFeeds['all'] || Object.values(sectionFeeds)[0]
  if (!feedUrls || feedUrls.length === 0) {
    return NextResponse.json({ items: [] })
  }

  const results = await Promise.allSettled(feedUrls.map(url => fetchFeed(url)))
  let items = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => (r as PromiseFulfilledResult<any[]>).value)
    .slice(0, 8)

  if (items.length === 0) {
    return NextResponse.json({ items: [] })
  }

  // Translate if not English
  if (lang !== 'en' && items.length > 0) {
    const titles = items.map(i => i.title)
    const descs = items.map(i => i.description)
    const [translatedTitles, translatedDescs] = await Promise.all([
      translateTexts(titles, lang),
      translateTexts(descs, lang),
    ])
    items = items.map((item, i) => ({
      ...item,
      title: translatedTitles[i] || item.title,
      description: translatedDescs[i] || item.description,
    }))
  }

  return NextResponse.json({ items })
}
