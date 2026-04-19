'use client'
import { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { ArrowLeft, Search, Newspaper, Cpu } from 'lucide-react'
import Header from '@/components/Header'
import { NewsCard, NewsItem } from '@/components/NewsWidget'
import { useLang } from '@/lib/LanguageContext'

const fetcher = (url: string) => fetch(url).then(r => r.json())
const PER_PAGE = 10

export default function NewsPage() {
  const { tr, lang } = useLang()
  const [tab, setTab] = useState<'war' | 'ai'>('war')
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

  const handleTabChange = (t: 'war' | 'ai') => { setTab(t); setPage(1); setQuery('') }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-5">
          <Link href="/" className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-white font-bold text-xl">📰 {tr.news}</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-3 py-2">
              <Search className="w-3.5 h-3.5 text-gray-500" />
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setPage(1) }}
                placeholder={tr.search + '...'}
                className="bg-transparent text-white text-sm outline-none w-36 placeholder-gray-600"
              />
            </div>
            <button onClick={() => mutate()} className="text-xs text-indigo-400 hover:text-indigo-300 transition px-2">{tr.refresh}</button>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => handleTabChange('war')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${tab === 'war' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            <Newspaper className="w-3 h-3" />{tr.warNews}
          </button>
          <button onClick={() => handleTabChange('ai')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${tab === 'ai' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            <Cpu className="w-3 h-3" />{tr.aiNews}
          </button>
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
