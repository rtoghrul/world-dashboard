'use client'
import { useState, useEffect } from 'react'
import { Sparkles, Clock, TrendingUp, TrendingDown, Newspaper, Cloud, Zap, Cpu } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const COPY: Record<string, Record<string, string>> = {
  morning: { en: 'Good morning', az: 'Sabahınız xeyir', ru: 'Доброе утро', tr: 'Günaydın', de: 'Guten Morgen', fr: 'Bonjour', es: 'Buenos días', zh: '早上好', ar: 'صباح الخير', ja: 'おはようございます', it: 'Buongiorno', pt: 'Bom dia' },
  afternoon: { en: 'Good afternoon', az: 'Günortanız xeyir', ru: 'Добрый день', tr: 'İyi günler', de: 'Guten Tag', fr: 'Bon après-midi', es: 'Buenas tardes', zh: '下午好', ar: 'مساء الخير', ja: 'こんにちは', it: 'Buon pomeriggio', pt: 'Boa tarde' },
  evening: { en: 'Good evening', az: 'Axşamınız xeyir', ru: 'Добрый вечер', tr: 'İyi akşamlar', de: 'Guten Abend', fr: 'Bonsoir', es: 'Buenas noches', zh: '晚上好', ar: 'مساء الخير', ja: 'こんばんは', it: 'Buonasera', pt: 'Boa noite' },
  brief: { en: 'Your daily brief', az: 'Günlük icmal', ru: 'Ваш дайджест', tr: 'Günlük özet', de: 'Ihr Tagesbriefing', fr: 'Votre résumé', es: 'Tu resumen diario', zh: '每日简报', ar: 'ملخصك اليومي', ja: 'デイリーブリーフ', it: 'Il tuo riassunto', pt: 'Seu resumo diário' },
  minRead: { en: '~1 min read', az: '~1 dəq oxu', ru: '~1 мин чтения', tr: '~1 dk okuma', de: '~1 Min Lesen', fr: '~1 min lecture', es: '~1 min lectura', zh: '约1分钟', ar: '~1 دقيقة', ja: '約1分', it: '~1 min lettura', pt: '~1 min leitura' },
  topStories: { en: 'Top Stories', az: 'Əsas Xəbərlər', ru: 'Главные', tr: 'Öne Çıkanlar', de: 'Top-Meldungen', fr: 'À la une', es: 'Destacadas', zh: '头条', ar: 'أهم الأخبار', ja: 'トップニュース', it: 'Notizie Top', pt: 'Destaques' },
  cryptoMovers: { en: 'Crypto Movers', az: 'Kripto Hərəkəti', ru: 'Крипто движения', tr: 'Kripto Hareketleri', de: 'Krypto Bewegungen', fr: 'Crypto Mouvements', es: 'Movimientos Cripto', zh: '加密动态', ar: 'تحركات العملات', ja: '仮想通貨動向', it: 'Movimenti Crypto', pt: 'Movimentos Cripto' },
  trending: { en: 'Trending', az: 'Trend', ru: 'Тренды', tr: 'Trend', de: 'Trending', fr: 'Tendances', es: 'Tendencias', zh: '热门', ar: 'رائج', ja: 'トレンド', it: 'Tendenze', pt: 'Tendências' },
  aiRadar: { en: 'AI & Tech Radar', az: 'AI & Texno Radar', ru: 'ИИ и техно радар', tr: 'YZ & Teknoloji Radarı', de: 'KI & Tech Radar', fr: 'Radar IA & Tech', es: 'Radar IA y Tech', zh: 'AI科技雷达', ar: 'رادار الذ.ا.', ja: 'AI&テクノレーダー', it: 'Radar IA & Tech', pt: 'Radar IA & Tech' },
  tip: { en: 'Tip: Press', az: 'Məsləhət:', ru: 'Совет:', tr: 'İpucu:', de: 'Tipp:', fr: 'Conseil:', es: 'Consejo:', zh: '提示:', ar: 'نصيحة:', ja: 'ヒント:', it: 'Suggerimento:', pt: 'Dica:' },
  quickSearch: { en: 'for quick search', az: 'sürətli axtarış', ru: 'быстрый поиск', tr: 'hızlı arama', de: 'Schnellsuche', fr: 'recherche rapide', es: 'búsqueda rápida', zh: '快速搜索', ar: 'بحث سريع', ja: 'クイック検索', it: 'ricerca rapida', pt: 'busca rápida' },
}

interface BriefData {
  greeting: string
  time: string
  topNews: { title: string; source: string }[]
  cryptoMovers: { name: string; symbol: string; change: number; price: string }[]
  weather: { temp: string; condition: string; city: string }
  trending: string[]
  aiRadar: { title: string; url: string; source: string }[]
}

export default function DailyBrief() {
  const { lang } = useLang()
  const [data, setData] = useState<BriefData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBrief() {
      try {
        const [cryptoRes, newsRes, weatherRes, trendingRes, horizonRes] = await Promise.allSettled([
          fetch('/api/crypto?per_page=5'),
          fetch('/api/news?category=top'),
          fetch('https://api.open-meteo.com/v1/forecast?latitude=40.41&longitude=49.87&current=temperature_2m,weather_code&timezone=auto'),
          fetch('/api/trending'),
          fetch('/api/horizon'),
        ])

        // Crypto
        const cryptoData = cryptoRes.status === 'fulfilled' ? await cryptoRes.value.json() : []
        const movers = Array.isArray(cryptoData) ? cryptoData.slice(0, 4).map((c: any) => ({
          name: c.name,
          symbol: c.symbol?.toUpperCase(),
          change: c.price_change_percentage_24h || 0,
          price: `$${c.current_price?.toLocaleString() || '0'}`
        })) : []

        // News — /api/news returns array directly, not { articles: [] }
        const newsData = newsRes.status === 'fulfilled' ? await newsRes.value.json() : []
        const newsArray = Array.isArray(newsData) ? newsData : (newsData?.articles || [])
        const topNews = newsArray.length > 0
          ? newsArray.slice(0, 3).map((a: any) => ({
              title: a.title || a.headline || 'Breaking news',
              source: a.source?.name || a.source || 'News'
            }))
          : [
              { title: 'Markets react to global economic shifts', source: 'Reuters' },
              { title: 'Tech sector leads S&P 500 gains', source: 'Bloomberg' },
              { title: 'Central banks signal rate decisions', source: 'FT' },
            ]

        // Weather from Open-Meteo (Baku coordinates)
        let weather = { temp: '—', condition: 'Loading...', city: 'Baku' }
        if (weatherRes.status === 'fulfilled') {
          const wData = await weatherRes.value.json()
          const temp = wData?.current?.temperature_2m
          const code = wData?.current?.weather_code
          const conditionMap: Record<number, string> = {
            0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
            45: 'Foggy', 48: 'Rime Fog', 51: 'Light Drizzle', 53: 'Drizzle',
            55: 'Heavy Drizzle', 61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
            71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow', 80: 'Rain Showers',
            95: 'Thunderstorm', 96: 'Thunderstorm + Hail'
          }
          weather = {
            temp: temp != null ? `${Math.round(temp)}°C` : '—',
            condition: conditionMap[code] || 'Unknown',
            city: 'Baku'
          }
        }

        // Trending
        let trending = ['AI Agents', 'Bitcoin ETF', 'NVIDIA', 'Fed Rate Decision']
        if (trendingRes.status === 'fulfilled') {
          try {
            const tData = await trendingRes.value.json()
            if (Array.isArray(tData) && tData.length > 0) {
              trending = tData.slice(0, 6).map((t: any) => t.title || t.name || t.query || t)
            }
          } catch {}
        }

        // AI & Tech Radar — top AI/tech items from the Horizon briefing
        let aiRadar: BriefData['aiRadar'] = []
        if (horizonRes.status === 'fulfilled') {
          try {
            const hData = await horizonRes.value.json()
            const hItems = Array.isArray(hData?.items) ? hData.items : []
            aiRadar = hItems
              .filter((it: any) => Array.isArray(it.tags) && it.tags.some((t: string) => /ai|tech/i.test(t)))
              .slice(0, 3)
              .map((it: any) => ({ title: it.title, url: it.url, source: it.source }))
          } catch {}
        }

        // Greeting
        const hour = new Date().getHours()
        let greeting = COPY.morning[lang] || COPY.morning.en
        if (hour >= 12 && hour < 17) greeting = COPY.afternoon[lang] || COPY.afternoon.en
        else if (hour >= 17) greeting = COPY.evening[lang] || COPY.evening.en

        setData({
          greeting,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          topNews,
          cryptoMovers: movers,
          weather,
          trending,
          aiRadar,
        })
      } catch (e) {
        setData({
          greeting: COPY.morning[lang] || COPY.morning.en,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          topNews: [
            { title: 'Markets open higher on tech earnings', source: 'Bloomberg' },
            { title: 'Crypto markets show strong momentum', source: 'CoinDesk' },
            { title: 'Global outlook remains cautiously optimistic', source: 'Reuters' },
          ],
          cryptoMovers: [
            { name: 'Bitcoin', symbol: 'BTC', change: 2.4, price: '$96,500' },
            { name: 'Ethereum', symbol: 'ETH', change: -1.2, price: '$3,450' },
            { name: 'Solana', symbol: 'SOL', change: 5.7, price: '$178' },
          ],
          weather: { temp: '22°C', condition: 'Partly Cloudy', city: 'Baku' },
          trending: ['AI Agents', 'Bitcoin ETF', 'NVIDIA', 'Fed Rate'],
          aiRadar: [],
        })
      } finally {
        setLoading(false)
      }
    }
    fetchBrief()
  }, [])

  if (loading) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-indigo-500/[0.08] to-purple-500/[0.05] border border-white/[0.06] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-white/[0.06] rounded-lg" />
          <div className="h-4 w-32 bg-white/[0.04] rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div className="h-32 bg-white/[0.04] rounded-xl" />
            <div className="h-32 bg-white/[0.04] rounded-xl" />
            <div className="h-32 bg-white/[0.04] rounded-xl" />
            <div className="h-32 bg-white/[0.04] rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const c = (key: string) => COPY[key]?.[lang] || COPY[key]?.en || key

  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-500/[0.08] to-purple-500/[0.05] border border-white/[0.06] p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            {data.greeting} ☀️
          </h2>
          <p className="text-sm text-[#6b6b80] mt-0.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {data.time} • {c('brief')} • {c('minRead')}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
          <Cloud className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs text-[#a0a0b0]">{data.weather.city} {data.weather.temp} · {data.weather.condition}</span>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Top News */}
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-4">
          <h3 className="text-xs font-semibold text-[#6b6b80] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Newspaper className="w-3.5 h-3.5" /> {c('topStories')}
          </h3>
          <div className="space-y-3">
            {data.topNews.map((news, i) => (
              <div key={i}>
                <p className="text-sm text-[#d0d0e0] leading-snug">{news.title}</p>
                <p className="text-[11px] text-[#5b5b70] mt-0.5">{news.source}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Crypto Movers */}
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-4">
          <h3 className="text-xs font-semibold text-[#6b6b80] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> {c('cryptoMovers')}
          </h3>
          <div className="space-y-2.5">
            {data.cryptoMovers.map((coin, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-white font-medium">{coin.symbol}</span>
                  <span className="text-[11px] text-[#5b5b70] ml-1.5">{coin.price}</span>
                </div>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${coin.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {coin.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI & Tech Radar */}
        {data.aiRadar.length > 0 && (
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-4">
            <h3 className="text-xs font-semibold text-[#6b6b80] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> {c('aiRadar')}
            </h3>
            <div className="space-y-3">
              {data.aiRadar.map((item, i) => (
                <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="block group">
                  <p className="text-sm text-[#d0d0e0] leading-snug group-hover:text-white transition-colors">{item.title}</p>
                  <p className="text-[11px] text-[#5b5b70] mt-0.5">{item.source}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Trending */}
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-4">
          <h3 className="text-xs font-semibold text-[#6b6b80] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> {c('trending')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.trending.map((topic, i) => (
              <span key={i} className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-[#a0a0b0]">
                #{typeof topic === 'string' ? topic : 'Trending'}
              </span>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.04]">
            <p className="text-[11px] text-[#5b5b70]">💡 {c('tip')} <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-[10px]">⌘K</kbd> {c('quickSearch')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
