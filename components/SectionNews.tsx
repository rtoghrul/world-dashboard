'use client'
import { useEffect, useState } from 'react'
import { useLang } from '@/lib/LanguageContext'
import { Newspaper, RefreshCw, X, ExternalLink } from 'lucide-react'

interface NewsItem {
  title: string
  link: string
  source: string
  pubDate: string
  thumbnail: string
  description: string
}

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'Latest News', az: 'Son Xəbərlər', ru: 'Последние новости', de: 'Aktuelle Nachrichten', tr: 'Son Haberler', fr: 'Dernières nouvelles', es: 'Últimas noticias', it: 'Ultime notizie', pt: 'Últimas notícias', zh: '最新新闻', ar: 'آخر الأخبار', ja: '最新ニュース' },
  loading: { en: 'Loading news...', az: 'Xəbərlər yüklənir...', ru: 'Загрузка...', de: 'Laden...', tr: 'Yükleniyor...', fr: 'Chargement...', es: 'Cargando...', it: 'Caricamento...', pt: 'Carregando...', zh: '加载中...', ar: 'جار التحميل...', ja: '読み込み中...' },
  empty: { en: 'No news right now', az: 'Hazırda xəbər yoxdur', ru: 'Новостей нет', de: 'Keine Nachrichten', tr: 'Haber yok', fr: 'Pas de nouvelles', es: 'Sin noticias', it: 'Nessuna notizia', pt: 'Sem notícias', zh: '暂无新闻', ar: 'لا أخبار', ja: 'ニュースなし' },
  read: { en: 'Read full article', az: 'Tam oxu (mənbədə)', ru: 'Читать полностью', de: 'Vollständig lesen', tr: 'Tam oku', fr: "Lire l\u2019article", es: 'Leer art\u00edculo', it: 'Leggi articolo', pt: 'Ler artigo', zh: '\u9605\u8bfb\u5168\u6587', ar: '\u0627\u0642\u0631\u0623 \u0627\u0644\u0645\u0642\u0627\u0644', ja: '\u5168\u6587\u3092\u8aad\u3080' },
}

interface Props {
  section: string
  tab: string
  accentColor?: string
  destination?: string
  darkMode?: boolean
}

export default function SectionNews({ section, tab, accentColor = 'blue', destination, darkMode = false }: Props) {
  const { lang } = useLang()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [modal, setModal] = useState<NewsItem | null>(null)
  const t = (k: string) => COPY[k]?.[lang] || COPY[k]?.en || k

  const fetchNews = () => {
    setLoading(true)
    setError(false)
    const params = new URLSearchParams({ section, tab, lang })
    if (destination) params.set('destination', destination)
    fetch(`/api/section-news?${params.toString()}`)
      .then(r => r.json())
      .then(data => { setNews(data.items || []); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }

  useEffect(() => { fetchNews() }, [section, tab, lang, destination])

  useEffect(() => {
    if (!modal) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setModal(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [modal])

  const borderColor = darkMode ? 'border-gray-700/50' : 'border-gray-200 dark:border-gray-700'

  if (loading) {
    return (
      <div className={`mt-6 pt-4 border-t ${borderColor}`}>
        <div className="flex items-center gap-2 mb-3 px-1">
          <Newspaper className="w-4 h-4 text-gray-400 animate-pulse" />
          <span className="text-sm text-gray-400 animate-pulse">{t('loading')}</span>
        </div>
        <div className="divide-y divide-gray-800/30">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3 py-3 px-1">
              <div className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4" />
                <div className="h-2.5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || news.length === 0) {
    return (
      <div className={`mt-6 pt-4 border-t ${borderColor}`}>
        <div className="flex items-center justify-between px-1">
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
    <>
      <div className={`mt-6 pt-4 border-t ${borderColor}`}>
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <Newspaper className={`w-4 h-4 text-${accentColor}-500`} />
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'}`}>{t('title')}</h3>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">{news.length}</span>
          </div>
          <button onClick={fetchNews} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Refresh">
            <RefreshCw className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
        <div className={`divide-y ${darkMode ? 'divide-gray-800/50' : 'divide-gray-100 dark:divide-gray-800/50'}`}>
          {news.map((item, i) => (
            <SectionNewsCard key={i} item={item} darkMode={darkMode} onOpen={() => setModal(item)} />
          ))}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            {modal.thumbnail && (
              <img src={modal.thumbnail} alt="" className="w-full h-44 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            )}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="text-white font-semibold text-sm leading-snug">{modal.title}</h2>
                <button onClick={() => setModal(null)} className="text-gray-500 hover:text-white transition flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">{modal.description || '\u2014'}</p>
              <div className="flex items-center gap-2 text-gray-600 text-xs mb-4">
                <span>{modal.source}</span>
                {modal.pubDate && (
                  <>
                    <span>\u00b7</span>
                    <span>{new Date(modal.pubDate).toLocaleDateString()}</span>
                  </>
                )}
              </div>
              <a href={modal.link} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 transition rounded-xl text-white text-xs font-medium">
                <ExternalLink className="w-3.5 h-3.5" />
                {t('read')}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function SectionNewsCard({ item, darkMode, onOpen }: { item: NewsItem; darkMode: boolean; onOpen: () => void }) {
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <button onClick={onOpen} className={`w-full text-left flex gap-3 px-1 py-3 transition group ${darkMode ? 'hover:bg-gray-800/40' : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'}`}>
      {item.thumbnail && !imgFailed ? (
        <img src={item.thumbnail} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-gray-800" onError={() => setImgFailed(true)} />
      ) : (
        <div className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center flex-shrink-0 ${darkMode ? 'bg-gray-800 border border-gray-700/70' : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/70'}`}>
          <span className="text-indigo-400 text-lg font-bold leading-none">{item.source?.trim()?.charAt(0)?.toUpperCase() || 'N'}</span>
          <span className="text-gray-500 text-[8px] mt-0.5">NEWS</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className={`text-xs font-medium line-clamp-2 transition ${darkMode ? 'text-white group-hover:text-indigo-300' : 'text-gray-800 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-300'}`}>{item.title}</h3>
        {item.description && <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{item.description}</p>}
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400 dark:text-gray-600'}`}>{item.source}</span>
          {item.pubDate && (
            <>
              <span className="text-gray-400 dark:text-gray-700 text-xs">\u00b7</span>
              <span className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400 dark:text-gray-600'}`}>{new Date(item.pubDate).toLocaleDateString()}</span>
            </>
          )}
        </div>
      </div>
    </button>
  )
}
