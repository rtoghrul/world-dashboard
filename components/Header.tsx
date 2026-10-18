'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Globe, ChevronDown, LogOut, LogIn, X, Search } from 'lucide-react'
import LanguagePicker from '@/components/LanguagePicker'
import { useLang } from '@/lib/LanguageContext'
import NotificationCenter from '@/components/NotificationCenter'
import ThemeToggle from '@/components/ThemeToggle'
import BookmarksPanel from '@/components/BookmarksPanel'
import FocusMode from '@/components/FocusMode'
import WhatsNew from '@/components/WhatsNew'
import { createClient } from '@/lib/supabase'
import { isAdminEmail } from '@/lib/admin'

import { menus, menuKeys } from '@/lib/menus'


const UI: Record<'search' | 'menu' | 'close' | 'login' | 'logout', Record<string, string>> = {
  search: { en: 'Search sections', az: 'Bölmələrdə axtar', ru: 'Поиск по разделам', de: 'Bereiche durchsuchen', tr: 'Bölümlerde ara', fr: 'Rechercher des sections', es: 'Buscar secciones', zh: '搜索栏目', ar: 'البحث في الأقسام', ja: 'セクションを検索', it: 'Cerca sezioni', pt: 'Pesquisar seções' },
  menu: { en: 'Menu', az: 'Menyu', ru: 'Меню', de: 'Menü', tr: 'Menü', fr: 'Menu', es: 'Menú', zh: '菜单', ar: 'القائمة', ja: 'メニュー', it: 'Menu', pt: 'Menu' },
  close: { en: 'Close', az: 'Bağla', ru: 'Закрыть', de: 'Schließen', tr: 'Kapat', fr: 'Fermer', es: 'Cerrar', zh: '关闭', ar: 'إغلاق', ja: '閉じる', it: 'Chiudi', pt: 'Fechar' },
  login: { en: 'Sign in', az: 'Daxil ol', ru: 'Войти', de: 'Anmelden', tr: 'Giriş yap', fr: 'Se connecter', es: 'Iniciar sesión', zh: '登录', ar: 'تسجيل الدخول', ja: 'ログイン', it: 'Accedi', pt: 'Entrar' },
  logout: { en: 'Sign out', az: 'Çıxış', ru: 'Выйти', de: 'Abmelden', tr: 'Çıkış yap', fr: 'Se déconnecter', es: 'Cerrar sesión', zh: '退出', ar: 'تسجيل الخروج', ja: 'ログアウト', it: 'Esci', pt: 'Sair' },
}


interface DropdownPortalProps {
  sectionId: string
  section: typeof menus[string]
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
    if (left + 200 > window.innerWidth) {
      left = buttonRect.right - 200
    }
    setPosition({ top, left: Math.max(8, left) })
  }, [buttonRect])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    function handleScroll(e: Event) {
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) return
      onClose()
    }
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
      className="min-w-[200px] max-h-[70vh] overflow-y-auto py-1.5 rounded-xl bg-surface-1 border border-line-strong shadow-2xl shadow-black/60"
    >
      {section.items.map(item => (
        <Link
          key={item.id}
          href={item.href || `/section/${item.section || sectionId}/${item.id}`}
          onClick={onClose}
          className="block px-4 py-2.5 text-sm text-ink-3 hover:text-ink-1 hover:bg-fg/[0.06] transition-colors"
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
  const [loggedIn, setLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const init = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setLoggedIn(true)
          setIsAdmin(isAdminEmail(user.email))
        }
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
      <header className="sticky top-0 z-50 bg-surface-1/90 backdrop-blur-xl border-b border-line">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                <Globe className="w-4 h-4 text-ink-1" />
              </div>
              <span className="text-ink-1 font-semibold text-[15px] tracking-tight hidden xl:block">World Dashboard</span>
            </Link>

            <nav className="hidden md:flex items-center mx-2 flex-1 overflow-x-auto scrollbar-thin">
              {menuKeys.map((id) => {
                const section = menus[id]
                return (
                  <button
                    key={id}
                    onClick={(e) => toggleMenu(id, e)}
                    className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-[12px] font-medium whitespace-nowrap transition-colors ${openMenu === id ? 'text-ink-1 bg-fg/[0.06]' : 'text-ink-3 hover:text-ink-1'}`}
                  >
                    {section.label[lang] || section.label.en}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openMenu === id ? 'rotate-180' : ''}`} />
                  </button>
                )
              })}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0 min-w-0">
              <button
                type="button"
                aria-label={UI.search[lang] || UI.search.en}
                onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-fg/[0.03] border border-line text-[11px] text-ink-4 hover:text-ink-1 hover:border-line-strong transition"
              >
                <Search className="w-3.5 h-3.5" aria-hidden="true" />
                <kbd className="ml-1 px-1 py-0.5 rounded bg-fg/[0.06] text-[10px]">⌘K</kbd>
              </button>
              <LanguagePicker />
              <ThemeToggle />
              <BookmarksPanel />
              {/* Focus mode is a desktop feature; hiding it keeps the header within 375px phones. */}
              <div className="hidden sm:block"><FocusMode /></div>
              <WhatsNew />
              {isAdmin && (
                <Link href="/admin" className="hidden sm:inline-block px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition">
                  Admin
                </Link>
              )}
              <NotificationCenter />
              {loggedIn ? (
                <button type="button" onClick={handleLogout} className="p-2 rounded-lg text-ink-3 hover:text-ink-1 hover:bg-fg/[0.04] transition" title={UI.logout[lang] || UI.logout.en} aria-label={UI.logout[lang] || UI.logout.en}>
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                </button>
              ) : (
                <Link href="/login" className="p-2 rounded-lg text-ink-3 hover:text-ink-1 hover:bg-fg/[0.04] transition" title={UI.login[lang] || UI.login.en} aria-label={UI.login[lang] || UI.login.en}>
                  <LogIn className="w-4 h-4" aria-hidden="true" />
                </Link>
              )}
              <button type="button" onClick={() => setMobileOpen(true)} aria-label={UI.menu[lang] || UI.menu.en} aria-expanded={mobileOpen} aria-controls="mobile-menu" className="md:hidden p-2 rounded-lg text-ink-3 hover:text-ink-1 hover:bg-fg/[0.04] transition">
                <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {mounted && openMenu && buttonRect && (
        <DropdownPortal
          sectionId={openMenu}
          section={menus[openMenu]}
          lang={lang}
          buttonRect={buttonRect}
          onClose={closeMenu}
        />
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-[99998] md:hidden" role="dialog" aria-modal="true" aria-label={UI.menu[lang] || UI.menu.en}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <nav id="mobile-menu" aria-label={UI.menu[lang] || UI.menu.en} className="absolute right-0 top-0 bottom-0 w-[80vw] max-w-xs bg-surface-1 border-l border-line overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-line">
              <span className="text-ink-1 font-semibold text-sm">{UI.menu[lang] || UI.menu.en}</span>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label={UI.close[lang] || UI.close.en} className="p-2 text-ink-3 hover:text-ink-1">
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            {isAdmin && (
              <Link href="/admin" onClick={() => setMobileOpen(false)} className="block mx-5 mt-3 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Admin
              </Link>
            )}
            <div className="py-2">
              {Object.entries(menus).map(([id, section]) => (
                <div key={id}>
                  <button
                    onClick={() => setMobileExpandedSection(mobileExpandedSection === id ? null : id)}
                    className="w-full flex items-center justify-between px-5 py-3 text-sm text-ink-3 hover:text-ink-1 hover:bg-fg/[0.03] transition"
                  >
                    {section.label[lang] || section.label.en}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileExpandedSection === id ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileExpandedSection === id && (
                    <div className="pb-2 pl-5">
                      {section.items.map(item => (
                        <Link
                          key={item.id}
                          href={item.href || `/section/${item.section || id}/${item.id}`}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-2.5 text-xs text-ink-4 hover:text-ink-1 transition"
                        >
                          {item.label[lang] || item.label.en}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
