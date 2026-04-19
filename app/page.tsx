'use client'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
import { useLang } from '@/lib/LanguageContext'
import { createClient } from '@/lib/supabase'

export default function HomePage() {
  const { tr } = useLang()
  const router = useRouter()
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const SECTIONS = [
    { id: 'crypto', label: `₿ ${tr.crypto}` },
    { id: 'whale', label: `🐋 ${tr.whaleActivity}` },
    { id: 'news', label: `📰 ${tr.news}` },
    { id: 'flights', label: `✈️ ${tr.flights}` },
    { id: 'viral', label: `🔥 ${tr.viral}` },
    { id: 'social', label: `📱 ${tr.social}` },
    { id: 'stocks', label: `📈 ${tr.stocks}` },
    { id: 'education', label: `🎓 ${tr.education}` },
  ]

  const handleRefresh = useCallback(() => setRefreshKey(k => k + 1), [])

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
    const sectionIds = SECTIONS.map(s => s.id)
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
  }, [refreshKey])

  return (
    <div className="min-h-screen bg-gray-950">
      <Header onRefresh={handleRefresh} />
      <MarketTicker />

      {/* Quick Nav */}
      <div className="sticky top-[57px] z-40 bg-gray-950/90 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center gap-2 py-2">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide flex-1 min-w-0">
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    activeSection === s.id ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isAdmin && (
                <Link href="/admin" className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition">
                {tr.logout}
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-screen-2xl mx-auto px-4 py-6 space-y-6" key={refreshKey}>
        {/* Crypto */}
        <section id="crypto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CryptoWidget />
            <div id="polymarket"><PolymarketWidget /></div>
          </div>
        </section>

        {/* Whale Activity */}
        <section id="whale">
          <WhaleWidget />
        </section>

        {/* News */}
        <section id="news" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NewsWidget />
          <div id="flights" className="space-y-4">
            <FlightsWidget />
            <div id="hotels"><HotelsWidget /></div>
          </div>
        </section>

        {/* Viral / YouTube */}
        <section id="viral">
          <ViralWidget />
        </section>

        {/* Social */}
        <section id="social">
          <SocialWidget />
        </section>

        {/* Stocks */}
        <section id="stocks">
          <StocksWidget />
        </section>

        {/* Education */}
        <section id="education">
          <EducationWidget />
        </section>

        <footer className="text-center text-gray-600 text-xs py-4 border-t border-gray-800">
          World Dashboard · CoinGecko, Polymarket, BBC, TechCrunch, YouTube & more
        </footer>
      </main>
    </div>
  )
}
