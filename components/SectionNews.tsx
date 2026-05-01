'use client'
import { useEffect, useState } from 'react'
import { useLang } from '@/lib/LanguageContext'
import { Newspaper, ExternalLink, Clock, RefreshCw } from 'lucide-react'

interface NewsItem {
  title: string
  link: string
  source: string
  pubDate: string
  image: string
}

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'Latest News', az: 'Son Xəbərlər', ru: 'Последние новости', de: 'Aktuelle Nachrichten', tr: 'Son Haberler', fr: 'Dernières nouvelles', es: 'Últimas noticias', it: 'Ultime notizie', pt: 'Últimas notícias', zh: '最新新闻', ar: 'آخر الأخبار', ja: '最新ニュース' },
  loading: { en: 'Loading news...', az: 'Xəbərlər yüklənir...', ru: 'Загрузка...', de: 'Laden...', tr: 'Yükleniyor...', fr: 'Chargement...', es: 'Cargando...', it: 'Caricamento...', pt: 'Carregando...', zh: '加载中...', ar: 'جار التحميل...', ja: '読み込み中...' },
  empty: { en: 'No news right now', az: 'Hazırda xəbər yoxdur', ru: 'Новостей нет', de: 'Keine Nachrichten', tr: 'Haber yok', fr: 'Pas de nouvelles', es: 'Sin noticias', it: 'Nessuna notizia', pt: 'Sem notícias', zh: '暂无新闻', ar: 'لا أخبار', ja: 'ニュースなし' },
  ago: { en: 'ago', az: 'əvvəl', ru: 'назад', de: 'her', tr: 'önce', fr: 'il y a', es: 'hace', it: 'fa', pt: 'atrás', zh: '前', ar: 'منذ', ja: '前' },
  h: { en: 'h', az: 'st', ru: 'ч', de: 'Std', tr: 'sa', fr: 'h', es: 'h', it: 'h', pt: 'h', zh: '时', ar: 'س', ja: '時間' },
  m: { en: 'm', az: 'd', ru: 'мин', de: 'Min', tr: 'dk', fr: 'min', es: 'min', it: 'min', pt: 'min', zh: '分', ar: 'د', ja: '分' },
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
    return `1d ${COPY.ago[lang] || COPY.ago.en}`
  } catch { return '' }
}

// Generate a gradient placeholder for items without images
const GRADIENTS = [
  'from-blue-600 to-indigo-700',
  'from-emerald-600 to-teal-700',
  'from-orange-500 to-red-600',
  'from-purple-600 to-pink-600',
  'from-cyan-600 to-blue-700',
  'from-rose-500 to-pink-700',
  'from-amber-500 to-orange-600',
  'from-violet-600 to-purple-700',
  'from-teal-500 to-emerald-700',
  'from-fuchsia-500 to-purple-700',
]

interface Props {
  section: string
  tab: string
  accentColor?: string
  destination?: string // for travel section
  darkMode?: boolean
}

export default function SectionNews({ section, tab, accentColor = 'blue', destination, darkMode = false }: Props) {
  const { lang } = useLang()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set())
  const t = (k: string) => COPY[k]?.[lang] || COPY[k]?.en || k

  const fetchNews = () => {
    setLoading(true)
    setError(false)
    setImgErrors(new Set())
    const params = new URLSearchParams({ section, tab, lang })
    if (destination) params.set('destination', destination)
    fetch(`/api/section-news?${params.toString()}`)
      .then(r => r.json())
      .then(data => { setNews(data.items || []); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }

  useEffect(() => { fetchNews() }, [section, tab, lang, destination])

  const borderColor = darkMode ? 'border-gray-700/50' : 'border-gray-200 dark:border-gray-700'

  if (loading) {
    return (
      <div className={`mt-6 pt-4 border-t ${borderColor}`}>
        <div className="flex items-center gap-2 mb-3">
          <Newspaper className="w-4 h-4 text-gray-400 animate-pulse" />
          <span className="text-sm text-gray-400 animate-pulse">{t('loading')}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse aspect-[4/3]" />
          ))}
        </div>
      </div>
    )
  }

  if (error || news.length === 0) {
    return (
      <div className={`mt-6 pt-4 border-t ${borderColor}`}>
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
    <div className={`mt-6 pt-4 border-t ${borderColor}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Newspaper className={`w-4 h-4 text-${accentColor}-500`} />
          <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'}`}>{t('title')}</h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">{news.length}</span>
        </div>
        <button onClick={fetchNews} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Refresh">
          <RefreshCw className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {news.map((item, i) => (
          <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
            className="group relative flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:shadow-lg hover:-translate-y-0.5">
            {/* Image or gradient placeholder */}
            <div className="relative aspect-[16/10] overflow-hidden">
              {item.image && !imgErrors.has(i) ? (
                <img
                  src={item.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => setImgErrors(prev => new Set([...prev, i]))}
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} flex items-center justify-center`}>
                  <span className="text-white/90 text-lg font-bold">{i + 1}</span>
                </div>
              )}
              {/* Source badge */}
              {item.source && (
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-[9px] text-white font-medium backdrop-blur-sm truncate max-w-[90%]">
                  {item.source}
                </span>
              )}
              {/* Time badge */}
              {item.pubDate && (
                <span className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/60 text-[9px] text-white backdrop-blur-sm">
                  <Clock className="w-2 h-2" />
                  {timeAgo(item.pubDate, lang)}
                </span>
              )}
            </div>
            {/* Title */}
            <div className={`p-2 flex-1 ${darkMode ? 'bg-gray-800/80' : 'bg-white dark:bg-gray-800/80'}`}>
              <p className={`text-[11px] font-medium leading-tight line-clamp-3 ${darkMode ? 'text-gray-200 group-hover:text-white' : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                {item.title}
              </p>
            </div>
            {/* Hover indicator */}
            <ExternalLink className="absolute top-1.5 right-1.5 w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
          </a>
        ))}
      </div>
    </div>
  )
}
