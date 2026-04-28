'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Search, Settings2, Star, X } from 'lucide-react'
import Header from '@/components/Header'
import MarketTicker from '@/components/MarketTicker'
import CryptoWidget from '@/components/CryptoWidget'
import NewsWidget from '@/components/NewsWidget'
import PolymarketWidget from '@/components/PolymarketWidget'
import TravelWidgetI18n from '@/components/TravelWidgetI18n'
import WeatherWidget from '@/components/WeatherWidget'
import ViralWidget from '@/components/ViralWidget'
import WhaleWidget from '@/components/WhaleWidget'
import EntertainmentWidget from '@/components/EntertainmentWidget'
import SocialWidget from '@/components/SocialWidget'
import StocksWidget from '@/components/StocksWidget'
import EducationWidget from '@/components/EducationWidget'
import TodayBrief from '@/components/TodayBrief'
import { useLang } from '@/lib/LanguageContext'
import { createClient } from '@/lib/supabase'

export default function HomePage() {
  const { tr, lang } = useLang()
  const router = useRouter()
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const [prefsOpen, setPrefsOpen] = useState(false)
  const [sectionPrefs, setSectionPrefs] = useState<{ pinned: string[]; hidden: string[] }>({ pinned: [], hidden: [] })

  const travelLabel = lang === 'az' ? 'Səyahət Endirimləri' : lang === 'ru' ? 'Тревел-скидки' : lang === 'de' ? 'Reiseangebote' : lang === 'tr' ? 'Seyahat Fırsatları' : 'Travel Deals'
  const entertainmentLabel = lang === 'az' ? 'Kino və Seriallar' : lang === 'ru' ? 'Кино и сериалы' : lang === 'de' ? 'Filme & Serien' : lang === 'tr' ? 'Film ve Diziler' : 'Movies & Series'

  const sections = useMemo(() => [
    { id: 'brief', label: `✦ ${tr.title}`, keywords: ['brief', 'today', 'summary', 'icmal', 'xulase', 'dashboard'] },
    { id: 'weather', label: tr.weather, keywords: ['weather', 'hava', 'temperatur', 'погода', 'wetter'] },
    { id: 'crypto', label: tr.crypto, keywords: ['crypto', 'bitcoin', 'btc', 'kripto'] },
    { id: 'whale', label: tr.whaleActivity, keywords: ['whale', 'balina', 'large', 'wallet'] },
    { id: 'news', label: tr.news, keywords: ['news', 'xeber', 'xəbər', 'politics', 'ai'] },
    { id: 'travel', label: travelLabel, keywords: ['flight', 'flights', 'ucus', 'uçuş', 'travel', 'hotel', 'transport', 'train', 'bus', 'last minute'] },
    { id: 'viral', label: tr.viral, keywords: ['youtube', 'video', 'viral', 'trend'] },
    { id: 'entertainment', label: entertainmentLabel, keywords: ['movie', 'film', 'kino', 'series', 'serial', 'cartoon', 'multfilm', 'мультфильм'] },
    { id: 'social', label: tr.social, keywords: ['social', 'tiktok', 'instagram'] },
    { id: 'stocks', label: tr.stocks, keywords: ['stocks', 'stock', 'sehmler', 'səhm', 'market'] },
    { id: 'education', label: tr.education, keywords: ['education', 'course', 'kurs', 'research', 'automation', 'electrical', 'mechanical', 'engineering'] },
  ], [tr, travelLabel, entertainmentLabel])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('dashboard-section-prefs')
      if (!raw) return
      const parsed = JSON.parse(raw) as { pinned?: unknown; hidden?: unknown }
      const pinned = Array.isArray(parsed.pinned) ? parsed.pinned.filter(Boolean).map(String) : []
      const hidden = Array.isArray(parsed.hidden) ? parsed.hidden.filter(Boolean).map(String) : []
      setSectionPrefs({ pinned, hidden })
    } catch {}
  }, [])

  const savePrefs = useCallback((next: { pinned: string[]; hidden: string[] }) => {
    setSectionPrefs(next)
    try { localStorage.setItem('dashboard-section-prefs', JSON.stringify(next)) } catch {}
  }, [])

  const normalizedSearch = searchQuery.trim().toLowerCase()
  const visibleSections = useMemo(() => {
    const hiddenSet = new Set(sectionPrefs.hidden)
    let base = sections.filter(section => !hiddenSet.has(section.id))
    if (normalizedSearch) {
      base = base.filter(section => [section.label, ...section.keywords].join(' ').toLowerCase().includes(normalizedSearch))
    }
    const pinnedSet = new Set(sectionPrefs.pinned)
    return [...base.filter(section => pinnedSet.has(section.id)), ...base.filter(section => !pinnedSet.has(section.id))]
  }, [normalizedSearch, sectionPrefs.hidden, sectionPrefs.pinned, sections])

  const visibleIds = useMemo(() => new Set(visibleSections.map(section => section.id)), [visibleSections])

  const togglePinned = (id: string) => {
    const pinnedSet = new Set(sectionPrefs.pinned)
    if (pinnedSet.has(id)) pinnedSet.delete(id)
    else pinnedSet.add(id)
    savePrefs({ pinned: Array.from(pinnedSet), hidden: sectionPrefs.hidden })
  }

  const toggleHidden = (id: string) => {
    const hiddenSet = new Set(sectionPrefs.hidden)
    if (hiddenSet.has(id)) hiddenSet.delete(id)
    else hiddenSet.add(id)
    savePrefs({ pinned: sectionPrefs.pinned.filter(p => p !== id), hidden: Array.from(hiddenSet) })
  }

  const handleRefresh = useCallback(() => setRefreshKey(k => k + 1), [])
  const openSearch = () => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50) }
  const closeSearch = () => { setSearchOpen(false); setSearchQuery('') }
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); setActiveSection(id) }
  const handleLogout = async () => { try { const supabase = createClient(); await supabase.auth.signOut() } catch {}; router.push('/login') }

  useEffect(() => {
    const init = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) { setIsAdmin(user.email === 'eagleeye385@gmail.com'); fetch('/api/pageview', { method: 'POST' }) }
      } catch {}
    }
    init()
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    sections.map(s => s.id).forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setActiveSection(id) }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 })
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
        <div className="max-w-screen-2xl mx-auto px-4"><div className="flex items-center gap-2 py-2"><div className="flex gap-1 overflow-x-auto scrollbar-hide flex-1 min-w-0">{visibleSections.map(section => <button key={section.id} onClick={() => scrollTo(section.id)} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${activeSection === section.id ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>{section.label}</button>)}</div><div className="flex items-center gap-2 flex-shrink-0">{searchOpen ? <div className="flex items-center gap-1 rounded-lg bg-gray-800 px-2 py-1 focus-within:ring-2 focus-within:ring-indigo-500"><Search className="w-3 h-3 text-gray-400 flex-shrink-0"/><input ref={searchRef} type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={`${tr.search}…`} autoComplete="off" className="bg-transparent text-white text-xs outline-none w-32 placeholder-gray-500" onKeyDown={e => e.key === 'Escape' && closeSearch()}/><button onClick={closeSearch} aria-label="Close Search" className="text-gray-400 hover:text-white"><X className="w-3 h-3"/></button></div> : <button onClick={openSearch} aria-label={tr.search} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"><Search className="w-4 h-4"/></button>}<button type="button" onClick={() => setPrefsOpen(true)} aria-label="Customize Sections" className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"><Settings2 className="w-4 h-4"/></button>{isAdmin && <Link href="/admin" className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition">Admin</Link>}<button onClick={handleLogout} className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition">{tr.logout}</button></div></div></div>
      </div>

      {prefsOpen && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Customize Sections"><div className="absolute inset-0 bg-black/55" onClick={() => setPrefsOpen(false)} /><div className="absolute inset-x-0 top-16 mx-auto w-[min(720px,calc(100vw-2rem))] rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl"><div className="flex items-center justify-between px-5 py-4 border-b border-gray-800"><div><p className="text-white text-sm font-semibold">Customize</p><p className="text-gray-500 text-xs">Pin sections to the front, or hide the ones you don’t need.</p></div><button type="button" onClick={() => setPrefsOpen(false)} aria-label="Close" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"><X className="w-4 h-4" /></button></div><div className="max-h-[70vh] overflow-auto">{sections.map(section => { const pinned = sectionPrefs.pinned.includes(section.id); const hidden = sectionPrefs.hidden.includes(section.id); return <div key={section.id} className="flex items-center justify-between gap-3 px-5 py-3 border-b border-gray-800/60"><div className="min-w-0"><p className="text-white text-sm font-medium truncate">{section.label}</p><p className="text-gray-600 text-xs truncate">{section.keywords.slice(0, 5).join(', ')}</p></div><div className="flex items-center gap-2 flex-shrink-0"><button type="button" onClick={() => togglePinned(section.id)} className={`p-2 rounded-lg transition ${pinned ? 'bg-indigo-600/20 text-indigo-300' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}><Star className="w-4 h-4" /></button><button type="button" onClick={() => toggleHidden(section.id)} className={`p-2 rounded-lg transition ${hidden ? 'bg-gray-800 text-gray-200' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>{hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button></div></div> })}</div><div className="flex items-center justify-between gap-3 px-5 py-4"><button type="button" onClick={() => savePrefs({ pinned: [], hidden: [] })} className="text-xs text-gray-400 hover:text-white transition">Reset</button><button type="button" onClick={() => setPrefsOpen(false)} className="px-3 py-2 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition">Done</button></div></div></div>
      )}

      <main className="max-w-screen-2xl mx-auto px-4 py-6 space-y-6" key={refreshKey}>
        {visibleIds.has('brief') && <section id="brief"><TodayBrief /></section>}
        {visibleIds.has('weather') && <section id="weather"><WeatherWidget /></section>}
        {visibleIds.has('crypto') && <section id="crypto"><div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><CryptoWidget /><div id="polymarket"><PolymarketWidget /></div></div></section>}
        {visibleIds.has('whale') && <section id="whale"><WhaleWidget /></section>}
        {(visibleIds.has('news') || visibleIds.has('travel')) && <section id="news" className="grid grid-cols-1 lg:grid-cols-2 gap-6">{visibleIds.has('news') && <NewsWidget />}{visibleIds.has('travel') && <div id="travel"><TravelWidgetI18n /></div>}</section>}
        {visibleIds.has('viral') && <section id="viral"><ViralWidget /></section>}
        {visibleIds.has('entertainment') && <section id="entertainment"><EntertainmentWidget /></section>}
        {visibleIds.has('social') && <section id="social"><SocialWidget /></section>}
        {visibleIds.has('stocks') && <section id="stocks"><StocksWidget /></section>}
        {visibleIds.has('education') && <section id="education"><EducationWidget /></section>}
        {visibleSections.length === 0 && <section className="rounded-2xl border border-gray-800 bg-gray-900/60 px-5 py-10 text-center"><p className="text-sm font-medium text-white">No matching sections</p><p className="mt-1 text-xs text-gray-500">Try crypto, news, YouTube, stocks, travel, movies, weather, or education.</p></section>}
        <footer className="text-center text-gray-600 text-xs py-4 border-t border-gray-800">World Dashboard · CoinGecko, Polymarket, BBC, TechCrunch, YouTube & travel deals</footer>
      </main>
    </div>
  )
}
