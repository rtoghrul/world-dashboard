import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 300

async function getGoogleTrends() {
  try {
    const res = await fetch(
      'https://trends.google.com/trends/trendingsearches/daily/rss?geo=US',
      { next: { revalidate: 300 } }
    )
    const text = await res.text()
    const titles = text.match(/<title>(?!Daily Search Trends)(.*?)<\/title>/g) || []
    return titles.slice(0, 5).map(t => ({
      title: t.replace(/<\/?title>/g, ''),
      source: 'google' as const,
      volume: '',
    }))
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
