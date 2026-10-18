import { NextResponse } from 'next/server'
import { buildHorizon, normalizeBriefing } from '@/lib/horizon'
import { fetchWithTimeout } from '@/lib/http'

// Always render per-request; freshness is controlled by the CDN Cache-Control header below.
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const GIST_URL = 'https://gist.githubusercontent.com/rtoghrul/b6c9ff6f0daf20f33f09edc263dfb328/raw/horizon-briefing.json'
// The external AI-ranking pipeline that writes the gist has been idle since 2026-06-06.
// It is only used while genuinely recent, so the live briefing is what people see today;
// if the pipeline comes back it is picked up automatically.
const STALE_MS = 8 * 60 * 60 * 1000
const CACHE = { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800' }

export async function GET() {
  try {
    const res = await fetchWithTimeout(GIST_URL, { next: { revalidate: 3600 } })
    if (res.ok) {
      const data = await res.json()
      const age = Date.now() - new Date(data?.date).getTime()
      const gist = Number.isFinite(age) && age < STALE_MS ? normalizeBriefing(data) : null
      if (gist) return NextResponse.json(gist, { headers: CACHE })
    }
  } catch {}

  const briefing = await buildHorizon()
  if (!briefing.items.length) {
    return NextResponse.json({ error: 'No sources reachable', sources: briefing.sources }, { status: 502 })
  }
  return NextResponse.json(briefing, { headers: CACHE })
}
