'use client'
import { useCallback, useState } from 'react'
import Header from '@/components/Header'
import CryptoWidget from '@/components/CryptoWidget'
import NewsWidget from '@/components/NewsWidget'
import PolymarketWidget from '@/components/PolymarketWidget'
import FlightsWidget from '@/components/FlightsWidget'
import HotelsWidget from '@/components/HotelsWidget'
import ViralWidget from '@/components/ViralWidget'
import { useLang } from '@/lib/LanguageContext'

const SECTIONS = [
  { id: 'crypto', label: '₿ Crypto', emoji: '₿' },
  { id: 'news', label: '📰 News', emoji: '📰' },
  { id: 'polymarket', label: '🎯 Polymarket', emoji: '🎯' },
  { id: 'flights', label: '✈️ Flights', emoji: '✈️' },
  { id: 'hotels', label: '🏨 Hotels', emoji: '🏨' },
  { id: 'viral', label: '🔥 Viral', emoji: '🔥' },
]

export default function HomePage() {
  const { tr } = useLang()
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const handleRefresh = useCallback(() => setRefreshKey(k => k + 1), [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(id)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header onRefresh={handleRefresh} />

      {/* Quick Nav */}
      <div className="sticky top-[57px] z-40 bg-gray-950/90 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
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
        </div>
      </div>

      <main className="max-w-screen-2xl mx-auto px-4 py-6 space-y-6" key={refreshKey}>
        {/* Crypto - full width */}
        <section id="crypto">
          <CryptoWidget />
        </section>

        {/* News + Polymarket side by side */}
        <section id="news" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NewsWidget />
          <div id="polymarket">
            <PolymarketWidget />
          </div>
        </section>

        {/* Flights + Hotels side by side */}
        <section id="flights" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FlightsWidget />
          <div id="hotels">
            <HotelsWidget />
          </div>
        </section>

        {/* Viral - full width */}
        <section id="viral">
          <ViralWidget />
        </section>

        <footer className="text-center text-gray-600 text-xs py-4 border-t border-gray-800">
          World Dashboard · Real-time data from CoinGecko, Polymarket, BBC, TechCrunch, YouTube & more
        </footer>
      </main>
    </div>
  )
}
