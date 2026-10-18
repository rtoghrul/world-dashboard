'use client'
import useSWR from 'swr'
import { useState } from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown, ChevronDown, BarChart2, ArrowUpRight } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'
import SectionNews from './SectionNews'

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

export default function StocksWidget({ defaultExpanded = false }: { defaultExpanded?: boolean }) {
  const { tr } = useLang()
  const [collapsed, setCollapsed] = useState(!defaultExpanded)
  const { data, error, isLoading } = useSWR<Quote[]>('/api/stocks', fetcher, { refreshInterval: 60000 })

  const quotes = Array.isArray(data) ? data : []
  const indices = quotes.filter(q => INDICES.includes(q.symbol))
  const stocks = quotes.filter(q => !INDICES.includes(q.symbol))

  return (
    <div className="bg-surface-1 rounded-2xl border border-line overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center justify-between border-b border-line cursor-pointer select-none hover:bg-surface-2/20 transition"
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-emerald-400" />
          <div>
            <h2 className="text-ink-1 font-semibold text-sm">{tr.stocks}</h2>
            <p className="text-ink-3 text-xs">{tr.stocksDesc}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/stocks" onClick={e => e.stopPropagation()} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition">
            View All <ArrowUpRight className="w-3 h-3" />
          </Link>
          <ChevronDown className={`w-4 h-4 text-ink-3 flex-shrink-0 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} />
        </div>
      </div>

      {/* Collapsed preview */}
      {collapsed && (
        <div className="px-5 py-3 flex items-center gap-4">
          {isLoading && <div className="h-4 bg-surface-2 rounded w-48 animate-pulse" />}
          {indices.map(q => {
            const up = q.changePercent >= 0
            return (
              <div key={q.symbol} className="flex items-center gap-2">
                <span className="text-ink-3 text-xs">{INDEX_LABELS[q.symbol] ?? q.symbol}</span>
                <span className="text-ink-1 text-sm font-mono font-medium">{q.price?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
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
          {isLoading && <div className="p-6 text-center text-ink-3 animate-pulse text-sm">{tr.loading}</div>}
          {error && <div className="p-6 text-center text-red-400 text-sm">{tr.error}</div>}

          {data && (
            <>
              {/* Major Indices */}
              <div>
                <p className="text-ink-3 text-xs font-semibold uppercase tracking-wider mb-2">{tr.majorIndices}</p>
                <div className="grid grid-cols-3 gap-3">
                  {indices.map(q => {
                    const up = q.changePercent >= 0
                    return (
                      <div key={q.symbol} className="bg-surface-2/60 rounded-xl p-3 border border-line-strong">
                        <p className="text-ink-3 text-xs mb-1">{INDEX_LABELS[q.symbol] ?? q.symbol}</p>
                        <p className="text-ink-1 font-mono font-bold text-sm">{q.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
                <p className="text-ink-3 text-xs font-semibold uppercase tracking-wider mb-2">{tr.topStocks}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-ink-3">
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
                          <tr key={q.symbol} className="border-t border-line hover:bg-surface-2/30 transition">
                            <td className="px-3 py-2 font-mono font-bold text-indigo-300">{q.symbol}</td>
                            <td className="px-3 py-2 text-ink-2">{q.name}</td>
                            <td className="px-3 py-2 text-right text-ink-1 font-mono">${q.price?.toFixed(2)}</td>
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
      {!collapsed && <SectionNews section="stocks" tab="all" accentColor="emerald" darkMode />}
    </div>
  )
}
