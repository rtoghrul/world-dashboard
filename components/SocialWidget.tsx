'use client'
import { useState } from 'react'
import { ExternalLink, TrendingUp, ChevronDown } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const TIKTOK_TAGS = [
  { tag: 'trending', label: '#trending' },
  { tag: 'viral', label: '#viral' },
  { tag: 'fyp', label: '#fyp' },
  { tag: 'foryou', label: '#foryou' },
  { tag: 'news', label: '#news' },
  { tag: 'music', label: '#music' },
]

const INSTAGRAM_TAGS = [
  { tag: 'trending', label: '#trending' },
  { tag: 'viral', label: '#viral' },
  { tag: 'reels', label: '#reels' },
  { tag: 'explore', label: '#explore' },
  { tag: 'news', label: '#news' },
  { tag: 'fashion', label: '#fashion' },
]

const PLATFORMS = [
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '♪',
    color: 'text-pink-400',
    activeBg: 'bg-pink-500/20 border-pink-500/40',
    tagBg: 'bg-pink-500/10 border-pink-500/20 text-pink-300 hover:bg-pink-500/20',
    links: [
      { label: '🔥 For You Feed', url: 'https://www.tiktok.com/foryou' },
      { label: '📈 Trending Now', url: 'https://www.tiktok.com/trending' },
      { label: '🔍 Discover', url: 'https://www.tiktok.com/discover' },
      { label: '🎵 Music Trends', url: 'https://www.tiktok.com/music' },
    ],
    tags: TIKTOK_TAGS,
    tagBase: 'https://www.tiktok.com/tag/',
    color2: '#fe2c55',
    note: '⚠️ TikTok does not provide a public trending API. Use the links above to browse trending content directly.',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '◉',
    color: 'text-purple-400',
    activeBg: 'bg-purple-500/20 border-purple-500/40',
    tagBg: 'bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500/20',
    links: [
      { label: '🎬 Reels Trending', url: 'https://www.instagram.com/reels/' },
      { label: '🔍 Explore', url: 'https://www.instagram.com/explore/' },
      { label: '📸 Top Posts', url: 'https://www.instagram.com/explore/tags/trending/' },
      { label: '🎵 Audio Trends', url: 'https://www.instagram.com/explore/tags/viral/' },
    ],
    tags: INSTAGRAM_TAGS,
    tagBase: 'https://www.instagram.com/explore/tags/',
    color2: '#c13584',
    note: '⚠️ Instagram public API is restricted. Use the direct links above to explore Reels and trending posts.',
  },
  {
    id: 'x',
    name: 'X',
    icon: '𝕏',
    color: 'text-sky-400',
    activeBg: 'bg-sky-500/20 border-sky-500/40',
    tagBg: 'bg-sky-500/10 border-sky-500/20 text-sky-300 hover:bg-sky-500/20',
    links: [
      { label: '🔥 Explore & Trending', url: 'https://x.com/explore' },
      { label: '🔍 Top Posts', url: 'https://x.com/search?q=trending&f=top' },
      { label: '👥 Communities', url: 'https://x.com/communities' },
      { label: '📰 News', url: 'https://x.com/explore?tab=news' },
    ],
    tags: [
      { tag: 'trending', label: '#trending' },
      { tag: 'viral', label: '#viral' },
      { tag: 'news', label: '#news' },
      { tag: 'breaking', label: '#breaking' },
      { tag: 'ai', label: '#ai' },
    ],
    tagBase: 'https://x.com/hashtag/',
    color2: '#1d9bf0',
    note: '⚠️ X has no public trending API. Open Explore to see real-time trends for your region.',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'f',
    color: 'text-blue-400',
    activeBg: 'bg-blue-500/20 border-blue-500/40',
    tagBg: 'bg-blue-500/10 border-blue-500/20 text-blue-300 hover:bg-blue-500/20',
    links: [
      { label: '🎬 Reels', url: 'https://www.facebook.com/reels/' },
      { label: '▶️ Watch', url: 'https://www.facebook.com/watch/' },
      { label: '🛍️ Marketplace', url: 'https://www.facebook.com/marketplace/' },
      { label: '📰 Feed', url: 'https://www.facebook.com/' },
    ],
    tags: [
      { tag: 'trending', label: '#trending' },
      { tag: 'viral', label: '#viral' },
      { tag: 'memes', label: '#memes' },
      { tag: 'news', label: '#news' },
    ],
    tagBase: 'https://www.facebook.com/hashtag/',
    color2: '#1877f2',
    note: '⚠️ Facebook trends are personalized. Watch and Reels surface the most viral videos.',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '▶',
    color: 'text-red-400',
    activeBg: 'bg-red-500/20 border-red-500/40',
    tagBg: 'bg-red-500/10 border-red-500/20 text-red-300 hover:bg-red-500/20',
    links: [
      { label: '🔥 Trending', url: 'https://www.youtube.com/feed/trending' },
      { label: '🎬 Shorts', url: 'https://www.youtube.com/shorts' },
      { label: '🎵 Music', url: 'https://www.youtube.com/music' },
      { label: '🎮 Gaming', url: 'https://www.youtube.com/gaming' },
    ],
    tags: [
      { tag: 'trending', label: '🔥 Trending' },
      { tag: 'viral videos', label: '📈 Viral' },
      { tag: 'shorts', label: '🎬 Shorts' },
      { tag: 'new music', label: '🎵 Music' },
      { tag: 'live news', label: '📰 Live' },
    ],
    tagBase: 'https://www.youtube.com/results?search_query=',
    color2: '#ff0000',
    note: '⚠️ YouTube trending is regional — the feed shows the top videos in your country.',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    icon: 'r/',
    color: 'text-orange-400',
    activeBg: 'bg-orange-500/20 border-orange-500/40',
    tagBg: 'bg-orange-500/10 border-orange-500/20 text-orange-300 hover:bg-orange-500/20',
    links: [
      { label: '🔥 Popular', url: 'https://www.reddit.com/r/popular/' },
      { label: '📈 All', url: 'https://www.reddit.com/r/all/' },
      { label: '🤖 r/technology', url: 'https://www.reddit.com/r/technology/' },
      { label: '🌍 r/worldnews', url: 'https://www.reddit.com/r/worldnews/' },
      { label: '🇩🇪 r/de', url: 'https://www.reddit.com/r/de/' },
    ],
    tags: [
      { tag: 'popular', label: 'r/popular' },
      { tag: 'all', label: 'r/all' },
      { tag: 'technology', label: 'r/technology' },
      { tag: 'worldnews', label: 'r/worldnews' },
      { tag: 'de', label: 'r/de' },
    ],
    tagBase: 'https://www.reddit.com/r/',
    color2: '#ff4500',
    note: 'Reddit surfaces viral posts on r/popular — no API needed, browse directly.',
  },
]

export default function SocialWidget({ defaultExpanded = false, initialPlatform }: { defaultExpanded?: boolean; initialPlatform?: string }) {
  const { tr } = useLang()
  const [platform, setPlatform] = useState(
    initialPlatform && PLATFORMS.some(p => p.id === initialPlatform) ? initialPlatform : 'tiktok'
  )
  const [collapsed, setCollapsed] = useState(!defaultExpanded)

  const current = PLATFORMS.find(p => p.id === platform)!

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-3 border-b border-gray-800 cursor-pointer select-none hover:bg-gray-800/20 transition"
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center justify-between mb-0">
          <div>
            <h2 className="text-white font-semibold text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-pink-400" />
              {tr.social}
            </h2>
            <p className="text-gray-500 text-xs">{tr.socialDesc}</p>
          </div>
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            {!collapsed && (
              <div className="flex gap-2">
                {PLATFORMS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      platform === p.id ? p.activeBg + ' ' + p.color : 'text-gray-400 hover:text-white border-transparent hover:bg-gray-800'
                    }`}
                  >
                    <span>{p.icon}</span> {p.name}
                  </button>
                ))}
              </div>
            )}
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} />
          </div>
        </div>
      </div>

      {/* Collapsed preview */}
      {collapsed && (
        <div className="px-5 py-3 flex items-center gap-3">
          {PLATFORMS.map(p => (
            <span key={p.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium bg-white/[0.03] border-white/[0.08] ${p.color}`}>
              {p.icon} {p.name}
            </span>
          ))}
          <span className="text-gray-500 text-xs">· {tr.trending} tags & links</span>
        </div>
      )}

      {/* Expanded content */}
      {!collapsed && (
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Quick Links */}
            <div>
              <p className="text-gray-500 text-xs mb-2 font-medium uppercase tracking-wide">Quick Links</p>
              <div className="space-y-1.5">
                {current.links.map(link => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 rounded-lg border transition bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] group"
                  >
                    <span className={`text-xs font-medium ${current.color}`}>{link.label}</span>
                    <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-gray-400" />
                  </a>
                ))}
              </div>
            </div>

            {/* Trending Tags */}
            <div>
              <p className="text-gray-500 text-xs mb-2 font-medium uppercase tracking-wide">Trending Tags</p>
              <div className="flex flex-wrap gap-2">
                {current.tags.map(t => (
                  <a
                    key={t.tag}
                    href={`${current.tagBase}${t.tag}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${current.tagBg}`}
                  >
                    {t.label}
                  </a>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-xl border border-gray-800 bg-gray-800/50">
                <p className="text-gray-400 text-xs">
                  {current.note}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
