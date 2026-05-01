'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { TrendingUp, TrendingDown, ArrowRight, Newspaper, Bitcoin, BarChart2, Film } from 'lucide-react'
import Header from '@/components/Header'
import MarketTicker from '@/components/MarketTicker'
import DailyBrief from '@/components/DailyBrief'
import { useLang } from '@/lib/LanguageContext'
import { createClient } from '@/lib/supabase'
import PortfolioTracker from '@/components/PortfolioTracker'
import PriceChart from '@/components/PriceChart'
import { NewsItem, NewsCard } from '@/components/NewsWidget'
import { Coin, formatNum } from '@/components/CryptoWidget'
import TrendingWidget from '@/components/TrendingWidget'
import CalendarWidget from '@/components/CalendarWidget'
import DailyStreak from '@/components/DailyStreak'
import DailyQuiz from '@/components/DailyQuiz'
import PortfolioSimulator from '@/components/PortfolioSimulator'
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function HomePage() {
  const { lang } = useLang()
  const { data: news } = useSWR<NewsItem[]>(`/api/news?category=top&lang=${lang}`, fetcher, { refreshInterval: 300000 })
  const { data: coins } = useSWR<Coin[]>('/api/crypto', fetcher, { refreshInterval: 60000 })

  useEffect(() => {
    const init = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) fetch('/api/pageview', { method: 'POST' })
      } catch {}
    }
    init()
  }, [])

  const newsItems = Array.isArray(news) ? news.slice(0, 6) : []
  const topCoins = Array.isArray(coins) ? coins.slice(0, 5) : []

  const labels = {
    en: { breaking: 'Breaking News', markets: 'Markets', viewAll: 'View all', topCoins: 'Top Coins' },
    az: { breaking: 'Son Xəbərlər', markets: 'Bazarlar', viewAll: 'Hamısına bax', topCoins: 'Top Coinlər' },
    ru: { breaking: 'Главные новости', markets: 'Рынки', viewAll: 'Смотреть все', topCoins: 'Топ монеты' },
  }
  const t = labels[lang as keyof typeof labels] || labels.en

  return (
    <div className="min-h-screen relative">
      <ServiceWorkerRegistrar />
      <Header />
      <MarketTicker />

      <main className="max-w-screen-2xl mx-auto px-5 py-6">
        {/* Daily Streak */}
        <div className="mb-4">
          <DailyStreak />
        </div>

        {/* AI Daily Brief */}
        <DailyBrief />

        {/* Price Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <PriceChart coinId="bitcoin" coinName="Bitcoin" />
          <PriceChart coinId="ethereum" coinName="Ethereum" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* News - takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-rose-400" />
                <h2 className="text-white font-semibold text-sm">{t.breaking}</h2>
                <span className="live-dot" />
              </div>
              <Link href="/section/news/top" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition">
                {t.viewAll} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="rounded-xl border border-white/[0.04] bg-[#0a0a10]/80 overflow-hidden divide-y divide-white/[0.03]">
              {newsItems.length === 0 && (
                <div className="p-8 space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-14 h-14 bg-white/[0.03] rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-3 bg-white/[0.03] rounded w-full" />
                        <div className="h-2 bg-white/[0.03] rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {newsItems.map((item, i) => (
                <NewsCard key={i} item={item} />
              ))}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Top Coins */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bitcoin className="w-4 h-4 text-amber-400" />
                  <h2 className="text-white font-semibold text-sm">{t.topCoins}</h2>
                </div>
                <Link href="/section/crypto/top" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition">
                  {t.viewAll} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="rounded-xl border border-white/[0.04] bg-[#0a0a10]/80 overflow-hidden">
                {topCoins.length === 0 && (
                  <div className="p-6 space-y-4">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-8 h-8 bg-white/[0.03] rounded-full" />
                        <div className="flex-1 h-3 bg-white/[0.03] rounded" />
                        <div className="w-16 h-3 bg-white/[0.03] rounded" />
                      </div>
                    ))}
                  </div>
                )}
                {topCoins.map(coin => {
                  const up = coin.price_change_percentage_24h >= 0
                  return (
                    <Link key={coin.id} href="/section/crypto/top" className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition border-b border-white/[0.03] last:border-0">
                      <img src={coin.image} alt={coin.name} className="w-7 h-7 rounded-full" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium">{coin.name}</p>
                        <p className="text-[#4a4a5e] text-[10px] uppercase">{coin.symbol}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-xs font-mono">${coin.current_price.toLocaleString()}</p>
                        <p className={`text-[10px] font-medium flex items-center justify-end gap-0.5 ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                          {up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Portfolio */}
            <PortfolioTracker />

            {/* Trending */}
            <TrendingWidget />

            {/* Paper Trading */}
            <PortfolioSimulator />
          </div>
        </div>

        {/* Second row: Calendar + Quiz */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          <CalendarWidget />
          <DailyQuiz />
          <div className="hidden lg:block">
            <div className="rounded-xl border border-white/[0.04] bg-[#0a0a10]/80 p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-white font-semibold text-sm">Quick Stats</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#8b8b9e] text-xs">BTC Dominance</span>
                  <span className="text-white text-xs font-mono">54.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8b8b9e] text-xs">24h Volume</span>
                  <span className="text-white text-xs font-mono">$89.4B</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8b8b9e] text-xs">Active Coins</span>
                  <span className="text-white text-xs font-mono">14,283</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8b8b9e] text-xs">S&amp;P 500</span>
                  <span className="text-emerald-400 text-xs font-mono">+0.87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8b8b9e] text-xs">NASDAQ</span>
                  <span className="text-emerald-400 text-xs font-mono">+1.12%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8b8b9e] text-xs">Gold</span>
                  <span className="text-white text-xs font-mono">$2,341</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
