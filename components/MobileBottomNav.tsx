'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Newspaper, Bitcoin, Film, Zap, Search } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const tabs = [
  { id: '/', icon: Home, label: { en: 'Home', az: 'Ana', ru: 'Главная', de: 'Start' } },
  { id: '/section/news/top', icon: Newspaper, label: { en: 'News', az: 'Xəbər', ru: 'Новости', de: 'News' } },
  { id: '/section/markets/crypto-top', icon: Bitcoin, label: { en: 'Markets', az: 'Bazar', ru: 'Рынки', de: 'Märkte' } },
  { id: '/section/entertainment/movies', icon: Film, label: { en: 'Movies', az: 'Film', ru: 'Кино', de: 'Filme' } },
  { id: '/section/viral/youtube', icon: Zap, label: { en: 'Viral', az: 'Viral', ru: 'Вирус', de: 'Viral' } },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { lang } = useLang()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[9999] bg-[#07070b]/95 backdrop-blur-xl border-t border-white/[0.06] safe-area-bottom">
      <div className="flex items-center justify-around h-14 px-1">
        {tabs.map(tab => {
          const Icon = tab.icon
          const active = pathname === tab.id || (tab.id !== '/' && pathname.startsWith(tab.id.split('/').slice(0, 3).join('/')))
          return (
            <Link
              key={tab.id}
              href={tab.id}
              className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-lg transition-colors ${
                active ? 'text-indigo-400' : 'text-[#6b6b80]'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'drop-shadow-[0_0_6px_rgba(99,102,241,0.5)]' : ''}`} />
              <span className="text-[9px] font-medium">{tab.label[lang as keyof typeof tab.label] || tab.label.en}</span>
            </Link>
          )
        })}
        <button
          onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
          className="flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-lg text-[#6b6b80]"
        >
          <Search className="w-5 h-5" />
          <span className="text-[9px] font-medium">{lang === 'az' ? 'Axtar' : lang === 'ru' ? 'Поиск' : 'Search'}</span>
        </button>
      </div>
    </nav>
  )
}
