import { NextRequest, NextResponse } from 'next/server'

// Keyword mapping for each section/tab
const KEYWORDS: Record<string, Record<string, string>> = {
  germany: {
    behoerden: 'Behörden Deutschland Verwaltung Gesetz',
    wohnung: 'Mietpreise Deutschland Immobilien Wohnung Miete',
    bildung: 'Bildung Schule Universität Kita Deutschland',
    arbeit: 'Arbeitsmarkt Jobs Gehalt Fachkräfte Deutschland',
    aenderungen: 'Gesetzesänderung 2025 Deutschland neue Regeln',
    tools: 'Digitalisierung Apps Deutschland Online-Dienste',
  },
  chinese: {
    all: 'Temu SHEIN AliExpress Europe shopping',
    general: 'Temu AliExpress Europe marketplace',
    fashion: 'SHEIN fast fashion Europe Zaful',
    electronics: 'Xiaomi Banggood electronics Europe gadgets',
    home: 'robot vacuum smart home China Europe',
    kids: 'PatPat kids clothing Europe affordable',
    hobby: '3D printer drone RC China Europe',
  },
  platforms: {
    general: 'Amazon REWE Lieferando Deutschland Online-Shopping',
    clothes: 'Zalando AboutYou Mode Deutschland Online',
    pharma: 'Online Apotheke Deutschland DocMorris',
    food: 'Lieferando Wolt Flink Gorillas Lieferung Deutschland',
    electronics: 'MediaMarkt Saturn Elektronik Deutschland',
    autoparts: 'Autodoc Kfzteile24 Autoteile Online Deutschland',
    furniture: 'IKEA Wayfair Möbel Deutschland Online',
    international: 'Amazon eBay international shopping Germany',
  },
  women: {
    beauty: 'Beauty Skincare Trends Kosmetik',
    diet: 'Ernährung Diät gesund abnehmen Tipps',
    fitness: 'Fitness Workout Frauen Training Tipps',
    parenting: 'Eltern Baby Kinder Erziehung Tipps',
    fashion: 'Mode Trends Frauen Fashion Outfit',
    wellness: 'Wellness Gesundheit Frauen Mental Health',
  },
  crypto: {
    all: 'cryptocurrency Bitcoin Ethereum market news',
  },
  stocks: {
    all: 'stock market DAX S&P500 investing news',
  },
  entertainment: {
    all: 'movies series Netflix Disney streaming new releases',
  },
  weather: {
    all: 'Wetter Deutschland Unwetter Vorhersage',
  },
  travel: {
    all: 'Reisen Flüge günstig Urlaub Tipps Europa',
  },
  viral: {
    all: 'viral trending social media TikTok YouTube',
  },
  aitools: {
    all: 'AI artificial intelligence tools ChatGPT new',
  },
  software: {
    all: 'software apps new release update developer tools',
  },
}

interface NewsItem {
  title: string
  link: string
  source: string
  pubDate: string
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
    if (title && link) {
      items.push({ title: title.trim(), link: link.trim(), source: source.trim(), pubDate: pubDate.trim() })
    }
  }
  return items
}

export async function GET(req: NextRequest) {
  const section = req.nextUrl.searchParams.get('section') || ''
  const tab = req.nextUrl.searchParams.get('tab') || 'all'

  const sectionKeywords = KEYWORDS[section]
  if (!sectionKeywords) {
    return NextResponse.json({ items: [], error: 'Unknown section' }, { status: 400 })
  }

  const keywords = sectionKeywords[tab] || sectionKeywords['all'] || Object.values(sectionKeywords)[0]
  if (!keywords) {
    return NextResponse.json({ items: [], error: 'Unknown tab' }, { status: 400 })
  }

  try {
    const encoded = encodeURIComponent(keywords + ' when:1d')
    const url = `https://news.google.com/rss/search?q=${encoded}&hl=de&gl=DE&ceid=DE:de`

    const res = await fetch(url, {
      next: { revalidate: 1800 }, // cache 30 min
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WorldDashboard/1.0)' },
    })

    if (!res.ok) {
      // Fallback to English if German fails
      const urlEn = `https://news.google.com/rss/search?q=${encodeURIComponent(keywords + ' when:1d')}&hl=en&gl=US&ceid=US:en`
      const resEn = await fetch(urlEn, { next: { revalidate: 1800 } })
      if (!resEn.ok) {
        return NextResponse.json({ items: [], error: 'News fetch failed' }, { status: 502 })
      }
      const xmlEn = await resEn.text()
      const newsItems = parseRSSItems(xmlEn).slice(0, 10)
      return NextResponse.json({ items: newsItems })
    }

    const xml = await res.text()
    const newsItems = parseRSSItems(xml).slice(0, 10)
    return NextResponse.json({ items: newsItems })
  } catch (err: any) {
    return NextResponse.json({ items: [], error: err.message }, { status: 500 })
  }
}
