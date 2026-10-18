'use client'
import { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import { CryptoTable, Coin } from '@/components/CryptoWidget'
import { useLang } from '@/lib/LanguageContext'

const fetcher = async (url: string) => {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  const d = await r.json()
  if (!Array.isArray(d)) throw new Error('Unexpected response')
  return d
}

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'Crypto Markets', az: 'Kripto bazarları', ru: 'Криптовалютные рынки', de: 'Kryptomärkte', tr: 'Kripto Piyasaları', fr: 'Marchés crypto', es: 'Mercados cripto', zh: '加密市场', ar: 'أسواق العملات المشفرة', ja: '暗号資産市場', it: 'Mercati crypto', pt: 'Mercados cripto' },
  search: { en: 'Search coins', az: 'Koin axtar', ru: 'Поиск монет', de: 'Coins suchen', tr: 'Coin ara', fr: 'Rechercher des cryptos', es: 'Buscar monedas', zh: '搜索币种', ar: 'ابحث عن عملة', ja: '銘柄を検索', it: 'Cerca monete', pt: 'Buscar moedas' },
  back: { en: 'Back to home', az: 'Ana səhifəyə', ru: 'На главную', de: 'Zur Startseite', tr: 'Ana sayfaya dön', fr: "Retour à l'accueil", es: 'Volver al inicio', zh: '返回首页', ar: 'العودة للرئيسية', ja: 'ホームへ戻る', it: 'Torna alla home', pt: 'Voltar ao início' },
  pages: { en: 'Pages', az: 'Səhifələr', ru: 'Страницы', de: 'Seiten', tr: 'Sayfalar', fr: 'Pages', es: 'Páginas', zh: '分页', ar: 'الصفحات', ja: 'ページ', it: 'Pagine', pt: 'Páginas' },
  retry: { en: 'Try again', az: 'Yenidən cəhd et', ru: 'Повторить', de: 'Erneut versuchen', tr: 'Tekrar dene', fr: 'Réessayer', es: 'Reintentar', zh: '重试', ar: 'إعادة المحاولة', ja: '再試行', it: 'Riprova', pt: 'Tentar novamente' },
}
const PER_PAGE = 20

export default function CryptoPage() {
  const { lang, tr } = useLang()
  const c = (k: string) => COPY[k][lang] || COPY[k].en
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')

  const { data, error, isLoading, mutate } = useSWR<Coin[]>(
    `/api/crypto?per_page=${PER_PAGE}&page=${page}`,
    fetcher,
    { refreshInterval: 60000 }
  )

  const filtered = data
    ? (query ? data.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.symbol.toLowerCase().includes(query.toLowerCase())) : data)
    : []

  const totalPages = 5

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      <Header />
      <main id="main-content" className="max-w-screen-xl w-full mx-auto px-4 py-6 pb-24 md:pb-6 flex-1">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <Link href="/" aria-label={c('back')} className="p-1.5 rounded-lg text-ink-3 hover:text-ink-1 hover:bg-surface-2 transition">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </Link>
          <div>
            <h1 className="text-ink-1 font-bold text-xl">₿ {c('title')}</h1>
            <p className="text-ink-3 text-xs">{tr.cryptoDesc}</p>
          </div>
          <div className="w-full sm:w-auto sm:ml-auto flex items-center gap-1.5 bg-surface-2 rounded-lg px-3 py-2">
            <Search className="w-3.5 h-3.5 text-ink-3" aria-hidden="true" />
            <input
              type="search"
              aria-label={c('search')}
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1) }}
              placeholder="Bitcoin, ETH..."
              className="bg-transparent text-ink-1 text-sm outline-none flex-1 sm:w-36 placeholder-ink-4"
            />
          </div>
        </div>

        <div className="bg-surface-1 rounded-2xl border border-line overflow-hidden">
          {isLoading && <div className="p-12 text-center text-ink-3 animate-pulse">{tr.loading}</div>}
          {error && (
            <div role="alert" className="p-12 text-center">
              <p className="text-red-400">{tr.error}</p>
              <button onClick={() => mutate()} className="mt-3 px-4 py-2 rounded-lg bg-surface-2 text-ink-1 text-sm hover:bg-surface-3">{c('retry')}</button>
            </div>
          )}
          {data && !error && <CryptoTable coins={filtered} />}
        </div>

        {!query && (
          <nav aria-label={c('pages')} className="flex items-center justify-center gap-1 mt-5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                aria-current={page === p ? 'page' : undefined}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                  page === p ? 'bg-indigo-600 text-white' : 'text-ink-3 hover:text-ink-1 hover:bg-surface-2'
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
