'use client'
import useSWR from 'swr'
import { useState } from 'react'
import Link from 'next/link'
import { Newspaper, Cpu, Search, ArrowRight, ChevronDown } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'
import NewsModal from './NewsModal'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export type NewsItem = {
  title: string
  link: string
  pubDate: string
  description: string
  thumbnail: string | null
  source: string
}

export function NewsCard({ item }: { item: NewsItem }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left flex gap-3 px-5 py-3 hover:bg-gray-800/40 transition group"
      >
        {item.thumbnail && (
          <img src={item.thumbnail} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-white text-xs font-medium line-clamp-2 group-hover:text-indigo-300 transition">{item.title}</h3>
          <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{item.description}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-600 text-xs">{item.source}</span>
            <span className="text-gray-700 text-xs">·</span>
            <span className="text-gray-600 text-xs">{item.pubDate ? new Date(item.pubDate).toLocaleDateString() : ''}</span>
          </div>
        </div>
      </button>
      {open && <NewsModal item={item} onClose={() => setOpen(false)} />}
    </>
  )
}

export default function NewsWidget() {
  const { tr, lang } = useLang()
  const [tab, setTab] = useState<'war' | 'ai'>('war')
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState(true)
  const { data, error, isLoading, mutate } = useSWR<NewsItem[]>(`/api/news?category=${tab}&lang=${lang}`, fetcher, { refreshInterval: 300000 })

  const items = Array.isArray(data) ? data : []
  const filtered = query
    ? items.filter(item => item.title.toLowerCase().includes(query.toLowerCase()) || item.description?.toLowerCase().includes(query.toLowerCase()))
    : items

  const top = items[0]

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-3 border-b border-gray-800 cursor-pointer select-none hover:bg-gray-800/20 transition"
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white font-semibold text-sm">📰 {tr.news}</h2>
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            {!collapsed && (
              <>
                <div className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-2 py-1">
                  <Search className="w-3 h-3 text-gray-500 flex-shrink-0" />
                  <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder={tr.search} className="bg-transparent text-white text-xs outline-none w-16 placeholder-gray-600" />
                </div>
                <button onClick={() => mutate()} className="text-xs text-indigo-400 hover:text-indigo-300 transition">{tr.refresh}</button>
              </>
            )}
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} />
          </div>
        </div>
        {!collapsed && (
          <div className="flex gap-2" onClick={e => e.stopPropagation()}>
            <button onClick={() => setTab('war')} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${tab === 'war' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              <Newspaper className="w-3 h-3" />{tr.warNews}
            </button>
            <button onClick={() => setTab('ai')} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${tab === 'ai' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              <Cpu className="w-3 h-3" />{tr.aiNews}
            </button>
          </div>
        )}
      </div>

      {/* Collapsed preview */}
      {collapsed && (
        <div className="px-5 py-3">
          {isLoading && (
            <div className="flex gap-3 animate-pulse">
              <div className="w-14 h-14 bg-gray-800 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 bg-gray-800 rounded w-full" />
                <div className="h-2 bg-gray-800 rounded w-3/4" />
              </div>
            </div>
          )}
          {top && (
            <div className="flex gap-3 items-center">
              {top.thumbnail ? (
                <img src={top.thumbnail} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 text-2xl">📰</div>
              )}
              <div className="min-w-0">
                <p className="text-white text-xs font-medium line-clamp-2">{top.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{top.source}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expanded content */}
      {!collapsed && (
        <>
          <div className="divide-y divide-gray-800/50">
            {isLoading && Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-5 py-3 animate-pulse">
                <div className="h-3 bg-gray-800 rounded w-3/4 mb-1.5" />
                <div className="h-2 bg-gray-800 rounded w-full" />
              </div>
            ))}
            {error && <div className="p-6 text-center text-red-400 text-sm">{tr.error}</div>}
            {filtered.slice(0, 4).map((item, i) => <NewsCard key={i} item={item} />)}
          </div>
          <div className="px-5 py-3 border-t border-gray-800/50">
            <Link href="/news" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition">
              {tr.viewAll} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
