import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// Hit daily by Vercel cron (vercel.json) so the free-tier Supabase project
// registers activity and never auto-pauses (which kills sign-in).
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return NextResponse.json({ ok: false, reason: 'no supabase env' })

  try {
    const supabase = createClient(url, key)
    const { error } = await supabase.from('profiles').select('id', { count: 'exact', head: true })
    return NextResponse.json({ ok: !error, at: new Date().toISOString(), error: error?.message ?? null })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : 'unknown' }, { status: 500 })
  }
}
