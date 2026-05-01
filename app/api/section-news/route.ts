import { NextRequest, NextResponse } from 'next/server'

const LANG_MAP: Record<string, { hl: string; gl: string; ceid: string }> = {
  en: { hl: 'en', gl: 'US', ceid: 'US:en' },
  de: { hl: 'de', gl: 'DE', ceid: 'DE:de' },
  ru: { hl: 'ru', gl: 'RU', ceid: 'RU:ru' },
  tr: { hl: 'tr', gl: 'TR', ceid: 'TR:tr' },
  az: { hl: 'ru', gl: 'RU', ceid: 'RU:ru' },
  fr: { hl: 'fr', gl: 'FR', ceid: 'FR:fr' },
  es: { hl: 'es', gl: 'ES', ceid: 'ES:es' },
  it: { hl: 'it', gl: 'IT', ceid: 'IT:it' },
  pt: { hl: 'pt-BR', gl: 'BR', ceid: 'BR:pt-419' },
  zh: { hl: 'zh-CN', gl: 'CN', ceid: 'CN:zh-CN' },
  ar: { hl: 'ar', gl: 'SA', ceid: 'SA:ar' },
  ja: { hl: 'ja', gl: 'JP', ceid: 'JP:ja' },
}

const KEYWORDS: Record<string, Record<string, string>> = {
  germany: {
    behoerden: 'Deutschland Behörden Verwaltung Gesetz Politik',
    wohnung: 'Deutschland Mietpreise Immobilien Wohnung Miete',
    bildung: 'Deutschland Bildung Schule Universität',
    arbeit: 'Deutschland Arbeitsmarkt Jobs Gehalt Fachkräfte',
    aenderungen: 'Deutschland Gesetzesänderung 2025 neue Regeln',
    tools: 'Deutschland Digitalisierung Apps Online-Dienste',
  },
  chinese: {
    all: 'Temu SHEIN AliExpress Europe shopping',
    general: 'Temu AliExpress Europe marketplace',
    fashion: 'SHEIN fast fashion Europe',
    electronics: 'Xiaomi Banggood electronics Europe',
    home: 'smart home China Europe products',
    kids: 'PatPat kids clothing Europe',
    hobby: '3D printer drone China Europe',
  },
  platforms: {
    general: 'Amazon REWE Lieferando Deutschland Online-Shopping',
    clothes: 'Zalando AboutYou Mode Deutschland Online',
    pharma: 'Online Apotheke Deutschland DocMorris',
    food: 'Lieferando Wolt Flink Gorillas Lieferung',
    electronics: 'MediaMarkt Saturn Elektronik Deutschland',
    autoparts: 'Autodoc Kfzteile24 Autoteile Online',
    furniture: 'IKEA Wayfair Möbel Deutschland Online',
    international: 'Amazon eBay international shopping',
  },
  women: {
    beauty: 'Beauty Skincare Trends Kosmetik',
    diet: 'Ernährung Diät gesund abnehmen',
    fitness: 'Fitness Workout Frauen Training',
    parenting: 'Eltern Baby Kinder Erziehung',
    fashion: 'Mode Trends Frauen Fashion',
    wellness: 'Wellness Gesundheit Mental Health',
  },
  crypto: {
    all: 'cryptocurrency Bitcoin Ethereum market',
  },
  stocks: {
    all: 'stock market DAX S&P500 investing',
  },
  entertainment: {
    movie: 'new movies cinema release 2025',
    series: 'new TV series streaming Netflix',
    cartoon: 'animated movie cartoon kids new',
    all: 'movies series Netflix Disney streaming',
  },
  weather: {
    all: 'extreme weather forecast warning',
  },
  travel: {
    _dynamic: true,
  },
  viral: {
    all: 'viral trending social media TikTok',
  },
  aitools: {
    all: 'AI artificial intelligence new tools ChatGPT',
    writing: 'AI writing tools GPT copywriting',
    image: 'AI image generation Midjourney DALL-E',
    code: 'AI coding assistant Copilot Cursor',
    audio: 'AI audio music generation voice',
    video: 'AI video generation Sora RunwayML',
    research: 'AI research papers breakthrough',
  },
  software: {
    all: 'software apps new release update',
    windows: 'Windows software apps new release',
    mac: 'macOS Mac apps software new',
    ios: 'iOS iPhone apps new release',
    android: 'Android apps Google Play new',
    extensions: 'browser extensions Chrome Firefox new',
  },
}

interface NewsItem {
  title: string
  link: string
  source: string
  pubDate: string
  image: string
}

function parseRSSItems(xml: string): NewsItem[] {
  const items: NewsItem[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1]
    const title = itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1') || ''
    const link = itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1] || ''
    const source = itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1') || ''
    const pubDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || ''
    // Try to get image from media:content or enclosure
    const mediaUrl = itemXml.match(/<media:content[^>]*url="([^"]+)"/)?.[1] || ''
    const enclosure = itemXml.match(/<enclosure[^>]*url="([^"]+)"/)?.[1] || ''
    const image = mediaUrl || enclosure || ''
    if (title && link) {
      items.push({ title: title.trim(), link: link.trim(), source: source.trim(), pubDate: pubDate.trim(), image })
    }
  }
  return items
}

export async function GET(req: NextRequest) {
  const section = req.nextUrl.searchParams.get('section') || ''
  const tab = req.nextUrl.searchParams.get('tab') || 'all'
  const lang = req.nextUrl.searchParams.get('lang') || 'de'
  const destination = req.nextUrl.searchParams.get('destination') || ''

  // Travel section uses dynamic keywords based on destination
  let keywords = ''
  if (section === 'travel') {
    const dest = destination || tab
    if (!dest || dest === 'all') {
      keywords = 'travel tourism flights hotels deals'
    } else {
      keywords = `${dest} travel tourism visa safety tips`
    }
  } else {
    const sectionKeywords = KEYWORDS[section]
    if (!sectionKeywords) {
      return NextResponse.json({ items: [], error: 'Unknown section' }, { status: 400 })
    }
    keywords = sectionKeywords[tab] || sectionKeywords['all'] || Object.values(sectionKeywords)[0]
  }

  if (!keywords) {
    return NextResponse.json({ items: [], error: 'No keywords for section/tab' }, { status: 400 })
  }

  const locale = LANG_MAP[lang] || LANG_MAP.en

  try {
    const encoded = encodeURIComponent(keywords + ' when:1d')
    const url = `https://news.google.com/rss/search?q=${encoded}&hl=${locale.hl}&gl=${locale.gl}&ceid=${locale.ceid}`

    const res = await fetch(url, {
      next: { revalidate: 1800 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WorldDashboard/1.0)' },
    })

    if (!res.ok) {
      // Fallback: try without "when:1d" for more results
      const fallbackUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(keywords)}&hl=${locale.hl}&gl=${locale.gl}&ceid=${locale.ceid}`
      const fallbackRes = await fetch(fallbackUrl, { next: { revalidate: 1800 } })
      if (!fallbackRes.ok) {
        return NextResponse.json({ items: [], error: 'News fetch failed' }, { status: 502 })
      }
      const xml = await fallbackRes.text()
      const newsItems = parseRSSItems(xml).slice(0, 10)
      return NextResponse.json({ items: newsItems })
    }

    const xml = await res.text()
    let newsItems = parseRSSItems(xml).slice(0, 10)

    // If less than 3 items found for today, try without date filter
    if (newsItems.length < 3) {
      const fallbackUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(keywords)}&hl=${locale.hl}&gl=${locale.gl}&ceid=${locale.ceid}`
      const fallbackRes = await fetch(fallbackUrl, { next: { revalidate: 1800 } })
      if (fallbackRes.ok) {
        const xml2 = await fallbackRes.text()
        newsItems = parseRSSItems(xml2).slice(0, 10)
      }
    }

    return NextResponse.json({ items: newsItems })
  } catch (err: any) {
    return NextResponse.json({ items: [], error: err.message }, { status: 500 })
  }
}
