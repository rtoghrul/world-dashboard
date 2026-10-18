'use client'
import useSWR from 'swr'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, TrendingDown, BarChart2, RefreshCw } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import { STOCK_GROUPS } from '@/lib/stockGroups'
import { useLang } from '@/lib/LanguageContext'

const fetcher = async (url: string) => {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json()
}

type Quote = {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

type SortKey = 'symbol' | 'price' | 'change' | 'changePercent'
type L = Record<string, string>

const GROUP_KEYS = Object.keys(STOCK_GROUPS) as (keyof typeof STOCK_GROUPS)[]

const GROUP_LABELS: Record<string, L> = {
  indices: { en: 'Major Indices', az: 'Əsas indekslər', ru: 'Основные индексы', de: 'Wichtige Indizes', tr: 'Ana endeksler', fr: 'Indices majeurs', es: 'Índices principales', zh: '主要指数', ar: 'المؤشرات الرئيسية', ja: '主要指数', it: 'Indici principali', pt: 'Principais índices' },
  tech: { en: 'Technology', az: 'Texnologiya', ru: 'Технологии', de: 'Technologie', tr: 'Teknoloji', fr: 'Technologie', es: 'Tecnología', zh: '科技', ar: 'التكنولوجيا', ja: 'テクノロジー', it: 'Tecnologia', pt: 'Tecnologia' },
  finance: { en: 'Finance', az: 'Maliyyə', ru: 'Финансы', de: 'Finanzen', tr: 'Finans', fr: 'Finance', es: 'Finanzas', zh: '金融', ar: 'المالية', ja: '金融', it: 'Finanza', pt: 'Finanças' },
  ev_energy: { en: 'EV & Energy', az: 'Elektromobil və enerji', ru: 'Электромобили и энергетика', de: 'E-Autos & Energie', tr: 'Elektrikli araç ve enerji', fr: 'VE & énergie', es: 'VE y energía', zh: '电动车与能源', ar: 'السيارات الكهربائية والطاقة', ja: 'EV・エネルギー', it: 'Auto elettriche ed energia', pt: 'Elétricos e energia' },
  crypto_stocks: { en: 'Crypto-linked', az: 'Kripto ilə bağlı', ru: 'Связанные с криптой', de: 'Krypto-nah', tr: 'Kripto bağlantılı', fr: 'Liées à la crypto', es: 'Vinculadas a cripto', zh: '加密相关', ar: 'مرتبطة بالعملات المشفرة', ja: '暗号資産関連', it: 'Legate alle crypto', pt: 'Ligadas a cripto' },
}

const COPY: Record<string, L> = {
  dashboard: { en: 'Dashboard', az: 'Panel', ru: 'Панель', de: 'Dashboard', tr: 'Panel', fr: 'Tableau de bord', es: 'Panel', zh: '仪表板', ar: 'اللوحة', ja: 'ダッシュボード', it: 'Dashboard', pt: 'Painel' },
  title: { en: 'Stocks', az: 'Səhmlər', ru: 'Акции', de: 'Aktien', tr: 'Hisseler', fr: 'Actions', es: 'Acciones', zh: '股票', ar: 'الأسهم', ja: '株式', it: 'Azioni', pt: 'Ações' },
  refresh: { en: 'Refresh', az: 'Yenilə', ru: 'Обновить', de: 'Aktualisieren', tr: 'Yenile', fr: 'Actualiser', es: 'Actualizar', zh: '刷新', ar: 'تحديث', ja: '更新', it: 'Aggiorna', pt: 'Atualizar' },
  loading: { en: 'Loading market data…', az: 'Bazar məlumatları yüklənir…', ru: 'Загрузка данных рынка…', de: 'Marktdaten werden geladen…', tr: 'Piyasa verileri yükleniyor…', fr: 'Chargement des données…', es: 'Cargando datos del mercado…', zh: '正在加载市场数据…', ar: 'جارٍ تحميل بيانات السوق…', ja: '市場データを読み込み中…', it: 'Caricamento dati di mercato…', pt: 'Carregando dados do mercado…' },
  failed: { en: 'Couldn’t load stock data. Please try again.', az: 'Səhm məlumatları yüklənmədi. Yenidən cəhd edin.', ru: 'Не удалось загрузить данные. Попробуйте ещё раз.', de: 'Aktiendaten konnten nicht geladen werden. Bitte erneut versuchen.', tr: 'Hisse verileri yüklenemedi. Lütfen tekrar deneyin.', fr: 'Impossible de charger les données. Réessayez.', es: 'No se pudieron cargar los datos. Inténtalo de nuevo.', zh: '无法加载股票数据，请重试。', ar: 'تعذر تحميل بيانات الأسهم. حاول مرة أخرى.', ja: '株価データを読み込めませんでした。もう一度お試しください。', it: 'Impossibile caricare i dati. Riprova.', pt: 'Não foi possível carregar os dados. Tente novamente.' },
  empty: { en: 'No quotes available right now.', az: 'Hazırda kotirovka yoxdur.', ru: 'Котировки сейчас недоступны.', de: 'Derzeit keine Kurse verfügbar.', tr: 'Şu anda fiyat bilgisi yok.', fr: 'Aucune cotation disponible pour le moment.', es: 'No hay cotizaciones disponibles ahora.', zh: '暂无行情数据。', ar: 'لا توجد أسعار متاحة حالياً.', ja: '現在、表示できる株価がありません。', it: 'Nessuna quotazione disponibile al momento.', pt: 'Nenhuma cotação disponível no momento.' },
  symbol: { en: 'Symbol', az: 'Simvol', ru: 'Тикер', de: 'Symbol', tr: 'Sembol', fr: 'Symbole', es: 'Símbolo', zh: '代码', ar: 'الرمز', ja: 'シンボル', it: 'Simbolo', pt: 'Símbolo' },
  name: { en: 'Name', az: 'Ad', ru: 'Название', de: 'Name', tr: 'Ad', fr: 'Nom', es: 'Nombre', zh: '名称', ar: 'الاسم', ja: '名称', it: 'Nome', pt: 'Nome' },
  price: { en: 'Price', az: 'Qiymət', ru: 'Цена', de: 'Kurs', tr: 'Fiyat', fr: 'Prix', es: 'Precio', zh: '价格', ar: 'السعر', ja: '価格', it: 'Prezzo', pt: 'Preço' },
  change: { en: 'Change', az: 'Dəyişmə', ru: 'Изменение', de: 'Änderung', tr: 'Değişim', fr: 'Variation', es: 'Cambio', zh: '涨跌', ar: 'التغير', ja: '変動', it: 'Variazione', pt: 'Variação' },
  changePct: { en: '% Change', az: '% dəyişmə', ru: '% изм.', de: '% Änderung', tr: '% değişim', fr: '% var.', es: '% cambio', zh: '涨跌幅', ar: '% التغير', ja: '変動率', it: '% var.', pt: '% var.' },
  symbols: { en: 'symbols', az: 'simvol', ru: 'тикеров', de: 'Symbole', tr: 'sembol', fr: 'symboles', es: 'símbolos', zh: '只', ar: 'رمز', ja: '銘柄', it: 'simboli', pt: 'símbolos' },
  page: { en: 'Page', az: 'Səhifə', ru: 'Стр.', de: 'Seite', tr: 'Sayfa', fr: 'Page', es: 'Página', zh: '页', ar: 'صفحة', ja: 'ページ', it: 'Pagina', pt: 'Página' },
  of: { en: 'of', az: '/', ru: 'из', de: 'von', tr: '/', fr: 'sur', es: 'de', zh: '/', ar: 'من', ja: '/', it: 'di', pt: 'de' },
  prev: { en: 'Previous', az: 'Əvvəlki', ru: 'Назад', de: 'Zurück', tr: 'Önceki', fr: 'Précédent', es: 'Anterior', zh: '上一页', ar: 'السابق', ja: '前へ', it: 'Precedente', pt: 'Anterior' },
  next: { en: 'Next', az: 'Növbəti', ru: 'Далее', de: 'Weiter', tr: 'Sonraki', fr: 'Suivant', es: 'Siguiente', zh: '下一页', ar: 'التالي', ja: '次へ', it: 'Successiva', pt: 'Próxima' },
  source: { en: 'Data from Yahoo Finance · Refreshes every 60s', az: 'Məlumat Yahoo Finance-dəndir · Hər 60 san yenilənir', ru: 'Данные Yahoo Finance · Обновление каждые 60 с', de: 'Daten von Yahoo Finance · Aktualisierung alle 60 s', tr: 'Veriler Yahoo Finance’tan · 60 sn’de bir yenilenir', fr: 'Données Yahoo Finance · Actualisation toutes les 60 s', es: 'Datos de Yahoo Finance · Se actualiza cada 60 s', zh: '数据来自 Yahoo Finance · 每 60 秒刷新', ar: 'البيانات من Yahoo Finance · تُحدَّث كل 60 ثانية', ja: 'データ: Yahoo Finance · 60秒ごとに更新', it: 'Dati da Yahoo Finance · Aggiornamento ogni 60 s', pt: 'Dados do Yahoo Finance · Atualiza a cada 60 s' },
}

export default function StocksPage() {
  const { lang } = useLang()
  const c = (k: string) => COPY[k]?.[lang] || COPY[k]?.en || k
  const [activeGroup, setActiveGroup] = useState<string>('indices')
  const [sortKey, setSortKey] = useState<SortKey>('changePercent')
  const [sortAsc, setSortAsc] = useState(false)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20

  const { data, error, isLoading, isValidating, mutate } = useSWR<Quote[]>(
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

  // Sortable headers are real buttons (keyboard-accessible) and expose aria-sort.
  function SortHeader({ col, label, align = 'right' }: { col: SortKey; label: string; align?: 'left' | 'right' }) {
    const active = sortKey === col
    return (
      <th scope="col" aria-sort={active ? (sortAsc ? 'ascending' : 'descending') : 'none'} className={`px-4 py-2.5 ${align === 'left' ? 'text-left' : 'text-right'}`}>
        <button type="button" onClick={() => toggleSort(col)} className="inline-flex items-center gap-1 select-none hover:text-white transition">
          <span className={active ? 'text-emerald-400' : ''}>{label}</span>
          {active && <span aria-hidden="true" className="text-xs">{sortAsc ? '↑' : '↓'}</span>}
        </button>
      </th>
    )
  }

  return (
    <div className="min-h-screen relative z-[1] w-full">
      <Header />
      <main id="main-content" className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-[#a0a0b0] hover:text-white transition text-sm">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" /> {c('dashboard')}
            </Link>
            <span className="text-[#7c7c92]" aria-hidden="true">/</span>
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-400" aria-hidden="true" />
              <h1 className="text-white font-bold text-lg">{c('title')}</h1>
            </div>
          </div>
          <button
            type="button"
            onClick={() => mutate()}
            className="flex items-center gap-1.5 text-xs text-[#a0a0b0] hover:text-white transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin' : ''}`} aria-hidden="true" /> {c('refresh')}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label={c('title')}>
          {GROUP_KEYS.map(key => (
            <button
              key={key}
              type="button"
              aria-pressed={activeGroup === key}
              onClick={() => { setActiveGroup(key); setPage(1) }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition border ${
                activeGroup === key
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'text-[#a0a0b0] border-white/[0.08] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {GROUP_LABELS[key]?.[lang] || GROUP_LABELS[key]?.en || STOCK_GROUPS[key].label}
            </button>
          ))}
        </div>

        <div className="bg-[#0a0a10] rounded-2xl border border-white/[0.06] overflow-hidden">
          {isLoading && (
            <div role="status" className="p-10 text-center text-[#a0a0b0] animate-pulse text-sm">{c('loading')}</div>
          )}
          {error && !isLoading && (
            <div role="alert" className="p-10 text-center text-sm">
              <p className="text-red-400 mb-3">{c('failed')}</p>
              <button type="button" onClick={() => mutate()} className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-xs text-white hover:bg-white/[0.1] transition">
                {c('refresh')}
              </button>
            </div>
          )}
          {!isLoading && !error && quotes.length === 0 && (
            <div className="p-10 text-center text-[#a0a0b0] text-sm">{c('empty')}</div>
          )}
          {!isLoading && !error && quotes.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[#8b8b9e] text-xs border-b border-white/[0.06]">
                      <SortHeader col="symbol" label={c('symbol')} align="left" />
                      <th scope="col" className="px-4 py-2.5 text-left">{c('name')}</th>
                      <SortHeader col="price" label={c('price')} />
                      <SortHeader col="change" label={c('change')} />
                      <SortHeader col="changePercent" label={c('changePct')} />
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map(q => {
                      const up = q.changePercent >= 0
                      return (
                        <tr key={q.symbol} className="border-t border-white/[0.04] hover:bg-white/[0.03] transition">
                          <td className="px-4 py-3 font-mono font-bold text-indigo-300 whitespace-nowrap">{q.symbol}</td>
                          <td className="px-4 py-3 text-[#c0c0d0] whitespace-nowrap">{q.name}</td>
                          <td className="px-4 py-3 text-right font-mono text-white whitespace-nowrap">
                            {q.price?.toLocaleString(lang === 'zh' ? 'zh-CN' : lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className={`px-4 py-3 text-right font-mono whitespace-nowrap ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                            {up ? '+' : ''}{q.change?.toLocaleString(lang === 'zh' ? 'zh-CN' : lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <span className={`inline-flex items-center justify-end gap-1 font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                              {up ? <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" /> : <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />}
                              {up ? '+' : ''}{q.changePercent?.toLocaleString(lang === 'zh' ? 'zh-CN' : lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <nav aria-label={c('page')} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-t border-white/[0.06]">
                  <span className="text-xs text-[#8b8b9e]">{quotes.length} {c('symbols')} · {c('page')} {page} {c('of')} {totalPages}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 rounded-lg text-xs text-[#a0a0b0] hover:text-white hover:bg-white/[0.06] transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {c('prev')}
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        type="button"
                        aria-current={p === page ? 'page' : undefined}
                        onClick={() => setPage(p)}
                        className={`w-7 h-7 rounded-lg text-xs transition ${
                          p === page ? 'bg-emerald-500/20 text-emerald-300' : 'text-[#8b8b9e] hover:text-white hover:bg-white/[0.06]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-1 rounded-lg text-xs text-[#a0a0b0] hover:text-white hover:bg-white/[0.06] transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {c('next')}
                    </button>
                  </div>
                </nav>
              )}
            </>
          )}
        </div>

        <p className="text-center text-[#8b8b9e] text-xs mt-4">{c('source')}</p>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}
