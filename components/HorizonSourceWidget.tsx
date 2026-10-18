'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { useLang } from '@/lib/LanguageContext'

interface HorizonItem {
  rank: number; title: string; url: string; score: number
  summary: string; source: string; tags: string[]; image?: string | null
}
interface HorizonBriefing {
  date: string; totalFetched: number; totalSelected: number; items: HorizonItem[]
}

const SOURCE_MAP: Record<string, string> = {
  'hackernews':    'hackernews',
  'reddit-ml':     'reddit · r/MachineLearning',
  'reddit-tech':   'reddit · r/technology',
  'reddit-ai':     'reddit · r/artificial',
  'rss-techcrunch':'rss · TechCrunch',
  'rss-verge':     'rss · The Verge',
  'rss-ars':       'rss · Ars Technica',
  'rss-simon':     'rss · Simon Willison',
  'tg-guardian':   'telegram · guardian',
  'tg-hnfeed':     'telegram · hacker_news_feed',
  'tg-wired':      'telegram · wired',
  'tg-openai':     'telegram · openai_news',
  'tg-bbc':        'telegram · bbcbreaking',
}

const SOURCE_LABELS: Record<string, string> = {
  'hackernews':    'Hacker News',
  'reddit-ml':     'Reddit — Machine Learning',
  'reddit-tech':   'Reddit — Technology',
  'reddit-ai':     'Reddit — Artificial Intelligence',
  'rss-techcrunch':'TechCrunch',
  'rss-verge':     'The Verge',
  'rss-ars':       'Ars Technica',
  'rss-simon':     'Simon Willison',
  'tg-guardian':   'Telegram — Guardian',
  'tg-hnfeed':     'Telegram — HN Feed',
  'tg-wired':      'Telegram — Wired',
  'tg-openai':     'Telegram — OpenAI News',
  'tg-bbc':        'Telegram — BBC Breaking',
}

const COPY: Record<string, Record<string, string>> = {
  ranked: { en: 'Live-ranked', az: 'Canlı sıralama', ru: 'Живой рейтинг', de: 'Live-Ranking', tr: 'Canlı sıralama', fr: 'Classement en direct', es: 'Clasificación en vivo', zh: '实时排名', ar: 'ترتيب مباشر', ja: 'リアルタイム順位', it: 'Classifica live', pt: 'Ranking ao vivo' },
  fromSource: { en: 'items from this source', az: 'bu mənbədən xəbər', ru: 'материалов из этого источника', de: 'Beiträge dieser Quelle', tr: 'bu kaynaktan haber', fr: 'articles de cette source', es: 'noticias de esta fuente', zh: '条来自此来源', ar: 'عناصر من هذا المصدر', ja: '件（このソース）', it: 'articoli da questa fonte', pt: 'itens desta fonte' },
  noBriefing: { en: 'No briefing available yet', az: 'Hələ icmal yoxdur', ru: 'Обзор пока недоступен', de: 'Noch kein Überblick verfügbar', tr: 'Henüz özet yok', fr: 'Aucun briefing disponible', es: 'Aún no hay resumen', zh: '暂无简报', ar: 'لا يوجد ملخص بعد', ja: 'まだブリーフィングはありません', it: 'Nessun briefing disponibile', pt: 'Ainda não há resumo' },
  runsDaily: { en: 'Refreshes automatically from live sources', az: 'Canlı mənbələrdən avtomatik yenilənir', ru: 'Обновляется автоматически из живых источников', de: 'Aktualisiert automatisch aus Live-Quellen', tr: 'Canlı kaynaklardan otomatik güncellenir', fr: 'Mise à jour automatique depuis des sources en direct', es: 'Se actualiza automáticamente desde fuentes en vivo', zh: '自动从实时来源更新', ar: 'يتم التحديث تلقائياً من مصادر مباشرة', ja: 'ライブソースから自動更新', it: 'Si aggiorna automaticamente da fonti live', pt: 'Atualiza automaticamente a partir de fontes ao vivo' },
  noneToday: { en: 'No items from this source right now', az: 'Hazırda bu mənbədən xəbər yoxdur', ru: 'Сейчас нет материалов из этого источника', de: 'Derzeit keine Beiträge dieser Quelle', tr: 'Şu an bu kaynaktan haber yok', fr: 'Aucun article de cette source pour le moment', es: 'Ahora no hay noticias de esta fuente', zh: '此来源暂无内容', ar: 'لا توجد عناصر من هذا المصدر حالياً', ja: '現在このソースの記事はありません', it: 'Al momento nessun articolo da questa fonte', pt: 'No momento não há itens desta fonte' },
  noneHint: { en: 'This source may not have had high-scoring content', az: 'Bu mənbədə yüksək bal toplayan məzmun olmaya bilər', ru: 'Возможно, у источника не было популярного контента', de: 'Möglicherweise keine relevanten Inhalte', tr: 'Bu kaynakta yüksek puanlı içerik olmayabilir', fr: 'Cette source n’a peut-être pas eu de contenu bien noté', es: 'Puede que esta fuente no haya tenido contenido destacado', zh: '此来源可能没有高分内容', ar: 'ربما لم يكن لهذا المصدر محتوى عالي التقييم', ja: 'このソースには高評価の記事がなかった可能性があります', it: 'Questa fonte potrebbe non avere contenuti con punteggio alto', pt: 'Esta fonte pode não ter tido conteúdo bem avaliado' },
  readFull: { en: 'Read full article →', az: 'Tam məqaləni oxu →', ru: 'Читать полностью →', de: 'Ganzen Artikel lesen →', tr: 'Tam makaleyi oku →', fr: 'Lire l’article complet →', es: 'Leer el artículo completo →', zh: '阅读全文 →', ar: 'اقرأ المقال كاملاً ←', ja: '記事全文を読む →', it: 'Leggi l’articolo completo →', pt: 'Ler artigo completo →' },
}

// no-store: never let the browser serve a stale briefing from the HTTP cache
const fetcher = (url: string) => fetch(url, { cache: 'no-store' }).then(r => r.json())

export default function HorizonSourceWidget({ source }: { source: string }) {
  // /api/horizon serves the gist while fresh and falls back to a live-built briefing when stale
  const { data, error, isLoading } = useSWR<HorizonBriefing>('/api/horizon', fetcher, { revalidateOnFocus: false })
  const { lang } = useLang()
  const c = (k: string) => COPY[k]?.[lang] || COPY[k]?.en || k
  const [expanded, setExpanded] = useState<number | null>(null)

  const sourceKey = SOURCE_MAP[source] || ''
  const items = (data?.items ?? []).filter(item =>
    !sourceKey || item.source.toLowerCase().includes(sourceKey.toLowerCase())
  )

  const label = SOURCE_LABELS[source] || 'Horizon Briefing'

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">📡</span>
        <div>
          <h2 className="text-white font-semibold">{label}</h2>
          {data && <p className="text-gray-400 text-xs">{c('ranked')} · {data.date} · {items.length} {c('fromSource')}</p>}
        </div>
      </div>

      {isLoading && [...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-800 rounded-lg animate-pulse" />
      ))}

      {error && (
        <div className="text-center py-10 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p>{c('noBriefing')}</p>
          <p className="text-xs mt-1">{c('runsDaily')}</p>
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p>{c('noneToday')}</p>
          <p className="text-xs mt-1">{c('noneHint')}</p>
        </div>
      )}

      {!isLoading && !error && items.map(item => (
        <div key={item.rank} className="rounded-xl border border-white/[0.06] bg-[#0a0a10]/80 overflow-hidden">
          <button
            className="w-full text-left p-4 flex items-start gap-3"
            onClick={() => setExpanded(expanded === item.rank ? null : item.rank)}
          >
            {item.image ? (
              <img loading="lazy" decoding="async" src={item.image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0 bg-gray-800" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gray-800 shrink-0 flex items-center justify-center text-2xl">
                {item.source.includes('reddit') ? '🤖' : item.source.includes('telegram') ? '✈️' : item.source.includes('hackernews') ? '🔥' : '📰'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2">
                <p className="text-white text-sm font-medium leading-snug flex-1">{item.title}</p>
                <span className={(item.score >= 8 ? 'bg-emerald-500' : item.score >= 7 ? 'bg-yellow-500' : 'bg-slate-600') + ' text-white text-xs font-bold px-1.5 py-0.5 rounded shrink-0'}>
                  {item.score.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-indigo-400">{item.source}</span>
                {item.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-gray-400 text-xs">#{tag}</span>
                ))}
              </div>
            </div>
          </button>
          {expanded === item.rank && (
            <div className="px-4 pb-4 border-t border-white/[0.04] pt-3">
              <p className="text-gray-400 text-sm leading-relaxed mb-3">{item.summary}</p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-400 text-sm hover:underline"
              >
                {c('readFull')}
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
