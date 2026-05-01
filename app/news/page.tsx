'use client'
import { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { ArrowLeft, Search, X, ExternalLink, RefreshCw } from 'lucide-react'
import Header from '@/components/Header'
import { type NewsItem } from '@/components/NewsWidget'
import { useLang } from '@/lib/LanguageContext'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type Cat = 'top' | 'war' | 'politics' | 'economy' | 'technology' | 'ai' | 'industry' | 'social' | 'cinema' | 'art' | 'sports' | 'science' | 'health'

const CATS: { id: Cat; az: string; en: string }[] = [
  { id: 'top', az: '\u018fsas', en: 'Top' },
  { id: 'war', az: 'M\u00fcharib\u0259', en: 'War' },
  { id: 'politics', az: 'Siyas\u0259t', en: 'Politics' },
  { id: 'economy', az: '\u0130qtisadiyyat', en: 'Economy' },
  { id: 'technology', az: 'Texnologiya', en: 'Tech' },
  { id: 'ai', az: 'AI', en: 'AI' },
  { id: 'industry', az: 'S\u0259naye', en: 'Industry' },
  { id: 'social', az: 'Sosial', en: 'Social' },
  { id: 'cinema', az: 'Kino', en: 'Cinema' },
  { id: 'art', az: '\u0130nc\u0259s\u0259n\u0259t', en: 'Art' },
  { id: 'sports', az: '\u0130dman', en: 'Sports' },
  { id: 'science', az: 'Elm', en: 'Science' },
  { id: 'health', az: 'Sa\u011flaml\u0131q', en: 'Health' },
]

function ago(d: string) {
  if (!d) return ''
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
  if (m < 60) return `${m} d\u0259q`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} saat`
  return `${Math.floor(h / 24)} g\u00fcn`
}

function Img({ src, letter, className }: { src?: string | null; letter: string; className?: string }) {
  const [err, setErr] = useState(false)
  if (src && !err) return <img src={src} alt="" className={className} onError={() => setErr(true)} />
  return <div className={`${className} bg-gray-100 flex items-center justify-center`}><span className="text-2xl font-bold text-gray-300">{letter}</span></div>
}

export default function NewsPage() {
  const { tr, lang } = useLang()
  const [tab, setTab] = useState<Cat>('top')
  const [q, setQ] = useState('')
  const [modal, setModal] = useState<NewsItem | null>(null)

  const { data, error, isLoading, mutate } = useSWR<NewsItem[]>(`/api/news?category=${tab}&lang=${lang}`, fetcher, { refreshInterval: 300000 })

  const items = (q ? data?.filter(x => x.title.toLowerCase().includes(q.toLowerCase())) : data) || []
  const hero = items[0]
  const side = items.slice(1, 5)
  const grid = items.slice(5)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Red top bar */}
      <div className="bg-red-600">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-white/80 hover:text-white transition"><ArrowLeft className="w-4 h-4" /></Link>
            <h1 className="text-white font-bold text-sm">{'\ud83d\udcf0'} {tr.news || 'X\u0259b\u0259rl\u0259r'}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/20 rounded px-2 py-1">
              <Search className="w-3 h-3 text-white/70" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Axtar..." className="bg-transparent text-white text-xs outline-none ml-1.5 w-24 sm:w-32 placeholder-white/50" />
              {q && <button onClick={() => setQ('')}><X className="w-3 h-3 text-white/70" /></button>}
            </div>
            <button onClick={() => mutate()} className="p-1 rounded hover:bg-white/10"><RefreshCw className="w-3.5 h-3.5 text-white/80" /></button>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-0 min-w-max">
            {CATS.map(c => (
              <button key={c.id} onClick={() => { setTab(c.id); setQ('') }}
                className={`px-4 py-2.5 text-xs font-medium border-b-2 transition whitespace-nowrap ${tab === c.id ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                {lang === 'az' ? c.az : c.en}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-5">
        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
            <div className="aspect-[16/9] bg-gray-100 rounded animate-pulse" />
            <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />)}</div>
          </div>
        )}

        {error && <div className="p-12 text-center text-red-500">X\u0259ta ba\u015f verdi</div>}

        {!isLoading && !error && items.length === 0 && (
          <div className="p-12 text-center text-gray-400">N\u0259tic\u0259 tap\u0131lmad\u0131</div>
        )}

        {!isLoading && !error && items.length > 0 && (
          <>
            {/* Hero row: big left + small right */}
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 mb-6">
              {/* Hero */}
              {hero && (
                <button onClick={() => setModal(hero)} className="relative group rounded overflow-hidden aspect-[16/9]">
                  <Img src={hero.thumbnail} letter={hero.source?.charAt(0) || 'N'} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="inline-block px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded mb-2">{(CATS.find(c => c.id === tab) || CATS[0])[lang === 'az' ? 'az' : 'en']}</span>
                    <h2 className="text-white font-bold text-lg leading-snug line-clamp-3 group-hover:underline">{hero.title}</h2>
                    <p className="text-white/70 text-xs mt-1.5">{hero.source} \u2022 {ago(hero.pubDate)}</p>
                  </div>
                </button>
              )}

              {/* Side cards */}
              <div className="flex flex-col gap-2">
                {side.map((item, i) => (
                  <button key={i} onClick={() => setModal(item)} className="flex gap-3 p-2 rounded hover:bg-gray-50 transition text-left group border border-gray-100">
                    <Img src={item.thumbnail} letter={item.source?.charAt(0) || 'N'} className="w-24 h-16 rounded object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-900 text-sm font-medium line-clamp-2 group-hover:text-red-600 transition leading-snug">{item.title}</h3>
                      <p className="text-gray-400 text-[11px] mt-1">{item.source} \u2022 {ago(item.pubDate)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            {grid.length > 0 && (
              <>
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h3 className="text-gray-900 font-bold text-sm">Son x\u0259b\u0259rl\u0259r</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grid.map((item, i) => (
                    <button key={i} onClick={() => setModal(item)} className="text-left group rounded overflow-hidden border border-gray-100 hover:shadow-md transition">
                      <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                        <Img src={item.thumbnail} letter={item.source?.charAt(0) || 'N'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-3">
                        <h3 className="text-gray-900 text-sm font-medium line-clamp-2 group-hover:text-red-600 transition">{item.title}</h3>
                        <p className="text-gray-400 text-[11px] mt-1.5">{item.source} \u2022 {ago(item.pubDate)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div className="bg-white rounded-lg w-full max-w-lg overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            {modal.thumbnail && <img src={modal.thumbnail} alt="" className="w-full h-48 object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
            <div className="p-5">
              <h2 className="text-gray-900 font-bold text-base leading-snug mb-2">{modal.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{modal.description || '\u2014'}</p>
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-4">
                <span>{modal.source}</span><span>\u2022</span><span>{ago(modal.pubDate)}</span>
              </div>
              <div className="flex gap-2">
                <a href={modal.link} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 transition rounded text-white text-sm font-medium">
                  <ExternalLink className="w-3.5 h-3.5" />Tam oxu
                </a>
                <button onClick={() => setModal(null)} className="px-4 py-2.5 border border-gray-200 rounded text-gray-600 text-sm hover:bg-gray-50 transition">Ba\u011fla</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
