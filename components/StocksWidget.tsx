'use client'
import useSWR from 'swr'
import { useState } from 'react'
import { TrendingUp, TrendingDown, ChevronDown, BarChart2 } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type Quote = {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

const INDICES = ['^GSPC', '^IXIC', '^DJI']
const INDEX_LABELS: Record<string, string> = {
  '^GSPC': 'S&P 500',
  '^IXIC': 'NASDAQ',
  '^DJI': 'Dow Jones',
}

export default function StocksWidget() {
  const { tr } = useLang()
  const [collapsed, setCollapsed] = useState(true)
  const { data, error, isLoading } = useSWR<Quote[]>('/api/stocks', fetcher, { refreshInterval: 60000 })

  const indices = data?.filter(q => INDICES.includes(q.symbol)) ?? []
  const stocks = data?.filter(q => !INDICES.includes(q.symbol)) ?? []
  const sp500 = indices.find(q => q.symbol === '^GSPC')

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center justify-between border-b border-gray-800 cursor-pointer select-none hover:bg-gray-800/20 transition"
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-emerald-400" />
          <div>
            <h2 className="text-white font-semibold text-sm">{tr.stocks}</h2>
            <p className="text-gray-500 text-xs">{tr.stocksDesc}</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} />
      </div>

      {/* Collapsed preview */}
      {collapsed && (
        <div className="px-5 py-3 flex items-center gap-4">
          {isLoading && <div className="h-4 bg-gray-800 rounded w-48 animate-pulse" />}
          {indices.map(q => {
            const up = q.changePercent >= 0
            return (
              <div key={q.symbol} className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">{INDEX_LABELS[q.symbol] ?? q.symbol}</span>
                <span className="text-white text-sm font-mono font-medium">{q.price?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                <span className={`text-xs font-semibold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {up ? '+' : ''}{q.changePercent?.toFixed(2)}%
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Expanded content */}
      {!collapsed && (
        <div className="p-4 space-y-4">
          {isLoading && <div className="p-6 text-center text-gray-500 animate-pulse text-sm">{tr.loading}</div>}
          {error && <div className="p-6 text-center text-red-400 text-sm">{tr.error}</div>}

          {data && (
            <>
              {/* Major Indices */}
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Major Indices</p>
                <div className="grid grid-cols-3 gap-3">
                  {indices.map(q => {
                    const up = q.changePercent >= 0
                    return (
                      <div key={q.symbol} className="bg-gray-800/60 rounded-xl p-3 border border-gray-700/50">
                        <p className="text-gray-400 text-xs mb-1">{INDEX_LABELS[q.symbol] ?? q.symbol}</p>
                        <p className="text-white font-mono font-bold text-sm">{q.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <div className={`flex items-center gap-0.5 mt-0.5 text-xs font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                          {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {up ? '+' : ''}{q.changePercent?.toFixed(2)}%
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Top Stocks */}
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Top Stocks</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="px-3 py-1.5 text-left">Symbol</th>
                        <th className="px-3 py-1.5 text-left">Name</th>
                        <th className="px-3 py-1.5 text-right">{tr.price}</th>
                        <th className="px-3 py-1.5 text-right">{tr.change24h}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stocks.map(q => {
                        const up = q.changePercent >= 0
                        return (
                          <tr key={q.symbol} className="border-t border-gray-800/50 hover:bg-gray-800/30 transition">
                            <td className="px-3 py-2 font-mono font-bold text-indigo-300">{q.symbol}</td>
                            <td className="px-3 py-2 text-gray-300">{q.name}</td>
                            <td className="px-3 py-2 text-right text-white font-mono">${q.price?.toFixed(2)}</td>
                            <td className="px-3 py-2 text-right">
                              <span className={`flex items-center justify-end gap-0.5 font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                                {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {up ? '+' : ''}{q.changePercent?.toFixed(2)}%
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
