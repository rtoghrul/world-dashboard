'use client'
import { useState } from 'react'
import useSWR from 'swr'
import { Play, TrendingUp, ExternalLink, Search, Eye, ThumbsUp } from 'lucide-react'
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

const REGIONS = [
  { code: 'US', label: '🇺🇸 US' },
  { code: 'AZ', label: '🇦🇿 AZ' },
  { code: 'TR', label: '🇹🇷 TR' },
  { code: 'RU', label: '🇷🇺 RU' },
  { code: 'GB', label: '🇬🇧 UK' },
]

function formatViews(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`
  return n.toString()
}

const SOCIAL = [
  { name: 'TikTok', icon: '♪', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20', url: 'https://www.tiktok.com/trending' },
  { name: 'Instagram', icon: '◉', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', url: 'https://www.instagram.com/reels/' },
  { name: 'X/Twitter', icon: '✕', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20', url: 'https://x.com/explore/tabs/trending' },
]

export default function ViralWidget() {
  const { tr } = useLang()
  const [region, setRegion] = useState('US')
  const [query, setQuery] = useState('')
  const [showEmbed, setShowEmbed] = useState<string | null>(null)

  const { data, error, isLoading } = useSWR<Video[]>(
    `/api/youtube?region=${region}&maxResults=12`,
    fetcher,
    { refreshInterval: 3600000 }
  )

  const filtered = query
    ? data?.filter(v => v.title.toLowerCase().includes(query.toLowerCase()) || v.channel.toLowerCase().includes(query.toLowerCase()))
    : data

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-white font-semibold text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-400" />
              🔥 {tr.viral}
            </h2>
            <p className="text-gray-500 text-xs">{tr.viralDesc}</p>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-2 py-1">
            <Search className="w-3 h-3 text-gray-500 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={tr.search}
              className="bg-transparent text-white text-xs outline-none w-20 placeholder-gray-600"
            />
          </div>
        </div>
        <div className="flex gap-1 flex-wrap">
          {REGIONS.map(r => (
            <button
              key={r.code}
              onClick={() => setRegion(r.code)}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition ${
                region === r.code ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-video bg-gray-800 rounded-lg mb-2" />
                <div className="h-2.5 bg-gray-800 rounded w-3/4 mb-1" />
                <div className="h-2 bg-gray-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {error && <div className="p-6 text-center text-red-400 text-sm">{tr.error}</div>}

        {filtered && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filtered.slice(0, 6).map((video) => (
              <div key={video.id} className="group">
                <div className="relative rounded-lg overflow-hidden mb-1.5 cursor-pointer" onClick={() => setShowEmbed(showEmbed === video.id ? null : video.id)}>
                  <img src={video.thumbnail} alt={video.title} className="w-full aspect-video object-cover group-hover:opacity-80 transition" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <div className="w-9 h-9 rounded-full bg-red-600/90 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                </div>
                {showEmbed === video.id && (
                  <div className="mb-2 rounded-lg overflow-hidden border border-gray-700">
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
                  <p className="text-white text-xs font-medium line-clamp-2 flex-1">{video.title}</p>
                  <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-red-400 flex-shrink-0 mt-0.5">
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-gray-500 text-xs mt-0.5">{video.channel}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-gray-600 text-xs flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" />{formatViews(video.views)}</span>
                  <span className="text-gray-600 text-xs flex items-center gap-0.5"><ThumbsUp className="w-2.5 h-2.5" />{formatViews(video.likes)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-gray-500 text-xs mb-2">Digər platformalar</p>
          <div className="flex gap-2">
            {SOCIAL.map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${s.bg} ${s.color} hover:opacity-80 transition`}>
                <span>{s.icon}</span>{s.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
