import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 300

async function getGoogleTrends() {
  try {
    // The old /trends/trendingsearches/daily/rss endpoint was discontinued (404)
    const res = await fetch(
      'https://trends.google.com/trending/rss?geo=US',
      { next: { revalidate: 300 } }
    )
    if (!res.ok) return []
    const text = await res.text()
    const items = text.match(/<item>[\s\S]*?<\/item>/g) || []
    return items.slice(0, 5).flatMap(item => {
      const rawTitle = item.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1]?.trim()
      if (!rawTitle || /^\d{3}$/.test(rawTitle)) return []
      const traffic = item.match(/<ht:approx_traffic>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/ht:approx_traffic>/)?.[1] || ''
      return [{ title: rawTitle, source: 'google' as const, volume: traffic }]
    })
  } catch {
    return []
  }
}

async function getRedditTrending() {
  try {
    const res = await fetch('https://www.reddit.com/r/all/hot.json?limit=5', {
      headers: { 'User-Agent': 'WorldDashboard/1.0' },
      next: { revalidate: 300 },
    })
    const data = await res.json()
    return (data?.data?.children || []).slice(0, 5).map((c: any) => ({
      title: c.data.title.slice(0, 60),
      source: 'reddit' as const,
      volume: c.data.score > 1000 ? `${(c.data.score / 1000).toFixed(1)}k` : String(c.data.score),
      url: `https://reddit.com${c.data.permalink}`,
    }))
  } catch {
    return []
  }
}

export async function GET() {
  const [google, reddit] = await Promise.all([
    getGoogleTrends(),
    getRedditTrending(),
  ])

  const combined = [...google, ...reddit]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)

  return NextResponse.json(combined)
}
