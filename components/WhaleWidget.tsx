'use client'
import useSWR from 'swr'
import { useState } from 'react'
import { TrendingUp, TrendingDown, ExternalLink, ChevronDown } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'
import { formatNum, Coin } from './CryptoWidget'
import { Market, parseOutcomes } from './PolymarketWidget'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function WhaleWidget() {
  const { tr } = useLang()
  const [collapsed, setCollapsed] = useState(true)

  const { data: cryptoData } = useSWR<Coin[]>(
    '/api/crypto?per_page=50&page=1',
    fetcher,
    { refreshInterval: 60000 }
  )

  const { data: polyData } = useSWR<Market[]>(
    '/api/polymarket?limit=20',
    fetcher,
    { refreshInterval: 120000 }
  )

  const topMovers = cryptoData
    ? [...cryptoData]
        .sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h))
        .slice(0, 5)
    : []

  const topVolume = cryptoData
    ? [...cryptoData]
        .sort((a, b) => b.market_cap - a.market_cap)
        .slice(0, 5)
    : []

  const whaleBets = polyData
    ? [...polyData]
        .filter(m => m.question && m.volume)
        .sort((a, b) => (b.volume || 0) - (a.volume || 0))
        .slice(0, 5)
    : []

  const topMover = topMovers[0]

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center justify-between border-b border-gray-800 cursor-pointer select-none hover:bg-gray-800/20 transition"
        onClick={() => setCollapsed(c => !c)}
      >
        <div>
          <h2 className="text-white font-semibold text-sm">🐋 {tr.whaleActivity}</h2>
          <p className="text-gray-500 text-xs">{tr.whaleDesc}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} />
      </div>

      {/* Collapsed preview */}
      {collapsed && (
        <div className="px-5 py-3 flex items-center gap-3">
          {topMover ? (
            <>
              <img src={topMover.image} alt={topMover.name} className="w-6 h-6 rounded-full flex-shrink-0" />
              <span className="text-white text-sm font-medium">{topMover.symbol.toUpperCase()}</span>
              <span className="text-gray-400 text-sm">${topMover.current_price.toLocaleString()}</span>
              <span className={`text-xs font-semibold flex items-center gap-0.5 ${topMover.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {topMover.price_change_percentage_24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(topMover.price_change_percentage_24h).toFixed(1)}% 24h top mover
              </span>
            </>
          ) : (
            <div className="h-4 bg-gray-800 rounded w-48 animate-pulse" />
          )}
        </div>
      )}

      {/* Expanded content */}
      {!collapsed && (
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Big Movers */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-700/50">
                <h3 className="text-white font-semibold text-sm">🐋 {tr.bigMovers}</h3>
                <p className="text-gray-500 text-xs">Top 24h % {tr.change24h}</p>
              </div>
              <div className="divide-y divide-gray-700/30">
                {topMovers.map(coin => {
                  const up = coin.price_change_percentage_24h >= 0
                  return (
                    <div key={coin.id} className="px-4 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" />
                        <div>
                          <div className="text-white text-xs font-medium">{coin.symbol.toUpperCase()}</div>
                          <div className="text-gray-500 text-xs">${coin.current_price.toLocaleString()}</div>
                        </div>
                      </div>
                      <span className={`text-xs font-bold flex items-center gap-0.5 ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                        {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(coin.price_change_percentage_24h).toFixed(1)}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Top by Volume */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-700/50">
                <h3 className="text-white font-semibold text-sm">💰 Top {tr.volume}</h3>
                <p className="text-gray-500 text-xs">{tr.marketCap} leaders</p>
              </div>
              <div className="divide-y divide-gray-700/30">
                {topVolume.map(coin => (
                  <div key={coin.id} className="px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" />
                      <div>
                        <div className="text-white text-xs font-medium">{coin.symbol.toUpperCase()}</div>
                        <div className="text-gray-500 text-xs">${coin.current_price.toLocaleString()}</div>
                      </div>
                    </div>
                    <span className="text-gray-300 text-xs font-mono">{formatNum(coin.market_cap)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Whale Polymarket Bets */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-700/50">
                <h3 className="text-white font-semibold text-sm">🎯 {tr.largeBets}</h3>
                <p className="text-gray-500 text-xs">Polymarket high {tr.volume}</p>
              </div>
              <div className="divide-y divide-gray-700/30">
                {whaleBets.map(market => {
                  const odds = parseOutcomes(market)
                  const vol = market.volume ? formatNum(market.volume) : '—'
                  return (
                    <div key={market.id} className="px-4 py-2.5">
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <p className="text-white text-xs line-clamp-2 flex-1">{market.question}</p>
                        <a href={`https://polymarket.com/event/${market.slug || market.id}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-400 flex-shrink-0">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        {odds && <span className="text-emerald-400 text-xs">{tr.yes} {odds.yes}%</span>}
                        <span className="text-gray-500 text-xs">{tr.volume}: {vol}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
