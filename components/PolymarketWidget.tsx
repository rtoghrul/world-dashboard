'use client'
import useSWR from 'swr'
import { ExternalLink } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type Market = {
  id: string
  question: string
  outcomePrices?: string
  outcomes?: string
  volume?: number
  active: boolean
  slug?: string
}

function parseOutcomes(market: Market): { yes: number; no: number } | null {
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

export default function PolymarketWidget({ searchQuery = '' }: { searchQuery?: string }) {
  const { tr } = useLang()
  const { data, error, isLoading, mutate } = useSWR<Market[]>('/api/polymarket', fetcher, {
    refreshInterval: 120000,
  })

  const markets = Array.isArray(data)
    ? data.filter(m => m.question && (!searchQuery || m.question.toLowerCase().includes(searchQuery.toLowerCase())))
    : []

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-800">
        <div>
          <h2 className="text-white font-semibold text-base">🎯 {tr.polymarket}</h2>
          <p className="text-gray-500 text-xs mt-0.5">{tr.polymarketDesc}</p>
        </div>
        <button onClick={() => mutate()} className="text-xs text-indigo-400 hover:text-indigo-300 transition">
          {tr.refresh}
        </button>
      </div>

      <div className="divide-y divide-gray-800/50">
        {isLoading && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-5 py-4 animate-pulse">
            <div className="h-3 bg-gray-800 rounded w-4/5 mb-3" />
            <div className="h-2 bg-gray-800 rounded-full w-full" />
          </div>
        ))}

        {error && <div className="p-8 text-center text-red-400">{tr.error}</div>}

        {markets.slice(0, 10).map((market) => {
          const odds = parseOutcomes(market)
          const vol = market.volume ? `$${(market.volume / 1000).toFixed(0)}K` : null

          return (
            <div key={market.id} className="px-5 py-4 hover:bg-gray-800/30 transition">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-white text-sm font-medium line-clamp-2 flex-1">
                  {market.question}
                </p>
                <a
                  href={`https://polymarket.com/event/${market.slug || market.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-indigo-400 transition flex-shrink-0 mt-0.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {odds ? (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-emerald-400 font-medium">{tr.yes} {odds.yes}%</span>
                    <span className="text-red-400 font-medium">{tr.no} {odds.no}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                      style={{ width: `${odds.yes}%` }}
                    />
                  </div>
                  {vol && <p className="text-gray-600 text-xs mt-1">{tr.volume}: {vol}</p>}
                </div>
              ) : (
                <div className="h-1.5 bg-gray-800 rounded-full" />
              )}
            </div>
          )
        })}

        {markets.length === 0 && !isLoading && !error && (
          <div className="p-8 text-center text-gray-500">{tr.noData}</div>
        )}
      </div>
    </div>
  )
}
