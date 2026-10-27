'use client'
import Link from 'next/link'
import useSWR from 'swr'
import { ArrowRight, Layers, Radar } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'
import { ui, timeAgo } from '@/lib/i18n/ui'
import type { HorizonBriefing } from '@/lib/horizon'
import { scoreClass, topicLabel } from '@/components/horizon/HorizonBoard'

const fetcher = async (url: string) => {
  const r = await fetch(url)
  const d = await r.json().catch(() => null)
  if (!r.ok || !d || !Array.isArray(d.items)) throw new Error(`HTTP ${r.status}`)
  return d as HorizonBriefing
}

/** Home-page teaser: the five strongest stories on the Horizon radar. */
export default function HorizonWidget() {
  const { lang } = useLang()
  const { data, error, isLoading } = useSWR(`/api/horizon?lang=${lang}`, fetcher, { refreshInterval: 900000, revalidateOnFocus: false, dedupingInterval: 60000 })
  const items = data?.items.slice(0, 5) || []

  return (
    <section aria-labelledby="hz-widget-title" className="wd-card overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-3 border-b border-line">
        <h2 id="hz-widget-title" className="wd-section-title"><Radar className="w-4 h-4 text-indigo-400" aria-hidden="true" />{ui('home.radar', lang)}</h2>
        <Link href="/section/horizon/all" className="wd-link inline-flex items-center gap-1">{ui('hz.open', lang)}<ArrowRight className="w-3 h-3" aria-hidden="true" /></Link>
      </div>
      <ol className="divide-y divide-line" aria-busy={isLoading}>
        {isLoading && Array.from({ length: 4 }).map((_, i) => <li key={i} className="px-4 py-3"><div className="h-3 skeleton rounded w-5/6 mb-2" /><div className="h-2 skeleton rounded w-1/3" /></li>)}
        {error && !data && <li role="alert" className="px-4 py-6 text-center text-xs text-ink-3">{ui('common.error', lang)}</li>}
        {items.map(item => (
          <li key={item.url} className="relative px-4 py-3 hover:bg-fg/[0.02] transition-colors break-words">
            <div className="flex gap-3">
              <span className={`mt-0.5 h-6 min-w-[2.1rem] inline-flex items-center justify-center rounded-md border text-[11px] font-bold tabular-nums ${scoreClass(item.score)}`}>{item.score.toFixed(1)}</span>
              <div className="min-w-0">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[13px] font-medium leading-snug text-ink-1 hover:text-indigo-300 line-clamp-2">
                  {item.title}<span className="sr-only"> ({ui('common.newTab', lang)})</span>
                </a>
                <p className="flex flex-wrap items-center gap-x-2 mt-1 text-[11px] text-ink-4">
                  <span className="text-ink-3">{item.source}</span>
                  {item.tags?.[0] && <span>{topicLabel(item.tags[0], lang)}</span>}
                  {item.sources?.length > 1 && <span className="inline-flex items-center gap-0.5 text-amber-400"><Layers className="w-3 h-3" aria-hidden="true" />{item.sources.length}</span>}
                  {item.published && <span suppressHydrationWarning>{timeAgo(item.published, lang)}</span>}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
