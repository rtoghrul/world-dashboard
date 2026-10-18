import { NextResponse, type NextRequest } from 'next/server'
import { getDailyBriefing, utcDay } from '@/lib/horizonDaily'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Called by Vercel cron (vercel.json) once a day to build and cache today's Horizon edition.
 * No secret is required: the work is idempotent (one cached build per UTC day). If CRON_SECRET
 * is set in the project, Vercel sends it as a Bearer token and other callers are rejected.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  const started = Date.now()
  try {
    const b = await getDailyBriefing(utcDay())
    return NextResponse.json(
      { ok: true, date: b.date, generatedAt: b.generatedAt, items: b.items.length, sourcesOk: b.sources.filter(s => s.ok).length, ms: Date.now() - started },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (err) {
    console.error('cron/horizon failed', err)
    return NextResponse.json({ ok: false }, { status: 502, headers: { 'Cache-Control': 'no-store' } })
  }
}
