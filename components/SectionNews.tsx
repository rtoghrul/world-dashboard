'use client'
import { useEffect, useState } from 'react'
import { useLang } from '@/lib/LanguageContext'
import { Newspaper, ExternalLink, Clock, RefreshCw } from 'lucide-react'

interface NewsItem {
  title: string
  link: string
  source: string
  pubDate: string
}

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'Latest News', az: 'Son Xəbərlər', ru: 'Последние новости', de: 'Aktuelle Nachrichten', tr: 'Son Haberler' },
  loading: { en: 'Loading news...', az: 'Xəbərlər yüklənir...', ru: 'Загрузка новостей...', de: 'Nachrichten laden...', tr: 'Haberler yükleniyor...' },
  empty: { en: 'No news available right now', az: 'Hazırda xəbər yoxdur', ru: 'Новостей пока нет', de: 'Keine Nachrichten verfügbar', tr: 'Şu an haber yok' },
  ago: { en: 'ago', az: 'əvvəl', ru: 'назад', de: 'her', tr: 'önce' },
  h: { en: 'h', az: 'saat', ru: 'ч', de: 'Std', tr: 'sa' },
  m: { en: 'm', az: 'dəq', ru: 'мин', de: 'Min', tr: 'dk' },
  today: { en: 'Today', az: 'Bu gün', ru: 'Сегодня', de: 'Heute', tr: 'Bugün' },
}

function timeAgo(dateStr: string, lang: string): string {
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffH = Math.floor(diffMs / (1000 * 60 * 60))
    const diffM = Math.floor(diffMs / (1000 * 60))

    if (diffH < 1) return `${diffM}${COPY.m[lang] || COPY.m.en} ${COPY.ago[lang] || COPY.ago.en}`
    if (diffH < 24) return `${diffH}${COPY.h[lang] || COPY.h.en} ${COPY.ago[lang] || COPY.ago.en}`
    return COPY.today[lang] || COPY.today.en
  } catch {
    return ''
  }
}

interface Props {
  section: string
  tab: string
  accentColor?: string // tailwind color class like 'yellow' or 'red'
}

export default function SectionNews({ section, tab, accentColor = 'blue' }: Props) {
  const { lang } = useLang()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const t = (k: string) => COPY[k]?.[lang] || COPY[k]?.en || k

  const fetchNews = () => {
    setLoading(true)
    setError(false)
    fetch(`/api/section-news?section=${section}&tab=${tab}`)
      .then(r => r.json())
      .then(data => {
        setNews(data.items || [])
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchNews()
  }, [section, tab])

  if (loading) {
    return (
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Newspaper className="w-4 h-4 text-gray-400 animate-pulse" />
          <span className="text-sm text-gray-400 animate-pulse">{t('loading')}</span>
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error || news.length === 0) {
    return (
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">{t('empty')}</span>
          </div>
          <button onClick={fetchNews} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Newspaper className={`w-4 h-4 text-${accentColor}-500`} />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('title')}</h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">{news.length}</span>
        </div>
        <button onClick={fetchNews} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Refresh">
          <RefreshCw className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
        </button>
      </div>
      <div className="space-y-1.5">
        {news.map((item, i) => (
          <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
            className={`group flex items-start gap-2 p-2 rounded-lg hover:bg-${accentColor}-50 dark:hover:bg-${accentColor}-900/10 transition-colors`}>
            <span className={`shrink-0 w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold bg-${accentColor}-100 dark:bg-${accentColor}-900/30 text-${accentColor}-600 dark:text-${accentColor}-400 mt-0.5`}>
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white line-clamp-2 leading-relaxed">
                {item.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {item.source && <span className="text-[10px] text-gray-400 font-medium">{item.source}</span>}
                {item.pubDate && (
                  <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                    <Clock className="w-2.5 h-2.5" />
                    {timeAgo(item.pubDate, lang)}
                  </span>
                )}
              </div>
            </div>
            <ExternalLink className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
          </a>
        ))}
      </div>
    </div>
  )
}
