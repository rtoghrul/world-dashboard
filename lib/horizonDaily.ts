// The daily Horizon edition: built once per UTC day and kept in Next's data cache
// (persisted across serverless instances on Vercel, on disk with `next start`).
// The Vercel cron (vercel.json → /api/cron/horizon) warms it at 05:00 UTC so readers
// never wait for the ~8 s build; if the cron never runs, the first visitor builds it.
import { unstable_cache } from 'next/cache'
import { buildHorizon, type HorizonBriefing } from '@/lib/horizon'

export const utcDay = (now = Date.now()) => new Date(now).toISOString().slice(0, 10)

/** Fewer than this many stories means most sources failed: don't freeze that for a whole day. */
const MIN_ITEMS = 20

export function getDailyBriefing(day = utcDay()): Promise<HorizonBriefing> {
  return unstable_cache(
    async () => {
      const b = await buildHorizon()
      // Throwing keeps a poor build out of the cache; the caller falls back to a live build.
      if (b.items.length < MIN_ITEMS) throw new Error(`horizon daily: only ${b.items.length} items`)
      return { ...b, live: false, edition: 'daily' as const }
    },
    ['horizon-daily-v1', day],
    { revalidate: 60 * 60 * 26, tags: ['horizon-daily'] },
  )()
}
