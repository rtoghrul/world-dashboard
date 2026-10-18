'use client'
import { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { ArrowRight, Newspaper } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'
import { ui } from '@/lib/i18n/ui'
import type { NewsCategory } from '@/lib/newsSources'
import { NewsRow, NewsSkeleton, type NewsRowItem } from '@/components/news/NewsList'
import { tabLabel } from '@/components/news/NewsTabs'

const TABS: NewsCategory[] = ['top', 'local', 'azerbaijan', 'caucasus', 'europe', 'world', 'technology']

const fetcher = async (url: string) => {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  const d = await r.json()
  if (!Array.isArray(d)) throw new Error('Unexpected response')
  return d as NewsRowItem[]
}

export default function HomeNews() {
  const { lang } = useLang()
  const [tab, setTab] = useState<NewsCategory>('top')
  const { data, error, isLoading, mutate } = useSWR(`/api/news?category=${tab}&lang=${lang}&limit=7`, fetcher, { refreshInterval: 300000 })

  return (
    <section aria-labelledby="home-news-title" className="wd-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 pt-4">
        <h2 id="home-news-title" className="wd-section-title"><Newspaper className="w-4 h-4 text-rose-400" aria-hidden="true" />{ui('news.title', lang)}<span className="live-dot ml-1" aria-hidden="true" /></h2>
        <Link href={`/news?category=${tab}`} className="wd-link inline-flex items-center gap-1">{ui('news.viewAll', lang)}<ArrowRight className="w-3 h-3" aria-hidden="true" /></Link>
      </div>
      <div role="tablist" aria-label={ui('news.regions', lang)} className="flex gap-1.5 overflow-x-auto scrollbar-hide px-4 sm:px-5 py-3 border-b border-line">
        {TABS.map(id => (
          <button key={id} role="tab" aria-selected={tab === id} aria-controls="home-news-panel" onClick={() => setTab(id)} className="wd-chip shrink-0 whitespace-nowrap">
            {id === 'azerbaijan' && <span aria-hidden="true">🇦🇿</span>}{tabLabel(id, lang)}
          </button>
        ))}
      </div>
      <div id="home-news-panel" role="tabpanel" className="divide-y divide-line" aria-busy={isLoading}>
        {isLoading && <NewsSkeleton rows={5} />}
        {error && (
          <div role="alert" className="p-6 text-center text-sm">
            <p className="text-ink-2">{ui('common.error', lang)}</p>
            <button onClick={() => mutate()} className="wd-chip mt-3">{ui('common.retry', lang)}</button>
          </div>
        )}
        {data && data.length === 0 && <p className="p-6 text-center text-sm text-ink-3">{ui('news.empty', lang)}</p>}
        {data?.map(item => <NewsRow key={item.link} item={item} />)}
      </div>
    </section>
  )
}
