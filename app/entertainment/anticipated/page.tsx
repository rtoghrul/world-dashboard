'use client'
import useSWR from 'swr'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Film, Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import { useLang } from '@/lib/LanguageContext'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type Item = { id: string; type: string; title: string; originalTitle: string; year: string; image: string; summary: string; genres: string[]; rating: number | null; url: string; trailerUrl: string }

const copy: Record<string, any> = {
  en: { title: 'Most Anticipated', sub: 'Upcoming movies, series and cartoons', back: 'Back', trailer: 'Trailer/Search', official: 'Official page' },
  az: { title: 'Ən çox gözlənilənlər', sub: 'Gələcək kino, serial və multfilmlər', back: 'Geri', trailer: 'Trailer/Axtar', official: 'Rəsmi səhifə' },
  ru: { title: 'Самые ожидаемые', sub: 'Будущие фильмы, сериалы и мультфильмы', back: 'Назад', trailer: 'Трейлер/поиск', official: 'Официальная страница' },
  de: { title: 'Meist erwartet', sub: 'Kommende Filme, Serien und Cartoons', back: 'Zurück', trailer: 'Trailer/Suche', official: 'Offizielle Seite' },
  tr: { title: 'En çok beklenenler', sub: 'Yaklaşan filmler, diziler ve çizgi filmler', back: 'Geri', trailer: 'Fragman/Ara', official: 'Resmi sayfa' },
}

export default function AnticipatedPage() {
  const { lang } = useLang()
  const t = copy[lang] || copy.en
  const year = new Date().getFullYear()
  const { data, isLoading } = useSWR<Item[]>(`/api/entertainment?type=all&mode=anticipated&lang=${lang}&yearFrom=${year}&yearTo=${year + 3}`, fetcher)
  const items = Array.isArray(data) ? data : []

  return <div className="min-h-screen bg-gray-950"><Header /><main className="max-w-screen-2xl mx-auto px-4 py-6"><div className="mb-5 flex items-center gap-3"><Link href="/" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"><ArrowLeft className="w-4 h-4" /></Link><div><h1 className="text-white text-2xl font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-fuchsia-300" />{t.title}</h1><p className="text-gray-500 text-sm mt-1">{t.sub}</p></div></div>{isLoading && <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">{Array.from({ length: 16 }).map((_, i) => <div key={i} className="animate-pulse"><div className="aspect-[2/3] rounded-xl bg-gray-800 mb-2" /><div className="h-3 bg-gray-800 rounded" /></div>)}</div>}<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">{items.map(item => <div key={item.id} className="rounded-xl border border-gray-800 bg-gray-900/70 overflow-hidden"><img src={item.image} alt={item.title} className="w-full aspect-[2/3] object-cover" /><div className="p-3"><div className="flex items-center gap-1 text-fuchsia-300 text-[11px] mb-1"><Film className="w-3 h-3" />{item.type} · {item.year}</div><h2 className="text-white text-xs font-semibold line-clamp-2 min-h-[2rem]">{item.title}</h2><p className="text-gray-400 text-[11px] mt-1 line-clamp-4">{item.summary}</p><div className="mt-2 flex gap-2"><a href={item.trailerUrl} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-lg bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 px-2 py-1.5 text-[11px] text-center hover:bg-fuchsia-500/20">{t.trailer}</a><a href={item.url} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-gray-700/60 text-gray-300 px-2 py-1.5 text-[11px] hover:text-white"><ExternalLink className="w-3.5 h-3.5" /></a></div></div></div>)}</div></main></div>
}
