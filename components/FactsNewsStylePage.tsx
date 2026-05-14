'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import { useLang } from '@/lib/LanguageContext'

const FACTS_PER_PAGE = 5
const SUPPORTED = ['en', 'az', 'ru', 'de', 'tr', 'fr', 'es', 'zh', 'ar', 'ja', 'it', 'pt'] as const
type Lang = typeof SUPPORTED[number]
type TextMap = Partial<Record<Lang, string>> & { en: string }

type FactCard = {
  image: string
  source: string
  sourceName: string
  title: TextMap
  text: TextMap
}

type CategoryData = {
  emoji: string
  name: TextMap
  facts: FactCard[]
}

const ui: Record<Lang, { back: string; chip: string; source: string; prev: string; next: string; page: (p:number,t:number)=>string }> = {
  en: { back: 'Back to facts', chip: 'Mind-blowing facts with sources', source: 'Open source', prev: 'Previous', next: 'Next', page: (p,t) => `Page ${p} of ${t}` },
  az: { back: 'Faktlara qayıt', chip: 'Mənbəli heyrətləndirici faktlar', source: 'Mənbəni aç', prev: 'Əvvəlki', next: 'Növbəti', page: (p,t) => `Səhifə ${p}/${t}` },
  ru: { back: 'Назад к фактам', chip: 'Удивительные факты с источниками', source: 'Открыть источник', prev: 'Назад', next: 'Далее', page: (p,t) => `Страница ${p} из ${t}` },
  de: { back: 'Zurück zu Fakten', chip: 'Verblüffende Fakten mit Quellen', source: 'Quelle öffnen', prev: 'Zurück', next: 'Weiter', page: (p,t) => `Seite ${p} von ${t}` },
  tr: { back: 'Faktlara dön', chip: 'Kaynaklı akıl almaz faktlar', source: 'Kaynağı aç', prev: 'Önceki', next: 'Sonraki', page: (p,t) => `Sayfa ${p}/${t}` },
  fr: { back: 'Retour aux faits', chip: 'Faits étonnants avec sources', source: 'Ouvrir la source', prev: 'Précédent', next: 'Suivant', page: (p,t) => `Page ${p} sur ${t}` },
  es: { back: 'Volver a hechos', chip: 'Hechos sorprendentes con fuentes', source: 'Abrir fuente', prev: 'Anterior', next: 'Siguiente', page: (p,t) => `Página ${p} de ${t}` },
  zh: { back: '返回事实', chip: '带来源的惊人事实', source: '打开来源', prev: '上一页', next: '下一页', page: (p,t) => `第 ${p} 页，共 ${t} 页` },
  ar: { back: 'العودة إلى الحقائق', chip: 'حقائق مذهلة مع مصادر', source: 'فتح المصدر', prev: 'السابق', next: 'التالي', page: (p,t) => `صفحة ${p} من ${t}` },
  ja: { back: '事実一覧へ戻る', chip: '出典付きの驚きの事実', source: '出典を開く', prev: '前へ', next: '次へ', page: (p,t) => `${p}/${t}ページ` },
  it: { back: 'Torna ai fatti', chip: 'Fatti sorprendenti con fonti', source: 'Apri fonte', prev: 'Precedente', next: 'Successivo', page: (p,t) => `Pagina ${p} di ${t}` },
  pt: { back: 'Voltar aos fatos', chip: 'Fatos surpreendentes com fontes', source: 'Abrir fonte', prev: 'Anterior', next: 'Próximo', page: (p,t) => `Página ${p} de ${t}` },
}

const data: Record<string, CategoryData> = {
  nature: {
    emoji: '🌿',
    name: { en: 'Nature', az: 'Təbiət', ru: 'Природа', de: 'Natur', tr: 'Doğa', fr: 'Nature', es: 'Naturaleza', zh: '自然', ar: 'الطبيعة', ja: '自然', it: 'Natura', pt: 'Natureza' },
    facts: [
      {
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
        source: 'https://www.fs.usda.gov/features/wood-wide-web',
        sourceName: 'USDA Forest Service',
        title: { en: 'Trees can share warning signals through forest networks', az: 'Ağaclar meşə şəbəkələri ilə xəbərdarlıq siqnalları paylaşa bilir', ru: 'Деревья могут передавать сигналы тревоги через лесные сети' },
        text: { en: 'Forests are not just groups of trees. Underground fungal networks can help plants exchange signals and resources.', az: 'Meşələr sadəcə ağac topluluğu deyil. Yeraltı göbələk şəbəkələri bitkilərin siqnal və resurs mübadiləsinə kömək edə bilər.', ru: 'Лес — это не просто группа деревьев. Подземные грибные сети могут помогать растениям обмениваться сигналами и ресурсами.' },
      },
      {
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        source: 'https://www.nps.gov/articles/wildland-fire-ecology.htm',
        sourceName: 'National Park Service',
        title: { en: 'Fire can be necessary for some ecosystems', az: 'Bəzi ekosistemlər üçün od vacib ola bilər', ru: 'Огонь может быть необходим для некоторых экосистем' },
        text: { en: 'Some landscapes evolved with fire. Controlled or natural fire can clear dead material and help certain plants reproduce.', az: 'Bəzi landşaftlar odla birlikdə təkamül edib. Təbii və ya nəzarətli yanğın ölü materialı təmizləyə və bəzi bitkilərin çoxalmasına kömək edə bilər.', ru: 'Некоторые ландшафты развивались вместе с огнём. Естественный или контролируемый огонь очищает сухую массу и помогает некоторым растениям размножаться.' },
      },
      {
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        source: 'https://oceanservice.noaa.gov/facts/mangroves.html',
        sourceName: 'NOAA Ocean Service',
        title: { en: 'Mangroves protect coastlines like living walls', az: 'Manqrov meşələri sahilləri canlı divar kimi qoruyur', ru: 'Мангровые леса защищают берега как живые стены' },
        text: { en: 'Mangrove roots slow waves, reduce erosion, and create nurseries for fish and other marine life.', az: 'Manqrov kökləri dalğaları zəiflədir, eroziyanı azaldır və balıqlar üçün təbii sığınacaq yaradır.', ru: 'Корни мангров ослабляют волны, уменьшают эрозию и создают убежища для рыб и другой морской жизни.' },
      },
      {
        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80',
        source: 'https://oceanservice.noaa.gov/facts/coralreef-climate.html',
        sourceName: 'NOAA Ocean Service',
        title: { en: 'Coral reefs are living cities under the sea', az: 'Koral rifləri dənizin altında yaşayan şəhərlər kimidir', ru: 'Коралловые рифы похожи на живые города под водой' },
        text: { en: 'Reefs support huge communities of animals, algae, and microbes, even though they cover a small part of the ocean floor.', az: 'Riflər okean dibinin kiçik hissəsini tutsa da, çox böyük canlı icmalarını saxlayır.', ru: 'Рифы занимают небольшую часть океанского дна, но поддерживают огромные сообщества животных, водорослей и микробов.' },
      },
      {
        image: 'https://images.unsplash.com/photo-1472145246862-b24cf25c4a36?auto=format&fit=crop&w=1200&q=80',
        source: 'https://www.nps.gov/articles/000/carnivorous-plants.htm',
        sourceName: 'National Park Service',
        title: { en: 'Carnivorous plants evolved traps because the soil was poor', az: 'Ətyeyən bitkilər kasıb torpağa görə tələlər inkişaf etdirib', ru: 'Хищные растения развили ловушки из-за бедной почвы' },
        text: { en: 'In nutrient-poor habitats, some plants evolved ways to trap and digest insects for extra nitrogen and minerals.', az: 'Qida maddəsi az olan mühitlərdə bəzi bitkilər əlavə azot və mineral almaq üçün həşəratları tutub həzm etməyə uyğunlaşıb.', ru: 'В бедных питательными веществами местах некоторые растения научились ловить и переваривать насекомых ради азота и минералов.' },
      },
    ],
  },
  astronomy: {
    emoji: '🔭',
    name: { en: 'Astronomy', az: 'Astronomiya', ru: 'Астрономия', de: 'Astronomie', tr: 'Astronomi', fr: 'Astronomie', es: 'Astronomía', zh: '天文学', ar: 'علم الفلك', ja: '天文学', it: 'Astronomia', pt: 'Astronomia' },
    facts: [
      {
        image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
        source: 'https://science.nasa.gov/venus/',
        sourceName: 'NASA Science',
        title: { en: 'A day on Venus is longer than a Venus year', az: 'Venerada bir gün bir ildən uzundur', ru: 'На Венере день длиннее года' },
        text: { en: 'Venus rotates so slowly that one full spin takes longer than one orbit around the Sun.', az: 'Venera o qədər yavaş fırlanır ki, bir tam dönüş Günəş ətrafında bir dövrdən daha uzun çəkir.', ru: 'Венера вращается так медленно, что один полный оборот длится дольше, чем её год вокруг Солнца.' },
      },
      {
        image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80',
        source: 'https://science.nasa.gov/universe/black-holes/',
        sourceName: 'NASA Science',
        title: { en: 'Black holes can bend light itself', az: 'Qara dəliklər işığın özünü əyə bilir', ru: 'Чёрные дыры могут искривлять сам свет' },
        text: { en: 'Their gravity is so strong that it curves spacetime and changes the path of light.', az: 'Onların cazibəsi o qədər güclüdür ki, məkan-zamanı əyir və işığın yolunu dəyişir.', ru: 'Их гравитация настолько сильна, что искривляет пространство-время и меняет путь света.' },
      },
    ],
  },
}

const fallbackNames: Record<string, TextMap> = {
  history: { en: 'History', az: 'Tarix', ru: 'История' },
  human: { en: 'Human', az: 'İnsan', ru: 'Человек' },
  animals: { en: 'Animals', az: 'Heyvanlar', ru: 'Животные' },
  science: { en: 'Science', az: 'Elm', ru: 'Наука' },
  ocean: { en: 'Ocean', az: 'Okean', ru: 'Океан' },
  space: { en: 'Space', az: 'Kosmos', ru: 'Космос' },
  earth: { en: 'Earth', az: 'Yer', ru: 'Земля' },
  technology: { en: 'Technology', az: 'Texnologiya', ru: 'Технологии' },
  psychology: { en: 'Psychology', az: 'Psixologiya', ru: 'Психология' },
  mysteries: { en: 'Mysteries', az: 'Sirlər', ru: 'Тайны' },
  'ancient-world': { en: 'Ancient World', az: 'Qədim dünya', ru: 'Древний мир' },
  'weird-facts': { en: 'Weird Facts', az: 'Qəribə faktlar', ru: 'Странные факты' },
}

function normalizeLang(value?: string | null): Lang {
  const code = (value || 'en').toLowerCase().split('-')[0]
  return SUPPORTED.includes(code as Lang) ? (code as Lang) : 'en'
}

function getText(map: TextMap, lang: Lang) {
  return map[lang] || map.en
}

function titleCase(v: string) {
  return v.charAt(0).toUpperCase() + v.slice(1)
}

function makeFallbackCategory(id: string, lang: Lang): CategoryData {
  const name = fallbackNames[id] || { en: titleCase(id.replaceAll('-', ' ')), az: titleCase(id.replaceAll('-', ' ')), ru: titleCase(id.replaceAll('-', ' ')) }
  const baseName = getText(name, lang)
  const source = 'https://www.britannica.com/'
  const generated = Array.from({ length: 100 }, (_, i) => ({
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80',
    source,
    sourceName: 'Britannica',
    title: {
      en: `Mind-blowing ${getText(name, 'en')} fact #${i + 1}`,
      az: `${baseName} haqqında heyrətləndirici fakt #${i + 1}`,
      ru: `Удивительный факт: ${baseName} #${i + 1}`,
    },
    text: {
      en: `Open the source to read more background and verify this topic before using it in content.`,
      az: `Bu mövzunu kontentdə istifadə etməzdən əvvəl mənbəni açıb daha ətraflı yoxlaya bilərsən.`,
      ru: `Откройте источник, чтобы подробнее изучить тему и проверить её перед использованием в контенте.`,
    },
  }))
  return { emoji: '✨', name, facts: generated }
}

function getVisiblePages(current: number, total: number) {
  const pages = new Set<number>([1, total])
  for (let p = current - 2; p <= current + 2; p += 1) if (p >= 1 && p <= total) pages.add(p)
  return Array.from(pages).sort((a, b) => a - b)
}

export default function FactsNewsStylePage({ id, page }: { id: string; page?: string }) {
  const { lang: contextLang } = useLang()
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const update = () => setLang(normalizeLang(localStorage.getItem('dashboard-lang') || contextLang))
    update()
    const timer = window.setInterval(update, 300)
    window.addEventListener('storage', update)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('storage', update)
    }
  }, [contextLang])

  const t = ui[lang]
  const category = data[id] || makeFallbackCategory(id, lang)
  const categoryName = getText(category.name, lang)
  const totalPages = Math.max(1, Math.ceil(category.facts.length / FACTS_PER_PAGE))
  const requestedPage = Number(page || '1')
  const currentPage = Number.isFinite(requestedPage) ? Math.min(Math.max(1, Math.floor(requestedPage)), totalPages) : 1
  const start = (currentPage - 1) * FACTS_PER_PAGE
  const cards = category.facts.slice(start, start + FACTS_PER_PAGE)
  const pages = getVisiblePages(currentPage, totalPages)

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
            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">{category.emoji} {categoryName}</h1>
            <p className="text-[#9a9aae] text-sm sm:text-base mt-3 leading-7">{t.page(currentPage, totalPages)}</p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {cards.map((card, index) => (
            <article key={`${card.source}-${index}`} className="rounded-2xl border border-white/[0.06] bg-[#0a0a10]/90 overflow-hidden hover:border-indigo-400/30 transition">
              <div className="aspect-[16/9] bg-white/[0.03] overflow-hidden">
                <img src={card.image} alt={getText(card.title, lang)} className="h-full w-full object-cover hover:scale-[1.03] transition duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-[11px] text-indigo-200 bg-indigo-500/10 border border-indigo-400/20 rounded-full px-2.5 py-1">{category.emoji} #{start + index + 1}</span>
                  <span className="text-[11px] text-[#6b6b80]">{card.sourceName}</span>
                </div>
                <h2 className="text-xl text-white font-semibold leading-snug">{getText(card.title, lang)}</h2>
                <p className="text-[#9a9aae] text-sm leading-6 mt-3">{getText(card.text, lang)}</p>
                <a href={card.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition">
                  {t.source} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </section>

        <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Facts pagination">
          <Link href={`/facts/${id}?page=${Math.max(1, currentPage - 1)}`} className={`rounded-lg border px-3 py-2 text-sm transition ${currentPage === 1 ? 'pointer-events-none border-white/[0.04] text-[#4a4a5e]' : 'border-white/[0.08] text-[#c7c7d8] hover:border-indigo-400/30 hover:text-white'}`}>{t.prev}</Link>
          {pages.map((pageNumber, index) => {
            const previousPage = pages[index - 1]
            const dots = previousPage && pageNumber - previousPage > 1
            return (
              <span key={pageNumber} className="flex items-center gap-2">
                {dots && <span className="text-[#6b6b80]">...</span>}
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
