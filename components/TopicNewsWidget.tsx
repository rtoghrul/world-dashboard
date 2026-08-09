'use client'
import useSWR from 'swr'
import { useMemo, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'
import { formatNewsDate } from '@/lib/dates'
import type { ReactNode } from 'react'
import NewsModal, { type ModalItem } from './NewsModal'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type Item = {
  title: string
  link: string
  pubDate: string
  description: string
  thumbnail: string | null
  source: string
}

function TopicNewsCard({ item }: { item: ModalItem }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left flex gap-3 px-5 py-3 hover:bg-gray-800/40 transition group"
      >
        {item.thumbnail && (
          <img
            src={item.thumbnail}
            alt=""
            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
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

export default function TopicNewsWidget({
  topic,
  title,
  desc,
  accentClass,
  icon,
  defaultCollapsed = true,
  limit = 6,
}: {
  topic: 'automation' | 'electrical' | 'mechanical'
  title: string
  desc: string
  accentClass: string
  icon: ReactNode
  defaultCollapsed?: boolean
  limit?: number
}) {
  const { tr, lang } = useLang()
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [query, setQuery] = useState('')

  const apiPath = useMemo(() => `/api/engineering?topic=${topic}&lang=${lang}`, [topic, lang])
  const { data: rawData, isLoading, error, mutate } = useSWR<Item[]>(apiPath, fetcher, { refreshInterval: 900000 })
  const items = Array.isArray(rawData) ? rawData : []

  const filtered = useMemo(() => {
    if (!query.trim()) return items
    const q = query.trim().toLowerCase()
    return items.filter(i => (i.title || '').toLowerCase().includes(q) || (i.description || '').toLowerCase().includes(q) || (i.source || '').toLowerCase().includes(q))
  }, [items, query])

  const top = items[0]

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div
        className="px-5 py-3 border-b border-gray-800 cursor-pointer select-none hover:bg-gray-800/20 transition"
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={accentClass}>{icon}</span>
            <div>
              <h2 className="text-white font-semibold text-sm">{title}</h2>
              <p className="text-gray-500 text-xs">{desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            {!collapsed && (
              <>
                <div className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-2 py-1">
                  <Search className="w-3 h-3 text-gray-500 flex-shrink-0" aria-hidden="true" />
                  <input
                    type="text"
                    name={`${topic}-search`}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder={tr.search}
                    className="bg-transparent text-white text-xs outline-none w-20 placeholder-gray-600"
                    autoComplete="off"
                  />
                </div>
                <button onClick={() => mutate()} className="text-xs text-indigo-400 hover:text-indigo-300 transition">
                  {tr.refresh}
                </button>
              </>
            )}
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} aria-hidden="true" />
          </div>
        </div>
      </div>

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
                <img
                  src={top.thumbnail}
                  alt=""
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 text-xl">
                  {icon}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-white text-xs font-medium line-clamp-2">{top.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{top.source}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {!collapsed && (
        <div className="divide-y divide-gray-800/50">
          {isLoading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-5 py-3 animate-pulse">
              <div className="h-3 bg-gray-800 rounded w-3/4 mb-1.5" />
              <div className="h-2 bg-gray-800 rounded w-full" />
            </div>
          ))}
          {error && <div className="p-6 text-center text-red-400 text-sm">{tr.error}</div>}
          {filtered.slice(0, limit).map((item, i) => (
            <TopicNewsCard key={i} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
