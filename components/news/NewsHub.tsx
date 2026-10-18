'use client'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { RefreshCw, Search, ExternalLink, Languages } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'
import { ui } from '@/lib/i18n/ui'
import { isNewsCategory, sourcesFor, type NewsCategory } from '@/lib/newsSources'
import { NewsRow, NewsSkeleton, type NewsRowItem } from './NewsList'
import { REGION_TABS, TOPIC_TABS, TabRow, tabLabel } from './NewsTabs'

const fetcher = async (url: string) => {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  const d = await r.json()
  if (!Array.isArray(d)) throw new Error('Unexpected response')
  return d as (NewsRowItem & { lang: string })[]
}

export default function NewsHub({ initialCategory, embedded = false }: { initialCategory?: string; embedded?: boolean }) {
  const { lang } = useLang()
  const router = useRouter()
  const [category, setCategory] = useState<NewsCategory>(initialCategory && isNewsCategory(initialCategory) ? initialCategory : 'top')
  const [query, setQuery] = useState('')
  const { data, error, isLoading, isValidating, mutate } = useSWR(`/api/news?category=${category}&lang=${lang}&limit=30`, fetcher, { refreshInterval: 300000, keepPreviousData: true })

  const choose = (id: NewsCategory) => {
    setCategory(id)
    setQuery('')
    if (!embedded) router.replace(`/news?category=${id}`, { scroll: false })
  }

  const items = useMemo(() => {
    const list = data || []
    const q = query.trim().toLowerCase()
    return q ? list.filter(i => i.title.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q) || i.source.toLowerCase().includes(q)) : list
  }, [data, query])
  const sources = useMemo(() => sourcesFor(category, lang), [category, lang])
  const translated = (data || []).some(i => i.lang && i.lang !== lang)

  return (
    <div className="space-y-5">
      {!embedded && <header className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-1">{ui('news.title', lang)}</h1>
        <p className="text-sm text-ink-3 max-w-2xl">{ui('news.subtitle', lang)}</p>
      </header>}

      <div className="wd-card p-3 sm:p-4 space-y-2.5">
        <TabRow label={ui('news.regions', lang)} tabs={REGION_TABS} value={category} onChange={choose} controls="news-panel" />
        <TabRow label={ui('news.topics', lang)} tabs={TOPIC_TABS} value={category} onChange={choose} controls="news-panel" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
        <section id="news-panel" role="tabpanel" aria-label={tabLabel(category, lang)} className="wd-card overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 justify-between px-4 sm:px-5 py-3 border-b border-line">
            <h2 className="wd-section-title">{tabLabel(category, lang)}{isValidating && <RefreshCw className="w-3.5 h-3.5 animate-spin text-ink-4" aria-hidden="true" />}</h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="relative flex-1 sm:w-56">
                <span className="sr-only">{ui('news.search', lang)}</span>
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-4" aria-hidden="true" />
                <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={ui('news.search', lang)} className="wd-input w-full pl-8 py-1.5 text-xs" />
              </label>
              <button onClick={() => mutate()} className="wd-chip" aria-label={ui('common.refresh', lang)}><RefreshCw className="w-3.5 h-3.5" aria-hidden="true" /></button>
            </div>
          </div>
          {translated && (
            <p className="flex items-center gap-1.5 px-5 py-2 text-[11px] text-ink-4 border-b border-line bg-surface-2/40"><Languages className="w-3 h-3" aria-hidden="true" />{ui('news.translated', lang)}</p>
          )}
          <div className="divide-y divide-line" aria-busy={isLoading}>
            {isLoading && !data && <NewsSkeleton rows={6} />}
            {error && !data && (
              <div role="alert" className="p-8 text-center text-sm">
                <p className="text-ink-2">{ui('common.error', lang)}</p>
                <button onClick={() => mutate()} className="wd-chip mt-3">{ui('common.retry', lang)}</button>
              </div>
            )}
            {data && data.length === 0 && <p className="p-8 text-center text-sm text-ink-3">{ui('news.empty', lang)}</p>}
            {data && data.length > 0 && items.length === 0 && <p className="p-8 text-center text-sm text-ink-3">{ui('news.noMatch', lang)}</p>}
            {items.map(item => <NewsRow key={item.link} item={item} size="md" />)}
          </div>
        </section>

        <aside className={`wd-card p-4 ${embedded ? '' : 'lg:sticky lg:top-20'}`}>
          <h2 className="wd-section-title mb-3">{ui('news.sourcesIn', lang)}</h2>
          <ul className="space-y-1.5">
            {sources.map(s => (
              <li key={s.id}>
                <a href={s.home} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs text-ink-2 hover:bg-fg/[0.04] hover:text-ink-1">
                  <span className="truncate">{s.name}</span>
                  <span className="flex items-center gap-1 text-ink-4 shrink-0">
                    <span className="uppercase text-[10px]">{s.lang}</span>
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" aria-hidden="true" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}
