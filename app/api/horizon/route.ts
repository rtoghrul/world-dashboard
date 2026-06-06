import { NextResponse } from 'next/server'

const GIST_URL = 'https://gist.githubusercontent.com/rtoghrul/b6c9ff6f0daf20f33f09edc263dfb328/raw/horizon-briefing.json'

export async function GET() {
  try {
    const res = await fetch(GIST_URL, { next: { revalidate: 3600 } })
    if (!res.ok) return NextResponse.json({ error: 'No briefing available yet' }, { status: 404 })
    const data = await res.json()
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=600' },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to load briefing' }, { status: 500 })
  }
}
