import { NextResponse, type NextRequest } from 'next/server'
import { buildHorizon, normalizeBriefing } from '@/lib/horizon'
import { getDailyBriefing } from '@/lib/horizonDaily'
import { fetchWithTimeout } from '@/lib/http'

// Always render per-request; freshness is controlled by the caches below.
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const GIST_URL = 'https://gist.githubusercontent.com/rtoghrul/b6c9ff6f0daf20f33f09edc263dfb328/raw/horizon-briefing.json'
// The external AI-ranking pipeline that writes the gist has been idle since 2026-06-06.
// It is used only while genuinely recent; if it comes back it is picked up automatically.
const STALE_MS = 8 * 60 * 60 * 1000
const DAILY_CACHE = { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' }
const LIVE_CACHE = { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200' }

/**
 * GET /api/horizon           → fresh gist briefing, else today's daily edition, else a live build
 * GET /api/horizon?live=1    → a live build (cached ~10 min at the CDN)
 */
export async function GET(req: NextRequest) {
  const live = req.nextUrl.searchParams.get('live') === '1'

  if (!live) {
    try {
      const res = await fetchWithTimeout(GIST_URL, { next: { revalidate: 3600 } })
      if (res.ok) {
        const data = await res.json()
        const age = Date.now() - new Date(data?.date).getTime()
        const gist = Number.isFinite(age) && age < STALE_MS ? normalizeBriefing(data) : null
        if (gist) return NextResponse.json({ ...gist, edition: 'gist' }, { headers: DAILY_CACHE })
      }
    } catch {}

    try {
      return NextResponse.json(await getDailyBriefing(), { headers: DAILY_CACHE })
    } catch (err) {
      console.error('horizon: daily edition unavailable, serving live', err)
    }
  }

  const briefing = await buildHorizon()
  if (!briefing.items.length) {
    return NextResponse.json({ error: 'No sources reachable', sources: briefing.sources }, { status: 502 })
  }
  return NextResponse.json({ ...briefing, edition: 'live' }, { headers: LIVE_CACHE })
}
