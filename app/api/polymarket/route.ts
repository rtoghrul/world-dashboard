import { NextResponse } from 'next/server'
import { fetchWithTimeout, clampInt } from '@/lib/http'
import { translateTexts } from '@/lib/translate'

export const revalidate = 120
export const maxDuration = 60

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const limit = clampInt(searchParams.get('limit'), 12, 1, 100)
  const offset = clampInt(searchParams.get('offset'), 0, 0, 10000)
  const lang = (searchParams.get('lang') || 'en').slice(0, 5)

  try {
    const res = await fetchWithTimeout(
      `https://gamma-api.polymarket.com/markets?limit=${limit}&offset=${offset}&order=volume&ascending=false&active=true&closed=false`,
      { next: { revalidate: 120 } }
    )
    if (!res.ok) throw new Error('Polymarket error')
    let data = await res.json()

    // Market questions are editorial text; translate them for non-English readers.
    if (lang !== 'en' && Array.isArray(data) && data.length > 0) {
      const questions = await translateTexts(data.map((m: { question?: string }) => String(m?.question || '')), lang)
      data = data.map((m: { question?: string }, i: number) => ({ ...m, question: questions[i] || m.question }))
    }

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600' },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch Polymarket data' }, { status: 502 })
  }
}
