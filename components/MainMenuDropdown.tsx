'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Menu, X } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

type MenuItem = {
  id: string
  label: Record<string, string>
}

type MenuGroup = {
  key: string
  hrefBase: string
  label: Record<string, string>
  items: MenuItem[]
}

const menuGroups: MenuGroup[] = [
  {
    key: 'facts',
    hrefBase: '/facts',
    label: { en: 'Facts', az: 'Faktlar', ru: 'Факты', tr: 'Facts', de: 'Fakten' },
    items: [
      { id: 'astronomy', label: { en: 'Astronomy', az: 'Astronomiya', ru: 'Астрономия', de: 'Astronomie' } },
      { id: 'history', label: { en: 'History', az: 'Tarix', ru: 'История', de: 'Geschichte' } },
      { id: 'human', label: { en: 'Human', az: 'İnsan', ru: 'Человек', de: 'Mensch' } },
      { id: 'nature', label: { en: 'Nature', az: 'Təbiət', ru: 'Природа', de: 'Natur' } },
      { id: 'animals', label: { en: 'Animals', az: 'Heyvanlar', ru: 'Животные', de: 'Tiere' } },
      { id: 'science', label: { en: 'Science', az: 'Elm', ru: 'Наука', de: 'Wissenschaft' } },
      { id: 'ocean', label: { en: 'Ocean', az: 'Okean', ru: 'Океан', de: 'Ozean' } },
      { id: 'space', label: { en: 'Space', az: 'Kosmos', ru: 'Космос', de: 'Weltraum' } },
      { id: 'earth', label: { en: 'Earth', az: 'Yer', ru: 'Земля', de: 'Erde' } },
      { id: 'technology', label: { en: 'Technology', az: 'Texnologiya', ru: 'Технологии', de: 'Technologie' } },
      { id: 'psychology', label: { en: 'Psychology', az: 'Psixologiya', ru: 'Психология', de: 'Psychologie' } },
      { id: 'mysteries', label: { en: 'Mysteries', az: 'Sirlər', ru: 'Тайны', de: 'Mysterien' } },
      { id: 'ancient-world', label: { en: 'Ancient World', az: 'Qədim dünya', ru: 'Древний мир', de: 'Antike Welt' } },
      { id: 'weird-facts', label: { en: 'Weird Facts', az: 'Qəribə faktlar', ru: 'Странные факты', de: 'Seltsame Fakten' } },
    ],
  },
  {
    key: 'news',
    hrefBase: '/section/news',
    label: { en: 'News', az: 'Xəbərlər', ru: 'Новости', tr: 'Haberler', de: 'Nachrichten' },
    items: [
      { id: 'top', label: { en: 'Top', az: 'Əsas', ru: 'Главное', de: 'Top' } },
      { id: 'war', label: { en: 'War & Conflicts', az: 'Müharibə', ru: 'Война', de: 'Krieg' } },
      { id: 'politics', label: { en: 'Politics', az: 'Siyasət', ru: 'Политика', de: 'Politik' } },
      { id: 'economy', label: { en: 'Economy', az: 'İqtisadiyyat', ru: 'Экономика', de: 'Wirtschaft' } },
      { id: 'tech', label: { en: 'Technology', az: 'Texnologiya', ru: 'Технологии', de: 'Technik' } },
      { id: 'science', label: { en: 'Science', az: 'Elm', ru: 'Наука', de: 'Wissenschaft' } },
      { id: 'sports', label: { en: 'Sports', az: 'İdman', ru: 'Спорт', de: 'Sport' } },
      { id: 'health', label: { en: 'Health', az: 'Səhiyyə', ru: 'Здоровье', de: 'Gesundheit' } },
    ],
  },
  {
    key: 'markets',
    hrefBase: '/section/markets',
    label: { en: 'Markets', az: 'Bazarlar', ru: 'Рынки', tr: 'Piyasalar', de: 'Märkte' },
    items: [
      { id: 'crypto-top', label: { en: 'Crypto Top', az: 'Kripto Top', ru: 'Крипто Топ', de: 'Krypto Top' } },
      { id: 'bitcoin', label: { en: 'Bitcoin', az: 'Bitcoin', ru: 'Bitcoin', de: 'Bitcoin' } },
      { id: 'ethereum', label: { en: 'Ethereum', az: 'Ethereum', ru: 'Ethereum', de: 'Ethereum' } },
      { id: 'fear-greed', label: { en: 'Fear & Greed', az: 'Qorxu & Tamah', ru: 'Страх & Жадность', de: 'Angst & Gier' } },
      { id: 'stocks-top', label: { en: 'Stocks', az: 'Səhmlər', ru: 'Акции', de: 'Aktien' } },
      { id: 'gainers', label: { en: 'Top Gainers', az: 'Qalxanlar', ru: 'Рост', de: 'Gewinner' } },
      { id: 'losers', label: { en: 'Top Losers', az: 'Düşənlər', ru: 'Падение', de: 'Verlierer' } },
    ],
  },
  {
    key: 'entertainment',
    hrefBase: '/section/entertainment',
    label: { en: 'Entertainment', az: 'Əyləncə', ru: 'Развлечения', tr: 'Eğlence', de: 'Unterhaltung' },
    items: [
      { id: 'movies', label: { en: 'Movies', az: 'Filmlər', ru: 'Фильмы', de: 'Filme' } },
      { id: 'series', label: { en: 'TV Series', az: 'Seriallar', ru: 'Сериалы', de: 'Serien' } },
      { id: 'anime', label: { en: 'Anime', az: 'Anime', ru: 'Аниме', de: 'Anime' } },
      { id: 'gaming', label: { en: 'Gaming', az: 'Oyunlar', ru: 'Игры', de: 'Spiele' } },
      { id: 'cartoons', label: { en: 'Cartoons', az: 'Cizgi filmlər', ru: 'Мультфильмы', de: 'Cartoons' } },
    ],
  },
  {
    key: 'aitools',
    hrefBase: '/section/aitools',
    label: { en: 'AI Tools', az: 'AI Alətlər', ru: 'ИИ Инструменты', tr: 'YZ Araçları', de: 'KI-Tools' },
    items: [
      { id: 'chatbots', label: { en: 'AI Chatbots', az: 'AI Chatbotlar', ru: 'ИИ Чатботы', de: 'KI-Chatbots' } },
      { id: 'image-gen', label: { en: 'Image Generation', az: 'Şəkil Yaratma', ru: 'Генерация изображений', de: 'Bildgenerierung' } },
      { id: 'video-gen', label: { en: 'Video AI', az: 'Video AI', ru: 'Видео ИИ', de: 'Video-KI' } },
      { id: 'writing', label: { en: 'Writing AI', az: 'Yazı AI', ru: 'Написание ИИ', de: 'Schreib-KI' } },
      { id: 'coding', label: { en: 'Coding AI', az: 'Kod AI', ru: 'Код ИИ', de: 'Coding-KI' } },
      { id: 'free-tools', label: { en: 'Free AI Tools', az: 'Pulsuz AI', ru: 'Бесплатные ИИ', de: 'Kostenlose KI' } },
    ],
  },
  {
    key: 'software',
    hrefBase: '/section/software',
    label: { en: 'Software', az: 'Proqramlar', ru: 'Софт', tr: 'Yazılım', de: 'Software' },
    items: [
      { id: 'android', label: { en: 'Android Apps', az: 'Android', ru: 'Android', de: 'Android' } },
      { id: 'ios', label: { en: 'iOS Apps', az: 'iOS', ru: 'iOS', de: 'iOS' } },
      { id: 'windows', label: { en: 'Windows Software', az: 'Windows', ru: 'Windows', de: 'Windows' } },
      { id: 'mac', label: { en: 'Mac Apps', az: 'Mac', ru: 'Mac', de: 'Mac' } },
      { id: 'browser-ext', label: { en: 'Extensions', az: 'Əlavələr', ru: 'Расширения', de: 'Erweiterungen' } },
    ],
  },
  {
    key: 'education',
    hrefBase: '/section/education',
    label: { en: 'Learn', az: 'Təhsil', ru: 'Учёба', tr: 'Eğitim', de: 'Lernen' },
    items: [
      { id: 'courses', label: { en: 'Free Courses', az: 'Pulsuz kurslar', ru: 'Бесплатные курсы', de: 'Kostenlose Kurse' } },
      { id: 'science', label: { en: 'Science', az: 'Elm', ru: 'Наука', de: 'Wissenschaft' } },
      { id: 'math', label: { en: 'Mathematics', az: 'Riyaziyyat', ru: 'Математика', de: 'Mathematik' } },
      { id: 'engineering', label: { en: 'Engineering', az: 'Mühəndislik', ru: 'Инженерия', de: 'Ingenieurwesen' } },
      { id: 'languages', label: { en: 'Languages', az: 'Dillər', ru: 'Языки', de: 'Sprachen' } },
    ],
  },
  {
    key: 'travel',
    hrefBase: '/section/travel',
    label: { en: 'Travel', az: 'Səyahət', ru: 'Путешествия', tr: 'Seyahat', de: 'Reisen' },
    items: [
      { id: 'flight', label: { en: 'Flights', az: 'Uçuşlar', ru: 'Рейсы', de: 'Flüge' } },
      { id: 'hotel', label: { en: 'Hotels', az: 'Otellər', ru: 'Отели', de: 'Hotels' } },
      { id: 'flight-hotel', label: { en: 'Flight + Hotel', az: 'Uçuş + Otel', ru: 'Рейс + Отель', de: 'Flug + Hotel' } },
      { id: 'last-minute', label: { en: 'Last Minute', az: 'Son dəqiqə', ru: 'Горящие', de: 'Last Minute' } },
    ],
  },
  {
    key: 'weather',
    hrefBase: '/section/weather',
    label: { en: 'Weather', az: 'Hava', ru: 'Погода', tr: 'Hava', de: 'Wetter' },
    items: [
      { id: 'current', label: { en: 'Current', az: 'İndi', ru: 'Сейчас', de: 'Aktuell' } },
      { id: 'hourly', label: { en: 'Hourly', az: 'Saatlıq', ru: 'По часам', de: 'Stündlich' } },
      { id: 'weekly', label: { en: 'Weekly', az: 'Həftəlik', ru: 'Неделя', de: 'Wöchentlich' } },
    ],
  },
]

function getLabel(label: Record<string, string>, lang: string) {
  return label[lang] || label.en
}

function getHref(group: MenuGroup, item: MenuItem) {
  if (group.key === 'facts') return `/facts/${item.id}`
  return `${group.hrefBase}/${item.id}`
}

export default function MainMenuDropdown() {
  const { lang } = useLang()
  const [open, setOpen] = useState(false)
  const [activeKey, setActiveKey] = useState(menuGroups[0].key)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const activeGroup = menuGroups.find(group => group.key === activeKey) || menuGroups[0]

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)

    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="fixed top-[96px] left-8 z-[100000] hidden md:block">
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        className="flex items-center gap-2 rounded-xl border border-indigo-400/30 bg-indigo-600/90 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 hover:bg-indigo-500 transition"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        Menu
      </button>

      {open && (
        <div className="mt-2 flex rounded-2xl border border-white/[0.08] bg-[#08080f]/98 shadow-2xl shadow-black/40 overflow-hidden backdrop-blur-xl">
          <div className="w-64 max-h-[70vh] overflow-y-auto py-2 border-r border-white/[0.06]">
            {menuGroups.map(group => {
              const active = group.key === activeGroup.key
              return (
                <Link
                  key={group.key}
                  href={group.key === 'facts' ? '/facts' : `${group.hrefBase}/${group.items[0].id}`}
                  onMouseEnter={() => setActiveKey(group.key)}
                  onFocus={() => setActiveKey(group.key)}
                  className={`flex items-center justify-between px-4 py-3 text-sm transition ${
                    active ? 'bg-indigo-500/15 text-indigo-100' : 'text-[#a5a5b8] hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <span>{getLabel(group.label, lang)}</span>
                  <ChevronRight className="h-4 w-4 opacity-60" />
                </Link>
              )
            })}
          </div>

          <div className="w-72 max-h-[70vh] overflow-y-auto p-2">
            <div className="px-3 py-2 text-xs uppercase tracking-[0.18em] text-[#6b6b80]">
              {getLabel(activeGroup.label, lang)}
            </div>
            <div className="grid gap-1">
              {activeGroup.items.map(item => (
                <Link
                  key={item.id}
                  href={getHref(activeGroup, item)}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm text-[#c7c7d8] hover:bg-indigo-500/10 hover:text-white transition"
                >
                  {getLabel(item.label, lang)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
