import { NextResponse } from 'next/server'

const VPS_HOST = '82.165.54.47'

export interface HorizonItem {
  rank: number; title: string; url: string; score: number
  summary: string; source: string; tags: string[]
}
export interface HorizonBriefing {
  date: string; totalFetched: number; totalSelected: number; items: HorizonItem[]
}

function parseMarkdown(content: string): HorizonBriefing {
  const titleMatch = content.split('
')[0]?.match(/(\d{4}-\d{2}-\d{2})/)
  const date = titleMatch?.[1] ?? new Date().toISOString().split('T')[0]
  const countMatch = content.match(/From (\d+) items, (\d+) important/)
  const totalFetched = parseInt(countMatch?.[1] ?? '0')
  const totalSelected = parseInt(countMatch?.[2] ?? '0')
  const items: HorizonItem[] = []
  const sections = content.split(/
---
/)
  for (const section of sections) {
    const hm = section.match(/^## \[(.+?)\]\((.+?)\) .+ ([\d.]+)\/10/m)
    if (!hm) continue
    const title = hm[1], url = hm[2], score = parseFloat(hm[3])
    const rm = section.match(/item-(\d+)/), rank = rm ? parseInt(rm[1]) : items.length + 1
    const sm = section.match(/
([a-z]+(?:\/[^\s]+)?) /)
    const source = sm?.[1] ?? 'unknown'
    const afterH = section.replace(/^## .+
/, '').trim()
    const summary = (afterH.split(/

|\*\*Background\*\*/)[0] ?? '').replace(/
/g, ' ').trim()
    const tags: string[] = []
    const tm = section.match(/\*\*Tags\*\*: (.+)/)
    if (tm) { const re = /`#([^`]+)`/g; let m; while ((m = re.exec(tm[1])) !== null) tags.push(m[1]) }
    items.push({ rank, title, url, score, summary, source, tags })
  }
  return { date, totalFetched, totalSelected, items: items.sort((a, b) => a.rank - b.rank) }
}

async function fetchLatestBriefing(): Promise<string | null> {
  for (let daysAgo = 0; daysAgo <= 1; daysAgo++) {
    try {
      const d = new Date(Date.now() - daysAgo * 86400000).toISOString().split('T')[0]
      const res = await fetch('http://' + VPS_HOST + ':4242/horizon-' + d + '-en.md', { next: { revalidate: 3600 } })
      if (res.ok) return res.text()
    } catch {}
  }
  return null
}

export async function GET() {
  try {
    const content = await fetchLatestBriefing()
    if (!content) return NextResponse.json({ error: 'No briefing available yet' }, { status: 404 })
    return NextResponse.json(parseMarkdown(content), {
      headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=600' },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to load briefing' }, { status: 500 })
  }
}
