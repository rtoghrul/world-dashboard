'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { formatNewsDate } from '@/lib/dates'
import { useLang } from '@/lib/LanguageContext'

interface HorizonItem { rank: number; title: string; url: string; score: number; summary: string; source: string; tags: string[]; image?: string | null }
interface HorizonBriefing { date: string; totalFetched: number; totalSelected: number; items: HorizonItem[] }

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'Horizon Daily Briefing', az: 'Horizon Gündəlik İcmal', ru: 'Ежедневный обзор Horizon', de: 'Horizon Tagesüberblick', tr: 'Horizon Günlük Özet', fr: 'Briefing quotidien Horizon', es: 'Briefing diario Horizon', zh: 'Horizon 每日简报', ar: 'موجز Horizon اليومي', ja: 'Horizon デイリーブリーフィング', it: 'Briefing quotidiano Horizon', pt: 'Resumo diário Horizon' },
  items: { en: 'items', az: 'xəbər', ru: 'новостей', de: 'Beiträge', tr: 'haber', fr: 'actualités', es: 'noticias', zh: '条', ar: 'عنصر', ja: '件', it: 'notizie', pt: 'itens' },
  unreachable: { en: 'Sources temporarily unreachable', az: 'Mənbələr müvəqqəti əlçatmazdır', ru: 'Источники временно недоступны', de: 'Quellen vorübergehend nicht erreichbar', tr: 'Kaynaklara ulaşılamıyor', fr: 'Sources temporairement indisponibles', es: 'Fuentes no disponibles', zh: '来源暂时无法访问', ar: 'المصادر غير متاحة مؤقتاً', ja: 'ソースに一時的に接続できません', it: 'Fonti temporaneamente non raggiungibili', pt: 'Fontes temporariamente indisponíveis' },
  retrying: { en: 'Retrying automatically — no action needed', az: 'Avtomatik yenidən cəhd edilir', ru: 'Повторная попытка автоматически', de: 'Automatischer Neuversuch', tr: 'Otomatik yeniden deneniyor', fr: 'Nouvelle tentative automatique', es: 'Reintentando automáticamente', zh: '正在自动重试 — 无需操作', ar: 'تتم إعادة المحاولة تلقائياً — لا حاجة لأي إجراء', ja: '自動で再試行中 — 操作は不要です', it: 'Nuovo tentativo automatico — nessuna azione necessaria', pt: 'Tentando novamente — nenhuma ação necessária' },
  showAll: { en: 'Show all', az: 'Hamısını göstər', ru: 'Показать все', de: 'Alle anzeigen', tr: 'Tümünü göster', fr: 'Tout afficher', es: 'Mostrar todo', zh: '显示全部', ar: 'عرض الكل', ja: 'すべて表示', it: 'Mostra tutto', pt: 'Mostrar tudo' },
  showLess: { en: 'Show less', az: 'Az göstər', ru: 'Скрыть', de: 'Weniger anzeigen', tr: 'Daha az', fr: 'Réduire', es: 'Mostrar menos', zh: '收起', ar: 'عرض أقل', ja: '折りたたむ', it: 'Mostra meno', pt: 'Mostrar menos' },
  readFull: { en: 'Read full article →', az: 'Tam məqaləni oxu →', ru: 'Читать полностью →', de: 'Ganzen Artikel lesen →', tr: 'Tam makaleyi oku →', fr: 'Lire l\'article complet →', es: 'Leer artículo completo →', zh: '阅读全文 →', ar: 'اقرأ المقال كاملاً ←', ja: '記事全文を読む →', it: 'Leggi l’articolo completo →', pt: 'Ler artigo completo →' },
}

// no-store: never let the browser serve a stale briefing from the HTTP cache
const fetcher = (url: string) => fetch(url, { cache: 'no-store' }).then(r => r.json())

export default function HorizonWidget() {
  // Auto-refresh every 5 minutes so the briefing updates while the tab stays open
  const { data, error, isLoading } = useSWR<HorizonBriefing>('/api/horizon', fetcher, { refreshInterval: 300000, revalidateOnFocus: true, dedupingInterval: 60000 })
  const { lang } = useLang()
  const c = (k: string) => COPY[k]?.[lang] || COPY[k]?.en || k
  const [expanded, setExpanded] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)
  const items = data?.items ?? []
  const visibleItems = showAll ? items : items.slice(0, 10)

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">📡</span>
          <div>
            <h2 className="text-white font-semibold text-sm">{c('title')}</h2>
            {data && <p className="text-gray-400 text-xs">{formatNewsDate(data.date)} · {data.totalSelected}/{data.totalFetched} {c('items')}</p>}
          </div>
        </div>
      </div>
      {isLoading && [...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-800 rounded-lg animate-pulse" />)}
      {error && (
        <div className="text-center py-6 text-gray-400 text-sm">
          <p>📭 {c('unreachable')}</p>
          <p className="text-xs mt-1">{c('retrying')}</p>
        </div>
      )}
      {!isLoading && !error && (
        <div className="flex flex-col gap-1">
          {visibleItems.map((item) => (
            <div key={item.rank} className="rounded-lg hover:bg-gray-800 transition-colors">
              <button className="w-full text-left p-2 flex items-start gap-2" onClick={() => setExpanded(expanded === item.rank ? null : item.rank)}>
                <span className="text-gray-400 text-xs w-5 mt-0.5 shrink-0">{item.rank}.</span>
                {item.image ? (
                  <img loading="lazy" decoding="async" src={item.image} alt="" className="w-10 h-10 rounded-md object-cover shrink-0 bg-gray-800" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                ) : (
                  <div className="w-10 h-10 rounded-md bg-gray-800 shrink-0 flex items-center justify-center text-base">
                    {item.source.includes('reddit') ? '🤖' : item.source.includes('telegram') ? '✈️' : item.source.includes('hackernews') ? '🔥' : '📰'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <p className="text-gray-200 text-sm leading-snug flex-1">{item.title}</p>
                    <span className={(item.score >= 8 ? 'bg-emerald-500' : item.score >= 7 ? 'bg-yellow-500' : 'bg-slate-500') + ' text-white text-xs font-bold px-1.5 py-0.5 rounded'}>{item.score.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{item.source}</span>
                    {item.tags.slice(0, 2).map(tag => <span key={tag} className="text-gray-400 text-xs">#{tag}</span>)}
                  </div>
                </div>
              </button>
              {expanded === item.rank && (
                <div className="px-2 pb-3 ml-7">
                  <p className="text-gray-400 text-xs leading-relaxed mb-2">{item.summary}</p>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs hover:underline">{c('readFull')}</a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {items.length > 10 && (
        <button onClick={() => setShowAll(!showAll)} className="w-full py-2 mt-1 border-t border-gray-800 text-xs text-gray-400 hover:text-gray-300 text-center transition whitespace-nowrap">
          {showAll ? '▲ ' + c('showLess') : '▼ ' + c('showAll') + ' ' + items.length + ' ' + c('items')}
        </button>
      )}
    </div>
  )
}
