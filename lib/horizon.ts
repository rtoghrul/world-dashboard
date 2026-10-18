// Horizon: a tech & science radar. Pulls free, key-less sources, merges stories that
// several sources cover, scores them (0-10) and tags topics. Used by /api/horizon.
import { loadFeed, storyKey, decodeEntities } from '@/lib/feed'
import { fetchWithTimeout } from '@/lib/http'

export type HorizonTopic = 'ai' | 'security' | 'science' | 'space' | 'dev' | 'hardware' | 'business' | 'policy' | 'culture' | 'tech'
export const HORIZON_TOPICS: HorizonTopic[] = ['ai', 'security', 'science', 'space', 'dev', 'hardware', 'business', 'policy', 'culture']

export type HorizonSourceDef = {
  id: string
  label: string
  home: string
  kind: 'hn' | 'rss'
  url?: string
  /** 0.7–1.0: how much a top story from this source counts */
  weight: number
  topics: HorizonTopic[]
}

export const HORIZON_SOURCES: HorizonSourceDef[] = [
  { id: 'hackernews', label: 'Hacker News', home: 'https://news.ycombinator.com', kind: 'hn', weight: 1, topics: [] },
  { id: 'lobsters', label: 'Lobsters', home: 'https://lobste.rs', kind: 'rss', url: 'https://lobste.rs/rss', weight: 0.85, topics: ['dev'] },
  { id: 'techcrunch', label: 'TechCrunch', home: 'https://techcrunch.com', kind: 'rss', url: 'https://techcrunch.com/feed/', weight: 0.85, topics: ['business'] },
  { id: 'verge', label: 'The Verge', home: 'https://www.theverge.com', kind: 'rss', url: 'https://www.theverge.com/rss/index.xml', weight: 0.85, topics: [] },
  { id: 'ars', label: 'Ars Technica', home: 'https://arstechnica.com', kind: 'rss', url: 'https://feeds.arstechnica.com/arstechnica/index', weight: 0.9, topics: [] },
  { id: 'wired', label: 'WIRED', home: 'https://www.wired.com', kind: 'rss', url: 'https://www.wired.com/feed/rss', weight: 0.8, topics: ['culture'] },
  { id: 'bbc-tech', label: 'BBC Technology', home: 'https://www.bbc.com/news/technology', kind: 'rss', url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', weight: 0.85, topics: [] },
  { id: 'mit-tr', label: 'MIT Technology Review', home: 'https://www.technologyreview.com', kind: 'rss', url: 'https://www.technologyreview.com/feed/', weight: 0.9, topics: [] },
  { id: 'ieee', label: 'IEEE Spectrum', home: 'https://spectrum.ieee.org', kind: 'rss', url: 'https://spectrum.ieee.org/feeds/feed.rss', weight: 0.85, topics: ['hardware'] },
  { id: 'register', label: 'The Register', home: 'https://www.theregister.com', kind: 'rss', url: 'https://www.theregister.com/headlines.atom', weight: 0.8, topics: [] },
  { id: 'simon', label: 'Simon Willison', home: 'https://simonwillison.net', kind: 'rss', url: 'https://simonwillison.net/atom/everything/', weight: 0.8, topics: ['ai'] },
  { id: 'huggingface', label: 'Hugging Face Blog', home: 'https://huggingface.co/blog', kind: 'rss', url: 'https://huggingface.co/blog/feed.xml', weight: 0.75, topics: ['ai'] },
  { id: 'openai', label: 'OpenAI News', home: 'https://openai.com/news/', kind: 'rss', url: 'https://openai.com/news/rss.xml', weight: 0.8, topics: ['ai'] },
  { id: 'google-ai', label: 'Google AI Blog', home: 'https://blog.google/technology/ai/', kind: 'rss', url: 'https://blog.google/technology/ai/rss/', weight: 0.75, topics: ['ai'] },
  { id: 'github-blog', label: 'The GitHub Blog', home: 'https://github.blog', kind: 'rss', url: 'https://github.blog/feed/', weight: 0.7, topics: ['dev'] },
  { id: 'krebs', label: 'Krebs on Security', home: 'https://krebsonsecurity.com', kind: 'rss', url: 'https://krebsonsecurity.com/feed/', weight: 0.85, topics: ['security'] },
  { id: 'bleeping', label: 'BleepingComputer', home: 'https://www.bleepingcomputer.com', kind: 'rss', url: 'https://www.bleepingcomputer.com/feed/', weight: 0.8, topics: ['security'] },
  { id: 'quanta', label: 'Quanta Magazine', home: 'https://www.quantamagazine.org', kind: 'rss', url: 'https://www.quantamagazine.org/feed/', weight: 0.85, topics: ['science'] },
  { id: 'nature', label: 'Nature', home: 'https://www.nature.com', kind: 'rss', url: 'https://www.nature.com/nature.rss', weight: 0.8, topics: ['science'] },
  { id: 'nasa', label: 'NASA', home: 'https://www.nasa.gov/news/', kind: 'rss', url: 'https://www.nasa.gov/feed/', weight: 0.8, topics: ['space'] },
  { id: 'producthunt', label: 'Product Hunt', home: 'https://www.producthunt.com', kind: 'rss', url: 'https://www.producthunt.com/feed', weight: 0.7, topics: ['business'] },
]

export { LEGACY_SOURCE_IDS } from '@/lib/horizonIds'

const TOPIC_RULES: [HorizonTopic, RegExp][] = [
  ['ai', /\b(ai|a\.i\.|llms?|gpt[-\d]*|chatgpt|openai|anthropic|claude|gemini|chatbots?|machine learning|neural|deep learning|transformers?|diffusion|agents?|agentic|copilot|deepmind|hugging ?face|mistral|llama|deepseek|qwen|grok|inference|fine-tun\w*|embeddings?)\b/i],
  ['security', /\b(security|hack(?:ed|ers?|ing)?|breach\w*|vulnerab\w*|exploit\w*|malware|ransomware|phishing|cve-\d+|zero-day|spyware|backdoor|botnet|encryption|ddos|infostealer|patch tuesday)\b/i],
  ['space', /\b(nasa|spacex|rockets?|orbit\w*|satellites?|mars|moon|lunar|astronauts?|telescope|esa|asteroids?|galax\w+|starship|exoplanets?|jwst|blue origin)\b/i],
  ['science', /\b(scien\w+|physic\w*|biolog\w*|chemi\w+|researchers?|study|quantum|climate|genom\w*|cells?|brain|species|fossils?|evolution|mathemat\w*|vaccin\w*|protein)\b/i],
  ['dev', /\b(programming|developers?|code|coding|rust|python|javascript|typescript|golang|java|kotlin|swift|haskell|lisp|zig|linux|kernel|open[- ]source|github|compilers?|databases?|postgres\w*|sqlite|api|sql|git|frameworks?|wasm|webassembly|css|html|react|unix|emacs|vim)\b/i],
  ['hardware', /\b(macos|windows|apple|chips?|cpus?|gpus?|nvidia|amd|intel|semiconductors?|tsmc|iphone|pixel|android|laptops?|hardware|batter(?:y|ies)|robots?|robotics|risc-v|arm|displays?|keyboard)\b/i],
  ['business', /\b(startups?|funding|raises?|acquisitions?|acquires?|ipo|revenue|layoffs?|valuation|investors?|billion|antitrust|earnings|ceo)\b/i],
  ['policy', /\b(laws?|legal|scraping|regulat\w+|courts?|lawsuits?|sued|judge|congress|senate|eu|ftc|fcc|ban|bans|banned|government|policy|elections?|privacy|gdpr|copyright)\b/i],
  ['culture', /\b(games?|gaming|movies?|films?|music|books?|social media|tiktok|youtube|netflix|streaming|art)\b/i],
]

export function classify(text: string, defaults: HorizonTopic[]): HorizonTopic[] {
  const found = new Set<HorizonTopic>(defaults)
  for (const [topic, re] of TOPIC_RULES) if (re.test(text)) found.add(topic)
  const list = Array.from(found).slice(0, 3)
  return list.length ? list : ['tech']
}

type Raw = {
  sourceId: string
  title: string
  url: string
  summary: string
  published: string
  image: string | null
  position: number
  of: number
  points?: number
  comments?: number
  discussionUrl?: string
}

export type HorizonItem = {
  id: string
  rank: number
  title: string
  url: string
  score: number
  summary: string
  /** label of the primary source (kept for older clients) */
  source: string
  sourceId: string
  sources: { id: string; label: string; url: string }[]
  tags: HorizonTopic[]
  published: string
  image: string | null
  points?: number
  comments?: number
  discussionUrl?: string
}

export type HorizonSourceStatus = { id: string; label: string; home: string; count: number; ok: boolean }

export type HorizonBriefing = {
  date: string
  generatedAt: string
  live: boolean
  /** 'daily' = today's cached edition, 'live' = built for this request, 'gist' = external pipeline */
  edition?: 'daily' | 'live' | 'gist'
  totalFetched: number
  totalSelected: number
  items: HorizonItem[]
  sources: HorizonSourceStatus[]
}

async function fetchHN(): Promise<Raw[]> {
  try {
    const ids: number[] = await (await fetchWithTimeout('https://hacker-news.firebaseio.com/v0/topstories.json', { next: { revalidate: 900 } })).json()
    const top = ids.slice(0, 30)
    const stories = await Promise.all(top.map(id =>
      fetchWithTimeout(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { next: { revalidate: 900 } }).then(r => r.json()).catch(() => null)
    ))
    return stories.flatMap((s: any, i: number): Raw[] => {
      if (!s?.title || s.dead || s.deleted) return []
      const discussionUrl = `https://news.ycombinator.com/item?id=${s.id}`
      return [{
        sourceId: 'hackernews', title: decodeEntities(String(s.title)), url: s.url || discussionUrl,
        summary: '', published: s.time ? new Date(s.time * 1000).toISOString() : '', image: null,
        position: i, of: top.length, points: s.score || 0, comments: s.descendants || 0, discussionUrl,
      }]
    })
  } catch { return [] }
}

async function fetchSource(def: HorizonSourceDef): Promise<Raw[]> {
  if (def.kind === 'hn') return fetchHN()
  const entries = await loadFeed(def.url!, { revalidate: 1200, max: 8 })
  return entries.map((e, i) => ({
    sourceId: def.id, title: e.title, url: e.link, summary: /^\s*comments\s*$/i.test(e.summary) ? '' : e.summary, published: e.published,
    image: e.image, position: i, of: entries.length,
  }))
}

function urlKey(u: string): string {
  try {
    const x = new URL(u)
    return (x.hostname.replace(/^www\./, '') + x.pathname.replace(/\/+$/, '')).toLowerCase()
  } catch { return u }
}

const DAY_MS = 86400000

function baseScore(r: Raw, def: HorizonSourceDef, now: number): number {
  const pos = r.of > 1 ? 1 - r.position / r.of : 1
  const ageH = r.published ? Math.max(0, (now - new Date(r.published).getTime()) / 3600000) : 24
  const fresh = Math.exp(-ageH / 36)
  let s = r.points !== undefined
    ? 0.3 * pos + 0.3 * fresh + 0.4 * Math.min(1, Math.log10(r.points + 1) / 3)
    : 0.5 * pos + 0.5 * fresh
  s *= def.weight
  return s
}

/** Fetch every source and build the ranked briefing. Never throws. */
export async function buildHorizon(now = Date.now()): Promise<HorizonBriefing> {
  const defs = HORIZON_SOURCES
  const results = await Promise.all(defs.map(d => fetchSource(d).catch(() => [] as Raw[])))
  const byId = new Map(defs.map(d => [d.id, d]))

  // Skip very old items (some feeds never rotate): older than 10 days.
  const raws = results.flat().filter(r => !r.published || now - new Date(r.published).getTime() < 10 * DAY_MS)

  // Group duplicates: same normalized URL or same headline.
  type Group = { best: Raw; bestScore: number; members: Raw[] }
  const groups: Group[] = []
  const index = new Map<string, Group>()
  for (const r of raws) {
    const def = byId.get(r.sourceId)!
    const sc = baseScore(r, def, now)
    const keys = [urlKey(r.url), 't:' + storyKey(r.title)]
    let g = keys.map(k => index.get(k)).find(Boolean)
    if (!g) { g = { best: r, bestScore: sc, members: [] }; groups.push(g) }
    g.members.push(r)
    if (sc > g.bestScore) { g.best = r; g.bestScore = sc }
    for (const k of keys) index.set(k, g)
  }

  const items: HorizonItem[] = groups.map(g => {
    const distinct = Array.from(new Set(g.members.map(m => m.sourceId)))
    const boost = 0.12 * (distinct.length - 1)
    const score = Math.round(Math.min(1, g.bestScore + boost) * 100) / 10
    const hn = g.members.find(m => m.sourceId === 'hackernews')
    const withSummary = g.members.find(m => m.summary) || g.best
    const withImage = g.members.find(m => m.image)
    const primary = byId.get(g.best.sourceId)!
    const defaults = Array.from(new Set(distinct.flatMap(id => byId.get(id)!.topics)))
    const text = `${g.best.title} ${withSummary.summary}`
    return {
      id: urlKey(g.best.url).slice(0, 120),
      rank: 0,
      title: g.best.title,
      url: g.best.url,
      score,
      summary: withSummary.summary,
      source: primary.label,
      sourceId: primary.id,
      sources: distinct.map(id => {
        const m = g.members.find(x => x.sourceId === id)!
        return { id, label: byId.get(id)!.label, url: m.discussionUrl || m.url }
      }),
      tags: classify(text, defaults),
      published: g.members.map(m => m.published).filter(Boolean).sort()[0] || '',
      image: withImage?.image || null,
      points: hn?.points,
      comments: hn?.comments,
      discussionUrl: hn?.discussionUrl,
    }
  })

  items.sort((a, b) => b.score - a.score || (b.published || '').localeCompare(a.published || ''))
  const top = items.slice(0, 120).map((it, i) => ({ ...it, rank: i + 1 }))

  // Thumbnails for the top stories that have none (bounded: 12 lookups, 4s each).
  await Promise.all(top.slice(0, 12).map(async it => {
    if (it.image || /news\.ycombinator\.com/.test(it.url)) return
    it.image = await fetchOgImage(it.url)
  }))

  const sources: HorizonSourceStatus[] = defs.map((d, i) => ({ id: d.id, label: d.label, home: d.home, count: results[i].length, ok: results[i].length > 0 }))
  return {
    date: new Date(now).toISOString().slice(0, 10),
    generatedAt: new Date(now).toISOString(),
    live: true,
    totalFetched: raws.length,
    totalSelected: top.length,
    items: top,
    sources,
  }
}

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetchWithTimeout(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WorldDashboardBot/1.0)' }, next: { revalidate: 3600 } }, 4000)
    if (!res.ok || !(res.headers.get('content-type') || '').includes('html')) return null
    const html = (await res.text()).slice(0, 200000)
    const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1]
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1]
      || html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)?.[1]
    if (!og) return null
    const abs = new URL(decodeEntities(og), url).toString()
    return /^https?:\/\//.test(abs) ? abs : null
  } catch { return null }
}

/** Make an older/external briefing (e.g. the gist pipeline) safe for the current UI. */
export function normalizeBriefing(data: any): HorizonBriefing | null {
  if (!data || !Array.isArray(data.items) || !data.items.length) return null
  const items: HorizonItem[] = data.items.filter((x: any) => x && x.title && x.url).map((x: any, i: number) => ({
    id: String(x.id || urlKey(x.url)).slice(0, 120),
    rank: i + 1,
    title: String(x.title),
    url: String(x.url),
    score: Number(x.score) || 0,
    summary: String(x.summary || ''),
    source: String(x.source || ''),
    sourceId: String(x.sourceId || x.source || ''),
    sources: Array.isArray(x.sources) ? x.sources : [{ id: String(x.source || ''), label: String(x.source || ''), url: String(x.url) }],
    tags: Array.isArray(x.tags) ? x.tags.map((t: string) => String(t).toLowerCase()).filter((t: string) => (HORIZON_TOPICS as string[]).includes(t) || t === 'tech') : ['tech'],
    published: String(x.published || ''),
    image: x.image || null,
    points: x.points, comments: x.comments, discussionUrl: x.discussionUrl,
  }))
  return {
    date: String(data.date || ''), generatedAt: String(data.generatedAt || data.date || ''), live: Boolean(data.live),
    totalFetched: Number(data.totalFetched) || items.length, totalSelected: items.length, items,
    sources: Array.isArray(data.sources) ? data.sources : [],
  }
}
