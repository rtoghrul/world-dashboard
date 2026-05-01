'use client'
import { useState, useEffect } from 'react'
import { Sparkles, Clock, TrendingUp, TrendingDown, Newspaper, Cloud, Zap } from 'lucide-react'

interface BriefData {
  greeting: string
  time: string
  topNews: { title: string; source: string }[]
  cryptoMovers: { name: string; symbol: string; change: number; price: string }[]
  weather: { temp: string; condition: string; city: string }
  trending: string[]
}

export default function DailyBrief() {
  const [data, setData] = useState<BriefData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBrief() {
      try {
        const [cryptoRes, newsRes, weatherRes, trendingRes] = await Promise.allSettled([
          fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&sparkline=false&price_change_percentage=24h'),
          fetch('/api/news?category=top'),
          fetch('https://api.open-meteo.com/v1/forecast?latitude=40.41&longitude=49.87&current=temperature_2m,weather_code&timezone=auto'),
          fetch('/api/trending')
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

        // Greeting
        const hour = new Date().getHours()
        let greeting = 'Good morning'
        if (hour >= 12 && hour < 17) greeting = 'Good afternoon'
        else if (hour >= 17) greeting = 'Good evening'

        setData({
          greeting,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          topNews,
          cryptoMovers: movers,
          weather,
          trending,
        })
      } catch (e) {
        setData({
          greeting: 'Good morning',
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="h-32 bg-white/[0.04] rounded-xl" />
            <div className="h-32 bg-white/[0.04] rounded-xl" />
            <div className="h-32 bg-white/[0.04] rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

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
            {data.time} • Your daily brief • ~1 min read
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
          <Cloud className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs text-[#a0a0b0]">{data.weather.city} {data.weather.temp} · {data.weather.condition}</span>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top News */}
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-4">
          <h3 className="text-xs font-semibold text-[#6b6b80] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Newspaper className="w-3.5 h-3.5" /> Top Stories
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
            <Zap className="w-3.5 h-3.5" /> Crypto Movers
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

        {/* Trending */}
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-4">
          <h3 className="text-xs font-semibold text-[#6b6b80] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Trending
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.trending.map((topic, i) => (
              <span key={i} className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-[#a0a0b0]">
                #{typeof topic === 'string' ? topic : 'Trending'}
              </span>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.04]">
            <p className="text-[11px] text-[#5b5b70]">💡 Tip: Press <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-[10px]">⌘K</kbd> for quick search</p>
          </div>
        </div>
      </div>
    </div>
  )
}
