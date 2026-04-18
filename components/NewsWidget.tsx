'use client'
import useSWR from 'swr'
import { useState } from 'react'
import { ExternalLink, Newspaper, Cpu, Search } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type NewsItem = {
  title: string
  link: string
  pubDate: string
  description: string
  thumbnail: string | null
  source: string
}

export default function NewsWidget() {
  const { tr } = useLang()
  const [tab, setTab] = useState<'war' | 'ai'>('war')
  const [query, setQuery] = useState('')

  const { data, error, isLoading, mutate } = useSWR<NewsItem[]>(
    `/api/news?category=${tab}`,
    fetcher,
    { refreshInterval: 300000 }
  )

  const filtered = query
    ? data?.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
      )
    : data

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold text-base">📰 {tr.news}</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-2 py-1.5">
              <Search className="w-3 h-3 text-gray-500 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={tr.search}
                className="bg-transparent text-white text-xs outline-none w-24 placeholder-gray-600"
              />
            </div>
            <button onClick={() => mutate()} className="text-xs text-indigo-400 hover:text-indigo-300 transition">
              {tr.refresh}
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab('war')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              tab === 'war' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Newspaper className="w-3 h-3" />
            {tr.warNews}
          </button>
          <button
            onClick={() => setTab('ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              tab === 'ai' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Cpu className="w-3 h-3" />
            {tr.aiNews}
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-800/50">
        {isLoading && Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="px-5 py-4 animate-pulse">
            <div className="h-3 bg-gray-800 rounded w-3/4 mb-2" />
            <div className="h-2 bg-gray-800 rounded w-full mb-1" />
            <div className="h-2 bg-gray-800 rounded w-2/3" />
          </div>
        ))}

        {error && <div className="p-8 text-center text-red-400">{tr.error}</div>}

        {filtered?.map((item, i) => (
          <a
            key={i}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 px-5 py-4 hover:bg-gray-800/40 transition group"
          >
            {item.thumbnail && (
              <img
                src={item.thumbnail}
                alt=""
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-white text-sm font-medium line-clamp-2 group-hover:text-indigo-300 transition">
                  {item.title}
                </h3>
                <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-gray-400 flex-shrink-0 mt-0.5" />
              </div>
              <p className="text-gray-500 text-xs mt-1 line-clamp-2">{item.description}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-gray-600 text-xs">{item.source}</span>
                <span className="text-gray-700 text-xs">·</span>
                <span className="text-gray-600 text-xs">
                  {item.pubDate ? new Date(item.pubDate).toLocaleDateString() : ''}
                </span>
              </div>
            </div>
          </a>
        ))}

        {data?.length === 0 && (
          <div className="p-8 text-center text-gray-500">{tr.noData}</div>
        )}
      </div>
    </div>
  )
}
