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
  loading: { en: 'Loading news...', az: 'Yüklənir...', ru: 'Загрузка...', de: 'Laden...', tr: 'Yükleniyor...', fr: 'Chargement...', es: 'Cargando...', it: 'Caricamento...', pt: 'Carregando...', zh: '加载中...', ar: 'جار التحميل...', ja: '読み込み中...' },
  empty: { en: 'No news', az: 'Xəbər yoxdur', ru: 'Новостей нет', de: 'Keine Nachrichten', tr: 'Haber yok', fr: 'Pas de nouvelles', es: 'Sin noticias', it: 'Nessuna notizia', pt: 'Sem notícias', zh: '暂无新闻', ar: 'لا أخبار', ja: 'ニュースなし' },
  read: { en: 'Read full article', az: 'Tam oxu', ru: 'Читать', de: 'Lesen', tr: 'Oku', fr: 'Lire', es: 'Leer', it: 'Leggi', pt: 'Ler', zh: '阅读', ar: 'اقرأ', ja: '読む' },
}

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace('www.', '') } catch { return '' }
}

function faviconUrl(link: string): string {
  const domain = getDomain(link)
  if (!domain) return ''
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
}

function timeAgo(dateStr: string, lang: string): string {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return lang === 'az' ? 'indi' : 'now'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

interface Props {
  section: string
  tab: string
  accentColor?: string
  destination?: string
  darkMode?: boolean
  country?: string
}

export default function SectionNews({ section, tab, accentColor = 'blue', destination, darkMode = false, country }: Props) {
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
    if (country) params.set('country', country)
    fetch(`/api/section-news?${params.toString()}`)
      .then(r => r.json())
      .then(data => { setNews(data.items || []); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }

  useEffect(() => { fetchNews() }, [section, tab, lang, destination, country])

  useEffect(() => {
    if (!modal) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setModal(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [modal])

  if (loading) {
    return (
      <div className="mt-5 pt-4 border-t border-gray-800/50">
        <div className="flex items-center gap-2 mb-3">
          <Newspaper className="w-3.5 h-3.5 text-gray-500 animate-pulse" />
          <span className="text-xs text-gray-500 animate-pulse">{t('loading')}</span>
        </div>
        <div className="space-y-2">
          {[1,2,3].map(i => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-12 h-12 rounded bg-gray-800 flex-shrink-0" />
              <div className="flex-1 space-y-1.5 py-1"><div className="h-3 bg-gray-800 rounded w-3/4" /><div className="h-2 bg-gray-800 rounded w-1/2" /></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || news.length === 0) {
    return (
      <div className="mt-5 pt-4 border-t border-gray-800/50">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">{t('empty')}</span>
          <button onClick={fetchNews} className="p-1 rounded hover:bg-gray-800 transition"><RefreshCw className="w-3 h-3 text-gray-600" /></button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mt-5 pt-4 border-t border-gray-800/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Newspaper className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs font-medium text-gray-300">{t('title')}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-500">{news.length}</span>
          </div>
          <button onClick={fetchNews} className="p-1 rounded hover:bg-gray-800 transition"><RefreshCw className="w-3 h-3 text-gray-600" /></button>
        </div>
        <div className="space-y-0.5">
          {news.map((item, i) => (
            <NewsCard key={i} item={item} lang={lang} onOpen={() => setModal(item)} />
          ))}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            {modal.thumbnail && (
              <img src={modal.thumbnail} alt="" className="w-full h-44 object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="text-white font-semibold text-sm leading-snug">{modal.title}</h2>
                <button onClick={() => setModal(null)} className="text-gray-500 hover:text-white transition flex-shrink-0"><X className="w-4 h-4" /></button>
              </div>
              {modal.description && modal.description.length > 5 && (
                <p className="text-gray-400 text-xs leading-relaxed mb-3">{modal.description}</p>
              )}
              <div className="flex items-center gap-2 text-gray-600 text-[11px] mb-4">
                <img src={faviconUrl(modal.link)} alt="" className="w-4 h-4 rounded" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                <span>{modal.source || getDomain(modal.link)}</span>
                {modal.pubDate && <><span>&middot;</span><span>{new Date(modal.pubDate).toLocaleDateString()}</span></>}
              </div>
              <a href={modal.link} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 transition rounded-lg text-white text-xs font-medium">
                <ExternalLink className="w-3.5 h-3.5" />{t('read')}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function NewsCard({ item, lang, onOpen }: { item: NewsItem; lang: string; onOpen: () => void }) {
  const [imgErr, setImgErr] = useState(false)
  const hasImg = item.thumbnail && !imgErr

  return (
    <button onClick={onOpen} className="w-full text-left flex gap-3 px-1 py-2.5 rounded-lg hover:bg-gray-800/50 transition group">
      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
        {hasImg ? (
          <img src={item.thumbnail} alt="" className="w-full h-full object-cover" onError={() => setImgErr(true)} />
        ) : (
          <img src={faviconUrl(item.link)} alt="" className="w-full h-full object-contain p-2" onError={e => { (e.target as HTMLImageElement).src = '' }} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-medium text-white line-clamp-2 group-hover:text-indigo-300 transition leading-snug">{item.title}</h4>
        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-600">
          <span>{item.source || getDomain(item.link)}</span>
          {item.pubDate && <><span>&middot;</span><span>{timeAgo(item.pubDate, lang)}</span></>}
        </div>
      </div>
    </button>
  )
}
