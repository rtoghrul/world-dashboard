'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { TrendingUp, TrendingDown, ArrowRight, Newspaper, Bitcoin, BarChart2, Globe2 } from 'lucide-react'
import Header from '@/components/Header'
import MarketTicker from '@/components/MarketTicker'
import DailyBrief from '@/components/DailyBrief'
import CommandPalette from '@/components/CommandPalette'
import MobileBottomNav from '@/components/MobileBottomNav'
import Footer from '@/components/Footer'
import QuickActions from '@/components/QuickActions'
import LivePriceTicker from '@/components/LivePriceTicker'
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
import { Sparkles, Download } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type MarketData = {
  total_market_cap: number | null
  market_cap_change_24h: number | null
  btc_dominance: number | null
  active_coins: number | null
  fear_greed: number | null
  fear_greed_label: string | null
  total_volume: number | null
}

export default function HomePage() {
  const { lang } = useLang()
  const { data: news } = useSWR<NewsItem[]>(`/api/news?category=top&lang=${lang}`, fetcher, { refreshInterval: 300000 })
  const { data: coins } = useSWR<Coin[]>('/api/crypto', fetcher, { refreshInterval: 60000 })
  const { data: market } = useSWR<MarketData>('/api/market', fetcher, { refreshInterval: 300000 })
  const { data: stocks } = useSWR<any[]>('/api/stocks', fetcher, { refreshInterval: 300000 })

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

  // Extract stock data
  const sp500 = Array.isArray(stocks) ? stocks.find((s: any) => s.symbol === '^GSPC') : null
  const nasdaq = Array.isArray(stocks) ? stocks.find((s: any) => s.symbol === '^IXIC') : null
  const gold = Array.isArray(stocks) ? stocks.find((s: any) => s.symbol === 'GC=F' || s.symbol === 'GLD') : null

  const labels = {
    en: { breaking: 'Breaking News', markets: 'Markets', viewAll: 'View all', topCoins: 'Top Coins', quickStats: 'Quick Stats', aiTools: 'AI Tools', software: 'Software & Apps', btcDom: 'BTC Dominance', volume: '24h Volume', activeCoins: 'Active Coins', fearGreed: 'Fear & Greed' },
    az: { breaking: 'Son Xəbərlər', markets: 'Bazarlar', viewAll: 'Hamısına bax', topCoins: 'Top Coinlər', quickStats: 'Statistika', aiTools: 'AI Alətlər', software: 'Proqramlar', btcDom: 'BTC Dominantlığı', volume: '24s Həcm', activeCoins: 'Aktiv Coinlər', fearGreed: 'Qorxu & Tamah' },
    ru: { breaking: 'Главные новости', markets: 'Рынки', viewAll: 'Смотреть все', topCoins: 'Топ монеты', quickStats: 'Статистика', aiTools: 'ИИ Инструменты', software: 'Софт и приложения', btcDom: 'Доминация BTC', volume: 'Объём 24ч', activeCoins: 'Активные монеты', fearGreed: 'Страх и Жадность' },
    tr: { breaking: 'Son Dakika', markets: 'Piyasalar', viewAll: 'Tümünü gör', topCoins: 'Top Coinler', quickStats: 'İstatistikler', aiTools: 'YZ Araçları', software: 'Yazılım', btcDom: 'BTC Dominansı', volume: '24s Hacim', activeCoins: 'Aktif Coinler', fearGreed: 'Korku & Açgözlülük' },
    de: { breaking: 'Eilmeldung', markets: 'Märkte', viewAll: 'Alle anzeigen', topCoins: 'Top Coins', quickStats: 'Statistiken', aiTools: 'KI-Tools', software: 'Software', btcDom: 'BTC Dominanz', volume: '24h Volumen', activeCoins: 'Aktive Coins', fearGreed: 'Angst & Gier' },
    fr: { breaking: 'Dernières nouvelles', markets: 'Marchés', viewAll: 'Voir tout', topCoins: 'Top Cryptos', quickStats: 'Statistiques', aiTools: 'Outils IA', software: 'Logiciels', btcDom: 'Dominance BTC', volume: 'Volume 24h', activeCoins: 'Coins actifs', fearGreed: 'Peur & Avidité' },
    es: { breaking: 'Últimas Noticias', markets: 'Mercados', viewAll: 'Ver todo', topCoins: 'Top Monedas', quickStats: 'Estadísticas', aiTools: 'Herramientas IA', software: 'Software', btcDom: 'Dominio BTC', volume: 'Volumen 24h', activeCoins: 'Monedas activas', fearGreed: 'Miedo & Codicia' },
    zh: { breaking: '突发新闻', markets: '市场', viewAll: '查看全部', topCoins: '热门币种', quickStats: '快速统计', aiTools: 'AI工具', software: '软件', btcDom: 'BTC主导', volume: '24h成交量', activeCoins: '活跃币种', fearGreed: '恐惧与贪婪' },
    ar: { breaking: 'أخبار عاجلة', markets: 'أسواق', viewAll: 'عرض الكل', topCoins: 'أفضل العملات', quickStats: 'إحصائيات', aiTools: 'أدوات ذ.ا.', software: 'برامج', btcDom: 'هيمنة BTC', volume: 'حجم 24س', activeCoins: 'عملات نشطة', fearGreed: 'خوف وطمع' },
    ja: { breaking: '速報ニュース', markets: '市場', viewAll: 'すべて見る', topCoins: 'トップコイン', quickStats: '統計', aiTools: 'AIツール', software: 'ソフト', btcDom: 'BTC占有率', volume: '24h出来高', activeCoins: 'アクティブコイン', fearGreed: '恐怖と貪欲' },
    it: { breaking: 'Ultime Notizie', markets: 'Mercati', viewAll: 'Vedi tutto', topCoins: 'Top Coin', quickStats: 'Statistiche', aiTools: 'Strumenti IA', software: 'Software', btcDom: 'Dominanza BTC', volume: 'Volume 24h', activeCoins: 'Coin attivi', fearGreed: 'Paura & Avidità' },
    pt: { breaking: 'Últimas Notícias', markets: 'Mercados', viewAll: 'Ver tudo', topCoins: 'Top Moedas', quickStats: 'Estatísticas', aiTools: 'Ferramentas IA', software: 'Software', btcDom: 'Dominância BTC', volume: 'Volume 24h', activeCoins: 'Moedas ativas', fearGreed: 'Medo & Ganância' },
  }
  const t = labels[lang as keyof typeof labels] || labels.en

  return (
    <div className="min-h-screen relative z-[1] w-full">
      <ServiceWorkerRegistrar />
      <CommandPalette />
      <Header />

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative overflow-hidden border-b border-white/[0.03]">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.03] via-transparent to-transparent pointer-events-none" />
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="gradient-text text-2xl sm:text-3xl font-bold tracking-tight">World Dashboard</h1>
              <p className="text-[#6b6b80] text-xs sm:text-sm mt-1">Real-time intelligence · 15+ sections · 12 languages</p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              {/* KPI Pills */}
              {market?.total_market_cap && (
                <div className="glass px-3 py-1.5 rounded-full flex items-center gap-2">
                  <span className="text-[10px] text-[#8b8b9e]">Crypto MCap</span>
                  <span className="text-xs text-white font-mono font-medium">{formatNum(market.total_market_cap)}</span>
                  {market.market_cap_change_24h !== null && (
                    <span className={`text-[10px] font-medium ${market.market_cap_change_24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {market.market_cap_change_24h >= 0 ? '+' : ''}{market.market_cap_change_24h.toFixed(1)}%
                    </span>
                  )}
                </div>
              )}
              {sp500 && (
                <div className="hidden sm:flex glass px-3 py-1.5 rounded-full items-center gap-2">
                  <span className="text-[10px] text-[#8b8b9e]">S&amp;P 500</span>
                  <span className={`text-xs font-mono font-medium ${sp500.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {sp500.change >= 0 ? '+' : ''}{sp500.changePercent?.toFixed(2)}%
                  </span>
                </div>
              )}
              {market?.fear_greed && (
                <div className="hidden md:flex glass px-3 py-1.5 rounded-full items-center gap-2">
                  <span className="text-[10px] text-[#8b8b9e]">{t.fearGreed}</span>
                  <span className={`text-xs font-mono font-bold ${
                    market.fear_greed <= 25 ? 'text-red-400' : market.fear_greed <= 45 ? 'text-orange-400' :
                    market.fear_greed <= 55 ? 'text-yellow-400' : market.fear_greed <= 75 ? 'text-lime-400' : 'text-emerald-400'
                  }`}>{market.fear_greed}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <QuickActions />

      <MarketTicker />
      <LivePriceTicker />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
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

        {/* Second row: Calendar + Quiz + Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          <CalendarWidget />
          <DailyQuiz />
          <div className="hidden lg:block">
            <div className="rounded-xl border border-white/[0.04] bg-[#0a0a10]/80 p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-white font-semibold text-sm">{t.quickStats}</h3>
                <span className="live-dot" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#8b8b9e] text-xs">{t.btcDom}</span>
                  <span className="text-white text-xs font-mono">
                    {market?.btc_dominance ? `${market.btc_dominance.toFixed(1)}%` : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8b8b9e] text-xs">{t.volume}</span>
                  <span className="text-white text-xs font-mono">
                    {market?.total_volume ? formatNum(market.total_volume) : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8b8b9e] text-xs">{t.activeCoins}</span>
                  <span className="text-white text-xs font-mono">
                    {market?.active_coins ? market.active_coins.toLocaleString() : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8b8b9e] text-xs">S&amp;P 500</span>
                  {sp500 ? (
                    <span className={`text-xs font-mono ${sp500.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {sp500.change >= 0 ? '+' : ''}{sp500.changePercent?.toFixed(2) || sp500.change?.toFixed(2)}%
                    </span>
                  ) : <span className="text-[#6b6b80] text-xs font-mono">—</span>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8b8b9e] text-xs">NASDAQ</span>
                  {nasdaq ? (
                    <span className={`text-xs font-mono ${nasdaq.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {nasdaq.change >= 0 ? '+' : ''}{nasdaq.changePercent?.toFixed(2) || nasdaq.change?.toFixed(2)}%
                    </span>
                  ) : <span className="text-[#6b6b80] text-xs font-mono">—</span>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8b8b9e] text-xs">{t.fearGreed}</span>
                  {market?.fear_greed ? (
                    <span className={`text-xs font-mono font-bold ${
                      market.fear_greed <= 25 ? 'text-red-400' :
                      market.fear_greed <= 45 ? 'text-orange-400' :
                      market.fear_greed <= 55 ? 'text-yellow-400' :
                      market.fear_greed <= 75 ? 'text-lime-400' : 'text-emerald-400'
                    }`}>
                      {market.fear_greed} · {market.fear_greed_label}
                    </span>
                  ) : <span className="text-[#6b6b80] text-xs font-mono">—</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Tools & Software Preview Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          {/* AI Tools Preview */}
          <div className="rounded-xl border border-white/[0.04] bg-[#0a0a10]/80 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-white font-semibold text-sm">{t.aiTools}</h3>
              </div>
              <Link href="/section/aitools/chatbots" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition">
                {t.viewAll} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['ChatGPT', 'Claude', 'Gemini', 'Midjourney'].map(name => (
                <div key={name} className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/30 transition">
                  <p className="text-xs text-white font-medium">{name}</p>
                  <p className="text-[10px] text-emerald-400">🆓 Free</p>
                </div>
              ))}
            </div>
          </div>

          {/* Software Preview */}
          <div className="rounded-xl border border-white/[0.04] bg-[#0a0a10]/80 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" />
                <h3 className="text-white font-semibold text-sm">{t.software}</h3>
              </div>
              <Link href="/section/software/android" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition">
                {t.viewAll} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['ReVanced', 'TrollStore', 'uBlock Origin', 'MAS'].map(name => (
                <div key={name} className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 transition">
                  <p className="text-xs text-white font-medium">{name}</p>
                  <p className="text-[10px] text-emerald-400">🆓 Free</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}
