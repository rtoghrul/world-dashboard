'use client'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { Bookmark, BookmarkCheck, ChevronDown, ExternalLink, Flame, Layers, MessageSquare, RefreshCw, Search, Radar, Info } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'
import { ui, timeAgo, type UiKey } from '@/lib/i18n/ui'
import type { HorizonBriefing, HorizonItem, HorizonTopic } from '@/lib/horizon'
import { useStoredList } from './useStoredList'

const TOPICS: HorizonTopic[] = ['ai', 'security', 'science', 'space', 'dev', 'hardware', 'business', 'policy', 'culture']
const PAGE = 30

const fetcher = async (url: string) => {
  const r = await fetch(url)
  const d = await r.json().catch(() => null)
  if (!r.ok || !d || !Array.isArray(d.items)) throw new Error(`HTTP ${r.status}`)
  return d as HorizonBriefing
}

export const topicLabel = (t: string, lang: string) => ui(`hz.t.${t}` as UiKey, lang)

export function scoreClass(score: number) {
  if (score >= 7) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
  if (score >= 4.5) return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
  return 'bg-fg/[0.05] text-ink-3 border-line'
}

type View = 'top' | 'latest' | 'saved'

export default function HorizonBoard({ initialSource = 'all' }: { initialSource?: string }) {
  const { lang } = useLang()
  const { data, error, isLoading, isValidating, mutate } = useSWR('/api/horizon', fetcher, { revalidateOnFocus: false, refreshInterval: 900000 })
  const [view, setView] = useState<View>('top')
  const [topic, setTopic] = useState<HorizonTopic | 'all'>('all')
  const [source, setSource] = useState(initialSource)
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(PAGE)
  const [saved, updateSaved] = useStoredList<HorizonItem>('wd-horizon-saved', 100)
  const [read, updateRead] = useStoredList<string>('wd-horizon-read', 600)

  const savedIds = useMemo(() => new Set(saved.map(s => s.url)), [saved])
  const readSet = useMemo(() => new Set(read), [read])
  const toggleSave = (item: HorizonItem) => updateSaved(prev => prev.some(p => p.url === item.url) ? prev.filter(p => p.url !== item.url) : [item, ...prev])
  const markRead = (url: string) => updateRead(prev => prev.includes(url) ? prev : [url, ...prev])

  const base = useMemo(() => (view === 'saved' ? saved : data?.items || []), [view, saved, data])
  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = base.filter(i =>
      (topic === 'all' || i.tags?.includes(topic)) &&
      (source === 'all' || i.sourceId === source || i.sources?.some(s => s.id === source)) &&
      (!q || i.title.toLowerCase().includes(q) || i.summary?.toLowerCase().includes(q)))
    if (view === 'latest') list = [...list].sort((a, b) => Date.parse(b.published || '') - Date.parse(a.published || ''))
    return list
  }, [base, topic, source, query, view])

  const topicCounts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const i of data?.items || []) for (const t of i.tags || []) c[t] = (c[t] || 0) + 1
    return c
  }, [data])

  const sources = data?.sources || []
  const okCount = sources.filter(s => s.ok).length
  const unfiltered = view === 'top' && topic === 'all' && source === 'all' && !query
  const lead = unfiltered ? items[0] : undefined
  const rest = lead ? items.slice(1, limit) : items.slice(0, limit)
  const sourceKnown = source === 'all' || sources.length === 0 || sources.some(s => s.id === source)

  return (
    <div className="space-y-5">
      <header className="wd-card p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-ink-1"><Radar className="w-6 h-6 text-indigo-400" aria-hidden="true" />{ui('hz.title', lang)}</h2>
            <p className="text-sm text-ink-3 mt-1 max-w-xl">{ui('hz.subtitle', lang)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-3">
            {data && <span className="wd-chip pointer-events-none">{ui('hz.stories', lang, { n: data.items.length })}</span>}
            {sources.length > 0 && (
              <span className="wd-chip pointer-events-none"><span className={`w-1.5 h-1.5 rounded-full ${okCount === sources.length ? 'bg-emerald-400' : 'bg-amber-400'}`} aria-hidden="true" />{ui('hz.online', lang, { a: okCount, b: sources.length })}</span>
            )}
            {data?.generatedAt && <span className="wd-chip pointer-events-none" suppressHydrationWarning>{ui('common.updated', lang)} {timeAgo(data.generatedAt, lang)}</span>}
            <button onClick={() => mutate()} className="wd-chip" aria-label={ui('common.refresh', lang)}><RefreshCw className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin' : ''}`} aria-hidden="true" /></button>
          </div>
        </div>
      </header>

      <div className="wd-card p-3 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
          <div role="tablist" aria-label={ui('hz.title', lang)} className="flex gap-1.5">
            {(['top', 'latest', 'saved'] as View[]).map(v => (
              <button key={v} role="tab" aria-selected={view === v} aria-controls="hz-list" onClick={() => { setView(v); setLimit(PAGE) }} className="wd-chip">
                {v === 'top' && <Flame className="w-3.5 h-3.5" aria-hidden="true" />}
                {v === 'saved' && <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />}
                {ui(`hz.${v}` as UiKey, lang)}{v === 'saved' && saved.length > 0 && <span className="text-ink-4">{saved.length}</span>}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <label className="relative flex-1 sm:w-56">
              <span className="sr-only">{ui('hz.search', lang)}</span>
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-4" aria-hidden="true" />
              <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={ui('hz.search', lang)} className="wd-input w-full pl-8 py-1.5 text-xs" />
            </label>
            <label className="sr-only" htmlFor="hz-source">{ui('hz.allSources', lang)}</label>
            <select id="hz-source" value={sourceKnown ? source : 'all'} onChange={e => setSource(e.target.value)} className="wd-input py-1.5 text-xs max-w-[44%] sm:max-w-none">
              <option value="all">{ui('hz.allSources', lang)}</option>
              {sources.map(s => <option key={s.id} value={s.id}>{s.label} ({s.count})</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-0.5" role="group" aria-label={ui('hz.allTopics', lang)}>
          <button aria-pressed={topic === 'all'} onClick={() => setTopic('all')} className="wd-chip shrink-0">{ui('hz.allTopics', lang)}</button>
          {TOPICS.map(t => (
            <button key={t} aria-pressed={topic === t} onClick={() => setTopic(t)} className="wd-chip shrink-0 whitespace-nowrap">
              {topicLabel(t, lang)}{topicCounts[t] ? <span className="text-ink-4">{topicCounts[t]}</span> : null}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
        <section id="hz-list" role="tabpanel" aria-busy={isLoading} className="space-y-3 min-w-0">
          {isLoading && view !== 'saved' && Array.from({ length: 6 }).map((_, i) => <div key={i} className="wd-card h-24 skeleton" />)}
          {error && !data && view !== 'saved' && (
            <div role="alert" className="wd-card p-8 text-center text-sm">
              <p className="text-ink-2">{ui('common.error', lang)}</p>
              <button onClick={() => mutate()} className="wd-chip mt-3">{ui('common.retry', lang)}</button>
            </div>
          )}
          {view === 'saved' && saved.length === 0 && <p className="wd-card p-8 text-center text-sm text-ink-3">{ui('hz.noSaved', lang)}</p>}
          {base.length > 0 && items.length === 0 && <p className="wd-card p-8 text-center text-sm text-ink-3">{ui('hz.noMatch', lang)}</p>}

          {lead && <StoryCard item={lead} lead lang={lang} saved={savedIds.has(lead.url)} read={readSet.has(lead.url)} onSave={() => toggleSave(lead)} onRead={() => markRead(lead.url)} />}
          {rest.map(item => (
            <StoryCard key={item.url} item={item} lang={lang} saved={savedIds.has(item.url)} read={readSet.has(item.url)} onSave={() => toggleSave(item)} onRead={() => markRead(item.url)} />
          ))}
          {items.length > limit && (
            <button onClick={() => setLimit(l => l + PAGE)} className="wd-chip w-full justify-center py-2.5">{ui('hz.loadMore', lang)} ({items.length - limit})</button>
          )}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-20">
          {sources.length > 0 && (
            <div className="wd-card p-4">
              <h3 className="wd-section-title mb-3">{ui('hz.sources', lang)}</h3>
              <ul className="grid grid-cols-2 lg:grid-cols-1 gap-x-3 gap-y-1">
                {sources.map(s => (
                  <li key={s.id} className="flex items-center gap-2 min-w-0 text-xs">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.ok ? 'bg-emerald-400' : 'bg-red-400'}`} aria-hidden="true" />
                    <button onClick={() => setSource(source === s.id ? 'all' : s.id)} aria-pressed={source === s.id} className={`truncate text-left hover:text-ink-1 ${source === s.id ? 'text-ink-1 font-semibold' : 'text-ink-2'}`}>{s.label}</button>
                    <span className="ml-auto text-ink-4 tabular-nums">{s.count}</span>
                    <a href={s.home} target="_blank" rel="noopener noreferrer" className="text-ink-4 hover:text-ink-1" aria-label={`${s.label} (${ui('common.newTab', lang)})`}><ExternalLink className="w-3 h-3" aria-hidden="true" /></a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <details className="wd-card p-4 group">
            <summary className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-ink-1 list-none">
              <Info className="w-4 h-4 text-indigo-400" aria-hidden="true" />{ui('hz.how', lang)}
              <ChevronDown className="w-4 h-4 ml-auto text-ink-4 group-open:rotate-180 transition-transform" aria-hidden="true" />
            </summary>
            <p className="text-xs text-ink-3 leading-relaxed mt-3">{ui('hz.howText', lang)}</p>
          </details>
        </aside>
      </div>
    </div>
  )
}

function StoryCard({ item, lead = false, lang, saved, read, onSave, onRead }: { item: HorizonItem; lead?: boolean; lang: string; saved: boolean; read: boolean; onSave: () => void; onRead: () => void }) {
  const [open, setOpen] = useState(false)
  const [imgOk, setImgOk] = useState(true)
  const others = (item.sources || []).filter(s => s.id !== item.sourceId)
  const showImg = !!item.image && imgOk
  return (
    <article className={`relative wd-card wd-card-hover p-4 break-words [overflow-wrap:anywhere] ${lead ? 'sm:p-5' : ''} ${read ? 'opacity-70' : ''}`}>
      <div className={`flex gap-4 ${lead ? 'flex-col sm:flex-row-reverse' : ''}`}>
        {showImg && (
          <img src={item.image!} alt="" loading={lead ? 'eager' : 'lazy'} decoding="async" onError={() => setImgOk(false)}
            className={lead ? 'w-full sm:w-72 h-44 sm:h-40 rounded-xl object-cover bg-surface-2 shrink-0' : 'hidden sm:block w-28 h-20 rounded-lg object-cover bg-surface-2 shrink-0 order-last'} />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5 text-[11px]">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md border font-bold tabular-nums ${scoreClass(item.score)}`} title={ui('hz.how', lang)}>{item.score.toFixed(1)}</span>
            {item.tags?.map(t => <span key={t} className="px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300">{topicLabel(t, lang)}</span>)}
            {others.length > 0 && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300" title={item.sources.map(s => s.label).join(', ')}>
                <Layers className="w-3 h-3" aria-hidden="true" />{ui('hz.multi', lang, { n: item.sources.length })}
              </span>
            )}
          </div>
          <h3 className={`${lead ? 'text-lg sm:text-xl' : 'text-sm sm:text-[15px]'} font-semibold leading-snug text-ink-1`}>
            <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={onRead} onAuxClick={onRead} className="hover:text-indigo-300 transition-colors">
              {item.title}<span className="sr-only"> ({ui('common.newTab', lang)})</span>
            </a>
          </h3>
          {(lead || open) && item.summary && <p className="text-xs sm:text-sm text-ink-3 mt-2 leading-relaxed">{item.summary}</p>}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-ink-4">
            <span className="text-ink-2 font-medium">{item.source}</span>
            {others.map(s => <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-ink-1 underline-offset-2 hover:underline">{s.label}</a>)}
            {item.published && <time dateTime={item.published} suppressHydrationWarning>{timeAgo(item.published, lang)}</time>}
            {typeof item.points === 'number' && <span>▲ {ui('hz.points', lang, { n: item.points })}</span>}
            {item.discussionUrl && (
              <a href={item.discussionUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-ink-1">
                <MessageSquare className="w-3 h-3" aria-hidden="true" />{typeof item.comments === 'number' ? ui('hz.comments', lang, { n: item.comments }) : ui('hz.discussion', lang)}
              </a>
            )}
            <span className="ml-auto flex items-center gap-1">
              {!lead && item.summary && (
                <button onClick={() => setOpen(o => !o)} aria-expanded={open} className="px-1.5 py-0.5 rounded hover:bg-fg/[0.06] hover:text-ink-1">{ui('hz.summary', lang)}</button>
              )}
              <button onClick={onSave} aria-pressed={saved} aria-label={saved ? ui('hz.unsave', lang) : ui('hz.save', lang)} title={saved ? ui('hz.unsave', lang) : ui('hz.save', lang)} className={`p-1.5 rounded hover:bg-fg/[0.06] ${saved ? 'text-amber-400' : 'hover:text-ink-1'}`}>
                {saved ? <BookmarkCheck className="w-4 h-4" aria-hidden="true" /> : <Bookmark className="w-4 h-4" aria-hidden="true" />}
              </button>
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
