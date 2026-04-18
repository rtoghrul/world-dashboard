import { NextResponse } from 'next/server'

export const revalidate = 300

const RSS_FEEDS = {
  war: [
    'https://feeds.bbci.co.uk/news/world/rss.xml',
    'https://www.aljazeera.com/xml/rss/all.xml',
  ],
  ai: [
    'https://techcrunch.com/category/artificial-intelligence/feed/',
    'https://feeds.feedburner.com/venturebeat/SZYF',
  ],
}

async function fetchRSS(url: string, category: string) {
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}&api_key=public&count=5`
  const res = await fetch(apiUrl, { next: { revalidate: 300 } })
  if (!res.ok) return []
  const data = await res.json()
  if (data.status !== 'ok') return []
  return (data.items || []).map((item: Record<string, string>) => ({
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    description: item.description?.replace(/<[^>]*>/g, '').slice(0, 150) + '...',
    thumbnail: item.thumbnail || item.enclosure?.link || null,
    category,
    source: data.feed?.title || url,
  }))
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') || 'war'

  const feeds = RSS_FEEDS[category as keyof typeof RSS_FEEDS] || RSS_FEEDS.war

  try {
    const results = await Promise.allSettled(
      feeds.map(url => fetchRSS(url, category))
    )
    const items = results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => (r as PromiseFulfilledResult<unknown[]>).value)
      .slice(0, 10)

    return NextResponse.json(items)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
