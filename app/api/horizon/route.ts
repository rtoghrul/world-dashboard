import { NextResponse } from 'next/server'

export const revalidate = 1800

const GIST_URL = 'https://gist.githubusercontent.com/rtoghrul/b6c9ff6f0daf20f33f09edc263dfb328/raw/horizon-briefing.json'
const STALE_MS = 48 * 60 * 60 * 1000

type Item = { rank: number; title: string; url: string; score: number; summary: string; source: string; tags: string[] }

function strip(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim()
}

// Rank-normalized score: best item in a source gets `top`, each next slightly less
function rankScore(i: number, top: number) {
  return Math.max(5, Math.round((top - i * 0.4) * 10) / 10)
}

async function getHackerNews(): Promise<Item[]> {
  try {
    const ids: number[] = await (await fetch('https://hacker-news.firebaseio.com/v0/topstories.json', { next: { revalidate: 1800 } })).json()
    const stories = await Promise.all(ids.slice(0, 12).map(id =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { next: { revalidate: 1800 } }).then(r => r.json()).catch(() => null)
    ))
    return stories
      .filter(s => s?.title && (s.url || s.id))
      .map((s: any, i: number) => ({
        rank: 0, title: s.title, url: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
        score: rankScore(i, 9.4), summary: `${s.score} points · ${s.descendants || 0} comments on Hacker News`,
        source: 'hackernews', tags: ['Tech'],
      }))
  } catch { return [] }
}

async function getReddit(sub: string, label: string, tag: string): Promise<Item[]> {
  try {
    const data = await (await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=8`, {
      headers: { 'User-Agent': 'WorldDashboard/1.0' }, next: { revalidate: 1800 },
    })).json()
    return (data?.data?.children || [])
      .map((c: any) => c.data)
      .filter((p: any) => p?.title && !p.stickied)
      .slice(0, 6)
      .map((p: any, i: number) => ({
        rank: 0, title: p.title, url: p.url?.startsWith('http') ? p.url : `https://reddit.com${p.permalink}`,
        score: rankScore(i, 8.8), summary: strip(p.selftext || '').slice(0, 200) || `${p.score} upvotes · ${p.num_comments} comments on r/${sub}`,
        source: `reddit · r/${label}`, tags: [tag],
      }))
  } catch { return [] }
}

async function getRss(url: string, label: string, tag: string): Promise<Item[]> {
  try {
    const text = await (await fetch(url, { next: { revalidate: 1800 } })).text()
    const entries = text.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/g) || []
    return entries.slice(0, 6).flatMap((entry, i) => {
      const title = strip(entry.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, '') || '')
      const link = entry.match(/<link[^>]*href="([^"]+)"/)?.[1] || strip(entry.match(/<link[^>]*>([\s\S]*?)<\/link>/)?.[1] || '')
      const desc = strip((entry.match(/<(description|summary|content)[^>]*>([\s\S]*?)<\/\2>/)?.[2] || '').replace(/<!\[CDATA\[|\]\]>/g, ''))
      if (!title || !link) return []
      return [{ rank: 0, title, url: link, score: rankScore(i, 8.5), summary: desc.slice(0, 220), source: `rss · ${label}`, tags: [tag] }]
    })
  } catch { return [] }
}

async function getTelegram(channel: string, label: string): Promise<Item[]> {
  try {
    const html = await (await fetch(`https://t.me/s/${channel}`, { next: { revalidate: 1800 } })).text()
    const blocks = html.match(/<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/g) || []
    return blocks.slice(-5).reverse().flatMap((block, i) => {
      const link = block.match(/href="(https?:\/\/(?!t\.me)[^"]+)"/)?.[1]
      const text = strip(block)
      if (!text || text.length < 30) return []
      return [{
        rank: 0, title: text.slice(0, 110), url: link || `https://t.me/s/${channel}`,
        score: rankScore(i, 8.2), summary: text.slice(0, 220), source: `telegram · ${label}`, tags: ['News'],
      }]
    })
  } catch { return [] }
}

async function buildLiveBriefing() {
  const groups = await Promise.all([
    getHackerNews(),
    getReddit('MachineLearning', 'MachineLearning', 'AI'),
    getReddit('technology', 'technology', 'Tech'),
    getReddit('artificial', 'artificial', 'AI'),
    getRss('https://techcrunch.com/feed/', 'TechCrunch', 'Tech'),
    getRss('https://www.theverge.com/rss/index.xml', 'The Verge', 'Tech'),
    getRss('https://feeds.arstechnica.com/arstechnica/index', 'Ars Technica', 'Tech'),
    getRss('https://simonwillison.net/atom/everything/', 'Simon Willison', 'AI'),
    getTelegram('guardian', 'guardian'),
    getTelegram('hacker_news_feed', 'hacker_news_feed'),
    getTelegram('wired', 'wired'),
    getTelegram('openai_news', 'openai_news'),
    getTelegram('bbcbreaking', 'bbcbreaking'),
  ])
  const totalFetched = groups.reduce((n, g) => n + g.length, 0)
  const items = groups.flat()
    .sort((a, b) => b.score - a.score)
    .slice(0, 50)
    .map((item, i) => ({ ...item, rank: i + 1 }))
  return { date: new Date().toISOString().slice(0, 10), totalFetched, totalSelected: items.length, items, live: true }
}

export async function GET() {
  // Prefer the gist (AI-ranked by the external pipeline) while it's fresh
  try {
    const res = await fetch(GIST_URL, { next: { revalidate: 3600 } })
    if (res.ok) {
      const data = await res.json()
      const age = Date.now() - new Date(data?.date).getTime()
      if (data?.items?.length && Number.isFinite(age) && age < STALE_MS) {
        return NextResponse.json(data, { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=600' } })
      }
    }
  } catch {}

  // Gist stale or unreachable — assemble the briefing live from the same sources
  try {
    const briefing = await buildLiveBriefing()
    if (briefing.items.length === 0) throw new Error('No sources reachable')
    return NextResponse.json(briefing, { headers: { 'Cache-Control': 's-maxage=1800, stale-while-revalidate=600' } })
  } catch {
    return NextResponse.json({ error: 'Failed to load briefing' }, { status: 500 })
  }
}
