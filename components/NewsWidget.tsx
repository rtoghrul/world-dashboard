'use client'
import useSWR from 'swr'
import { useState } from 'react'
import Link from 'next/link'
import {
  Newspaper,
  Cpu,
  Search,
  ArrowRight,
  ChevronDown,
  Globe2,
  Landmark,
  BadgeDollarSign,
  Factory,
  Share2,
  Clapperboard,
  Palette,
  Trophy,
  Microscope,
  HeartPulse,
} from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'
import NewsModal from './NewsModal'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type NewsCategory =
  | 'top'
  | 'war'
  | 'politics'
  | 'economy'
  | 'technology'
  | 'ai'
  | 'industry'
  | 'social'
  | 'cinema'
  | 'art'
  | 'sports'
  | 'science'
  | 'health'

const NEWS_CATEGORIES: {
  id: NewsCategory
  label: string
  icon: React.ComponentType<{ className?: string }>
  activeClass: string
}[] = [
  { id: 'top', label: 'Top', icon: Globe2, activeClass: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  { id: 'war', label: 'War', icon: Newspaper, activeClass: 'bg-red-500/20 text-red-400 border border-red-500/30' },
  { id: 'politics', label: 'Politics', icon: Landmark, activeClass: 'bg-sky-500/20 text-sky-400 border border-sky-500/30' },
  { id: 'economy', label: 'Economy', icon: BadgeDollarSign, activeClass: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
  { id: 'technology', label: 'Tech', icon: Cpu, activeClass: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' },
  { id: 'ai', label: 'AI', icon: Cpu, activeClass: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' },
  { id: 'industry', label: 'Industry', icon: Factory, activeClass: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' },
  { id: 'social', label: 'Social', icon: Share2, activeClass: 'bg-pink-500/20 text-pink-400 border border-pink-500/30' },
  { id: 'cinema', label: 'Cinema', icon: Clapperboard, activeClass: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
  { id: 'art', label: 'Art', icon: Palette, activeClass: 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30' },
  { id: 'sports', label: 'Sports', icon: Trophy, activeClass: 'bg-lime-500/20 text-lime-400 border border-lime-500/30' },
  { id: 'science', label: 'Science', icon: Microscope, activeClass: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' },
  { id: 'health', label: 'Health', icon: HeartPulse, activeClass: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' },
]

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
  const [tab, setTab] = useState<NewsCategory>('top')
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState(true)
  const { data, error, isLoading, mutate } = useSWR<NewsItem[]>(`/api/news?category=${tab}&lang=${lang}`, fetcher, { refreshInterval: 300000 })

  const items = Array.isArray(data) ? data : []
  const filtered = query
    ? items.filter(item => item.title.toLowerCase().includes(query.toLowerCase()) || item.description?.toLowerCase().includes(query.toLowerCase()))
    : items

  const top = items[0]
  const activeCategory = NEWS_CATEGORIES.find(category => category.id === tab)

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-3 border-b border-gray-800 cursor-pointer select-none hover:bg-gray-800/20 transition"
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-white font-semibold text-sm">📰 {tr.news}</h2>
            {collapsed && activeCategory && (
              <p className="text-gray-500 text-xs mt-0.5">{activeCategory.label} global news</p>
            )}
          </div>
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
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1" onClick={e => e.stopPropagation()}>
            {NEWS_CATEGORIES.map(category => {
              const Icon = category.icon
              const active = tab === category.id
              return (
                <button
                  key={category.id}
                  onClick={() => setTab(category.id)}
                  className={`flex flex-shrink-0 items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${active ? category.activeClass : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                  <Icon className="w-3 h-3" />{category.label}
                </button>
              )
            })}
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
            {!isLoading && !error && filtered.length === 0 && (
              <div className="p-6 text-center text-gray-500 text-sm">No news found in this category.</div>
            )}
            {filtered.slice(0, 5).map((item, i) => <NewsCard key={i} item={item} />)}
          </div>
          <div className="px-5 py-3 border-t border-gray-800/50">
            <Link href={`/news?category=${tab}`} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition">
              {tr.viewAll} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
