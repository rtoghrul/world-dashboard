'use client'
import { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import { MarketList, Market } from '@/components/PolymarketWidget'
import { useLang } from '@/lib/LanguageContext'

const fetcher = async (url: string) => {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json()
}

const COPY: Record<string, Record<string, string>> = {
  search: { en: 'Search markets', az: 'Bazar axtar', ru: 'Поиск рынков', de: 'Märkte suchen', tr: 'Piyasa ara', fr: 'Rechercher des marchés', es: 'Buscar mercados', zh: '搜索市场', ar: 'ابحث عن سوق', ja: 'マーケットを検索', it: 'Cerca mercati', pt: 'Buscar mercados' },
  back: { en: 'Back to home', az: 'Ana səhifəyə', ru: 'На главную', de: 'Zur Startseite', tr: 'Ana sayfaya dön', fr: "Retour à l'accueil", es: 'Volver al inicio', zh: '返回首页', ar: 'العودة للرئيسية', ja: 'ホームへ戻る', it: 'Torna alla home', pt: 'Voltar ao início' },
  pages: { en: 'Pages', az: 'Səhifələr', ru: 'Страницы', de: 'Seiten', tr: 'Sayfalar', fr: 'Pages', es: 'Páginas', zh: '分页', ar: 'الصفحات', ja: 'ページ', it: 'Pagine', pt: 'Páginas' },
  retry: { en: 'Try again', az: 'Yenidən cəhd et', ru: 'Повторить', de: 'Erneut versuchen', tr: 'Tekrar dene', fr: 'Réessayer', es: 'Reintentar', zh: '重试', ar: 'إعادة المحاولة', ja: '再試行', it: 'Riprova', pt: 'Tentar novamente' },
}
const PER_PAGE = 10

export default function PolymarketPage() {
  const { lang, tr } = useLang()
  const c = (k: string) => COPY[k][lang] || COPY[k].en
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')

  const offset = (page - 1) * PER_PAGE
  const { data, error, isLoading, mutate } = useSWR<Market[]>(
    `/api/polymarket?limit=${PER_PAGE}&offset=${offset}`,
    fetcher,
    { refreshInterval: 120000 }
  )

  const markets = Array.isArray(data)
    ? data.filter(m => m.question && (!query || m.question.toLowerCase().includes(query.toLowerCase())))
    : []

  const totalPages = 5

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header />
      <main id="main-content" className="max-w-screen-xl w-full mx-auto px-4 py-6 pb-24 md:pb-6 flex-1">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <Link href="/" aria-label={c('back')} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </Link>
          <div>
            <h1 className="text-white font-bold text-xl">🎯 Polymarket</h1>
            <p className="text-gray-400 text-xs">{tr.polymarketDesc}</p>
          </div>
          <div className="w-full sm:w-auto sm:ml-auto flex items-center gap-1.5 bg-gray-800 rounded-lg px-3 py-2">
            <Search className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
            <input
              type="search"
              aria-label={c('search')}
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1) }}
              placeholder={tr.search + '...'}
              className="bg-transparent text-white text-sm outline-none flex-1 sm:w-36 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          {isLoading && Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-5 py-4 animate-pulse border-b border-gray-800/50">
              <div className="h-3 bg-gray-800 rounded w-4/5 mb-3" />
              <div className="h-1.5 bg-gray-800 rounded-full w-full" />
            </div>
          ))}
          {error && (
            <div role="alert" className="p-12 text-center">
              <p className="text-red-400">{tr.error}</p>
              <button onClick={() => mutate()} className="mt-3 px-4 py-2 rounded-lg bg-gray-800 text-gray-200 text-sm hover:bg-gray-700">{c('retry')}</button>
            </div>
          )}
          {!isLoading && !error && <MarketList markets={markets} tr={tr} />}
          {markets.length === 0 && !isLoading && !error && <div className="p-12 text-center text-gray-400">{tr.noData}</div>}
        </div>

        {!query && (
          <nav aria-label={c('pages')} className="flex items-center justify-center gap-1 mt-5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                aria-current={page === p ? 'page' : undefined}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                  page === p ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {p}
              </button>
            ))}
          </nav>
        )}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}
