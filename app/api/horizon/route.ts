import { NextResponse } from 'next/server'

export const revalidate = 1800
// Bound the function runtime so the live fallback never times out on Vercel
export const maxDuration = 60

const GIST_URL = 'https://gist.githubusercontent.com/rtoghrul/b6c9ff6f0daf20f33f09edc263dfb328/raw/horizon-briefing.json'
// Gist counts as fresh for 6h (was 48h) — the live briefing takes over quickly when the pipeline is down
const STALE_MS = 6 * 60 * 60 * 1000

type Item = { rank: number; title: string; url: string; score: number; summary: string; source: string; tags: string[]; image?: string | null }

function strip(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim()
}

function unescapeUrl(url: string) {
  return url.replace(/&amp;/g, '&')
}

// Fetch an article's og:image/twitter:image so link-only sources (HN, RSS) get a thumbnail too.
// Bounded by a short timeout since this runs per-item and must not stall the whole route.
async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(4000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WorldDashboardBot/1.0)' },
      next: { revalidate: 1800 },
    })
    if (!res.ok) return null
    const html = await res.text()
    const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1]
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1]
      || html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)?.[1]
    return og ? unescapeUrl(og) : null
  } catch {
    return null
  }
}

// Rank-normalized score: best item in a source gets `top`, each next slightly less
function rankScore(i: number, top: number) {
  return Math.max(5, Math.round((top - i * 0.4) * 10) / 10)
}

async function getHackerNews(): Promise<Item[]> {
  try {
    const ids: number[] = await (await fetch('https://hacker-news.firebaseio.com/v0/topstories.json', { signal: AbortSignal.timeout(8000), next: { revalidate: 1800 } })).json()
    const stories = await Promise.all(ids.slice(0, 12).map(id =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { signal: AbortSignal.timeout(8000), next: { revalidate: 1800 } }).then(r => r.json()).catch(() => null)
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

// NOTE: getReddit() was removed — Reddit blocks datacenter IPs (403 on both the
// JSON API and RSS from Vercel), so it always contributed zero items in production.
// Replaced by reliable RSS feeds in buildLiveBriefing().

async function getRss(url: string, label: string, tag: string): Promise<Item[]> {
  try {
    const text = await (await fetch(url, { signal: AbortSignal.timeout(8000), next: { revalidate: 1800 } })).text()
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
    const html = await (await fetch(`https://t.me/s/${channel}`, { signal: AbortSignal.timeout(8000), next: { revalidate: 1800 } })).text()
    // Each message is wrapped in its own message div; split on that boundary so the
    // photo (if any) and the text of the SAME message stay together.
    const messages = html.split('tgme_widget_message_wrap').slice(1)
    return messages.slice(-5).reverse().flatMap((msg, i) => {
      const textBlock = msg.match(/<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/)?.[0] || ''
      const link = textBlock.match(/href="(https?:\/\/(?!t\.me)[^"]+)"/)?.[1]
      const text = strip(textBlock)
      if (!text || text.length < 30) return []
      const image = msg.match(/tgme_widget_message_photo_wrap[^"]*"[^>]*style="[^"]*background-image:url\('([^']+)'\)/)?.[1]
      return [{
        rank: 0, title: text.slice(0, 110), url: link || `https://t.me/s/${channel}`,
        score: rankScore(i, 8.2), summary: text.slice(0, 220), source: `telegram · ${label}`, tags: ['News'],
        image: image ? unescapeUrl(image) : null,
      }]
    })
  } catch { return [] }
}

async function buildLiveBriefing() {
  // Note: Reddit JSON/RSS block datacenter IPs (403 from Vercel), so the live
  // briefing uses reliable RSS feeds instead. getReddit() was removed for this reason.
  const groups = await Promise.all([
    getHackerNews(),
    getRss('https://www.technologyreview.com/feed/', 'MIT Tech Review', 'AI'),
    getRss('https://feeds.bbci.co.uk/news/technology/rss.xml', 'BBC Tech', 'Tech'),
    getRss('https://www.wired.com/feed/rss', 'Wired', 'Tech'),
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
  let items = groups.flat()
    .sort((a, b) => b.score - a.score)
    .slice(0, 50)
    .map((item, i) => ({ ...item, rank: i + 1 }))

  // Reddit/Telegram already carry an image where available; HN links and RSS items
  // don't, so fetch og:image for those — bounded to the first 15 to keep the
  // serverless function inside its runtime limit.
  items = await Promise.all(items.map(async (item, i) => {
    if (item.image) return item
    if (i >= 15) return item
    if (item.source !== 'hackernews' && !item.source.startsWith('rss')) return item
    return { ...item, image: await fetchOgImage(item.url) }
  }))

  return { date: new Date().toISOString().slice(0, 10), totalFetched, totalSelected: items.length, items, live: true }
}

export async function GET() {
  // Prefer the gist (AI-ranked by the external pipeline) while it's fresh
  try {
    const res = await fetch(GIST_URL, { signal: AbortSignal.timeout(8000), next: { revalidate: 3600 } })
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
