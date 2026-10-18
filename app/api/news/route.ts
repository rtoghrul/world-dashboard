import { NextResponse } from 'next/server'
import { translateTexts } from '@/lib/translate'
import { loadFeed, storyKey } from '@/lib/feed'
import { clampInt } from '@/lib/http'
import { isNewsCategory, sourcesFor, type NewsCategory } from '@/lib/newsSources'

export const revalidate = 300

const SUPPORTED_LANGS = ['en', 'az', 'ru', 'de', 'tr', 'fr', 'es', 'zh', 'ar', 'ja', 'it', 'pt']

export type NewsApiItem = {
  title: string
  link: string
  pubDate: string
  description: string
  thumbnail: string | null
  source: string
  sourceUrl: string
  sourceId: string
  category: string
  lang: string
}

/**
 * GET /api/news?category=<topic|region|local>&lang=<ui lang>&limit=<1-40>
 * Newest first, duplicates (same headline from several feeds) removed, and no single
 * publisher can take more than its share of the list.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const rawCategory = searchParams.get('category') || 'top'
  const category: NewsCategory = isNewsCategory(rawCategory) ? rawCategory : 'top'
  const rawLang = searchParams.get('lang') || 'en'
  const lang = SUPPORTED_LANGS.includes(rawLang) ? rawLang : 'en'
  const limit = clampInt(searchParams.get('limit'), 12, 1, 40)

  const sources = sourcesFor(category, lang)
  const perFeed = await Promise.all(sources.map(async src => {
    const entries = await loadFeed(src.url, { revalidate: 300, max: 15 })
    return entries.map((e): NewsApiItem => ({
      title: e.title,
      link: e.link,
      pubDate: e.published,
      description: e.summary.length > 200 ? e.summary.slice(0, 197) + '…' : e.summary,
      thumbnail: e.image,
      source: src.name,
      sourceUrl: src.home,
      sourceId: src.id,
      category,
      lang: src.lang,
    }))
  }))

  const all = perFeed.flat().sort((a, b) => (b.pubDate || '').localeCompare(a.pubDate || ''))
  const seen = new Set<string>()
  const perSource = new Map<string, number>()
  const cap = Math.max(2, Math.ceil(limit / Math.max(1, perFeed.filter(f => f.length).length)) + 1)
  const items: NewsApiItem[] = []
  for (const item of all) {
    const key = storyKey(item.title)
    if (!key || seen.has(key)) continue
    const n = perSource.get(item.sourceId) || 0
    if (n >= cap) continue
    seen.add(key)
    perSource.set(item.sourceId, n + 1)
    items.push(item)
    if (items.length >= limit) break
  }

  // Translate only what isn't already in the reader's language ('local' never is).
  const toTranslate = items.filter(i => i.lang !== lang)
  if (toTranslate.length) {
    const groups = new Map<string, NewsApiItem[]>()
    for (const i of toTranslate) groups.set(i.lang, [...(groups.get(i.lang) || []), i])
    await Promise.all(Array.from(groups.entries()).map(async ([from, group]) => {
      const [titles, descs] = await Promise.all([
        translateTexts(group.map(i => i.title), lang, from),
        translateTexts(group.map(i => i.description), lang, from),
      ])
      group.forEach((item, idx) => { item.title = titles[idx] || item.title; item.description = descs[idx] || item.description })
    }))
  }

  return NextResponse.json(items, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  })
}
