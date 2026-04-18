'use client'
import useSWR from 'swr'
import { useState } from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown, Search, ArrowRight, ChevronDown } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function formatNum(n: number) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  return `$${n.toLocaleString()}`
}

export type Coin = {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  sparkline_in_7d: { price: number[] }
  market_cap_rank: number
}

export function Sparkline({ data }: { data: number[] }) {
  if (!data?.length) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = 80, h = 30
  const pts = data.slice(-30).map((v, i, arr) => {
    const x = (i / (arr.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')
  const isUp = data[data.length - 1] >= data[0]
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={isUp ? '#10b981' : '#ef4444'} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

export function CryptoTable({ coins }: { coins: Coin[] }) {
  const { tr } = useLang()
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500 text-xs">
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">{tr.rank}</th>
            <th className="px-4 py-2 text-right">{tr.price}</th>
            <th className="px-4 py-2 text-right">{tr.change24h}</th>
            <th className="px-4 py-2 text-right hidden md:table-cell">{tr.marketCap}</th>
            <th className="px-4 py-2 text-right hidden lg:table-cell">7d</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => {
            const up = coin.price_change_percentage_24h >= 0
            return (
              <tr key={coin.id} className="border-t border-gray-800/50 hover:bg-gray-800/30 transition">
                <td className="px-4 py-2 text-gray-500 text-xs">{coin.market_cap_rank}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" />
                    <div>
                      <div className="text-white font-medium text-xs">{coin.name}</div>
                      <div className="text-gray-500 text-xs uppercase">{coin.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2 text-right text-white font-mono text-xs">
                  ${coin.current_price.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right">
                  <span className={`flex items-center justify-end gap-1 text-xs font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                    {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  </span>
                </td>
                <td className="px-4 py-2 text-right text-gray-400 text-xs hidden md:table-cell">
                  {formatNum(coin.market_cap)}
                </td>
                <td className="px-4 py-2 text-right hidden lg:table-cell">
                  <Sparkline data={coin.sparkline_in_7d?.price || []} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function CryptoWidget() {
  const { tr } = useLang()
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState(true)
  const { data, error, isLoading, mutate } = useSWR<Coin[]>('/api/crypto', fetcher, { refreshInterval: 60000 })

  const coins = Array.isArray(data) ? data : []
  const filtered = query
    ? coins.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.symbol.toLowerCase().includes(query.toLowerCase()))
    : coins

  const btc = coins.find(c => c.id === 'bitcoin') ?? coins[0]

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header — always visible, clickable */}
      <div
        className="px-5 py-3 flex items-center justify-between border-b border-gray-800 gap-3 cursor-pointer select-none hover:bg-gray-800/20 transition"
        onClick={() => setCollapsed(c => !c)}
      >
        <div>
          <h2 className="text-white font-semibold text-sm">₿ {tr.crypto}</h2>
          <p className="text-gray-500 text-xs">{tr.cryptoDesc}</p>
        </div>
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          {!collapsed && (
            <>
              <div className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-2 py-1">
                <Search className="w-3 h-3 text-gray-500 flex-shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="BTC..."
                  className="bg-transparent text-white text-xs outline-none w-16 placeholder-gray-600"
                />
              </div>
              <button onClick={() => mutate()} className="text-xs text-indigo-400 hover:text-indigo-300 transition">
                {tr.refresh}
              </button>
            </>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} />
      </div>

      {/* Collapsed preview */}
      {collapsed && (
        <div className="px-5 py-3 flex items-center gap-3">
          {isLoading && <div className="h-4 bg-gray-800 rounded w-48 animate-pulse" />}
          {btc && (
            <>
              <img src={btc.image} alt="BTC" className="w-6 h-6 rounded-full flex-shrink-0" />
              <span className="text-white text-sm font-medium">{btc.name}</span>
              <span className="text-white font-mono text-sm">${btc.current_price.toLocaleString()}</span>
              <span className={`text-xs font-semibold ${btc.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {btc.price_change_percentage_24h >= 0 ? '+' : ''}{btc.price_change_percentage_24h.toFixed(2)}%
              </span>
            </>
          )}
        </div>
      )}

      {/* Expanded content */}
      {!collapsed && (
        <>
          {isLoading && <div className="p-6 text-center text-gray-500 animate-pulse text-sm">{tr.loading}</div>}
          {error && <div className="p-6 text-center text-red-400 text-sm">{tr.error}</div>}
          {data && !error && <CryptoTable coins={filtered.slice(0, 8)} />}
          <div className="px-5 py-3 border-t border-gray-800/50">
            <Link href="/crypto" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition">
              {tr.viewAll} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
