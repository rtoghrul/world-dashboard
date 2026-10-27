'use client'
import { useState, useEffect } from 'react'
import { TrendingUp, Flame, Hash, ExternalLink, RefreshCw } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

interface TrendItem {
  title: string
  source: 'google' | 'reddit' | 'twitter'
  volume?: string
  url?: string
}

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'Trending Now', az: 'İndi Trend', ru: 'В тренде', de: 'Jetzt im Trend', tr: 'Şu An Trend', fr: 'Tendances', es: 'Tendencias', it: 'Di tendenza', pt: 'Em alta', zh: '热门趋势', ar: 'الرائج الآن', ja: 'トレンド' },
}

export default function TrendingWidget() {
  const { lang } = useLang()
  const c = (k: string) => COPY[k]?.[lang] || COPY[k]?.en || k
  const [trends, setTrends] = useState<TrendItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTrends = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/trending?lang=${lang}`)
      const data = await res.json()
      if (Array.isArray(data)) setTrends(data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchTrends() }, [lang])

  const sourceColors = {
    google: 'text-blue-400 bg-blue-400/10',
    reddit: 'text-orange-400 bg-orange-400/10',
    twitter: 'text-sky-400 bg-sky-400/10',
  }

  const sourceLabels = { google: 'Google', reddit: 'Reddit', twitter: '𝕏' }

  return (
    <div className="rounded-xl border border-line bg-surface-1/80 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <h3 className="text-ink-1 font-semibold text-sm">{c('title')}</h3>
          <span className="live-dot" />
        </div>
        <button onClick={fetchTrends} className="p-1.5 rounded-md hover:bg-fg/[0.05] text-ink-4 hover:text-ink-1 transition">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && trends.length === 0 ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center gap-2 animate-pulse">
              <div className="w-5 h-5 bg-fg/[0.03] rounded" />
              <div className="flex-1 h-3 bg-fg/[0.03] rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1.5 max-h-[280px] overflow-y-auto scrollbar-hide">
          {trends.slice(0, 10).map((t, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-fg/[0.03] transition group">
              <span className="text-[10px] text-ink-4 font-mono w-4">{i + 1}</span>
              <Hash className="w-3 h-3 text-ink-4" />
              <span className="text-ink-1 text-xs flex-1 truncate">{t.title}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${sourceColors[t.source]}`}>
                {sourceLabels[t.source]}
              </span>
              {t.volume && <span className="text-[10px] text-ink-4">{t.volume}</span>}
              {t.url && (
                <a href={t.url} target="_blank" rel="noopener" className="opacity-0 group-hover:opacity-100 transition">
                  <ExternalLink className="w-3 h-3 text-ink-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
