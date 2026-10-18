// Small dependency-free RSS 2.0 / RDF (RSS 1.0) / Atom parser shared by the news and
// Horizon routes. Only the fields the UI needs are extracted; everything is plain text.
import { fetchWithTimeout } from '@/lib/http'

export type FeedEntry = {
  title: string
  link: string
  /** ISO timestamp, or '' when the feed has no usable date */
  published: string
  summary: string
  image: string | null
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…', laquo: '«', raquo: '»', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“' }

export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === '#') {
      const code = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)
      return Number.isFinite(code) && code > 0 && code < 0x110000 ? String.fromCodePoint(code) : m
    }
    return ENTITIES[e.toLowerCase()] ?? m
  })
}

function unwrap(s: string) {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
}

export function toText(html: string): string {
  // Strip twice: some feeds (e.g. Lobsters) entity-encode their HTML, so tags only appear after decoding.
  return decodeEntities(decodeEntities(unwrap(html).replace(/<[^>]+>/g, ' ')).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
}

function tag(block: string, names: string[]): string {
  for (const n of names) {
    const m = block.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)</${n}>`, 'i'))
    if (m && m[1].trim()) return m[1]
  }
  return ''
}

function findLink(block: string): string {
  // Atom: <link rel="alternate" href="..."/> (or the first link with an href)
  const alt = block.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i) || block.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']alternate["']/i)
  if (alt) return decodeEntities(alt[1])
  const plain = block.match(/<link>([\s\S]*?)<\/link>/i)
  if (plain && plain[1].trim()) return decodeEntities(unwrap(plain[1]).trim())
  const href = block.match(/<link[^>]*href=["']([^"']+)["']/i)
  if (href) return decodeEntities(href[1])
  const guid = block.match(/<guid[^>]*isPermaLink=["']true["'][^>]*>([\s\S]*?)<\/guid>/i)
  return guid ? decodeEntities(unwrap(guid[1]).trim()) : ''
}

function findImage(block: string): string | null {
  const patterns = [
    /<media:thumbnail[^>]+url=["']([^"']+)["']/i,
    /<media:content[^>]+url=["']([^"']+)["'][^>]*(?:medium=["']image["']|type=["']image)/i,
    /<media:content[^>]+url=["']([^"']+\.(?:jpe?g|png|webp)[^"']*)["']/i,
    /<enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']image/i,
    /<enclosure[^>]+type=["']image[^"']*["'][^>]+url=["']([^"']+)["']/i,
    /<img[^>]+src=["']([^"']+)["']/i,
    /&lt;img[^&]+src=(?:&quot;|")([^&"]+)(?:&quot;|")/i,
  ]
  for (const p of patterns) {
    const m = block.match(p)
    if (m && /^https?:\/\//.test(m[1])) return decodeEntities(m[1])
  }
  return null
}

function toIso(raw: string): string {
  const s = toText(raw)
  if (!s) return ''
  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? '' : d.toISOString()
}

export function parseFeed(xml: string, max = 20): FeedEntry[] {
  const blocks = xml.match(/<(item|entry)(?:\s[^>]*)?>[\s\S]*?<\/\1>/gi) || []
  const out: FeedEntry[] = []
  for (const block of blocks) {
    const title = toText(tag(block, ['title']))
    const link = findLink(block)
    if (!title || !/^https?:\/\//.test(link)) continue
    const summary = toText(tag(block, ['description', 'summary', 'content:encoded', 'content'])).slice(0, 280)
    out.push({
      title,
      link,
      published: toIso(tag(block, ['pubDate', 'published', 'updated', 'dc:date'])),
      summary,
      image: findImage(block),
    })
    if (out.length >= max) break
  }
  return out
}

/** Fetch and parse one feed. Never throws: an unreachable or invalid feed yields []. */
export async function loadFeed(url: string, opts: { revalidate?: number; max?: number; timeoutMs?: number } = {}): Promise<FeedEntry[]> {
  try {
    const res = await fetchWithTimeout(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WorldDashboard/1.0; +https://world-dashboard-delta-umber.vercel.app)', Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.5' },
      next: { revalidate: opts.revalidate ?? 600 },
    }, opts.timeoutMs ?? 8000)
    if (!res.ok) return []
    return parseFeed(await res.text(), opts.max ?? 20)
  } catch {
    return []
  }
}

/** Normalized key used to drop duplicate stories reported by several feeds. */
export function storyKey(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\u00c0-\u024f\u0400-\u04ff\u0600-\u06ff\u3040-\u30ff\u4e00-\u9fff]+/g, ' ').trim().split(' ').slice(0, 9).join(' ')
}
