'use client'
import { useState } from 'react'
import { Play, TrendingUp, ExternalLink, Search } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const PLATFORMS = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '▶',
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    activeBg: 'bg-red-500/20 border-red-500/40',
    trending: [
      { title: 'Browse YouTube Trending', url: 'https://www.youtube.com/feed/trending', views: 'Live' },
      { title: 'YouTube Trending - Music', url: 'https://www.youtube.com/feed/trending?bp=4gIuKhQKA0FnYxIDQWdj', views: 'Music' },
      { title: 'YouTube Trending - Gaming', url: 'https://www.youtube.com/feed/trending?bp=4gIoKhYKBGdhbWUSBGdhbWU%3D', views: 'Gaming' },
      { title: 'YouTube Trending - News', url: 'https://www.youtube.com/feed/trending?bp=4gIoKhYKBG5ld3MSBGNvQk4%3D', views: 'News' },
    ]
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '♪',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20',
    activeBg: 'bg-pink-500/20 border-pink-500/40',
    trending: [
      { title: 'TikTok Trending Feed', url: 'https://www.tiktok.com/trending', views: 'Live' },
      { title: 'TikTok Discover', url: 'https://www.tiktok.com/discover', views: 'Discover' },
      { title: '#trending on TikTok', url: 'https://www.tiktok.com/tag/trending', views: 'Tags' },
      { title: '#viral on TikTok', url: 'https://www.tiktok.com/tag/viral', views: 'Viral' },
    ]
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '◉',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    activeBg: 'bg-purple-500/20 border-pink-500/40',
    trending: [
      { title: 'Instagram Reels', url: 'https://www.instagram.com/reels/', views: 'Live' },
      { title: 'Instagram Explore', url: 'https://www.instagram.com/explore/', views: 'Explore' },
      { title: '#trending on Instagram', url: 'https://www.instagram.com/explore/tags/trending/', views: 'Tags' },
      { title: '#viral on Instagram', url: 'https://www.instagram.com/explore/tags/viral/', views: 'Viral' },
    ]
  },
]

const YOUTUBE_TRENDING_EMBED = 'https://www.youtube.com/embed?listType=most_popular&list=PL4fGSI1pDJn6puJdseH2Rt9sMvt9E2M4i'

export default function ViralWidget() {
  const { tr } = useLang()
  const [platform, setPlatform] = useState('youtube')
  const [showEmbed, setShowEmbed] = useState(false)
  const [query, setQuery] = useState('')

  const current = PLATFORMS.find(p => p.id === platform)!
  const filtered = query
    ? current.trending.filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
    : current.trending

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-white font-semibold text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-pink-400" />
              {tr.viral}
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">{tr.viralDesc}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-2 py-1.5">
              <Search className="w-3 h-3 text-gray-500 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={tr.search}
                className="bg-transparent text-white text-xs outline-none w-20 placeholder-gray-600"
              />
            </div>
            {platform === 'youtube' && (
              <button
                onClick={() => setShowEmbed(!showEmbed)}
                className="text-xs text-red-400 hover:text-red-300 transition flex items-center gap-1"
              >
                <Play className="w-3 h-3" />
                {showEmbed ? 'Hide' : 'Preview'}
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {PLATFORMS.map(p => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                platform === p.id ? p.activeBg + ' ' + p.color : 'text-gray-400 hover:text-white border-transparent hover:bg-gray-800'
              }`}
            >
              <span>{p.icon}</span>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        {showEmbed && platform === 'youtube' && (
          <div className="mb-4 rounded-xl overflow-hidden border border-gray-700">
            <iframe
              src={YOUTUBE_TRENDING_EMBED}
              className="w-full h-64"
              allowFullScreen
              title="YouTube Trending"
            />
          </div>
        )}

        <div className="space-y-2 mb-5">
          {filtered.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between p-3.5 rounded-xl border ${current.bg} hover:opacity-90 transition group`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center text-sm font-bold ${current.color}`}>
                  {i + 1}
                </div>
                <div>
                  <div className="text-white text-sm font-medium group-hover:underline">{item.title}</div>
                  <div className={`text-xs ${current.color}`}>{item.views}</div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400" />
            </a>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-4">
          <p className="text-gray-500 text-xs mb-3">Quick Access</p>
          <div className="grid grid-cols-3 gap-2">
            {PLATFORMS.map(p => (
              <a
                key={p.id}
                href={p.trending[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border ${p.bg} hover:opacity-90 transition`}
              >
                <span className={`text-xl ${p.color}`}>{p.icon}</span>
                <span className={`text-xs font-medium ${p.color}`}>{p.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
