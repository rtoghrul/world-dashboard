'use client'
import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'
import { ui, timeAgo } from '@/lib/i18n/ui'

export type NewsRowItem = {
  title: string
  link: string
  pubDate: string
  description: string
  thumbnail: string | null
  source: string
  sourceUrl?: string
  lang?: string
}

function Thumb({ item, size }: { item: NewsRowItem; size: 'sm' | 'md' }) {
  const [failed, setFailed] = useState(false)
  const cls = size === 'md' ? 'w-20 h-16 sm:w-28 sm:h-20' : 'w-14 h-14'
  if (item.thumbnail && !failed) {
    return <img loading="lazy" decoding="async" src={item.thumbnail} alt="" className={`${cls} rounded-xl object-cover flex-shrink-0 bg-surface-2`} onError={() => setFailed(true)} />
  }
  return (
    <div aria-hidden="true" className={`${cls} rounded-xl bg-gradient-to-br from-brand/15 to-cyan-500/10 border border-line flex items-center justify-center flex-shrink-0`}>
      <span className="text-brand-ink text-lg font-bold">{item.source?.trim().charAt(0).toUpperCase() || 'N'}</span>
    </div>
  )
}

/** One headline: the title links straight to the article, the source name to the publisher. */
export function NewsRow({ item, size = 'sm', showSummary = true }: { item: NewsRowItem; size?: 'sm' | 'md'; showSummary?: boolean }) {
  const { lang } = useLang()
  const when = timeAgo(item.pubDate, lang)
  return (
    <article className="relative flex gap-3 break-words px-4 sm:px-5 py-3.5 hover:bg-fg/[0.025] transition-colors">
      <Thumb item={item} size={size} />
      <div className="flex-1 min-w-0">
        <h3 className={`${size === 'md' ? 'text-sm sm:text-[15px]' : 'text-[13px]'} font-medium leading-snug text-ink-1`}>
          <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-brand-ink transition-colors line-clamp-2">
            {item.title}
            <span className="sr-only"> ({ui('common.newTab', lang)})</span>
          </a>
        </h3>
        {showSummary && item.description && <p className="text-ink-3 text-xs mt-1 line-clamp-2">{item.description}</p>}
        <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-1.5 text-[11px] text-ink-4">
          {item.sourceUrl ? (
            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-ink-3 hover:text-ink-1 inline-flex items-center gap-1">
              {item.source}<ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
            </a>
          ) : <span className="font-medium text-ink-3">{item.source}</span>}
          {when && <><span aria-hidden="true">·</span><time dateTime={item.pubDate}>{when}</time></>}
        </div>
      </div>
    </article>
  )
}

export function NewsSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3 px-5 py-3.5 animate-pulse">
          <div className="w-14 h-14 rounded-xl bg-surface-2" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-3 rounded bg-surface-2 w-11/12" />
            <div className="h-3 rounded bg-surface-2 w-2/3" />
            <div className="h-2 rounded bg-surface-2 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
