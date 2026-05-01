'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Globe, ChevronDown, LogOut, X, Search } from 'lucide-react'
import LanguagePicker from '@/components/LanguagePicker'
import { useLang } from '@/lib/LanguageContext'
import { createClient } from '@/lib/supabase'

const menuStructure: Record<string, { label: Record<string,string>; items: { id: string; label: Record<string,string> }[] }> = {
  weather: {
    label: { en: 'Weather', az: 'Hava', ru: 'Погода' },
    items: [
      { id: 'current', label: { en: 'Current', az: 'İndi', ru: 'Сейчас' } },
      { id: 'hourly', label: { en: 'Hourly', az: 'Saatlıq', ru: 'По часам' } },
      { id: 'weekly', label: { en: 'Weekly', az: 'Həftəlik', ru: 'Неделя' } },
    ]
  },
  crypto: {
    label: { en: 'Crypto', az: 'Kripto', ru: 'Крипто' },
    items: [
      { id: 'top', label: { en: 'Top Coins', az: 'Top Coinlər', ru: 'Топ монеты' } },
      { id: 'bitcoin', label: { en: 'Bitcoin', az: 'Bitcoin', ru: 'Bitcoin' } },
      { id: 'ethereum', label: { en: 'Ethereum', az: 'Ethereum', ru: 'Ethereum' } },
      { id: 'fear-greed', label: { en: 'Fear & Greed', az: 'Fear & Greed', ru: 'Страх и жадность' } },
    ]
  },
  whale: {
    label: { en: 'Whale', az: 'Balina', ru: 'Киты' },
    items: [
      { id: 'large-transfers', label: { en: 'Large Transfers', az: 'Böyük Transferlər', ru: 'Крупные переводы' } },
      { id: 'wallets', label: { en: 'Wallets', az: 'Cüzdanlar', ru: 'Кошельки' } },
      { id: 'exchanges', label: { en: 'Exchanges', az: 'Birjalar', ru: 'Биржи' } },
    ]
  },
  news: {
    label: { en: 'News', az: 'Xəbərlər', ru: 'Новости' },
    items: [
      { id: 'top', label: { en: 'Top', az: 'Top', ru: 'Топ' } },
      { id: 'war', label: { en: 'War', az: 'Müharibə', ru: 'Война' } },
      { id: 'politics', label: { en: 'Politics', az: 'Siyasət', ru: 'Политика' } },
      { id: 'economy', label: { en: 'Economy', az: 'İqtisadiyyat', ru: 'Экономика' } },
      { id: 'ai', label: { en: 'AI', az: 'AI', ru: 'AI' } },
      { id: 'industry', label: { en: 'Industry', az: 'Sənaye', ru: 'Индустрия' } },
      { id: 'social', label: { en: 'Social', az: 'Sosial', ru: 'Соцсети' } },
    ]
  },
  travel: {
    label: { en: 'Travel', az: 'Səyahət', ru: 'Путешествия' },
    items: [
      { id: 'flight-hotel', label: { en: 'Flight + Hotel', az: 'Uçuş + Otel', ru: 'Рейс + Отель' } },
      { id: 'flight', label: { en: 'Flights', az: 'Uçuşlar', ru: 'Рейсы' } },
      { id: 'hotel', label: { en: 'Hotels', az: 'Otellər', ru: 'Отели' } },
      { id: 'last-minute', label: { en: 'Last Minute', az: 'Son Dəqiqə', ru: 'Горящие туры' } },
    ]
  },
  viral: {
    label: { en: 'Viral', az: 'Viral', ru: 'Вирусное' },
    items: [
      { id: 'youtube', label: { en: 'YouTube', az: 'YouTube', ru: 'YouTube' } },
      { id: 'music', label: { en: 'Music', az: 'Musiqi', ru: 'Музыка' } },
      { id: 'shorts', label: { en: 'Shorts', az: 'Shorts', ru: 'Shorts' } },
      { id: 'trending', label: { en: 'Trending', az: 'Trend', ru: 'Тренды' } },
    ]
  },
  entertainment: {
    label: { en: 'Movies', az: 'Kino', ru: 'Кино' },
    items: [
      { id: 'movies', label: { en: 'Movies', az: 'Filmlər', ru: 'Фильмы' } },
      { id: 'series', label: { en: 'Series', az: 'Seriallar', ru: 'Сериалы' } },
      { id: 'cartoons', label: { en: 'Cartoons', az: 'Multfilmlər', ru: 'Мультфильмы' } },
      { id: 'upcoming', label: { en: 'Upcoming', az: 'Gözlənilən', ru: 'Ожидаемые' } },
    ]
  },
  social: {
    label: { en: 'Social', az: 'Sosial', ru: 'Соцсети' },
    items: [
      { id: 'instagram', label: { en: 'Instagram', az: 'Instagram', ru: 'Instagram' } },
      { id: 'tiktok', label: { en: 'TikTok', az: 'TikTok', ru: 'TikTok' } },
      { id: 'x', label: { en: 'X (Twitter)', az: 'X (Twitter)', ru: 'X (Twitter)' } },
      { id: 'facebook', label: { en: 'Facebook', az: 'Facebook', ru: 'Facebook' } },
    ]
  },
  stocks: {
    label: { en: 'Stocks', az: 'Səhmlər', ru: 'Акции' },
    items: [
      { id: 'top', label: { en: 'Top', az: 'Top', ru: 'Топ' } },
      { id: 'gainers', label: { en: 'Gainers', az: 'Qalxanlar', ru: 'Рост' } },
      { id: 'losers', label: { en: 'Losers', az: 'Düşənlər', ru: 'Падение' } },
      { id: 'tech', label: { en: 'Tech', az: 'Texnologiya', ru: 'Технологии' } },
    ]
  },
  education: {
    label: { en: 'Learn', az: 'Təhsil', ru: 'Учёба' },
    items: [
      { id: 'courses', label: { en: 'Courses', az: 'Kurslar', ru: 'Курсы' } },
      { id: 'engineering', label: { en: 'Engineering', az: 'Mühəndislik', ru: 'Инженерия' } },
      { id: 'ai-tools', label: { en: 'AI Tools', az: 'AI Alətləri', ru: 'AI инструменты' } },
      { id: 'cybersecurity', label: { en: 'Cybersecurity', az: 'Kibertəhlükəsizlik', ru: 'Кибербезопасность' } },
    ]
  },
}

const menuKeys = Object.keys(menuStructure)

interface DropdownPortalProps {
  sectionId: string
  section: typeof menuStructure[string]
  lang: string
  buttonRect: DOMRect
  onClose: () => void
}

function DropdownPortal({ sectionId, section, lang, buttonRect, onClose }: DropdownPortalProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const top = buttonRect.bottom + 4
    let left = buttonRect.left
    // If dropdown would overflow right edge, align to right
    if (left + 180 > window.innerWidth) {
      left = buttonRect.right - 180
    }
    setPosition({ top, left: Math.max(8, left) })
  }, [buttonRect])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    function handleScroll() { onClose() }
    document.addEventListener('mousedown', handleClick)
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [onClose])

  return createPortal(
    <div
      ref={dropdownRef}
      style={{ position: 'fixed', top: position.top, left: position.left, zIndex: 99999 }}
      className="min-w-[180px] py-1.5 rounded-xl bg-[#111118] border border-white/[0.08] shadow-2xl shadow-black/60"
    >
      {section.items.map(item => (
        <Link
          key={item.id}
          href={`/section/${sectionId}/${item.id}`}
          onClick={onClose}
          className="block px-4 py-2.5 text-sm text-[#a0a0b0] hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          {item.label[lang] || item.label.en}
        </Link>
      ))}
    </div>,
    document.body
  )
}

export default function Header() {
  const { lang } = useLang()
  const router = useRouter()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const init = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) setIsAdmin(user.email === 'eagleeye385@gmail.com')
      } catch {}
    }
    init()
  }, [])

  const toggleMenu = useCallback((id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (openMenu === id) {
      setOpenMenu(null)
      setButtonRect(null)
    } else {
      setOpenMenu(id)
      setButtonRect(e.currentTarget.getBoundingClientRect())
    }
  }, [openMenu])

  const closeMenu = useCallback(() => {
    setOpenMenu(null)
    setButtonRect(null)
  }, [])

  const handleLogout = async () => {
    try { const supabase = createClient(); await supabase.auth.signOut() } catch {}
    router.push('/login')
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#07070b]/90 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold text-[15px] tracking-tight hidden xl:block">World Dashboard</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center mx-2 flex-1 flex-wrap">
              {menuKeys.map((id) => {
                const section = menuStructure[id]
                return (
                  <button
                    key={id}
                    onClick={(e) => toggleMenu(id, e)}
                    className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-[12px] font-medium whitespace-nowrap transition-colors ${openMenu === id ? 'text-white bg-white/[0.06]' : 'text-[#8b8b9e] hover:text-white'}`}
                  >
                    {section.label[lang] || section.label.en}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openMenu === id ? 'rotate-180' : ''}`} />
                  </button>
                )
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Search trigger for Cmd+K */}
              <button
                onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-[#6b6b80] hover:text-white hover:border-white/[0.1] transition"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Search</span>
                <kbd className="ml-1 px-1 py-0.5 rounded bg-white/[0.06] text-[10px]">⌘K</kbd>
              </button>
              <LanguagePicker />
              {isAdmin && (
                <Link href="/admin" className="px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="p-2 rounded-lg text-[#6b6b80] hover:text-white hover:bg-white/[0.04] transition" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
              {/* Mobile menu button */}
              <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 rounded-lg text-[#6b6b80] hover:text-white hover:bg-white/[0.04] transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Portal-based dropdown - renders outside header DOM */}
      {mounted && openMenu && buttonRect && (
        <DropdownPortal
          sectionId={openMenu}
          section={menuStructure[openMenu]}
          lang={lang}
          buttonRect={buttonRect}
          onClose={closeMenu}
        />
      )}

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[99998] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[80vw] max-w-xs bg-[#0a0a10] border-l border-white/[0.04] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-white/[0.04]">
              <span className="text-white font-semibold text-sm">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-[#6b6b80] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-2">
              {Object.entries(menuStructure).map(([id, section]) => (
                <div key={id}>
                  <button
                    onClick={() => setMobileExpandedSection(mobileExpandedSection === id ? null : id)}
                    className="w-full flex items-center justify-between px-5 py-3 text-sm text-[#a0a0b0] hover:text-white hover:bg-white/[0.03] transition"
                  >
                    {section.label[lang] || section.label.en}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileExpandedSection === id ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileExpandedSection === id && (
                    <div className="pb-2 pl-5">
                      {section.items.map(item => (
                        <Link
                          key={item.id}
                          href={`/section/${id}/${item.id}`}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-2.5 text-xs text-[#6b6b80] hover:text-white transition"
                        >
                          {item.label[lang] || item.label.en}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
