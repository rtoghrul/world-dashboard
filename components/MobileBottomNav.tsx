'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Newspaper, Bitcoin, Film, Lightbulb, Search } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const tabs = [
  { id: '/', icon: Home, label: { en: 'Home', az: 'Ana', de: 'Start', ru: 'Главная', tr: 'Ana sayfa', fr: 'Accueil', es: 'Inicio', zh: '首页', ar: 'الرئيسية', ja: 'ホーム', it: 'Home', pt: 'Início' } },
  { id: '/section/news/top', icon: Newspaper, label: { en: 'News', az: 'Xəbər', de: 'News', ru: 'Новости', tr: 'Haberler', fr: 'Actus', es: 'Noticias', zh: '新闻', ar: 'الأخبار', ja: 'ニュース', it: 'Notizie', pt: 'Notícias' } },
  { id: '/section/markets/crypto-top', icon: Bitcoin, label: { en: 'Markets', az: 'Bazar', de: 'Märkte', ru: 'Рынки', tr: 'Piyasalar', fr: 'Marchés', es: 'Mercados', zh: '市场', ar: 'الأسواق', ja: 'マーケット', it: 'Mercati', pt: 'Mercados' } },
  { id: '/section/entertainment/movies', icon: Film, label: { en: 'Movies', az: 'Film', de: 'Filme', ru: 'Фильмы', tr: 'Filmler', fr: 'Films', es: 'Películas', zh: '电影', ar: 'الأفلام', ja: '映画', it: 'Film', pt: 'Filmes' } },
  { id: '/section/facts/astronomy', icon: Lightbulb, label: { en: 'Facts', az: 'Faktlar', de: 'Fakten', ru: 'Факты', tr: 'Bilgiler', fr: 'Faits', es: 'Datos', zh: '趣闻', ar: 'حقائق', ja: '雑学', it: 'Curiosità', pt: 'Fatos' } },
]

const pick = (m: Record<string, string>, lang: string) => m[lang] || m.en
const SEARCH_LABEL: Record<string, string> = { en: 'Search', az: 'Axtar', ru: 'Поиск', de: 'Suche', tr: 'Ara', fr: 'Recherche', es: 'Buscar', zh: '搜索', ar: 'بحث', ja: '検索', it: 'Cerca', pt: 'Buscar' }
const NAV_LABEL: Record<string, string> = { en: 'Main navigation', az: 'Əsas naviqasiya', ru: 'Основная навигация', de: 'Hauptnavigation', tr: 'Ana gezinme', fr: 'Navigation principale', es: 'Navegación principal', zh: '主导航', ar: 'التنقل الرئيسي', ja: 'メインナビゲーション', it: 'Navigazione principale', pt: 'Navegação principal' }

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { lang } = useLang()

  return (
    <nav aria-label={pick(NAV_LABEL, lang)} className="md:hidden fixed bottom-0 left-0 right-0 z-[9999] bg-[#07070b]/95 backdrop-blur-xl border-t border-white/[0.06] safe-area-bottom">
      <div className="flex items-center justify-around h-14 px-1">
        {tabs.map(tab => {
          const Icon = tab.icon
          const active = pathname === tab.id || (tab.id !== '/' && pathname.startsWith(tab.id.split('/').slice(0, 3).join('/')))
          return (
            <Link
              key={tab.id}
              href={tab.id}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-lg transition-colors ${
                active ? 'text-indigo-400' : 'text-[#8b8b9e]'
              }`}
            >
              <Icon aria-hidden="true" className={`w-5 h-5 ${active ? 'drop-shadow-[0_0_6px_rgba(99,102,241,0.5)]' : ''}`} />
              <span className="text-[9px] font-medium">{tab.label[lang as keyof typeof tab.label] || tab.label.en}</span>
            </Link>
          )
        })}
        <button
          type="button"
          onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
          className="flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-lg text-[#8b8b9e]"
        >
          <Search className="w-5 h-5" aria-hidden="true" />
          <span className="text-[9px] font-medium">{pick(SEARCH_LABEL, lang)}</span>
        </button>
      </div>
    </nav>
  )
}
