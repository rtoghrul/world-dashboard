import { NextRequest, NextResponse } from 'next/server'
import { getFactsForCategory } from '@/lib/facts'
import { translateTexts } from '@/lib/translate'

const FACTS_PER_PAGE = 5
const SUPPORTED_LANGS = ['en', 'az', 'ru', 'de', 'tr', 'fr', 'es', 'zh', 'ar', 'ja', 'it', 'pt'] as const

type SupportedLang = typeof SUPPORTED_LANGS[number]

function normalizeLang(value: string | null): SupportedLang {
  const code = (value || 'en').toLowerCase().split('-')[0]
  return SUPPORTED_LANGS.includes(code as SupportedLang) ? (code as SupportedLang) : 'en'
}

function normalizePage(value: string | null, totalPages: number) {
  const requestedPage = Number(value || '1')
  return Number.isFinite(requestedPage) ? Math.min(Math.max(1, Math.floor(requestedPage)), totalPages) : 1
}

function getBaseTitle(title: string) {
  return title.split(' — ')[0]
}

function buildSourceUrl(baseTitle: string, category: string) {
  const query = `${baseTitle} ${category} fact explanation reliable source`
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || 'weird-facts'
  const lang = normalizeLang(searchParams.get('lang'))
  const facts = getFactsForCategory(category)
  const totalPages = Math.max(1, Math.ceil(facts.length / FACTS_PER_PAGE))
  const currentPage = normalizePage(searchParams.get('page'), totalPages)
  const start = (currentPage - 1) * FACTS_PER_PAGE
  const pageFacts = facts.slice(start, start + FACTS_PER_PAGE)

  const titles = pageFacts.map(fact => fact.title)
  const texts = pageFacts.map(fact => fact.text)
  const [translatedTitles, translatedTexts] = lang === 'en'
    ? [titles, texts]
    : await Promise.all([
        translateTexts(titles, lang),
        translateTexts(texts, lang),
      ])

  return NextResponse.json({
    category,
    lang,
    page: currentPage,
    totalPages,
    items: pageFacts.map((fact, index) => {
      const baseTitle = getBaseTitle(fact.title)
      return {
        title: translatedTitles[index] || fact.title,
        text: translatedTexts[index] || fact.text,
        sourceName: 'Learn more',
        sourceUrl: buildSourceUrl(baseTitle, category),
      }
    }),
  })
}
