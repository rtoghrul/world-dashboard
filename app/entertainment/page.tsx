'use client'
import useSWR from 'swr'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, ExternalLink, Film, Play } from 'lucide-react'
import Header from '@/components/Header'
import { useLang } from '@/lib/LanguageContext'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type Item = { id: string; type: string; title: string; originalTitle: string; year: string; image: string; summary: string; genres: string[]; rating: number | null; url: string; trailerUrl: string }

const copy: Record<string, any> = {
  en: { title: 'Entertainment Details', back: 'Back', trailer: 'Trailer/Search', official: 'Official page', page: 'Page', next: 'Next', prev: 'Previous' },
  az: { title: 'Kino və Serial Detalları', back: 'Geri', trailer: 'Trailer/Axtar', official: 'Rəsmi səhifə', page: 'Səhifə', next: 'Növbəti', prev: 'Əvvəlki' },
  ru: { title: 'Детали кино и сериалов', back: 'Назад', trailer: 'Трейлер/поиск', official: 'Официальная страница', page: 'Страница', next: 'Далее', prev: 'Назад' },
  de: { title: 'Entertainment-Details', back: 'Zurück', trailer: 'Trailer/Suche', official: 'Offizielle Seite', page: 'Seite', next: 'Weiter', prev: 'Zurück' },
  tr: { title: 'Film ve Dizi Detayları', back: 'Geri', trailer: 'Fragman/Ara', official: 'Resmi sayfa', page: 'Sayfa', next: 'Sonraki', prev: 'Önceki' },
}

function hasRealImage(item: Item) { return item.image && !item.image.includes('placehold.co') }

export default function EntertainmentPage() {
  const { lang } = useLang()
  const t = copy[lang] || copy.en
  const sp = useSearchParams()
  const [page, setPage] = useState(1)
  const [player, setPlayer] = useState<string | null>(null)
  const perPage = 12

  const api = useMemo(() => {
    const params = new URLSearchParams()
    params.set('type', sp.get('type') || 'movie')
    params.set('lang', lang)
    params.set('yearFrom', sp.get('yearFrom') || '1900')
    params.set('yearTo', sp.get('yearTo') || String(new Date().getFullYear() + 3))
    if (sp.get('genre')) params.set('genre', sp.get('genre') || '')
    if (sp.get('q')) params.set('q', sp.get('q') || '')
    return `/api/entertainment?${params.toString()}`
  }, [lang, sp])

  const { data, isLoading } = useSWR<Item[]>(api, fetcher)
  const items = (Array.isArray(data) ? data : []).filter(hasRealImage)
  const totalPages = Math.max(1, Math.ceil(items.length / perPage))
  const pageItems = items.slice((page - 1) * perPage, page * perPage)

  return <div className="min-h-screen bg-gray-950"><Header /><main className="max-w-screen-2xl mx-auto px-4 py-6"><div className="mb-5 flex items-center gap-3"><Link href="/" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"><ArrowLeft className="w-4 h-4" /></Link><div><h1 className="text-white text-2xl font-bold flex items-center gap-2"><Film className="w-5 h-5 text-fuchsia-300" />{t.title}</h1><p className="text-gray-500 text-sm mt-1">{sp.get('type') || 'movie'} · {sp.get('genre') || 'all'} · {sp.get('yearFrom') || '1900'}-{sp.get('yearTo') || new Date().getFullYear() + 3}</p></div></div>{isLoading && <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">{Array.from({ length: 12 }).map((_, i) => <div key={i} className="animate-pulse"><div className="aspect-[2/3] rounded-xl bg-gray-800 mb-2" /><div className="h-3 bg-gray-800 rounded" /></div>)}</div>}<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">{pageItems.map(item => <div key={item.id} className="rounded-xl border border-gray-800 bg-gray-900/70 overflow-hidden"><img src={item.image} alt={item.title} className="w-full aspect-[2/3] object-cover" /><div className="p-3"><h2 className="text-white text-xs font-semibold line-clamp-2 min-h-[2rem]">{item.title}</h2><p className="text-gray-500 text-[11px] mt-1 truncate">{item.year} · {item.genres.slice(0, 2).join(', ')}</p><p className="text-gray-400 text-[11px] mt-1 line-clamp-4">{item.summary}</p>{player === item.id && <iframe src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(item.originalTitle + ' official trailer')}`} className="w-full aspect-video rounded-lg mt-2 border border-gray-700" allowFullScreen title={item.title}/>}<div className="mt-2 flex gap-2"><button onClick={() => setPlayer(player === item.id ? null : item.id)} className="flex-1 rounded-lg bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 px-2 py-1.5 text-[11px] hover:bg-fuchsia-500/20"><Play className="inline w-3 h-3 mr-1" />{t.trailer}</button><a href={item.url || item.trailerUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-gray-700/60 text-gray-300 px-2 py-1.5 text-[11px] hover:text-white"><ExternalLink className="w-3.5 h-3.5" /></a></div></div></div>)}</div><div className="mt-6 flex items-center justify-center gap-3"><button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-40 text-sm">{t.prev}</button><span className="text-gray-400 text-sm">{t.page} {page} / {totalPages}</span><button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-40 text-sm">{t.next}</button></div></main></div>
}
