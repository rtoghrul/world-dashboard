'use client'
import { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import {
  ArrowLeft, Search, Newspaper, Cpu, Globe2, Landmark, BadgeDollarSign,
  Factory, Share2, Clapperboard, Palette, Trophy, Microscope, HeartPulse,
  RefreshCw, X, ExternalLink, TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import Header from '@/components/Header'
import { type NewsItem } from '@/components/NewsWidget'
import { useLang } from '@/lib/LanguageContext'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type NewsCategory = 'top' | 'war' | 'politics' | 'economy' | 'technology' | 'ai' | 'industry' | 'social' | 'cinema' | 'art' | 'sports' | 'science' | 'health'

const CATS: { id: NewsCategory; label: string; icon: LucideIcon; color: string }[] = [
  { id: 'top', label: '\u018fsas', icon: Globe2, color: 'bg-blue-500' },
  { id: 'war', label: 'M\u00fcharib\u0259', icon: Newspaper, color: 'bg-red-600' },
  { id: 'politics', label: 'Siyas\u0259t', icon: Landmark, color: 'bg-sky-500' },
  { id: 'economy', label: '\u0130qtisadiyyat', icon: BadgeDollarSign, color: 'bg-emerald-500' },
  { id: 'technology', label: 'Texnologiya', icon: Cpu, color: 'bg-cyan-500' },
  { id: 'ai', label: 'AI', icon: Cpu, color: 'bg-purple-500' },
  { id: 'industry', label: 'S\u0259naye', icon: Factory, color: 'bg-orange-500' },
  { id: 'social', label: 'Sosial', icon: Share2, color: 'bg-pink-500' },
  { id: 'cinema', label: 'Kino', icon: Clapperboard, color: 'bg-amber-500' },
  { id: 'art', label: '\u0130nc\u0259s\u0259n\u0259t', icon: Palette, color: 'bg-fuchsia-500' },
  { id: 'sports', label: '\u0130dman', icon: Trophy, color: 'bg-lime-500' },
  { id: 'science', label: 'Elm', icon: Microscope, color: 'bg-indigo-500' },
  { id: 'health', label: 'Sa\u011flaml\u0131q', icon: HeartPulse, color: 'bg-rose-500' },
]

function timeAgo(dateStr: string) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} d\u0259q \u0259vv\u0259l`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} saat \u0259vv\u0259l`
  const days = Math.floor(hours / 24)
  return `${days} g\u00fcn \u0259vv\u0259l`
}

function CardImage({ src, fallbackLetter }: { src?: string | null; fallbackLetter: string }) {
  const [failed, setFailed] = useState(false)
  if (src && !failed) {
    return <img src={src} alt="" className="w-full h-full object-cover" onError={() => setFailed(true)} />
  }
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
      <span className="text-4xl font-bold text-gray-700">{fallbackLetter}</span>
    </div>
  )
}

export default function NewsPage() {
  const { tr, lang } = useLang()
  const [tab, setTab] = useState<NewsCategory>('top')
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState<NewsItem | null>(null)

  const { data, error, isLoading, mutate } = useSWR<NewsItem[]>(
    `/api/news?category=${tab}&lang=${lang}`,
    fetcher,
    { refreshInterval: 300000 }
  )

  const filtered = query
    ? data?.filter(item => item.title.toLowerCase().includes(query.toLowerCase()) || item.description?.toLowerCase().includes(query.toLowerCase()))
    : data

  const items = filtered || []
  const hero = items[0]
  const gridItems = items.slice(1, 9)
  const sideItems = items.slice(0, 10)
  const catObj = CATS.find(c => c.id === tab) || CATS[0]

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main className="max-w-screen-xl mx-auto px-4 py-5">
        {/* Top bar */}
        <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-white font-bold text-lg">{'\ud83d\udcf0'} {tr.news || 'News'}</h1>
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <div className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 flex-1 sm:flex-none">
              <Search className="w-3.5 h-3.5 text-gray-500" />
              <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder={tr.search + '...'} className="bg-transparent text-white text-sm outline-none w-full sm:w-40 placeholder-gray-600" />
              {query && <button onClick={() => setQuery('')}><X className="w-3 h-3 text-gray-500 hover:text-white" /></button>}
            </div>
            <button onClick={() => mutate()} className="p-2 rounded-lg bg-gray-900 border border-gray-800 hover:bg-gray-800 transition">
              <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Categories - horizontal scroll */}
        <div className="-mx-4 px-4 mb-5 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1.5 min-w-max pb-1">
            {CATS.map(cat => {
              const active = tab === cat.id
              return (
                <button key={cat.id} onClick={() => { setTab(cat.id); setQuery('') }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${active ? `${cat.color} text-white shadow-lg` : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'}`}>
                  <cat.icon className="w-3 h-3" />{cat.label}
                </button>
              )
            })}
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
            <div className="space-y-4">
              <div className="aspect-[16/9] rounded-2xl bg-gray-900 animate-pulse" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => <div key={i} className="aspect-[16/10] rounded-xl bg-gray-900 animate-pulse" />)}
              </div>
            </div>
            <div className="hidden lg:block rounded-2xl bg-gray-900 h-96 animate-pulse" />
          </div>
        )}

        {error && <div className="p-12 text-center text-red-400 bg-gray-900 rounded-2xl border border-gray-800">{tr.error || 'Error'}</div>}

        {!isLoading && !error && items.length === 0 && (
          <div className="p-12 text-center text-gray-500 bg-gray-900 rounded-2xl border border-gray-800">{tr.noData || 'No results'}</div>
        )}

        {!isLoading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
            {/* Main content */}
            <div className="space-y-4">
              {/* Hero card */}
              {hero && (
                <button onClick={() => setModal(hero)} className="relative w-full aspect-[16/8] sm:aspect-[16/7] rounded-2xl overflow-hidden group">
                  <CardImage src={hero.thumbnail} fallbackLetter={hero.source?.charAt(0) || 'N'} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <span className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold text-white ${catObj.color}`}>{catObj.label}</span>
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <h2 className="text-white font-bold text-base sm:text-xl leading-snug line-clamp-2 group-hover:text-indigo-300 transition">{hero.title}</h2>
                    {hero.description && <p className="text-gray-300 text-xs mt-2 line-clamp-2 hidden sm:block">{hero.description}</p>}
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <span>{hero.source}</span>
                      <span>{'\u00b7'}</span>
                      <span>{timeAgo(hero.pubDate)}</span>
                    </div>
                  </div>
                </button>
              )}

              {/* Grid cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {gridItems.map((item, i) => (
                  <button key={i} onClick={() => setModal(item)} className="text-left group rounded-xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-gray-700 transition">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <CardImage src={item.thumbnail} fallbackLetter={item.source?.charAt(0) || 'N'} />
                      <span className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold text-white ${catObj.color}`}>{catObj.label}</span>
                    </div>
                    <div className="p-2.5">
                      <h3 className="text-white text-xs font-medium line-clamp-2 group-hover:text-indigo-300 transition leading-snug">{item.title}</h3>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-gray-500">
                        <span>{item.source}</span>
                        <span>{'\u00b7'}</span>
                        <span>{timeAgo(item.pubDate)}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Remaining items as list */}
              {items.length > 9 && (
                <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden divide-y divide-gray-800/50">
                  {items.slice(9).map((item, i) => (
                    <button key={i} onClick={() => setModal(item)} className="w-full text-left flex gap-3 px-4 py-3 hover:bg-gray-800/40 transition group">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-gray-800" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
                          <span className="text-indigo-400 text-xl font-bold">{item.source?.charAt(0) || 'N'}</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white text-xs font-medium line-clamp-2 group-hover:text-indigo-300 transition">{item.title}</h3>
                        {item.description && <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{item.description}</p>}
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-600">
                          <span>{item.source}</span><span>{'\u00b7'}</span><span>{timeAgo(item.pubDate)}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar - Most Read */}
            <aside className="hidden lg:block">
              <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden sticky top-4">
                <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-red-400" />
                  <h3 className="text-white text-sm font-bold">{'\u018fn \u00e7ox oxunan'}</h3>
                </div>
                <div className="divide-y divide-gray-800/50">
                  {sideItems.map((item, i) => (
                    <button key={i} onClick={() => setModal(item)} className="w-full text-left flex gap-3 px-4 py-2.5 hover:bg-gray-800/40 transition group">
                      <span className={`text-lg font-bold w-6 flex-shrink-0 ${i < 3 ? 'text-red-400' : 'text-gray-600'}`}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-xs line-clamp-2 group-hover:text-indigo-300 transition">{item.title}</h4>
                        <span className="text-[10px] text-gray-600 mt-0.5 block">{item.source} {'\u00b7'} {timeAgo(item.pubDate)}</span>
                      </div>
                      {item.thumbnail && <img src={item.thumbnail} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0 bg-gray-800" />}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            {modal.thumbnail && (
              <img src={modal.thumbnail} alt="" className="w-full h-48 object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            )}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="text-white font-semibold text-sm leading-snug">{modal.title}</h2>
                <button onClick={() => setModal(null)} className="text-gray-500 hover:text-white transition flex-shrink-0"><X className="w-4 h-4" /></button>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">{modal.description || '\u2014'}</p>
              <div className="flex items-center gap-2 text-gray-600 text-xs mb-4">
                <span>{modal.source}</span><span>{'\u00b7'}</span><span>{timeAgo(modal.pubDate)}</span>
              </div>
              <a href={modal.link} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 transition rounded-xl text-white text-xs font-medium">
                <ExternalLink className="w-3.5 h-3.5" />Tam oxu (m\u0259nb\u0259d\u0259)
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
