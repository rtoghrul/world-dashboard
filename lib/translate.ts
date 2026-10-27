// Text translation helper used by API routes (news, section-news, facts, education, ...).
//
// Provider chain (both key-less, both reachable from local dev and Vercel's datacenter IPs):
//   1. clients5.google.com "dict-chrome-ex" — real batching via repeated ?q=, no API key
//   2. api.mymemory.translated.net — per-text fallback, small anonymous daily quota
//
// Reliability rules:
//  - identical strings are deduped before any provider is called
//  - Google batches are limited by item count *and* total characters (URL length)
//  - a hard deadline stops all provider work so a route can never hang on translation
//  - every failure mode falls back to the original string, never to empty text or garbage
//  - results are cached 24h in the Next.js Data Cache (keyed by the full request URL)
//  - set MYMEMORY_EMAIL to lift the anonymous MyMemory quota

const LANG_MAP: Record<string, string> = {
  zh: 'zh-CN',
  'zh-CN': 'zh-CN',
  pt: 'pt-BR',
  'pt-BR': 'pt-BR',
  he: 'iw',
  jv: 'jw',
}

function mapLang(lang: string) {
  return LANG_MAP[lang] || lang
}

const MAX_LEN = 600
const GOOGLE_BATCH = 8
const GOOGLE_MAX_CHARS = 1400
const DEADLINE_MS = 12000

function clean(text: string) {
  return (text || '').replace(/\s+/g, ' ').trim().slice(0, MAX_LEN)
}

// ── Provider 1: Google dictionary endpoint (batched) ──────────────────────────
async function googleMany(texts: string[], target: string, source: string): Promise<(string | null)[]> {
  if (texts.length === 0) return []
  const params = new URLSearchParams()
  params.set('client', 'dict-chrome-ex')
  params.set('sl', source)
  params.set('tl', target)
  for (const t of texts) params.append('q', t)
  const url = 'https://clients5.google.com/translate_a/t?' + params.toString()

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(9000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WorldDashboard/1.0)' },
      next: { revalidate: 86400 },
    })
    if (!res.ok) return texts.map(() => null)
    const data = await res.json()

    // Shape: ["translated 1", "translated 2", ...]
    // Older/odd responses wrap it once: [["translated 1", ...]]
    let arr: unknown[] = Array.isArray(data) ? data : []
    if (arr.length === 1 && Array.isArray(arr[0])) arr = arr[0] as unknown[]

    return texts.map((text, i) => {
      const v = arr[i]
      const s = typeof v === 'string' ? v : Array.isArray(v) ? (v as unknown[])[0] : null
      if (typeof s !== 'string' || !s.trim()) return null
      // Provider echoed the source back (unknown phrase / unsupported pair)
      if (s.trim().toLowerCase() === text.trim().toLowerCase()) return null
      return s.trim()
    })
  } catch {
    return texts.map(() => null)
  }
}

// ── Provider 2: MyMemory (per text) ───────────────────────────────────────────
const BAD_RESULT = /MYMEMORY WARNING|QUERY LENGTH LIMIT|INVALID LANGUAGE PAIR|NO QUERY SPECIFIED|PLEASE SELECT TWO DISTINCT/i

async function myMemoryOne(text: string, target: string, source: string): Promise<string | null> {
  const q = clean(text)
  if (!q || q.length < 2) return null

  const email = process.env.MYMEMORY_EMAIL
  const url =
    'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(q) +
    '&langpair=' + encodeURIComponent(`${source}|${target}`) +
    (email ? `&de=${encodeURIComponent(email)}` : '')

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WorldDashboard/1.0)' },
      next: { revalidate: 86400 },
    })
    if (!res.ok) return null
    const data = await res.json()
    if (data?.quotaFinished) return null
    const translated = data?.responseData?.translatedText
    if (typeof translated !== 'string' || !translated.trim()) return null
    if (BAD_RESULT.test(translated)) return null
    if (translated.trim().toLowerCase() === q.toLowerCase()) return null
    return translated.trim()
  } catch {
    return null
  }
}

// Bounded-concurrency map so a 40-item page never opens 40 sockets at once.
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length)
  let cursor = 0
  const workers = Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, async () => {
    while (cursor < items.length) {
      const i = cursor++
      out[i] = await fn(items[i])
    }
  })
  await Promise.all(workers)
  return out
}

/** Split unique strings into Google-sized chunks: max N items and max total characters. */
function chunkForGoogle(unique: string[]): string[][] {
  const chunks: string[][] = []
  let current: string[] = []
  let chars = 0
  for (const text of unique) {
    const size = text.length
    if (current.length >= GOOGLE_BATCH || (current.length > 0 && chars + size > GOOGLE_MAX_CHARS)) {
      chunks.push(current)
      current = []
      chars = 0
    }
    current.push(text)
    chars += size
  }
  if (current.length) chunks.push(current)
  return chunks
}

export async function translateTexts(texts: string[], lang: string, sourceLang: string = 'en'): Promise<string[]> {
  if (!Array.isArray(texts) || texts.length === 0) return texts
  if (!lang) return texts

  const target = mapLang(lang)
  const source = mapLang(sourceLang)
  if (target === source) return texts

  const started = Date.now()
  const unique = Array.from(new Set(texts.map(t => clean(t)).filter(Boolean)))
  if (unique.length === 0) return texts
  const resolved = new Map<string, string>()

  // Pass 1 — Google dictionary endpoint in batches (bounded parallel chunks)
  const chunks = chunkForGoogle(unique)
  await mapLimit(chunks, 4, async (chunk) => {
    if (Date.now() - started > DEADLINE_MS) return
    const results = await googleMany(chunk, target, source)
    chunk.forEach((text, i) => { if (results[i]) resolved.set(text, results[i] as string) })
  })

  // Pass 2 — MyMemory for anything Google could not translate
  const remaining = unique.filter(t => !resolved.has(t))
  if (remaining.length) {
    await mapLimit(remaining, 5, async (text) => {
      if (Date.now() - started > DEADLINE_MS) return
      const translated = await myMemoryOne(text, target, source)
      if (translated) resolved.set(text, translated)
    })
  }

  return texts.map(t => resolved.get(clean(t)) || t)
}

export async function translateText(text: string, lang: string, sourceLang: string = 'en'): Promise<string> {
  const [out] = await translateTexts([text], lang, sourceLang)
  return out
}
