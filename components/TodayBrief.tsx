'use client'
import useSWR from 'swr'
import type { ReactNode } from 'react'
import { ArrowUpRight, BarChart2, Newspaper, Play, RefreshCw, Sparkles, TrendingDown, TrendingUp } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type Coin = {
  id: string
  name: string
  symbol: string
  current_price: number
  price_change_percentage_24h: number
}

type Quote = {
  symbol: string
  name: string
  price: number
  changePercent: number
}

type NewsItem = {
  title: string
  link: string
  source: string
}

type Video = {
  title: string
  channel: string
  views: number
  url: string
}

const LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  az: 'az-AZ',
  ru: 'ru-RU',
  de: 'de-DE',
  tr: 'tr-TR',
  fr: 'fr-FR',
  es: 'es-ES',
  it: 'it-IT',
  pt: 'pt-PT',
  ja: 'ja-JP',
  zh: 'zh-CN',
  ar: 'ar-SA',
}

const YOUTUBE_REGION_BY_LANG: Record<string, string> = {
  az: 'AZ',
  ru: 'RU',
  de: 'DE',
  tr: 'TR',
  en: 'US',
  fr: 'FR',
  es: 'ES',
  it: 'IT',
  pt: 'PT',
  ja: 'JP',
}

const BRIEF_TEXT: Record<string, { views: string; day: string }> = {
  en: { views: 'views', day: '24h' },
  az: { views: 'baxış', day: '24s' },
  ru: { views: 'просмотров', day: '24ч' },
  de: { views: 'Aufrufe', day: '24 Std.' },
  tr: { views: 'görüntüleme', day: '24s' },
}

function formatCompactNumber(value?: number, locale = 'en-US') {
  if (typeof value !== 'number' || Number.isNaN(value)) return '--'
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function formatCurrency(value?: number, locale = 'en-US') {
  if (typeof value !== 'number' || Number.isNaN(value)) return '--'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value > 1000 ? 0 : 2,
  }).format(value)
}

function formatPercent(value?: number, locale = 'en-US') {
  if (typeof value !== 'number' || Number.isNaN(value)) return '--'
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
  return `${value >= 0 ? '+' : ''}${formatted}%`
}

function SignalCard({
  tone,
  icon,
  label,
  title,
  meta,
  href,
}: {
  tone: 'emerald' | 'red' | 'sky' | 'amber'
  icon: ReactNode
  label: string
  title: string
  meta: string
  href?: string
}) {
  const toneClass = {
    emerald: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
    red: 'text-red-300 bg-red-500/10 border-red-500/20',
    sky: 'text-sky-300 bg-sky-500/10 border-sky-500/20',
    amber: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
  }[tone]

  const content = (
    <div className="min-w-0 rounded-xl border border-gray-800 bg-gray-900/70 p-4 transition-colors hover:border-gray-700 hover:bg-gray-900">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-medium ${toneClass}`}>
          {icon}
          {label}
        </span>
        {href && <ArrowUpRight className="h-3.5 w-3.5 flex-shrink-0 text-gray-600" aria-hidden="true" />}
      </div>
      <p className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 truncate text-xs text-gray-500">{meta}</p>
    </div>
  )

  if (!href) return content

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950">
      {content}
    </a>
  )
}

export default function TodayBrief() {
  const { lang, tr } = useLang()
  const locale = LOCALE_MAP[lang] || 'en-US'
  const briefText = BRIEF_TEXT[lang] || BRIEF_TEXT.en
  const youtubeRegion = YOUTUBE_REGION_BY_LANG[lang] || 'US'

  const { data: cryptoData, isLoading: cryptoLoading } = useSWR<Coin[]>('/api/crypto?per_page=5', fetcher, { refreshInterval: 60000 })
  const { data: stockData, isLoading: stockLoading } = useSWR<Quote[]>('/api/stocks', fetcher, { refreshInterval: 60000 })
  const { data: newsData, isLoading: newsLoading } = useSWR<NewsItem[]>(`/api/news?category=top&lang=${lang}`, fetcher, { refreshInterval: 300000 })
  const { data: videoData, isLoading: videoLoading } = useSWR<Video[]>(`/api/youtube?region=${youtubeRegion}&maxResults=5&lang=${lang}`, fetcher, { refreshInterval: 3600000 })

  const coins = Array.isArray(cryptoData) ? cryptoData : []
  const quotes = Array.isArray(stockData) ? stockData : []
  const news = Array.isArray(newsData) ? newsData : []
  const videos = Array.isArray(videoData) ? videoData : []

  const btc = coins.find(c => c.id === 'bitcoin') ?? coins[0]
  const topStock = quotes
    .filter(q => typeof q.changePercent === 'number')
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))[0]
  const topNews = news[0]
  const topVideo = videos[0]

  const stockUp = (topStock?.changePercent ?? 0) >= 0
  const btcUp = (btc?.price_change_percentage_24h ?? 0) >= 0

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50">
      <div className="border-b border-gray-800 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2 py-1 text-xs font-medium text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {tr.todayBriefRefreshed}
            </div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">{tr.todayBrief}</h2>
            <p className="mt-1 text-sm text-gray-400">{tr.todayBriefSubtitle}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(new Date())}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
        <SignalCard
          tone={btcUp ? 'emerald' : 'red'}
          icon={btcUp ? <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" /> : <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />}
          label={tr.crypto}
          title={cryptoLoading ? tr.loading : btc ? `${btc.name} ${formatCurrency(btc.current_price, locale)}` : tr.noData}
          meta={btc ? `${btc.symbol.toUpperCase()} ${formatPercent(btc.price_change_percentage_24h, locale)} / ${briefText.day}` : tr.noData}
        />
        <SignalCard
          tone={stockUp ? 'emerald' : 'red'}
          icon={<BarChart2 className="h-3.5 w-3.5" aria-hidden="true" />}
          label={tr.stocks}
          title={stockLoading ? tr.loading : topStock ? `${topStock.symbol} ${formatCurrency(topStock.price, locale)}` : tr.noData}
          meta={topStock ? `${topStock.name ?? topStock.symbol} ${formatPercent(topStock.changePercent, locale)}` : tr.noData}
        />
        <SignalCard
          tone="sky"
          icon={<Newspaper className="h-3.5 w-3.5" aria-hidden="true" />}
          label={tr.news}
          title={newsLoading ? tr.loading : topNews?.title ?? tr.noData}
          meta={topNews?.source ?? tr.noData}
          href={topNews?.link}
        />
        <SignalCard
          tone="amber"
          icon={<Play className="h-3.5 w-3.5" aria-hidden="true" />}
          label={tr.viral}
          title={videoLoading ? tr.loading : topVideo?.title ?? tr.noData}
          meta={topVideo ? `${topVideo.channel} / ${formatCompactNumber(topVideo.views, locale)} ${briefText.views}` : tr.noData}
          href={topVideo?.url}
        />
      </div>
    </section>
  )
}
