'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import { getFactCategory, getFactsForCategory } from '@/lib/facts'
import { useLang } from '@/lib/LanguageContext'

const FACTS_PER_PAGE = 5
const SUPPORTED_LANGS = ['en', 'az', 'ru', 'de', 'tr', 'fr', 'es', 'zh', 'ar', 'ja', 'it', 'pt'] as const

type SupportedLang = typeof SUPPORTED_LANGS[number]
type ApiFact = { title: string; text: string; sourceName: string; sourceUrl: string }

type Copy = {
  back: string
  chip: string
  page: (page: number, totalPages: number, count: number, total: number) => string
  previous: string
  next: string
  learnMore: string
}

const copy: Record<SupportedLang, Copy> = {
  en: { back: 'Back to facts', chip: 'Did you know?', page: (p, t, c, total) => `Page ${p} of ${t}. Showing ${c} facts from ${total}.`, previous: 'Previous', next: 'Next', learnMore: 'Learn more' },
  az: { back: 'Faktlara qayıt', chip: 'Bilirdiniz?', page: (p, t, c, total) => `Səhifə ${p}/${t}. ${total} faktdan ${c} fakt göstərilir.`, previous: 'Əvvəlki', next: 'Növbəti', learnMore: 'Daha ətraflı' },
  ru: { back: 'Назад к фактам', chip: 'Знаете ли вы?', page: (p, t, c, total) => `Страница ${p} из ${t}. Показано ${c} фактов из ${total}.`, previous: 'Назад', next: 'Далее', learnMore: 'Подробнее' },
  de: { back: 'Zurück zu Fakten', chip: 'Wusstest du?', page: (p, t, c, total) => `Seite ${p} von ${t}. ${c} von ${total} Fakten werden angezeigt.`, previous: 'Zurück', next: 'Weiter', learnMore: 'Mehr erfahren' },
  tr: { back: 'Faktlara dön', chip: 'Biliyor muydun?', page: (p, t, c, total) => `Sayfa ${p}/${t}. ${total} fakttan ${c} fakt gösteriliyor.`, previous: 'Önceki', next: 'Sonraki', learnMore: 'Daha fazla bilgi' },
  fr: { back: 'Retour aux faits', chip: 'Le saviez-vous ?', page: (p, t, c, total) => `Page ${p} sur ${t}. ${c} faits affichés sur ${total}.`, previous: 'Précédent', next: 'Suivant', learnMore: 'En savoir plus' },
  es: { back: 'Volver a hechos', chip: '¿Sabías que?', page: (p, t, c, total) => `Página ${p} de ${t}. Mostrando ${c} hechos de ${total}.`, previous: 'Anterior', next: 'Siguiente', learnMore: 'Más información' },
  zh: { back: '返回事实', chip: '你知道吗？', page: (p, t, c, total) => `第 ${p} 页，共 ${t} 页。显示 ${c} 条事实，共 ${total} 条。`, previous: '上一页', next: '下一页', learnMore: '了解更多' },
  ar: { back: 'العودة إلى الحقائق', chip: 'هل تعلم؟', page: (p, t, c, total) => `صفحة ${p} من ${t}. يتم عرض ${c} حقائق من ${total}.`, previous: 'السابق', next: 'التالي', learnMore: 'اعرف المزيد' },
  ja: { back: '事実一覧へ戻る', chip: '知っていましたか？', page: (p, t, c, total) => `${p}/${t}ページ。全${total}件中${c}件を表示中。`, previous: '前へ', next: '次へ', learnMore: '詳しく見る' },
  it: { back: 'Torna ai fatti', chip: 'Lo sapevi?', page: (p, t, c, total) => `Pagina ${p} di ${t}. Mostrando ${c} fatti su ${total}.`, previous: 'Precedente', next: 'Successivo', learnMore: 'Scopri di più' },
  pt: { back: 'Voltar aos fatos', chip: 'Você sabia?', page: (p, t, c, total) => `Página ${p} de ${t}. Mostrando ${c} fatos de ${total}.`, previous: 'Anterior', next: 'Próximo', learnMore: 'Saiba mais' },
}

const categoryNames: Record<string, Partial<Record<SupportedLang, string>>> = {
  astronomy: { en: 'Astronomy', az: 'Astronomiya', ru: 'Астрономия', de: 'Astronomie', tr: 'Astronomi', fr: 'Astronomie', es: 'Astronomía', zh: '天文学', ar: 'علم الفلك', ja: '天文学', it: 'Astronomia', pt: 'Astronomia' },
  history: { en: 'History', az: 'Tarix', ru: 'История', de: 'Geschichte', tr: 'Tarih' },
  human: { en: 'Human', az: 'İnsan', ru: 'Человек', de: 'Mensch', tr: 'İnsan' },
  nature: { en: 'Nature', az: 'Təbiət', ru: 'Природа', de: 'Natur', tr: 'Doğa' },
  animals: { en: 'Animals', az: 'Heyvanlar', ru: 'Животные', de: 'Tiere', tr: 'Hayvanlar' },
  science: { en: 'Science', az: 'Elm', ru: 'Наука', de: 'Wissenschaft', tr: 'Bilim' },
  ocean: { en: 'Ocean', az: 'Okean', ru: 'Океан', de: 'Ozean', tr: 'Okyanus' },
  space: { en: 'Space', az: 'Kosmos', ru: 'Космос', de: 'Weltraum', tr: 'Uzay' },
  earth: { en: 'Earth', az: 'Yer', ru: 'Земля', de: 'Erde', tr: 'Dünya' },
  technology: { en: 'Technology', az: 'Texnologiya', ru: 'Технологии', de: 'Technologie', tr: 'Teknoloji' },
  psychology: { en: 'Psychology', az: 'Psixologiya', ru: 'Психология', de: 'Psychologie', tr: 'Psikoloji' },
  mysteries: { en: 'Mysteries', az: 'Sirlər', ru: 'Тайны', de: 'Mysterien', tr: 'Gizemler' },
  'ancient-world': { en: 'Ancient World', az: 'Qədim dünya', ru: 'Древний мир', de: 'Antike Welt', tr: 'Antik dünya' },
  'weird-facts': { en: 'Weird Facts', az: 'Qəribə faktlar', ru: 'Странные факты', de: 'Seltsame Fakten', tr: 'Tuhaf faktlar' },
}

function normalizeLang(value?: string | null): SupportedLang {
  const code = (value || 'en').toLowerCase().split('-')[0]
  return SUPPORTED_LANGS.includes(code as SupportedLang) ? (code as SupportedLang) : 'en'
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function getBaseTitle(title: string) {
  return title.split(' — ')[0]
}

function buildDetailsUrl(title: string, category: string) {
  const query = `${getBaseTitle(title)} ${category} fact explanation reliable source`
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`
}

function getVisiblePageNumbers(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages])
  for (let page = currentPage - 2; page <= currentPage + 2; page += 1) {
    if (page >= 1 && page <= totalPages) pages.add(page)
  }
  return Array.from(pages).sort((a, b) => a - b)
}

export default function FactsCategoryTranslated({ id, page }: { id: string; page?: string }) {
  const { lang: contextLang } = useLang()
  const [lang, setLang] = useState<SupportedLang>(() => normalizeLang(contextLang))
  const [apiFacts, setApiFacts] = useState<ApiFact[]>([])

  useEffect(() => {
    const readLang = () => setLang(normalizeLang(localStorage.getItem('dashboard-lang') || contextLang))
    readLang()
    const interval = window.setInterval(readLang, 500)
    window.addEventListener('storage', readLang)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('storage', readLang)
    }
  }, [contextLang])

  const category = getFactCategory(id)
  const categoryName = categoryNames[id]?.[lang] || categoryNames[id]?.en || category.title
  const t = copy[lang]
  const facts = getFactsForCategory(id)
  const totalPages = Math.max(1, Math.ceil(facts.length / FACTS_PER_PAGE))
  const requestedPage = Number(page || '1')
  const currentPage = Number.isFinite(requestedPage) ? Math.min(Math.max(1, Math.floor(requestedPage)), totalPages) : 1
  const startIndex = (currentPage - 1) * FACTS_PER_PAGE
  const paginatedFacts = facts.slice(startIndex, startIndex + FACTS_PER_PAGE)
  const visiblePages = getVisiblePageNumbers(currentPage, totalPages)

  useEffect(() => {
    const controller = new AbortController()

    async function loadTranslatedFacts() {
      try {
        const params = new URLSearchParams({ category: id, page: String(currentPage), lang })
        const response = await fetch(`/api/facts?${params.toString()}`, { signal: controller.signal })
        if (!response.ok) {
          setApiFacts([])
          return
        }
        const data = await response.json()
        setApiFacts(Array.isArray(data?.items) ? data.items : [])
      } catch {
        if (!controller.signal.aborted) setApiFacts([])
      }
    }

    loadTranslatedFacts()
    return () => controller.abort()
  }, [id, currentPage, lang])

  const cards = useMemo(() => paginatedFacts.map((fact, index) => {
    const translated = apiFacts[index]
    return {
      number: startIndex + index + 1,
      title: translated?.title || fact.title,
      text: translated?.text || fact.text,
      sourceUrl: translated?.sourceUrl || buildDetailsUrl(fact.title, category.title),
    }
  }), [apiFacts, category.title, paginatedFacts, startIndex])

  return (
    <div className="min-h-screen relative z-[1] w-full pb-20 md:pb-0">
      <Header />
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <Link href="/facts" className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition mb-5">
          <ArrowLeft className="w-3.5 h-3.5" /> {t.back}
        </Link>

        <section className="rounded-2xl border border-white/[0.06] bg-[#0a0a10]/80 overflow-hidden p-5 sm:p-8 relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.08] via-purple-500/[0.03] to-transparent pointer-events-none" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-indigo-200 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> {t.chip}
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              {category.emoji} {titleCase(categoryName)}
            </h1>
            <p className="text-[#9a9aae] text-sm sm:text-base mt-3 leading-7">
              {t.page(currentPage, totalPages, cards.length, facts.length)}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map(card => (
            <article key={card.number} className="rounded-xl border border-white/[0.04] bg-[#0a0a10]/80 p-5 hover:border-indigo-400/25 hover:bg-white/[0.025] transition">
              <div className="inline-flex items-center gap-1.5 text-[11px] text-indigo-200 bg-indigo-500/10 border border-indigo-400/20 rounded-full px-2.5 py-1 mb-4">
                {category.emoji} {categoryName} · #{card.number}
              </div>
              <h2 className="text-white text-lg font-semibold leading-snug">{card.title}</h2>
              <p className="text-[#9a9aae] text-sm leading-6 mt-3">{card.text}</p>
              <a href={card.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition">
                {t.learnMore} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </article>
          ))}
        </section>

        <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Facts pagination">
          <Link href={`/facts/${id}?page=${Math.max(1, currentPage - 1)}`} className={`rounded-lg border px-3 py-2 text-sm transition ${currentPage === 1 ? 'pointer-events-none border-white/[0.04] text-[#4a4a5e]' : 'border-white/[0.08] text-[#c7c7d8] hover:border-indigo-400/30 hover:text-white'}`}>{t.previous}</Link>
          {visiblePages.map((pageNumber, index) => {
            const previousPage = visiblePages[index - 1]
            const showDots = previousPage && pageNumber - previousPage > 1
            return (
              <span key={pageNumber} className="flex items-center gap-2">
                {showDots && <span className="text-[#6b6b80]">...</span>}
                <Link href={`/facts/${id}?page=${pageNumber}`} className={`rounded-lg border px-3 py-2 text-sm transition ${currentPage === pageNumber ? 'border-indigo-400/40 bg-indigo-500/15 text-indigo-100' : 'border-white/[0.08] text-[#c7c7d8] hover:border-indigo-400/30 hover:text-white'}`}>{pageNumber}</Link>
              </span>
            )
          })}
          <Link href={`/facts/${id}?page=${Math.min(totalPages, currentPage + 1)}`} className={`rounded-lg border px-3 py-2 text-sm transition ${currentPage === totalPages ? 'pointer-events-none border-white/[0.04] text-[#4a4a5e]' : 'border-white/[0.08] text-[#c7c7d8] hover:border-indigo-400/30 hover:text-white'}`}>{t.next}</Link>
        </nav>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}
