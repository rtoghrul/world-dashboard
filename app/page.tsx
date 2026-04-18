'use client'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import CryptoWidget from '@/components/CryptoWidget'
import NewsWidget from '@/components/NewsWidget'
import PolymarketWidget from '@/components/PolymarketWidget'
import FlightsWidget from '@/components/FlightsWidget'
import HotelsWidget from '@/components/HotelsWidget'
import ViralWidget from '@/components/ViralWidget'
import { useLang } from '@/lib/LanguageContext'
import { createClient } from '@/lib/supabase'

const SECTIONS = [
  { id: 'crypto', label: '₿ Crypto' },
  { id: 'news', label: '📰 News' },
  { id: 'polymarket', label: '🎯 Polymarket' },
  { id: 'flights', label: '✈️ Flights' },
  { id: 'hotels', label: '🏨 Hotels' },
  { id: 'viral', label: '🔥 Viral' },
]

export default function HomePage() {
  const { tr } = useLang()
  const router = useRouter()
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const handleRefresh = useCallback(() => setRefreshKey(k => k + 1), [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(id)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email ?? null)
        setIsAdmin(user.email === 'eagleeye385@gmail.com')
        fetch('/api/pageview', { method: 'POST' })
      }
    }
    init()
  }, [])

  return (
    <div className="min-h-screen bg-gray-950">
      <Header onRefresh={handleRefresh} />

      {/* Quick Nav */}
      <div className="sticky top-[57px] z-40 bg-gray-950/90 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            <div className="flex gap-1 flex-1 overflow-x-auto">
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    activeSection === s.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              {isAdmin && (
                <Link href="/admin" className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition"
              >
                Çıxış
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-screen-2xl mx-auto px-4 py-6 space-y-6" key={refreshKey}>
        <section id="crypto"><CryptoWidget /></section>
        <section id="news" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NewsWidget />
          <div id="polymarket"><PolymarketWidget /></div>
        </section>
        <section id="flights" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FlightsWidget />
          <div id="hotels"><HotelsWidget /></div>
        </section>
        <section id="viral"><ViralWidget /></section>
        <footer className="text-center text-gray-600 text-xs py-4 border-t border-gray-800">
          World Dashboard · Real-time data from CoinGecko, Polymarket, BBC, TechCrunch, YouTube & more
        </footer>
      </main>
    </div>
  )
}
