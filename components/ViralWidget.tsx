'use client'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { ChevronDown, Clapperboard, ExternalLink, Eye, Flame, Play, Search, ThumbsUp, TrendingUp } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type Video = {
  id: string
  title: string
  channel: string
  thumbnail: string
  views: number
  likes: number
  url: string
}

type VideoCardSize = 'compact' | 'wide'

const REGIONS = [
  { code: 'US', label: 'US' },
  { code: 'AZ', label: 'AZ' },
  { code: 'TR', label: 'TR' },
  { code: 'RU', label: 'RU' },
  { code: 'GB', label: 'UK' },
]

const CATEGORIES = [
  { id: '', labelAz: 'Hamısı', labelEn: 'All' },
  { id: '25', labelAz: 'Xəbərlər', labelEn: 'News' },
  { id: '10', labelAz: 'Musiqi', labelEn: 'Music' },
  { id: '20', labelAz: 'Oyun', labelEn: 'Gaming' },
  { id: '17', labelAz: 'İdman', labelEn: 'Sports' },
  { id: '28', labelAz: 'Texnologiya', labelEn: 'Tech' },
]

const copy = {
  az: {
    featured: 'Seçilmiş video',
    trending: 'Trend videolar',
    more: 'Baxmağa dəyər',
    open: 'YouTube-da aç',
    featuredNote: 'Seçilmiş region və kateqoriya üzrə ən populyar video burada görünür.',
  },
  en: {
    featured: 'Featured Video',
    trending: 'Trending Videos',
    more: 'More To Watch',
    open: 'Open On YouTube',
    featuredNote: 'The most popular video for the selected region and category is pinned here.',
  },
}

function formatViews(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`
  return n.toString()
}

function VideoCard({
  video,
  showEmbed,
  onToggleEmbed,
  size = 'compact',
}: {
  video: Video
  showEmbed: boolean
  onToggleEmbed: () => void
  size?: VideoCardSize
}) {
  return (
    <div className="group min-w-0">
      <button
        type="button"
        className="relative mb-1.5 block w-full overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        onClick={onToggleEmbed}
        aria-label={video.title}
      >
        <img src={video.thumbnail} alt={video.title} loading="lazy" className="w-full aspect-video object-cover transition-opacity group-hover:opacity-80" />
        <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <span className={`${size === 'wide' ? 'h-11 w-11' : 'h-9 w-9'} flex items-center justify-center rounded-full bg-red-600/90`}>
            <Play className={`${size === 'wide' ? 'h-5 w-5' : 'h-4 w-4'} ml-0.5 text-white`} fill="white" aria-hidden="true" />
          </span>
        </span>
      </button>
      {showEmbed && (
        <div className="mb-2 overflow-hidden rounded-lg border border-gray-700">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            className="w-full aspect-video"
            allowFullScreen
            allow="autoplay"
            title={video.title}
          />
        </div>
      )}
      <div className="flex items-start justify-between gap-1">
        <p className={`min-w-0 flex-1 break-words font-medium text-white ${size === 'wide' ? 'text-sm line-clamp-2' : 'text-xs line-clamp-2'}`}>{video.title}</p>
        <a href={video.url} target="_blank" rel="noopener noreferrer" aria-label="Open video on YouTube" className="mt-0.5 flex-shrink-0 text-gray-600 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>
      <p className="mt-0.5 truncate text-xs text-gray-500">{video.channel}</p>
      <div className="mt-0.5 flex items-center gap-2">
        <span className="flex items-center gap-0.5 text-xs text-gray-600"><Eye className="h-2.5 w-2.5" aria-hidden="true" />{formatViews(video.views)}</span>
        <span className="flex items-center gap-0.5 text-xs text-gray-600"><ThumbsUp className="h-2.5 w-2.5" aria-hidden="true" />{formatViews(video.likes)}</span>
      </div>
    </div>
  )
}

const SOCIAL = [
  { name: 'TikTok', icon: '♪', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20', url: 'https://www.tiktok.com/trending' },
  { name: 'Instagram', icon: '◉', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', url: 'https://www.instagram.com/reels/' },
  { name: 'X/Twitter', icon: 'X', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20', url: 'https://x.com/explore/tabs/trending' },
]

export default function ViralWidget() {
  const { lang, tr } = useLang()
  const [region, setRegion] = useState('AZ')
  const [category, setCategory] = useState('')
  const [query, setQuery] = useState('')
  const [showEmbed, setShowEmbed] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(true)
  const text = lang === 'az' ? copy.az : copy.en

  useEffect(() => {
    const savedRegion = localStorage.getItem('youtube-region')
    const savedCategory = localStorage.getItem('youtube-category')
    if (savedRegion) setRegion(savedRegion)
    if (savedCategory !== null) setCategory(savedCategory)
  }, [])

  const apiPath = useMemo(() => {
    const params = new URLSearchParams({ region, maxResults: '24' })
    if (category) params.set('category', category)
    return `/api/youtube?${params.toString()}`
  }, [category, region])

  const { data, error, isLoading } = useSWR<Video[]>(apiPath, fetcher, { refreshInterval: 3600000 })

  const videos = Array.isArray(data) ? data : []
  const filtered = query
    ? videos.filter(v => v.title.toLowerCase().includes(query.toLowerCase()) || v.channel.toLowerCase().includes(query.toLowerCase()))
    : videos

  const top = videos[0]
  const featured = filtered[0]
  const trendingVideos = filtered.slice(1, 9)
  const moreVideos = filtered.slice(9, 24)

  const selectRegion = (code: string) => {
    setRegion(code)
    localStorage.setItem('youtube-region', code)
  }

  const selectCategory = (id: string) => {
    setCategory(id)
    localStorage.setItem('youtube-category', id)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
      <div
        className="cursor-pointer select-none border-b border-gray-800 px-5 py-3 transition-colors hover:bg-gray-800/20"
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="mb-0 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
              <TrendingUp className="h-4 w-4 text-red-400" aria-hidden="true" />
              {tr.viral}
            </h2>
            <p className="text-xs text-gray-500">{tr.viralDesc}</p>
          </div>
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            {!collapsed && (
              <div className="flex items-center gap-1.5 rounded-lg bg-gray-800 px-2 py-1 focus-within:ring-2 focus-within:ring-red-500">
                <Search className="h-3 w-3 flex-shrink-0 text-gray-500" aria-hidden="true" />
                <input
                  type="text"
                  name="youtube-search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={`${tr.search}…`}
                  autoComplete="off"
                  className="w-20 bg-transparent text-xs text-white outline-none placeholder-gray-600"
                />
              </div>
            )}
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} aria-hidden="true" />
          </div>
        </div>
        {!collapsed && (
          <div className="mt-3 space-y-2" onClick={e => e.stopPropagation()}>
            <div className="flex flex-wrap gap-1">
              {REGIONS.map(r => (
                <button
                  type="button"
                  key={r.code}
                  onClick={() => selectRegion(r.code)}
                  className={`rounded-lg px-2 py-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                    region === r.code ? 'border border-red-500/30 bg-red-500/20 text-red-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1">
              {CATEGORIES.map(item => (
                <button
                  type="button"
                  key={item.id || 'all'}
                  onClick={() => selectCategory(item.id)}
                  className={`flex-shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                    category === item.id ? 'border border-red-500/30 bg-red-500/20 text-red-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {lang === 'az' ? item.labelAz : item.labelEn}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {collapsed && (
        <div className="flex items-center gap-3 px-5 py-3">
          {isLoading && (
            <div className="flex w-full animate-pulse items-center gap-3">
              <div className="h-12 w-20 flex-shrink-0 rounded-lg bg-gray-800" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 rounded bg-gray-800" />
                <div className="h-2 w-1/2 rounded bg-gray-800" />
              </div>
            </div>
          )}
          {top && (
            <>
              <div className="relative flex-shrink-0">
                <img src={top.thumbnail} alt={top.title} className="h-12 w-20 rounded-lg object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600/90">
                    <Play className="ml-0.5 h-3 w-3 text-white" fill="white" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <div className="min-w-0">
                <p className="line-clamp-1 text-xs font-medium text-white">{top.title}</p>
                <p className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                  {top.channel}
                  <span className="flex items-center gap-0.5"><Eye className="h-2.5 w-2.5" aria-hidden="true" />{formatViews(top.views)}</span>
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {!collapsed && (
        <div className="p-4">
          {isLoading && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="mb-2 aspect-video w-full rounded-lg bg-gray-800" />
                  <div className="mb-1 h-2.5 w-3/4 rounded bg-gray-800" />
                  <div className="h-2 w-1/2 rounded bg-gray-800" />
                </div>
              ))}
            </div>
          )}

          {error && <div className="p-6 text-center text-sm text-red-400">{tr.error}</div>}

          {filtered && !error && (
            <div className="space-y-5">
              {featured && (
                <section>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="flex items-center gap-1.5 text-xs font-semibold text-white">
                      <Flame className="h-3.5 w-3.5 text-red-400" aria-hidden="true" />
                      {text.featured}
                    </h3>
                    <span className="text-[11px] text-gray-600">{region}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1.25fr)_minmax(220px,0.75fr)]">
                    <VideoCard
                      video={featured}
                      showEmbed={showEmbed === featured.id}
                      onToggleEmbed={() => setShowEmbed(showEmbed === featured.id ? null : featured.id)}
                      size="wide"
                    />
                    <div className="hidden flex-col justify-center border-l border-gray-800 pl-4 md:flex">
                      <p className="text-xs leading-5 text-gray-400">{text.featuredNote}</p>
                      <a href={featured.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                        {text.open}
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </section>
              )}

              {trendingVideos.length > 0 && (
                <section>
                  <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-white">
                    <TrendingUp className="h-3.5 w-3.5 text-red-400" aria-hidden="true" />
                    {text.trending}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {trendingVideos.map(video => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        showEmbed={showEmbed === video.id}
                        onToggleEmbed={() => setShowEmbed(showEmbed === video.id ? null : video.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {moreVideos.length > 0 && (
                <section>
                  <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-white">
                    <Clapperboard className="h-3.5 w-3.5 text-red-400" aria-hidden="true" />
                    {text.more}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {moreVideos.map(video => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        showEmbed={showEmbed === video.id}
                        onToggleEmbed={() => setShowEmbed(showEmbed === video.id ? null : video.id)}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          <div className="mt-4 border-t border-gray-800 pt-4">
            <p className="mb-2 text-xs text-gray-500">{tr.otherPlatforms}</p>
            <div className="flex flex-wrap gap-2">
              {SOCIAL.map(s => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${s.bg} ${s.color}`}>
                  <span>{s.icon}</span>{s.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
