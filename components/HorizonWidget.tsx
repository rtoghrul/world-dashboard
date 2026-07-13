'use client'

import { useState } from 'react'
import useSWR from 'swr'

interface HorizonItem { rank: number; title: string; url: string; score: number; summary: string; source: string; tags: string[]; image?: string | null }
interface HorizonBriefing { date: string; totalFetched: number; totalSelected: number; items: HorizonItem[] }

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function HorizonWidget() {
  const { data, error, isLoading } = useSWR<HorizonBriefing>('/api/horizon', fetcher, { revalidateOnFocus: false, dedupingInterval: 3600000 })
  const [expanded, setExpanded] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)
  const items = data?.items ?? []
  const visibleItems = showAll ? items : items.slice(0, 10)

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">📡</span>
          <div>
            <h2 className="text-white font-semibold text-sm">Horizon Daily Briefing</h2>
            {data && <p className="text-gray-500 text-xs">{data.date} · {data.totalSelected} of {data.totalFetched} items</p>}
          </div>
        </div>
      </div>
      {isLoading && [...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-800 rounded-lg animate-pulse" />)}
      {error && (
        <div className="text-center py-6 text-gray-500 text-sm">
          <p>📭 No briefing yet</p>
          <p className="text-xs mt-1">Runs daily at 7am UTC</p>
        </div>
      )}
      {!isLoading && !error && (
        <div className="flex flex-col gap-1">
          {visibleItems.map((item) => (
            <div key={item.rank} className="rounded-lg hover:bg-gray-800 transition-colors">
              <button className="w-full text-left p-2 flex items-start gap-2" onClick={() => setExpanded(expanded === item.rank ? null : item.rank)}>
                <span className="text-gray-600 text-xs w-5 mt-0.5 shrink-0">{item.rank}.</span>
                {item.image ? (
                  <img src={item.image} alt="" className="w-10 h-10 rounded-md object-cover shrink-0 bg-gray-800" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                ) : (
                  <div className="w-10 h-10 rounded-md bg-gray-800 shrink-0 flex items-center justify-center text-base">
                    {item.source.includes('reddit') ? '🤖' : item.source.includes('telegram') ? '✈️' : item.source.includes('hackernews') ? '🔥' : '📰'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <p className="text-gray-200 text-sm leading-snug flex-1">{item.title}</p>
                    <span className={(item.score >= 8 ? 'bg-emerald-500' : item.score >= 7 ? 'bg-yellow-500' : 'bg-slate-500') + ' text-white text-xs font-bold px-1.5 py-0.5 rounded'}>{item.score.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">{item.source}</span>
                    {item.tags.slice(0, 2).map(tag => <span key={tag} className="text-gray-600 text-xs">#{tag}</span>)}
                  </div>
                </div>
              </button>
              {expanded === item.rank && (
                <div className="px-2 pb-3 ml-7">
                  <p className="text-gray-400 text-xs leading-relaxed mb-2">{item.summary}</p>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs hover:underline">Read full article →</a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {items.length > 10 && (
        <button onClick={() => setShowAll(!showAll)} className="text-xs text-gray-500 hover:text-gray-300 text-center py-1">
          {showAll ? '▲ Show less' : '▼ Show all ' + items.length + ' items'}
        </button>
      )}
    </div>
  )
}
