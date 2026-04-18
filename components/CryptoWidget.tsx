'use client'
import useSWR from 'swr'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const fetcher = (url: string) => fetch(url).then(r => r.json())

function formatNum(n: number) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  return `$${n.toLocaleString()}`
}

type Coin = {
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

function Sparkline({ data }: { data: number[] }) {
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

export default function CryptoWidget({ searchQuery = '' }: { searchQuery?: string }) {
  const { tr } = useLang()
  const { data, error, isLoading, mutate } = useSWR<Coin[]>('/api/crypto', fetcher, { refreshInterval: 60000 })

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-800">
        <div>
          <h2 className="text-white font-semibold text-base">₿ {tr.crypto}</h2>
          <p className="text-gray-500 text-xs mt-0.5">{tr.cryptoDesc}</p>
        </div>
        <button onClick={() => mutate()} className="text-xs text-indigo-400 hover:text-indigo-300 transition">
          {tr.refresh}
        </button>
      </div>

      {isLoading && (
        <div className="p-8 text-center text-gray-500 animate-pulse">{tr.loading}</div>
      )}
      {error && (
        <div className="p-8 text-center text-red-400">{tr.error}</div>
      )}

      {data && !error && (
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
              {(searchQuery ? data.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.symbol.toLowerCase().includes(searchQuery.toLowerCase())) : data).map((coin, i) => {
                const up = coin.price_change_percentage_24h >= 0
                return (
                  <tr key={coin.id} className="border-t border-gray-800/50 hover:bg-gray-800/30 transition">
                    <td className="px-4 py-2.5 text-gray-500 text-xs">{coin.market_cap_rank}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                        <div>
                          <div className="text-white font-medium text-xs">{coin.name}</div>
                          <div className="text-gray-500 text-xs uppercase">{coin.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right text-white font-mono text-xs">
                      ${coin.current_price.toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`flex items-center justify-end gap-1 text-xs font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                        {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-400 text-xs hidden md:table-cell">
                      {formatNum(coin.market_cap)}
                    </td>
                    <td className="px-4 py-2.5 text-right hidden lg:table-cell">
                      <Sparkline data={coin.sparkline_in_7d?.price || []} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
