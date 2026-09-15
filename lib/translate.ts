// Text translation helper used by API routes (news, section-news, facts, education, ...).
//
// Provider strategy: MyMemory is the only free, key-less, non-Cloudflare endpoint that
// reliably answers from both local dev and Vercel's datacenter IPs. Google's public
// "gtx" endpoint returns a captcha page from datacenter IPs, so it is not used.
//
// Reliability rules:
//  - per-text requests with bounded concurrency (MyMemory has no batch API)
//  - identical strings are deduped (headlines repeat a lot between feeds)
//  - results are cached in the Next.js Data Cache for 24h (fetch `next.revalidate`)
//  - every failure mode falls back to the original English string, never to garbage
//  - set MYMEMORY_EMAIL to lift the anonymous daily word quota

const LANG_MAP: Record<string, string> = {
  zh: 'zh-CN',
  'zh-CN': 'zh-CN',
  pt: 'pt-BR',
  'pt-BR': 'pt-BR',
}

function mapLang(lang: string) {
  return LANG_MAP[lang] || lang
}

// MyMemory rejects long queries; 450 chars keeps us safely under the limit.
const MAX_LEN = 450

const BAD_RESULT = /MYMEMORY WARNING|QUERY LENGTH LIMIT|INVALID LANGUAGE PAIR|NO QUERY SPECIFIED|PLEASE SELECT TWO DISTINCT LANGUAGES/i

async function translateOne(text: string, target: string, source: string): Promise<string | null> {
  const q = (text || '').replace(/\s+/g, ' ').trim().slice(0, MAX_LEN)
  if (!q || q.length < 2) return null

  const email = process.env.MYMEMORY_EMAIL
  const url =
    'https://api.mymemory.translated.net/get?q=' +
    encodeURIComponent(q) +
    '&langpair=' + encodeURIComponent(`${source}|${target}`) +
    (email ? `&de=${encodeURIComponent(email)}` : '')

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(7000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WorldDashboard/1.0)' },
      // 24h server-side cache per unique string — keeps us well inside the free quota
      next: { revalidate: 86400 },
    })
    if (!res.ok) return null
    const data = await res.json()
    if (data?.quotaFinished) return null
    const translated = data?.responseData?.translatedText
    if (typeof translated !== 'string' || !translated.trim()) return null
    if (BAD_RESULT.test(translated)) return null
    // Provider echoed the source back (unknown phrase / unsupported pair)
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

export async function translateTexts(texts: string[], lang: string, sourceLang: string = 'en'): Promise<string[]> {
  if (!Array.isArray(texts) || texts.length === 0) return texts
  if (!lang) return texts

  const target = mapLang(lang)
  const source = mapLang(sourceLang)
  if (target === source) return texts

  // Dedupe: feeds frequently repeat the same headline — pay for it once.
  const unique = Array.from(new Set(texts.map(t => (t || '').trim()).filter(Boolean)))
  const resolved = new Map<string, string>()

  await mapLimit(unique, 5, async (text) => {
    const translated = await translateOne(text, target, source)
    if (translated) resolved.set(text, translated)
  })

  return texts.map(t => resolved.get((t || '').trim()) || t)
}

export async function translateText(text: string, lang: string, sourceLang: string = 'en'): Promise<string> {
  const [out] = await translateTexts([text], lang, sourceLang)
  return out
}
