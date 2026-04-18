'use client'
import { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'
import Header from '@/components/Header'
import { CryptoTable, Coin } from '@/components/CryptoWidget'
import { useLang } from '@/lib/LanguageContext'

const fetcher = (url: string) => fetch(url).then(r => r.json())
const PER_PAGE = 20

export default function CryptoPage() {
  const { tr } = useLang()
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')

  const { data, error, isLoading } = useSWR<Coin[]>(
    `/api/crypto?per_page=${PER_PAGE}&page=${page}`,
    fetcher,
    { refreshInterval: 60000 }
  )

  const filtered = data
    ? (query ? data.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.symbol.toLowerCase().includes(query.toLowerCase())) : data)
    : []

  const totalPages = 5

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-5">
          <Link href="/" className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-white font-bold text-xl">₿ Crypto Markets</h1>
            <p className="text-gray-500 text-xs">{tr.cryptoDesc}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 bg-gray-800 rounded-lg px-3 py-2">
            <Search className="w-3.5 h-3.5 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1) }}
              placeholder="Bitcoin, ETH..."
              className="bg-transparent text-white text-sm outline-none w-36 placeholder-gray-600"
            />
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          {isLoading && <div className="p-12 text-center text-gray-500 animate-pulse">{tr.loading}</div>}
          {error && <div className="p-12 text-center text-red-400">{tr.error}</div>}
          {data && !error && <CryptoTable coins={filtered} />}
        </div>

        {!query && (
          <div className="flex items-center justify-center gap-1 mt-5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                  page === p ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
