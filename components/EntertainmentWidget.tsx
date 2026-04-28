'use client'
import useSWR from 'swr'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { CalendarDays, ChevronDown, ExternalLink, Film, Flame, Play, Search, Sparkles, Tv } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type Item = { id: string; type: string; title: string; originalTitle: string; year: string; image: string; summary: string; genres: string[]; rating: number | null; url: string; trailerUrl: string }
type Mode = 'movie' | 'series' | 'cartoon'

type Copy = Record<string, string>
const copy: Record<string, Copy> = {
  en: { title: 'Movies & Series', sub: 'Movies, series, cartoons, posters, genres and trailers', movie: 'Movies', series: 'Series', cartoon: 'Cartoons', genre: 'Genre', all: 'All', search: 'Search title...', trailer: 'Trailer/Search', watch: 'Official page', rating: 'Rating', noData: 'No titles found', top: 'Top Trending', anticipated: 'Most Anticipated', yearFrom: 'From year', yearTo: 'To year', separate: 'Separated by type and genre', openPage: 'More details', details: 'More details' },
  az: { title: 'Kino və Seriallar', sub: 'Kino, serial, multfilm, şəkil, janr və trailer', movie: 'Kino', series: 'Serial', cartoon: 'Multfilm', genre: 'Janr', all: 'Hamısı', search: 'Ad ilə axtar...', trailer: 'Trailer/Axtar', watch: 'Rəsmi səhifə', rating: 'Reytinq', noData: 'Nəticə tapılmadı', top: 'Top Trend', anticipated: 'Ən çox gözlənilənlər', yearFrom: 'İldən', yearTo: 'İlə qədər', separate: 'Növ və janra görə ayrılıb', openPage: 'Daha ətraflı', details: 'Daha ətraflı' },
  ru: { title: 'Кино и сериалы', sub: 'Фильмы, сериалы, мультфильмы, постеры, жанры и трейлеры', movie: 'Фильмы', series: 'Сериалы', cartoon: 'Мультфильмы', genre: 'Жанр', all: 'Все', search: 'Поиск по названию...', trailer: 'Трейлер/поиск', watch: 'Официальная страница', rating: 'Рейтинг', noData: 'Ничего не найдено', top: 'Топ трендов', anticipated: 'Самые ожидаемые', yearFrom: 'С года', yearTo: 'До года', separate: 'Разделено по типу и жанру', openPage: 'Подробнее', details: 'Подробнее' },
  de: { title: 'Filme & Serien', sub: 'Filme, Serien, Cartoons, Poster, Genres und Trailer', movie: 'Filme', series: 'Serien', cartoon: 'Cartoons', genre: 'Genre', all: 'Alle', search: 'Titel suchen...', trailer: 'Trailer/Suche', watch: 'Offizielle Seite', rating: 'Bewertung', noData: 'Keine Titel gefunden', top: 'Top-Trends', anticipated: 'Meist erwartet', yearFrom: 'Ab Jahr', yearTo: 'Bis Jahr', separate: 'Nach Typ und Genre getrennt', openPage: 'Mehr Details', details: 'Mehr Details' },
  tr: { title: 'Film ve Diziler', sub: 'Filmler, diziler, çizgi film, posterler, türler ve fragmanlar', movie: 'Filmler', series: 'Diziler', cartoon: 'Çizgi film', genre: 'Tür', all: 'Hepsi', search: 'Başlık ara...', trailer: 'Fragman/Ara', watch: 'Resmi sayfa', rating: 'Puan', noData: 'Sonuç bulunamadı', top: 'Top Trend', anticipated: 'En çok beklenenler', yearFrom: 'Yıldan', yearTo: 'Yıla kadar', separate: 'Türe ve kategoriye göre ayrıldı', openPage: 'Daha detaylı', details: 'Daha detaylı' },
}

const genreLabels: Record<string, Record<string, string>> = {
  Drama: { az: 'Drama', ru: 'Драма', de: 'Drama', tr: 'Drama' }, Comedy: { az: 'Komediya', ru: 'Комедия', de: 'Komödie', tr: 'Komedi' }, Action: { az: 'Aksiyon', ru: 'Боевик', de: 'Action', tr: 'Aksiyon' }, Adventure: { az: 'Macəra', ru: 'Приключения', de: 'Abenteuer', tr: 'Macera' }, Crime: { az: 'Kriminal', ru: 'Криминал', de: 'Krimi', tr: 'Suç' }, Fantasy: { az: 'Fantaziya', ru: 'Фэнтези', de: 'Fantasy', tr: 'Fantastik' }, 'Science-Fiction': { az: 'Elmi fantastika', ru: 'Научная фантастика', de: 'Science-Fiction', tr: 'Bilim kurgu' }, Romance: { az: 'Romantika', ru: 'Романтика', de: 'Romantik', tr: 'Romantik' }, Thriller: { az: 'Triller', ru: 'Триллер', de: 'Thriller', tr: 'Gerilim' }, Animation: { az: 'Animasiya', ru: 'Анимация', de: 'Animation', tr: 'Animasyon' }, Family: { az: 'Ailə', ru: 'Семейный', de: 'Familie', tr: 'Aile' }
}
const GENRES_BY_MODE: Record<Mode, string[]> = {
  movie: ['All', 'Drama', 'Comedy', 'Action', 'Adventure', 'Crime', 'Fantasy', 'Science-Fiction', 'Romance', 'Thriller'],
  series: ['All', 'Drama', 'Comedy', 'Action', 'Adventure', 'Crime', 'Fantasy', 'Science-Fiction', 'Thriller'],
  cartoon: ['All', 'Animation', 'Family', 'Comedy', 'Adventure', 'Fantasy', 'Action', 'Science-Fiction', 'Drama'],
}
const YEARS = Array.from({ length: new Date().getFullYear() - 1900 + 4 }, (_, i) => 1900 + i).reverse()

function genreText(g: string, lang: string, t: Copy) { return g === 'All' ? t.all : (genreLabels[g]?.[lang] || g) }
function hasRealImage(item: Item) { return item.image && !item.image.includes('placehold.co') }
function detailsUrl(type: Mode, genre: string, yearFrom: string, yearTo: string, query: string) {
  const params = new URLSearchParams({ type, yearFrom, yearTo })
  if (genre) params.set('genre', genre)
  if (query.trim()) params.set('q', query.trim())
  return `/entertainment?${params.toString()}`
}

function MediaCard({ item, t, player, setPlayer }: { item: Item; t: Copy; player: string | null; setPlayer: (id: string | null) => void }) {
  return <div className="rounded-xl border border-gray-800 bg-gray-800/40 overflow-hidden"><img src={item.image} alt={item.title} className="w-full aspect-[2/3] object-cover"/><div className="p-3"><h3 className="text-white text-xs font-semibold line-clamp-2 min-h-[2rem]">{item.title}</h3><p className="text-gray-500 text-[11px] mt-1 truncate">{item.year} · {item.genres.slice(0,2).join(', ')}</p><p className="text-gray-400 text-[11px] mt-1 line-clamp-3">{item.summary}</p><p className="text-fuchsia-300 text-[11px] mt-2">{t.rating}: {item.rating || '—'}</p>{player===item.id && <iframe src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(item.originalTitle + ' official trailer')}`} className="w-full aspect-video rounded-lg mt-2 border border-gray-700" allowFullScreen title={item.title}/>}<div className="mt-2 flex gap-2"><button onClick={()=>setPlayer(player===item.id?null:item.id)} className="flex-1 rounded-lg bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 px-2 py-1.5 text-[11px] hover:bg-fuchsia-500/20">{t.trailer}</button><a href={item.url || item.trailerUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-gray-700/60 text-gray-300 px-2 py-1.5 text-[11px] hover:text-white"><ExternalLink className="w-3.5 h-3.5"/></a></div></div></div>
}

export default function EntertainmentWidget() {
  const { lang } = useLang()
  const t = copy[lang] || copy.en
  const [collapsed, setCollapsed] = useState(true)
  const [mode, setMode] = useState<Mode>('movie')
  const [genre, setGenre] = useState('')
  const [query, setQuery] = useState('')
  const [yearFrom, setYearFrom] = useState('1900')
  const [yearTo, setYearTo] = useState(String(new Date().getFullYear() + 3))
  const [player, setPlayer] = useState<string | null>(null)

  const api = useMemo(() => { const params = new URLSearchParams({ type: mode, lang, yearFrom, yearTo }); if (genre) params.set('genre', genre); if (query.trim()) params.set('q', query.trim()); return `/api/entertainment?${params.toString()}` }, [genre, lang, mode, query, yearFrom, yearTo])
  const trendingApi = useMemo(() => `/api/entertainment?type=${mode}&mode=trending&lang=${lang}&yearFrom=${yearFrom}&yearTo=${yearTo}`, [lang, mode, yearFrom, yearTo])
  const anticipatedApi = useMemo(() => `/api/entertainment?type=${mode}&mode=anticipated&lang=${lang}&yearFrom=${new Date().getFullYear()}&yearTo=${new Date().getFullYear() + 3}`, [lang, mode])

  const { data, error, isLoading } = useSWR<Item[]>(api, fetcher, { refreshInterval: 3600000 })
  const { data: trendingData } = useSWR<Item[]>(trendingApi, fetcher, { refreshInterval: 3600000 })
  const { data: anticipatedData } = useSWR<Item[]>(anticipatedApi, fetcher, { refreshInterval: 3600000 })
  const items = (Array.isArray(data) ? data : []).filter(item => item.type === mode && hasRealImage(item))
  const trending = (Array.isArray(trendingData) ? trendingData : []).filter(item => item.type === mode && hasRealImage(item)).slice(0, 4)
  const anticipated = (Array.isArray(anticipatedData) ? anticipatedData : []).filter(item => item.type === mode && hasRealImage(item)).slice(0, 4)
  const top = trending[0] || items[0]
  const currentGenres = GENRES_BY_MODE[mode]
  const moreUrl = detailsUrl(mode, genre, yearFrom, yearTo, query)

  return <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900"><div className="cursor-pointer select-none border-b border-gray-800 px-5 py-3 hover:bg-gray-800/20 transition" onClick={()=>setCollapsed(c=>!c)}><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 min-w-0"><div className="w-9 h-9 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center"><Film className="w-4 h-4 text-fuchsia-300"/></div><div className="min-w-0"><h2 className="text-white text-sm font-semibold">{t.title}</h2><p className="text-gray-500 text-xs truncate">{t.sub}</p></div></div><ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${collapsed?'':'rotate-180'}`}/></div></div>{collapsed?<div className="px-5 py-3 flex items-center gap-3">{top?.image&&<img src={top.image} alt={top.title} className="h-16 w-11 rounded-lg object-cover"/>}<div className="min-w-0"><p className="text-white text-sm font-medium line-clamp-1">{top?.title||t.title}</p><p className="text-gray-500 text-xs mt-1">{t.separate}</p></div></div>:<div className="p-4 space-y-5"><div className="grid grid-cols-3 gap-2">{([{id:'movie',label:t.movie,icon:Film},{id:'series',label:t.series,icon:Tv},{id:'cartoon',label:t.cartoon,icon:Play}] as any[]).map(x=>{const Icon=x.icon; return <button key={x.id} onClick={()=>{setMode(x.id); setGenre(''); setPlayer(null)}} className={`rounded-xl border px-2 py-2 text-xs font-medium flex items-center justify-center gap-1.5 ${mode===x.id?'border-fuchsia-500/40 bg-fuchsia-500/15 text-fuchsia-200':'border-gray-700 bg-gray-800/50 text-gray-400 hover:text-white'}`}><Icon className="w-3.5 h-3.5"/>{x.label}</button>})}</div><div className="grid grid-cols-1 sm:grid-cols-3 gap-2"><div className="flex items-center gap-1.5 rounded-lg bg-gray-800 px-3 py-2 border border-gray-700 focus-within:border-fuchsia-500"><Search className="w-3.5 h-3.5 text-gray-500"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search} className="w-full bg-transparent text-white text-sm outline-none placeholder-gray-600"/></div><label className="text-gray-500 text-xs">{t.yearFrom}<select value={yearFrom} onChange={e=>setYearFrom(e.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"><option value="1900">1900</option>{YEARS.map(y=><option key={y} value={y}>{y}</option>)}</select></label><label className="text-gray-500 text-xs">{t.yearTo}<select value={yearTo} onChange={e=>setYearTo(e.target.value)} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm">{YEARS.map(y=><option key={y} value={y}>{y}</option>)}</select></label></div><div><p className="text-gray-500 text-xs mb-2">{t.genre}</p><div className="flex gap-1 overflow-x-auto pb-1">{currentGenres.map(g=>{const value=g==='All'?'':g; return <button key={g} onClick={()=>setGenre(value)} className={`flex-shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium ${genre===value?'border border-fuchsia-500/30 bg-fuchsia-500/20 text-fuchsia-300':'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>{genreText(g, lang, t)}</button>})}</div></div><section><div className="flex items-center justify-between mb-2"><h3 className="text-white text-sm font-semibold flex items-center gap-2"><Flame className="w-4 h-4 text-orange-300"/>{t.top}</h3><Link href={detailsUrl(mode, '', yearFrom, yearTo, '')} className="text-xs text-fuchsia-300 hover:text-fuchsia-200 flex items-center gap-1">{t.details}<ExternalLink className="w-3 h-3"/></Link></div><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{trending.map(item=><MediaCard key={`tr-${item.id}`} item={item} t={t} player={player} setPlayer={setPlayer}/>)}</div></section><section><div className="flex items-center justify-between mb-2"><h3 className="text-white text-sm font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4 text-fuchsia-300"/>{t.anticipated}</h3><Link href={`/entertainment/anticipated?type=${mode}`} className="text-xs text-fuchsia-300 hover:text-fuchsia-200 flex items-center gap-1">{t.openPage}<ExternalLink className="w-3 h-3"/></Link></div><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{anticipated.map(item=><MediaCard key={`ant-${item.id}`} item={item} t={t} player={player} setPlayer={setPlayer}/>)}</div></section><section><div className="flex items-center justify-between mb-2"><h3 className="text-white text-sm font-semibold flex items-center gap-2"><CalendarDays className="w-4 h-4 text-sky-300"/>{mode==='movie'?t.movie:mode==='series'?t.series:t.cartoon}</h3><Link href={moreUrl} className="text-xs text-fuchsia-300 hover:text-fuchsia-200 flex items-center gap-1">{t.details}<ExternalLink className="w-3 h-3"/></Link></div>{isLoading&&<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{Array.from({length:4}).map((_,i)=><div key={i} className="animate-pulse"><div className="aspect-[2/3] rounded-xl bg-gray-800 mb-2"/><div className="h-3 bg-gray-800 rounded"/></div>)}</div>}{error&&<div className="p-6 text-center text-red-400 text-sm">Error</div>}{!isLoading&&!error&&items.length===0&&<div className="p-6 text-center text-gray-500 text-sm">{t.noData}</div>}<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{items.slice(0,4).map(item=><MediaCard key={item.id} item={item} t={t} player={player} setPlayer={setPlayer}/>)}</div></section></div>}</div>
}
