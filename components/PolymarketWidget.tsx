'use client'
import useSWR from 'swr'
import { useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Search, ArrowRight } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export type Market = {
  id: string
  question: string
  outcomePrices?: string
  outcomes?: string
  volume?: number
  active: boolean
  slug?: string
}

export function parseOutcomes(market: Market): { yes: number; no: number } | null {
  try {
    const prices = JSON.parse(market.outcomePrices || '[]')
    if (prices.length >= 2) {
      return {
        yes: Math.round(parseFloat(prices[0]) * 100),
        no: Math.round(parseFloat(prices[1]) * 100),
      }
    }
  } catch {}
  return null
}

export function MarketList({ markets, tr }: { markets: Market[]; tr: Record<string, string> }) {
  return (
    <div className="divide-y divide-gray-800/50">
      {markets.map((market) => {
        const odds = parseOutcomes(market)
        const vol = market.volume ? `$${(market.volume / 1000).toFixed(0)}K` : null
        return (
          <div key={market.id} className="px-5 py-3 hover:bg-gray-800/30 transition">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <p className="text-white text-xs font-medium line-clamp-2 flex-1">{market.question}</p>
              <a href={`https://polymarket.com/event/${market.slug || market.id}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-400 transition flex-shrink-0">
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            {odds ? (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-400 font-medium">{tr.yes} {odds.yes}%</span>
                  <span className="text-red-400 font-medium">{tr.no} {odds.no}%</span>
                </div>
                <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: `${odds.yes}%` }} />
                </div>
                {vol && <p className="text-gray-600 text-xs mt-1">{tr.volume}: {vol}</p>}
              </div>
            ) : (
              <div className="h-1 bg-gray-800 rounded-full" />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function PolymarketWidget() {
  const { tr } = useLang()
  const [query, setQuery] = useState('')
  const { data, error, isLoading, mutate } = useSWR<Market[]>('/api/polymarket', fetcher, { refreshInterval: 120000 })

  const markets = Array.isArray(data)
    ? data.filter(m => m.question && (!query || m.question.toLowerCase().includes(query.toLowerCase())))
    : []

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="px-5 py-3 flex items-center justify-between border-b border-gray-800 gap-3">
        <div>
          <h2 className="text-white font-semibold text-sm">🎯 {tr.polymarket}</h2>
          <p className="text-gray-500 text-xs">{tr.polymarketDesc}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-2 py-1">
            <Search className="w-3 h-3 text-gray-500 flex-shrink-0" />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder={tr.search} className="bg-transparent text-white text-xs outline-none w-16 placeholder-gray-600" />
          </div>
          <button onClick={() => mutate()} className="text-xs text-indigo-400 hover:text-indigo-300 transition flex-shrink-0">{tr.refresh}</button>
        </div>
      </div>

      {isLoading && Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="px-5 py-3 animate-pulse border-t border-gray-800/50">
          <div className="h-3 bg-gray-800 rounded w-4/5 mb-2" />
          <div className="h-1 bg-gray-800 rounded-full w-full" />
        </div>
      ))}
      {error && <div className="p-6 text-center text-red-400 text-sm">{tr.error}</div>}
      {!isLoading && !error && <MarketList markets={markets.slice(0, 5)} tr={tr} />}
      {markets.length === 0 && !isLoading && !error && <div className="p-6 text-center text-gray-500 text-sm">{tr.noData}</div>}

      <div className="px-5 py-3 border-t border-gray-800/50">
        <Link href="/polymarket" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition">
          Hamısını gör <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}
