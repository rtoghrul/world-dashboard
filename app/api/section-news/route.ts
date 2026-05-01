import { NextRequest, NextResponse } from 'next/server'

const LANG_MAP: Record<string, { hl: string; gl: string; ceid: string }> = {
  en: { hl: 'en', gl: 'US', ceid: 'US:en' },
  de: { hl: 'de', gl: 'DE', ceid: 'DE:de' },
  ru: { hl: 'ru', gl: 'RU', ceid: 'RU:ru' },
  tr: { hl: 'tr', gl: 'TR', ceid: 'TR:tr' },
  az: { hl: 'tr', gl: 'TR', ceid: 'TR:tr' },
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
  crypto: { all: 'cryptocurrency Bitcoin Ethereum market' },
  stocks: { all: 'stock market DAX S&P500 investing' },
  entertainment: {
    movie: 'yeni filmler sinema 2025',
    series: 'yeni diziler Netflix 2025',
    cartoon: 'animasyon çizgi film yeni',
    all: 'filmler diziler Netflix Disney streaming',
  },
  weather: { _dynamic: true },
  travel: { _dynamic: true },
  viral: { all: 'viral trending sosyal medya TikTok' },
  aitools: {
    all: 'yapay zeka AI yeni araçlar ChatGPT',
    writing: 'AI yazma araçları GPT',
    image: 'AI görsel üretimi Midjourney',
    code: 'AI kodlama asistanı Copilot',
    audio: 'AI ses müzik üretimi',
    video: 'AI video üretimi Sora',
    research: 'AI araştırma buluş',
  },
  software: {
    all: 'yazılım uygulama yeni güncelleme',
    windows: 'Windows yazılım uygulama yeni',
    mac: 'macOS Mac uygulama yeni',
    ios: 'iOS iPhone uygulama yeni',
    android: 'Android uygulama Google Play yeni',
    extensions: 'tarayıcı eklentileri Chrome yeni',
  },
}

interface NewsItem {
  title: string
  link: string
  source: string
  pubDate: string
  thumbnail: string
  description: string
}

function decodeGoogleNewsUrl(googleUrl: string): string {
  try {
    if (!googleUrl.includes('news.google.com/rss/articles/')) return googleUrl
    const articleId = googleUrl.split('/articles/')[1]?.split('?')[0]
    if (!articleId) return googleUrl
    const decoded = Buffer.from(articleId, 'base64').toString('latin1')
    const urlMatch = decoded.match(/https?:\/\/[^\s\x00-\x1f"'<>\\]{10,}/)
    if (urlMatch) {
      const clean = urlMatch[0].replace(/[\x00-\x1f\x7f-\x9f]+.*$/, '')
      if (clean.includes('.') && !clean.includes('news.google.com')) return clean
    }
    const utf8Decoded = Buffer.from(articleId, 'base64').toString('utf-8')
    const utf8Match = utf8Decoded.match(/https?:\/\/[^\s\x00-\x1f"'<>\\]{10,}/)
    if (utf8Match) {
      const clean = utf8Match[0].replace(/[\x00-\x1f\x7f-\x9f]+.*$/, '')
      if (clean.includes('.') && !clean.includes('news.google.com')) return clean
    }
  } catch {}
  return googleUrl
}

function extractRealUrl(descHtml: string, googleLink: string): string {
  const decoded = decodeGoogleNewsUrl(googleLink)
  if (decoded !== googleLink && !decoded.includes('news.google.com')) return decoded
  const hrefMatch = descHtml.match(/<a[^>]+href=["']([^"']+)["']/i)
  if (hrefMatch && hrefMatch[1] && !hrefMatch[1].includes('news.google.com')) {
    return hrefMatch[1]
  }
  return googleLink
}

function parseRSSItems(xml: string): NewsItem[] {
  const items: NewsItem[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1]
    const title = itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1') || ''
    const googleLink = itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() || ''
    const source = itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1') || ''
    const pubDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || ''
    const mediaUrl = itemXml.match(/<media:content[^>]*url=["']([^"']+)["']/)?.[1] || ''
    const enclosure = itemXml.match(/<enclosure[^>]*url=["']([^"']+)["']/)?.[1] || ''
    const thumbnail = mediaUrl || enclosure || ''
    const descRaw = itemXml.match(/<description>([\s\S]*?)<\/description>/)?.[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1') || ''

    const realLink = extractRealUrl(descRaw, googleLink)
    const description = descRaw.replace(/<[^>]+>/g, '').trim().slice(0, 300)

    if (title) {
      items.push({
        title: title.trim(),
        link: realLink,
        source: source.trim(),
        pubDate: pubDate.trim(),
        thumbnail,
        description,
      })
    }
  }
  return items
}

async function fetchOG(url: string): Promise<{ image: string; description: string }> {
  try {
    if (!url || url.includes('news.google.com')) return { image: '', description: '' }
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 4000)
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    })
    clearTimeout(timer)
    if (!res.ok) return { image: '', description: '' }
    const html = await res.text()
    const head = html.slice(0, 25000)
    const image = head.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)?.[1]
      || head.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i)?.[1]
      || head.match(/<meta[^>]*name=["']twitter:image(?::src)?["'][^>]*content=["']([^"']+)["']/i)?.[1]
      || head.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image(?::src)?["']/i)?.[1]
      || ''
    const desc = head.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)?.[1]
      || head.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i)?.[1]
      || head.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1]
      || head.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i)?.[1]
      || ''
    return { image: image.startsWith('http') ? image : '', description: desc.slice(0, 300) }
  } catch {
    return { image: '', description: '' }
  }
}

async function enrichItems(items: NewsItem[]): Promise<NewsItem[]> {
  const results = await Promise.allSettled(
    items.map(async (item) => {
      if (item.thumbnail && item.description && item.description.length > 30) return item
      if (item.link.includes('news.google.com')) return item
      const og = await fetchOG(item.link)
      return {
        ...item,
        thumbnail: item.thumbnail || og.image,
        description: (item.description && item.description.length > 30) ? item.description : (og.description || item.description),
      }
    })
  )
  return results.map((r, i) => r.status === 'fulfilled' ? r.value : items[i])
}

export async function GET(req: NextRequest) {
  const section = req.nextUrl.searchParams.get('section') || ''
  const tab = req.nextUrl.searchParams.get('tab') || 'all'
  const lang = req.nextUrl.searchParams.get('lang') || 'de'
  const destination = req.nextUrl.searchParams.get('destination') || ''
  const country = req.nextUrl.searchParams.get('country') || ''

  let keywords = ''
  if (section === 'travel') {
    const dest = destination || tab
    keywords = (!dest || dest === 'all') ? 'seyahat turizm uçuş otel' : `${dest} seyahat turizm vize`
  } else if (section === 'weather') {
    const wc = country || destination || ''
    keywords = wc ? `${wc} hava durumu fırtına uyarı` : 'hava durumu fırtına sel uyarı'
  } else {
    const sk = KEYWORDS[section]
    if (!sk) return NextResponse.json({ items: [], error: 'Unknown section' }, { status: 400 })
    keywords = sk[tab] || sk['all'] || Object.values(sk)[0]
  }

  if (!keywords) return NextResponse.json({ items: [], error: 'No keywords' }, { status: 400 })

  const locale = LANG_MAP[lang] || LANG_MAP.tr

  try {
    const encoded = encodeURIComponent(keywords + ' when:2d')
    const url = `https://news.google.com/rss/search?q=${encoded}&hl=${locale.hl}&gl=${locale.gl}&ceid=${locale.ceid}`
    const res = await fetch(url, { next: { revalidate: 1800 }, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WorldDashboard/1.0)' } })

    let newsItems: NewsItem[] = []
    if (res.ok) {
      newsItems = parseRSSItems(await res.text()).slice(0, 8)
    }

    if (newsItems.length < 3) {
      const fb = await fetch(`https://news.google.com/rss/search?q=${encodeURIComponent(keywords)}&hl=${locale.hl}&gl=${locale.gl}&ceid=${locale.ceid}`, { next: { revalidate: 1800 }, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WorldDashboard/1.0)' } })
      if (fb.ok) newsItems = parseRSSItems(await fb.text()).slice(0, 8)
    }

    if (newsItems.length === 0) return NextResponse.json({ items: [] })

    const enriched = await enrichItems(newsItems)
    return NextResponse.json({ items: enriched })
  } catch (err: any) {
    return NextResponse.json({ items: [], error: err.message }, { status: 500 })
  }
}
