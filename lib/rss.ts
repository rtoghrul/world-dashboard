export type RssItem = {
  title: string
  link: string
  pubDate: string
  description: string
  thumbnail: string | null
  source: string
}

function extractThumbnail(block: string): string | null {
  const patterns = [
    /media:thumbnail[^>]+url="([^"]+)"/i,
    /media:content[^>]+url="([^"]+)"/i,
    /<enclosure[^>]+url="([^"]+)"[^>]+type="image/i,
    /og:image[^>]+content="([^"]+)"/i,
    /<img[^>]+src="([^"]+)"/i,
  ]
  for (const pattern of patterns) {
    const match = block.match(pattern)
    if (match && match[1] && match[1].startsWith('http')) return match[1]
  }
  const descImg = block.match(/<description[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"/i)
  if (descImg && descImg[1]?.startsWith('http')) return descImg[1]
  return null
}

function stripTags(html: string) {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

export function parseRSS(xml: string, fallbackSource: string) {
  const items: RssItem[] = []
  const channelTitleMatch = xml.match(/<channel>\s*<title>(?:<!\[CDATA\[)?([^\]<]+)/i)
  const source = channelTitleMatch ? channelTitleMatch[1].trim() : fallbackSource

  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  let match: RegExpExecArray | null
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]
    const get = (tag: string) => {
      const m = block.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i'))
      return m ? m[1].trim() : ''
    }
    const linkMatch = block.match(/<link>([^<]+)<\/link>/i) || block.match(/<link[^>]+href="([^"]+)"/i)
    const descriptionRaw = get('description')
    items.push({
      title: stripTags(get('title')),
      link: linkMatch ? linkMatch[1].trim() : '',
      pubDate: get('pubDate') || get('dc:date'),
      description: stripTags(descriptionRaw).slice(0, 170),
      thumbnail: extractThumbnail(block),
      source,
    })
    if (items.length >= 10) break
  }
  return items
}

export async function fetchRss(url: string, revalidateSeconds: number) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WorldDashboard/1.0)' },
    next: { revalidate: revalidateSeconds },
  })
  if (!res.ok) return null
  return res.text()
}
