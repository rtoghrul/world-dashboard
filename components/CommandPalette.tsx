'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Search, Command, ArrowRight, Clock, TrendingUp, Newspaper, Film, Plane, GraduationCap, BarChart3 } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const allPages = [
  { id: 'weather-current', section: 'Weather', label: 'Current Weather', path: '/section/weather/current', icon: '🌤️' },
  { id: 'weather-hourly', section: 'Weather', label: 'Hourly Forecast', path: '/section/weather/hourly', icon: '🌤️' },
  { id: 'weather-weekly', section: 'Weather', label: 'Weekly Forecast', path: '/section/weather/weekly', icon: '🌤️' },
  { id: 'crypto-top', section: 'Crypto', label: 'Top Coins', path: '/section/crypto/top', icon: '₿' },
  { id: 'crypto-bitcoin', section: 'Crypto', label: 'Bitcoin', path: '/section/crypto/bitcoin', icon: '₿' },
  { id: 'crypto-ethereum', section: 'Crypto', label: 'Ethereum', path: '/section/crypto/ethereum', icon: '₿' },
  { id: 'crypto-fear-greed', section: 'Crypto', label: 'Fear & Greed Index', path: '/section/crypto/fear-greed', icon: '₿' },
  { id: 'whale-large-transfers', section: 'Whale', label: 'Large Transfers', path: '/section/whale/large-transfers', icon: '🐋' },
  { id: 'whale-wallets', section: 'Whale', label: 'Whale Wallets', path: '/section/whale/wallets', icon: '🐋' },
  { id: 'whale-exchanges', section: 'Whale', label: 'Exchange Flows', path: '/section/whale/exchanges', icon: '🐋' },
  { id: 'news-top', section: 'News', label: 'Top News', path: '/section/news/top', icon: '📰' },
  { id: 'news-war', section: 'News', label: 'War & Conflict', path: '/section/news/war', icon: '📰' },
  { id: 'news-politics', section: 'News', label: 'Politics', path: '/section/news/politics', icon: '📰' },
  { id: 'news-economy', section: 'News', label: 'Economy', path: '/section/news/economy', icon: '📰' },
  { id: 'news-ai', section: 'News', label: 'AI News', path: '/section/news/ai', icon: '📰' },
  { id: 'news-industry', section: 'News', label: 'Industry', path: '/section/news/industry', icon: '📰' },
  { id: 'news-social', section: 'News', label: 'Social News', path: '/section/news/social', icon: '📰' },
  { id: 'travel-flight-hotel', section: 'Travel', label: 'Flight + Hotel', path: '/section/travel/flight-hotel', icon: '✈️' },
  { id: 'travel-flight', section: 'Travel', label: 'Flights', path: '/section/travel/flight', icon: '✈️' },
  { id: 'travel-hotel', section: 'Travel', label: 'Hotels', path: '/section/travel/hotel', icon: '✈️' },
  { id: 'travel-last-minute', section: 'Travel', label: 'Last Minute Deals', path: '/section/travel/last-minute', icon: '✈️' },
  { id: 'viral-youtube', section: 'Viral', label: 'YouTube Trending', path: '/section/viral/youtube', icon: '🔥' },
  { id: 'viral-music', section: 'Viral', label: 'Viral Music', path: '/section/viral/music', icon: '🔥' },
  { id: 'viral-shorts', section: 'Viral', label: 'Shorts', path: '/section/viral/shorts', icon: '🔥' },
  { id: 'viral-trending', section: 'Viral', label: 'Trending Content', path: '/section/viral/trending', icon: '🔥' },
  { id: 'entertainment-movies', section: 'Movies', label: 'Movies', path: '/section/entertainment/movies', icon: '🎬' },
  { id: 'entertainment-series', section: 'Movies', label: 'Series', path: '/section/entertainment/series', icon: '🎬' },
  { id: 'entertainment-cartoons', section: 'Movies', label: 'Cartoons', path: '/section/entertainment/cartoons', icon: '🎬' },
  { id: 'entertainment-upcoming', section: 'Movies', label: 'Upcoming Releases', path: '/section/entertainment/upcoming', icon: '🎬' },
  { id: 'social-instagram', section: 'Social', label: 'Instagram', path: '/section/social/instagram', icon: '📱' },
  { id: 'social-tiktok', section: 'Social', label: 'TikTok', path: '/section/social/tiktok', icon: '📱' },
  { id: 'social-x', section: 'Social', label: 'X (Twitter)', path: '/section/social/x', icon: '📱' },
  { id: 'social-facebook', section: 'Social', label: 'Facebook', path: '/section/social/facebook', icon: '📱' },
  { id: 'stocks-top', section: 'Stocks', label: 'Top Stocks', path: '/section/stocks/top', icon: '📈' },
  { id: 'stocks-gainers', section: 'Stocks', label: 'Top Gainers', path: '/section/stocks/gainers', icon: '📈' },
  { id: 'stocks-losers', section: 'Stocks', label: 'Top Losers', path: '/section/stocks/losers', icon: '📈' },
  { id: 'stocks-tech', section: 'Stocks', label: 'Tech Stocks', path: '/section/stocks/tech', icon: '📈' },
  { id: 'education-courses', section: 'Learn', label: 'Courses', path: '/section/education/courses', icon: '📚' },
  { id: 'education-engineering', section: 'Learn', label: 'Engineering', path: '/section/education/engineering', icon: '📚' },
  { id: 'education-ai-tools', section: 'Learn', label: 'AI Tools', path: '/section/education/ai-tools', icon: '📚' },
  { id: 'education-cybersecurity', section: 'Learn', label: 'Cybersecurity', path: '/section/education/cybersecurity', icon: '📚' },
  { id: 'home', section: 'Navigation', label: 'Home / Dashboard', path: '/', icon: '🏠' },
  { id: 'polymarket', section: 'Navigation', label: 'Polymarket Predictions', path: '/polymarket', icon: '🎯' },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('cmd-recent')
    if (saved) setRecentSearches(JSON.parse(saved))
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(prev => !prev)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setSelectedIndex(0)
    }
  }, [open])

  const filtered = query.trim()
    ? allPages.filter(p =>
        p.label.toLowerCase().includes(query.toLowerCase()) ||
        p.section.toLowerCase().includes(query.toLowerCase()) ||
        p.id.includes(query.toLowerCase())
      )
    : allPages.slice(0, 8)

  useEffect(() => { setSelectedIndex(0) }, [query])

  const navigate = useCallback((path: string, label: string) => {
    const updated = [label, ...recentSearches.filter(r => r !== label)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('cmd-recent', JSON.stringify(updated))
    setOpen(false)
    router.push(path)
  }, [router, recentSearches])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      navigate(filtered[selectedIndex].path, filtered[selectedIndex].label)
    }
  }

  if (!mounted) return null
  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

      {/* Palette */}
      <div className="relative w-full max-w-lg mx-4 rounded-2xl bg-[#0f0f15] border border-white/[0.08] shadow-2xl shadow-black/50 overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
          <Search className="w-5 h-5 text-[#6b6b80] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, sections, topics..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-[#4a4a5a]"
          />
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-[10px] text-[#6b6b80]">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[300px] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-[#4a4a5a]">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item, i) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path, item.label)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${i === selectedIndex ? 'bg-white/[0.06] text-white' : 'text-[#a0a0b0] hover:bg-white/[0.03] hover:text-white'}`}
              >
                <span className="text-base shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.label}</div>
                  <div className="text-[11px] text-[#6b6b80]">{item.section}</div>
                </div>
                <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-opacity ${i === selectedIndex ? 'opacity-100' : 'opacity-0'}`} />
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-white/[0.06] text-[11px] text-[#4a4a5a]">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-white/[0.06] border border-white/[0.08]">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-white/[0.06] border border-white/[0.08]">↵</kbd>
            open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-white/[0.06] border border-white/[0.08]">esc</kbd>
            close
          </span>
        </div>
      </div>
    </div>,
    document.body
  )
}
