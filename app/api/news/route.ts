import { NextResponse } from 'next/server'

export const revalidate = 300

const RSS_FEEDS: Record<string, string[]> = {
  war: [
    'https://feeds.bbci.co.uk/news/world/rss.xml',
    'https://www.aljazeera.com/xml/rss/all.xml',
  ],
  ai: [
    'https://techcrunch.com/category/artificial-intelligence/feed/',
    'https://feeds.feedburner.com/venturebeat/SZYF',
  ],
}

function parseRSS(xml: string, source: string, category: string) {
  const items: { title: string; link: string; pubDate: string; description: string; source: string; category: string }[] = []
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
  const category = searchParams.get('category') || 'war'
  const feeds = RSS_FEEDS[category] || RSS_FEEDS.war

  const results = await Promise.allSettled(feeds.map(url => fetchFeed(url, category)))
  const items = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => (r as PromiseFulfilledResult<unknown[]>).value)
    .slice(0, 10)

  return NextResponse.json(items)
}
