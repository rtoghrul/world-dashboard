'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight, Newspaper, Bitcoin, Film, Zap, Download, GraduationCap, Plane, Cloud, ShoppingBag, Globe2, Gift } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const sectionIcons: Record<string, any> = {
  news: Newspaper, markets: Bitcoin, entertainment: Film, viral: Zap,
  aitools: Zap, software: Download, education: GraduationCap,
  travel: Plane, weather: Cloud, women: ShoppingBag, chinese: ShoppingBag,
  germany: Globe2, platforms: ShoppingBag, benefits: Gift,
}

const allSections = [
  { id: '/benefits', label: 'Benefits Hub — Subsidies, Discounts & Free Tools', section: 'benefits' },
  { id: 'news/top', label: 'Top News', section: 'news' },
  { id: 'news/war', label: 'War & Conflicts', section: 'news' },
  { id: 'news/politics', label: 'Politics', section: 'news' },
  { id: 'news/economy', label: 'Economy', section: 'news' },
  { id: 'news/tech', label: 'Technology News', section: 'news' },
  { id: 'news/ai', label: 'AI & Tech News', section: 'news' },
  { id: 'news/sports', label: 'Sports', section: 'news' },
  { id: 'markets/crypto-top', label: 'Crypto Top Coins', section: 'markets' },
  { id: 'markets/bitcoin', label: 'Bitcoin', section: 'markets' },
  { id: 'markets/ethereum', label: 'Ethereum', section: 'markets' },
  { id: 'markets/fear-greed', label: 'Fear & Greed Index', section: 'markets' },
  { id: 'markets/whale', label: 'Whale Activity', section: 'markets' },
  { id: 'markets/stocks-top', label: 'Stocks', section: 'markets' },
  { id: 'markets/gainers', label: 'Top Gainers', section: 'markets' },
  { id: 'markets/losers', label: 'Top Losers', section: 'markets' },
  { id: 'entertainment/movies', label: 'Movies', section: 'entertainment' },
  { id: 'entertainment/series', label: 'TV Series', section: 'entertainment' },
  { id: 'entertainment/anime', label: 'Anime', section: 'entertainment' },
  { id: 'entertainment/gaming', label: 'Gaming', section: 'entertainment' },
  { id: 'viral/youtube', label: 'YouTube Trending', section: 'viral' },
  { id: 'viral/tiktok', label: 'TikTok Trending', section: 'viral' },
  { id: 'viral/music', label: 'Music Charts', section: 'viral' },
  { id: 'aitools/chatbots', label: 'AI Chatbots', section: 'aitools' },
  { id: 'aitools/image-gen', label: 'AI Image Generation', section: 'aitools' },
  { id: 'aitools/video-gen', label: 'AI Video Tools', section: 'aitools' },
  { id: 'aitools/coding', label: 'AI Coding Tools', section: 'aitools' },
  { id: 'software/android', label: 'Android Apps', section: 'software' },
  { id: 'software/ios', label: 'iOS Apps', section: 'software' },
  { id: 'software/windows', label: 'Windows Software', section: 'software' },
  { id: 'education/science', label: 'Science', section: 'education' },
  { id: 'education/engineering', label: 'Engineering', section: 'education' },
  { id: 'education/courses', label: 'Free Courses', section: 'education' },
  { id: 'travel/flight', label: 'Flights', section: 'travel' },
  { id: 'travel/hotel', label: 'Hotels', section: 'travel' },
  { id: 'weather/current', label: 'Weather', section: 'weather' },
  { id: 'germany/behoerden', label: 'Germany - Government', section: 'germany' },
  { id: 'germany/wohnung', label: 'Germany - Housing', section: 'germany' },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { lang } = useLang()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const filtered = useMemo(() => {
    if (!query.trim()) return allSections.slice(0, 8)
    const q = query.toLowerCase()
    return allSections.filter(s =>
      s.label.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
    ).slice(0, 10)
  }, [query])

  useEffect(() => { setSelectedIndex(0) }, [filtered])

  function navigate(item: typeof allSections[0]) {
    router.push(item.id.startsWith('/') ? item.id : `/section/${item.id}`)
    setOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      navigate(filtered[selectedIndex])
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg mx-4 rounded-2xl bg-[#111118] border border-white/[0.08] shadow-2xl shadow-black/80 overflow-hidden animate-scale-in">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
          <Search className="w-5 h-5 text-[#6b6b80] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={lang === 'az' ? 'Axtarış...' : lang === 'ru' ? 'Поиск...' : lang === 'de' ? 'Suchen...' : 'Search sections...'}
            className="flex-1 bg-transparent text-white text-sm placeholder-[#4a4a5e] outline-none"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] text-[#6b6b80]">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto py-2">
          {filtered.length === 0 && (
            <p className="text-center text-[#6b6b80] text-sm py-8">No results found</p>
          )}
          {filtered.map((item, i) => {
            const Icon = sectionIcons[item.section] || Globe2
            return (
              <button
                key={item.id}
                onClick={() => navigate(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  i === selectedIndex ? 'bg-indigo-500/10 text-white' : 'text-[#a0a0b0] hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  i === selectedIndex ? 'bg-indigo-500/20' : 'bg-white/[0.04]'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.label}</p>
                  <p className="text-[10px] text-[#6b6b80] capitalize">{item.section}</p>
                </div>
                <ArrowRight className={`w-4 h-4 shrink-0 transition-opacity ${i === selectedIndex ? 'opacity-100' : 'opacity-0'}`} />
              </button>
            )
          })}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-white/[0.06] text-[10px] text-[#4a4a5e]">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  )
}
