'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import Header from '@/components/Header'
import MarketTicker from '@/components/MarketTicker'
import CryptoWidget from '@/components/CryptoWidget'
import NewsWidget from '@/components/NewsWidget'
import PolymarketWidget from '@/components/PolymarketWidget'
import FlightsWidget from '@/components/FlightsWidget'
import HotelsWidget from '@/components/HotelsWidget'
import ViralWidget from '@/components/ViralWidget'
import WhaleWidget from '@/components/WhaleWidget'
import SocialWidget from '@/components/SocialWidget'
import StocksWidget from '@/components/StocksWidget'
import EducationWidget from '@/components/EducationWidget'
import TodayBrief from '@/components/TodayBrief'
import TopicNewsWidget from '@/components/TopicNewsWidget'
import { useLang } from '@/lib/LanguageContext'
import { createClient } from '@/lib/supabase'
import { Bot, Cog, Zap } from 'lucide-react'

export default function HomePage() {
  const { tr } = useLang()
  const router = useRouter()
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  const sections = useMemo(() => [
    { id: 'brief', label: `✦ ${tr.title}`, keywords: ['brief', 'today', 'summary', 'icmal', 'xulase', 'dashboard'] },
    { id: 'crypto', label: `BTC ${tr.crypto}`, keywords: ['crypto', 'bitcoin', 'btc', 'kripto'] },
    { id: 'whale', label: `Whale ${tr.whaleActivity}`, keywords: ['whale', 'balina', 'large', 'wallet'] },
    { id: 'news', label: `News ${tr.news}`, keywords: ['news', 'xeber', 'xəbər', 'politics', 'ai'] },
    { id: 'flights', label: `Flights ${tr.flights}`, keywords: ['flight', 'flights', 'ucus', 'uçuş', 'travel', 'hotel'] },
    { id: 'viral', label: `YouTube ${tr.viral}`, keywords: ['youtube', 'video', 'viral', 'trend'] },
    { id: 'social', label: `Social ${tr.social}`, keywords: ['social', 'tiktok', 'instagram'] },
    { id: 'stocks', label: `Stocks ${tr.stocks}`, keywords: ['stocks', 'stock', 'sehmler', 'səhm', 'market'] },
    { id: 'education', label: `Edu ${tr.education}`, keywords: ['education', 'course', 'kurs', 'research'] },
    { id: 'automation', label: `Automation ${tr.automation}`, keywords: ['automation', 'robot', 'plc'] },
    { id: 'electrical', label: `Electrical ${tr.electrical}`, keywords: ['electrical', 'electronics', 'power', 'chip'] },
    { id: 'mechanical', label: `Mechanical ${tr.mechanical}`, keywords: ['mechanical', 'manufacturing', 'cad', 'machine'] },
  ], [tr])

  const normalizedSearch = searchQuery.trim().toLowerCase()
  const visibleSections = useMemo(() => {
    if (!normalizedSearch) return sections
    return sections.filter(section => {
      const haystack = [section.label, ...section.keywords].join(' ').toLowerCase()
      return haystack.includes(normalizedSearch)
    })
  }, [normalizedSearch, sections])
  const visibleIds = useMemo(() => new Set(visibleSections.map(section => section.id)), [visibleSections])

  const handleRefresh = useCallback(() => setRefreshKey(k => k + 1), [])

  const openSearch = () => {
    setSearchOpen(true)
    setTimeout(() => searchRef.current?.focus(), 50)
  }
  const closeSearch = () => {
    setSearchOpen(false)
    setSearchQuery('')
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(id)
  }

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {}
    router.push('/login')
  }

  useEffect(() => {
    const init = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setIsAdmin(user.email === 'eagleeye385@gmail.com')
          fetch('/api/pageview', { method: 'POST' })
        }
      } catch {}
    }
    init()
  }, [])

  useEffect(() => {
    const sectionIds = sections.map(s => s.id)
    const observers: IntersectionObserver[] = []

    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [refreshKey, sections])

  return (
    <div className="min-h-screen bg-gray-950">
      <Header onRefresh={handleRefresh} />
      <MarketTicker />

      <div className="sticky top-[57px] z-40 bg-gray-950/90 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center gap-2 py-2">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide flex-1 min-w-0">
              {visibleSections.map(section => (
                <button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    activeSection === section.id ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {searchOpen ? (
                <div className="flex items-center gap-1 rounded-lg bg-gray-800 px-2 py-1 focus-within:ring-2 focus-within:ring-indigo-500">
                  <Search className="w-3 h-3 text-gray-400 flex-shrink-0" aria-hidden="true" />
                  <input
                    ref={searchRef}
                    type="text"
                    name="dashboard-search"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={`${tr.search}…`}
                    autoComplete="off"
                    className="bg-transparent text-white text-xs outline-none w-32 placeholder-gray-500"
                    onKeyDown={e => e.key === 'Escape' && closeSearch()}
                  />
                  <button onClick={closeSearch} aria-label="Close Search" className="text-gray-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                    <X className="w-3 h-3" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <button onClick={openSearch} aria-label={tr.search} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                  <Search className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
              {isAdmin && (
                <Link href="/admin" className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                {tr.logout}
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-screen-2xl mx-auto px-4 py-6 space-y-6" key={refreshKey}>
        {visibleIds.has('brief') && (
          <section id="brief">
            <TodayBrief />
          </section>
        )}

        {visibleIds.has('crypto') && (
          <section id="crypto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CryptoWidget />
              <div id="polymarket"><PolymarketWidget /></div>
            </div>
          </section>
        )}

        {visibleIds.has('whale') && (
          <section id="whale">
            <WhaleWidget />
          </section>
        )}

        {(visibleIds.has('news') || visibleIds.has('flights')) && (
          <section id="news" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {visibleIds.has('news') && <NewsWidget />}
            {visibleIds.has('flights') && (
              <div id="flights" className="space-y-4">
                <FlightsWidget />
                <div id="hotels"><HotelsWidget /></div>
              </div>
            )}
          </section>
        )}

        {visibleIds.has('viral') && (
          <section id="viral">
            <ViralWidget />
          </section>
        )}

        {visibleIds.has('social') && (
          <section id="social">
            <SocialWidget />
          </section>
        )}

        {visibleIds.has('stocks') && (
          <section id="stocks">
            <StocksWidget />
          </section>
        )}

        {visibleIds.has('education') && (
          <section id="education">
            <EducationWidget />
          </section>
        )}

        {visibleIds.has('automation') && (
          <section id="automation">
            <TopicNewsWidget
              topic="automation"
              title={tr.automation}
              desc={tr.automationDesc}
              accentClass="text-indigo-300"
              icon={<Bot className="w-4 h-4" aria-hidden="true" />}
            />
          </section>
        )}

        {visibleIds.has('electrical') && (
          <section id="electrical">
            <TopicNewsWidget
              topic="electrical"
              title={tr.electrical}
              desc={tr.electricalDesc}
              accentClass="text-amber-300"
              icon={<Zap className="w-4 h-4" aria-hidden="true" />}
            />
          </section>
        )}

        {visibleIds.has('mechanical') && (
          <section id="mechanical">
            <TopicNewsWidget
              topic="mechanical"
              title={tr.mechanical}
              desc={tr.mechanicalDesc}
              accentClass="text-emerald-300"
              icon={<Cog className="w-4 h-4" aria-hidden="true" />}
            />
          </section>
        )}

        {visibleSections.length === 0 && (
          <section className="rounded-2xl border border-gray-800 bg-gray-900/60 px-5 py-10 text-center">
            <p className="text-sm font-medium text-white">No matching sections</p>
            <p className="mt-1 text-xs text-gray-500">Try crypto, news, YouTube, stocks, flights, or education.</p>
          </section>
        )}

        <footer className="text-center text-gray-600 text-xs py-4 border-t border-gray-800">
          World Dashboard · CoinGecko, Polymarket, BBC, TechCrunch, YouTube & more
        </footer>
      </main>
    </div>
  )
}
