'use client'
import { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  Newspaper,
  Cpu,
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
  type LucideIcon,
} from 'lucide-react'
import Header from '@/components/Header'
import { NewsCard, NewsItem } from '@/components/NewsWidget'
import { useLang } from '@/lib/LanguageContext'

const fetcher = (url: string) => fetch(url).then(r => r.json())
const PER_PAGE = 10

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
  icon: LucideIcon
  activeClass: string
}[] = [
  { id: 'top', label: 'Əsas', icon: Globe2, activeClass: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  { id: 'war', label: 'Müharibə', icon: Newspaper, activeClass: 'bg-red-500/20 text-red-400 border border-red-500/30' },
  { id: 'politics', label: 'Siyasət', icon: Landmark, activeClass: 'bg-sky-500/20 text-sky-400 border border-sky-500/30' },
  { id: 'economy', label: 'İqtisadiyyat', icon: BadgeDollarSign, activeClass: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
  { id: 'technology', label: 'Texnologiya', icon: Cpu, activeClass: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' },
  { id: 'ai', label: 'AI', icon: Cpu, activeClass: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' },
  { id: 'industry', label: 'Sənaye', icon: Factory, activeClass: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' },
  { id: 'social', label: 'Sosial şəbəkə', icon: Share2, activeClass: 'bg-pink-500/20 text-pink-400 border border-pink-500/30' },
  { id: 'cinema', label: 'Kino', icon: Clapperboard, activeClass: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
  { id: 'art', label: 'İncəsənət', icon: Palette, activeClass: 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30' },
  { id: 'sports', label: 'İdman', icon: Trophy, activeClass: 'bg-lime-500/20 text-lime-400 border border-lime-500/30' },
  { id: 'science', label: 'Elm', icon: Microscope, activeClass: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' },
  { id: 'health', label: 'Sağlamlıq', icon: HeartPulse, activeClass: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' },
]

export default function NewsPage() {
  const { tr, lang } = useLang()
  const [tab, setTab] = useState<NewsCategory>('top')
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')

  const { data, error, isLoading, mutate } = useSWR<NewsItem[]>(
    `/api/news?category=${tab}&lang=${lang}`,
    fetcher,
    { refreshInterval: 300000 }
  )

  const filtered = query
    ? data?.filter(item => item.title.toLowerCase().includes(query.toLowerCase()) || item.description?.toLowerCase().includes(query.toLowerCase()))
    : data

  const totalItems = filtered?.length || 0
  const totalPages = Math.max(1, Math.ceil(totalItems / PER_PAGE))
  const pageItems = filtered?.slice((page - 1) * PER_PAGE, page * PER_PAGE) || []

  const handleTabChange = (t: NewsCategory) => { setTab(t); setPage(1); setQuery('') }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex flex-col gap-4 mb-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-white font-bold text-xl">📰 {tr.news}</h1>
              <p className="text-gray-500 text-xs mt-1">Kateqoriyaları sağa-sola sürüşdür</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <div className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-3 py-2 flex-1 sm:flex-none">
              <Search className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setPage(1) }}
                placeholder={tr.search + '...'}
                className="bg-transparent text-white text-sm outline-none w-full sm:w-36 placeholder-gray-600"
              />
            </div>
            <button onClick={() => mutate()} className="text-xs text-indigo-400 hover:text-indigo-300 transition px-2 flex-shrink-0">{tr.refresh}</button>
          </div>
        </div>

        <div className="-mx-4 px-4 mb-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max pb-1">
            {NEWS_CATEGORIES.map(category => {
              const Icon = category.icon
              const active = tab === category.id
              return (
                <button
                  key={category.id}
                  onClick={() => handleTabChange(category.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${active ? category.activeClass : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                  <Icon className="w-3 h-3" />{category.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          {isLoading && Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-5 py-4 animate-pulse border-b border-gray-800/50">
              <div className="h-3 bg-gray-800 rounded w-3/4 mb-2" />
              <div className="h-2 bg-gray-800 rounded w-full" />
            </div>
          ))}
          {error && <div className="p-12 text-center text-red-400">{tr.error}</div>}
          <div className="divide-y divide-gray-800/50">
            {pageItems.map((item, i) => <NewsCard key={i} item={item} />)}
          </div>
          {pageItems.length === 0 && !isLoading && !error && <div className="p-12 text-center text-gray-500">{tr.noData}</div>}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                  page === p ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
