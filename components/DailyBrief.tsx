'use client'
import { useState, useEffect } from 'react'
import { Sparkles, Clock, TrendingUp, TrendingDown, Newspaper, Cloud, Zap, Cpu, AlertTriangle, RefreshCw } from 'lucide-react'
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

const EXTRA: Record<string, Record<string, string>> = {
  unavailable: { en: 'Not available right now', az: 'Hazırda əlçatan deyil', ru: 'Сейчас недоступно', tr: 'Şu anda kullanılamıyor', de: 'Derzeit nicht verfügbar', fr: 'Indisponible pour le moment', es: 'No disponible ahora', zh: '暂时不可用', ar: 'غير متاح حالياً', ja: '現在利用できません', it: 'Non disponibile al momento', pt: 'Indisponível no momento' },
  failed: { en: 'Couldn’t load your daily brief.', az: 'Günlük icmal yüklənmədi.', ru: 'Не удалось загрузить дайджест.', tr: 'Günlük özet yüklenemedi.', de: 'Tagesbriefing konnte nicht geladen werden.', fr: 'Impossible de charger votre résumé.', es: 'No se pudo cargar tu resumen.', zh: '无法加载每日简报。', ar: 'تعذر تحميل ملخصك اليومي.', ja: 'デイリーブリーフを読み込めませんでした。', it: 'Impossibile caricare il riassunto.', pt: 'Não foi possível carregar o resumo.' },
  retry: { en: 'Try again', az: 'Yenidən cəhd et', ru: 'Повторить', tr: 'Tekrar dene', de: 'Erneut versuchen', fr: 'Réessayer', es: 'Reintentar', zh: '重试', ar: 'أعد المحاولة', ja: '再試行', it: 'Riprova', pt: 'Tentar novamente' },
  baku: { en: 'Baku', az: 'Bakı', ru: 'Баку', tr: 'Bakü', de: 'Baku', fr: 'Bakou', es: 'Bakú', zh: '巴库', ar: 'باكو', ja: 'バクー', it: 'Baku', pt: 'Baku' },
}

// Open-Meteo WMO weather codes → translation keys in lib/translations.ts
function weatherKey(code: number | undefined): string | null {
  if (code == null) return null
  if (code === 0) return 'weatherClear'
  if (code === 1) return 'weatherMostlyClear'
  if (code === 2) return 'weatherPartlyCloudy'
  if (code === 3) return 'weatherOvercast'
  if (code === 45 || code === 48) return 'weatherFoggy'
  if (code >= 51 && code <= 57) return 'weatherDrizzle'
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'weatherRain'
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'weatherSnow'
  if (code >= 95) return 'weatherThunderstorm'
  return null
}

const TIMEOUT_MS = 10000

/** Fetch JSON with a timeout; resolves to null on any network/HTTP/parse failure. */
async function getJSON<T = unknown>(url: string): Promise<T | null> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, { signal: ctrl.signal })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

interface BriefData {
  // Each section is null when its source failed, so we can show an honest empty state.
  topNews: { title: string; source: string; link?: string }[] | null
  cryptoMovers: { symbol: string; change: number; price: number }[] | null
  weather: { temp: number; code?: number } | null
  trending: string[] | null
  aiRadar: { title: string; url: string; source: string }[]
}

function greetingKey(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours()
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 || hour < 4) return 'evening'
  return 'morning'
}

export default function DailyBrief() {
  const { lang, tr } = useLang()
  const [data, setData] = useState<BriefData | null>(null)
  const [loading, setLoading] = useState(true)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function fetchBrief() {
      setLoading(true)
      const [cryptoData, newsData, wData, tData, hData] = await Promise.all([
        getJSON<any[]>('/api/crypto?per_page=5'),
        getJSON<any>('/api/news?category=top'),
        getJSON<any>('https://api.open-meteo.com/v1/forecast?latitude=40.41&longitude=49.87&current=temperature_2m,weather_code&timezone=auto'),
        getJSON<any[]>('/api/trending'),
        getJSON<any>('/api/horizon'),
      ])

      const movers = Array.isArray(cryptoData) && cryptoData.length > 0
        ? cryptoData.slice(0, 4).map((c: any) => ({
            symbol: String(c.symbol || '').toUpperCase(),
            change: Number(c.price_change_percentage_24h) || 0,
            price: Number(c.current_price) || 0,
          }))
        : null

      // /api/news returns an array directly, not { articles: [] }
      const newsArray = Array.isArray(newsData) ? newsData : (Array.isArray(newsData?.articles) ? newsData.articles : [])
      const topNews = newsArray.length > 0
        ? newsArray.filter((a: any) => a?.title || a?.headline).slice(0, 3).map((a: any) => ({
            title: a.title || a.headline,
            source: typeof a.source === 'string' ? a.source : a.source?.name || '',
            link: a.link || a.url,
          }))
        : null

      const temp = wData?.current?.temperature_2m
      const weather = typeof temp === 'number' ? { temp, code: wData?.current?.weather_code } : null

      const trendingList = Array.isArray(tData)
        ? tData.map((t: any) => (typeof t === 'string' ? t : t?.title || t?.name || t?.query)).filter((t: unknown): t is string => typeof t === 'string' && t.length > 0).slice(0, 6)
        : []
      const trending = trendingList.length > 0 ? trendingList : null

      const hItems = Array.isArray(hData?.items) ? hData.items : []
      const aiRadar = hItems
        .filter((it: any) => Array.isArray(it.tags) && it.tags.some((t: string) => /ai|tech/i.test(t)))
        .slice(0, 3)
        .map((it: any) => ({ title: it.title, url: it.url, source: it.source }))

      if (!cancelled) {
        setData({ topNews, cryptoMovers: movers, weather, trending, aiRadar })
        setLoading(false)
      }
    }
    fetchBrief()
    return () => { cancelled = true }
  }, [attempt])

  const c = (key: string) => COPY[key]?.[lang] || EXTRA[key]?.[lang] || COPY[key]?.en || EXTRA[key]?.en || key

  if (loading) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-indigo-500/[0.08] to-purple-500/[0.05] border border-line p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-fg/[0.06] rounded-lg" />
          <div className="h-4 w-32 bg-fg/[0.04] rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div className="h-32 bg-fg/[0.04] rounded-xl" />
            <div className="h-32 bg-fg/[0.04] rounded-xl" />
            <div className="h-32 bg-fg/[0.04] rounded-xl" />
            <div className="h-32 bg-fg/[0.04] rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  const allFailed = !data || (!data.topNews && !data.cryptoMovers && !data.weather && !data.trending && data.aiRadar.length === 0)
  if (allFailed) {
    return (
      <div role="status" className="rounded-2xl bg-gradient-to-br from-indigo-500/[0.08] to-purple-500/[0.05] border border-line p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-ink-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" /> {c('failed')}
        </p>
        <button
          type="button"
          onClick={() => setAttempt(a => a + 1)}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-lg bg-fg/[0.06] border border-line-strong text-xs text-ink-1 hover:bg-fg/[0.1] transition"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" /> {c('retry')}
        </button>
      </div>
    )
  }

  const locale = lang === 'zh' ? 'zh-CN' : lang
  const time = new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
  const fmtPrice = (n: number) => `$${n.toLocaleString(locale, { maximumFractionDigits: n < 1 ? 4 : 2 })}`
  const wKey = data.weather ? weatherKey(data.weather.code) : null
  const unavailable = <p className="text-xs text-ink-4">{c('unavailable')}</p>

  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-500/[0.08] to-purple-500/[0.05] border border-line p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-ink-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            {c(greetingKey())}
          </h2>
          <p className="text-sm text-ink-4 mt-0.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {time} • {c('brief')} • {c('minRead')}
          </p>
        </div>
        {data.weather && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-fg/[0.04] border border-line">
            <Cloud className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
            <span className="text-xs text-ink-3">{c('baku')} {Math.round(data.weather.temp)}°C{wKey && tr[wKey] ? ` · ${tr[wKey]}` : ''}</span>
          </div>
        )}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Top News */}
        <div className="rounded-xl bg-fg/[0.03] border border-line p-4">
          <h3 className="text-xs font-semibold text-ink-4 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Newspaper className="w-3.5 h-3.5" /> {c('topStories')}
          </h3>
          {data.topNews ? (
            <div className="space-y-3">
              {data.topNews.map((news, i) => {
                const body = (
                  <>
                    <p className="text-sm text-ink-2 leading-snug group-hover:text-ink-1 transition-colors">{news.title}</p>
                    {news.source && <p className="text-[11px] text-ink-3 mt-0.5">{news.source}</p>}
                  </>
                )
                return news.link
                  ? <a key={i} href={news.link} target="_blank" rel="noopener noreferrer" className="block group">{body}</a>
                  : <div key={i}>{body}</div>
              })}
            </div>
          ) : unavailable}
        </div>

        {/* Crypto Movers */}
        <div className="rounded-xl bg-fg/[0.03] border border-line p-4">
          <h3 className="text-xs font-semibold text-ink-4 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> {c('cryptoMovers')}
          </h3>
          {data.cryptoMovers ? (
          <div className="space-y-2.5">
            {data.cryptoMovers.map((coin, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-ink-1 font-medium">{coin.symbol}</span>
                  <span className="text-[11px] text-ink-3 ml-1.5">{fmtPrice(coin.price)}</span>
                </div>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${coin.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {coin.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
          ) : unavailable}
        </div>

        {/* AI & Tech Radar */}
        {data.aiRadar.length > 0 && (
          <div className="rounded-xl bg-fg/[0.03] border border-line p-4">
            <h3 className="text-xs font-semibold text-ink-4 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> {c('aiRadar')}
            </h3>
            <div className="space-y-3">
              {data.aiRadar.map((item, i) => (
                <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="block group">
                  <p className="text-sm text-ink-2 leading-snug group-hover:text-ink-1 transition-colors">{item.title}</p>
                  <p className="text-[11px] text-ink-3 mt-0.5">{item.source}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Trending */}
        <div className="rounded-xl bg-fg/[0.03] border border-line p-4">
          <h3 className="text-xs font-semibold text-ink-4 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> {c('trending')}
          </h3>
          {data.trending ? (
            <div className="flex flex-wrap gap-2">
              {data.trending.map((topic, i) => (
                <span key={i} className="px-2.5 py-1.5 rounded-lg bg-fg/[0.04] border border-line text-xs text-ink-3">
                  #{topic}
                </span>
              ))}
            </div>
          ) : unavailable}
          <div className="mt-4 pt-3 border-t border-line">
            <p className="text-[11px] text-ink-3">💡 {c('tip')} <kbd className="px-1 py-0.5 rounded bg-fg/[0.06] text-[10px]">⌘K</kbd> {c('quickSearch')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
