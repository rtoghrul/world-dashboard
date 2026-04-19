'use client'
import useSWR from 'swr'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, TrendingDown, BarChart2, RefreshCw } from 'lucide-react'
import { STOCK_GROUPS } from '@/app/api/stocks/route'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type Quote = {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

type SortKey = 'symbol' | 'price' | 'change' | 'changePercent'

const GROUP_KEYS = Object.keys(STOCK_GROUPS) as (keyof typeof STOCK_GROUPS)[]

export default function StocksPage() {
  const [activeGroup, setActiveGroup] = useState<string>('indices')
  const [sortKey, setSortKey] = useState<SortKey>('changePercent')
  const [sortAsc, setSortAsc] = useState(false)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20

  const { data, error, isLoading, mutate } = useSWR<Quote[]>(
    `/api/stocks?group=${activeGroup}`,
    fetcher,
    { refreshInterval: 60000 }
  )

  const quotes = Array.isArray(data) ? data : []

  const sorted = [...quotes].sort((a, b) => {
    const av = a[sortKey]
    const bv = b[sortKey]
    if (typeof av === 'string' && typeof bv === 'string') {
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av)
    }
    return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number)
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc(a => !a)
    } else {
      setSortKey(key)
      setSortAsc(false)
    }
    setPage(1)
  }

  function SortHeader({ col, label }: { col: SortKey; label: string }) {
    const active = sortKey === col
    return (
      <th
        onClick={() => toggleSort(col)}
        className="px-4 py-2.5 text-right cursor-pointer select-none hover:text-white transition"
      >
        <span className={active ? 'text-emerald-400' : ''}>{label}</span>
        {active && <span className="ml-1 text-xs">{sortAsc ? '↑' : '↓'}</span>}
      </th>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition text-sm">
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
            <span className="text-gray-700">/</span>
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-400" />
              <h1 className="text-white font-bold text-lg">Stocks</h1>
            </div>
          </div>
          <button
            onClick={() => mutate()}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {/* Sector Tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {GROUP_KEYS.map(key => (
            <button
              key={key}
              onClick={() => { setActiveGroup(key); setPage(1) }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition border ${
                activeGroup === key
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'text-gray-400 border-gray-700 hover:text-white hover:bg-gray-800'
              }`}
            >
              {STOCK_GROUPS[key].label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          {isLoading && (
            <div className="p-10 text-center text-gray-500 animate-pulse text-sm">Loading market data…</div>
          )}
          {error && (
            <div className="p-10 text-center text-red-400 text-sm">Failed to load data</div>
          )}
          {!isLoading && !error && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-xs border-b border-gray-800">
                      <th
                        onClick={() => toggleSort('symbol')}
                        className="px-4 py-2.5 text-left cursor-pointer select-none hover:text-white transition"
                      >
                        <span className={sortKey === 'symbol' ? 'text-emerald-400' : ''}>Symbol</span>
                        {sortKey === 'symbol' && <span className="ml-1">{sortAsc ? '↑' : '↓'}</span>}
                      </th>
                      <th className="px-4 py-2.5 text-left text-gray-500">Name</th>
                      <SortHeader col="price" label="Price" />
                      <SortHeader col="change" label="Change" />
                      <SortHeader col="changePercent" label="% Change" />
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map(q => {
                      const up = q.changePercent >= 0
                      return (
                        <tr key={q.symbol} className="border-t border-gray-800/40 hover:bg-gray-800/30 transition">
                          <td className="px-4 py-3 font-mono font-bold text-indigo-300">{q.symbol}</td>
                          <td className="px-4 py-3 text-gray-300">{q.name}</td>
                          <td className="px-4 py-3 text-right font-mono text-white">
                            ${q.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className={`px-4 py-3 text-right font-mono ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                            {up ? '+' : ''}{q.change?.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={`inline-flex items-center justify-end gap-1 font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                              {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                              {up ? '+' : ''}{q.changePercent?.toFixed(2)}%
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
                  <span className="text-xs text-gray-500">{quotes.length} symbols · Page {page} of {totalPages}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-7 h-7 rounded-lg text-xs transition ${
                          p === page ? 'bg-emerald-500/20 text-emerald-300' : 'text-gray-500 hover:text-white hover:bg-gray-800'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-1 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <p className="text-center text-gray-700 text-xs mt-4">
          Data from Yahoo Finance · Refreshes every 60s
        </p>
      </div>
    </div>
  )
}
