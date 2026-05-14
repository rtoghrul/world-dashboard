'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import { getFactCategory, getFactsForCategory } from '@/lib/facts'
import { useLang } from '@/lib/LanguageContext'

const FACTS_PER_PAGE = 5
const SUPPORTED_LANGS = ['en', 'az', 'ru', 'de', 'tr', 'fr', 'es', 'zh', 'ar', 'ja', 'it', 'pt'] as const

type SupportedLang = typeof SUPPORTED_LANGS[number]
type LocalizedFact = { title: string; text: string }

type Dictionary = {
  back: string
  chip: string
  heading: (category: string) => string
  subtitle: (page: number, pages: number, count: number, total: number) => string
  previous: string
  next: string
  fallbackTitle: (category: string, n: number) => string
  fallbackText: (category: string) => string
}

const dictionaries: Record<SupportedLang, Dictionary> = {
  en: {
    back: 'Back to facts',
    chip: 'Did you know?',
    heading: c => `${titleCase(c)} Facts`,
    subtitle: (p, pages, count, total) => `Only mind-blowing facts — page ${p} of ${pages}. Showing ${count} topics from ${total} total.`,
    previous: 'Previous',
    next: 'Next',
    fallbackTitle: (c, n) => `Did you know? A mind-blowing fact about ${c} #${n}`,
    fallbackText: c => `This fact about ${c} reveals a surprising scale, hidden mechanism, or unexpected connection.`,
  },
  az: {
    back: 'Faktlara qayıt',
    chip: 'Bilirdiniz?',
    heading: c => `${c} faktları`,
    subtitle: (p, pages, count, total) => `Yalnız heyrətləndirici faktlar — səhifə ${p}/${pages}. ${total} mövzudan ${count} mövzu göstərilir.`,
    previous: 'Əvvəlki',
    next: 'Növbəti',
    fallbackTitle: (c, n) => `Bilirdiniz? ${c} haqqında heyrətləndirici fakt #${n}`,
    fallbackText: c => `${c} haqqında bu fakt gizli mexanizmi, böyük miqyası və ya gözlənilməz əlaqəni göstərir.`,
  },
  ru: {
    back: 'Назад к фактам',
    chip: 'Знаете ли вы?',
    heading: c => `Факты о ${c}`,
    subtitle: (p, pages, count, total) => `Только удивительные факты — страница ${p} из ${pages}. Показано ${count} тем из ${total}.`,
    previous: 'Назад',
    next: 'Далее',
    fallbackTitle: (c, n) => `Знаете ли вы? Удивительный факт о ${c} #${n}`,
    fallbackText: c => `Этот факт о ${c} раскрывает скрытый механизм, огромный масштаб или неожиданную связь.`,
  },
  de: {
    back: 'Zurück zu Fakten',
    chip: 'Wusstest du?',
    heading: c => `Fakten über ${c}`,
    subtitle: (p, pages, count, total) => `Nur verblüffende Fakten — Seite ${p} von ${pages}. ${count} von ${total} Themen werden angezeigt.`,
    previous: 'Zurück',
    next: 'Weiter',
    fallbackTitle: (c, n) => `Wusstest du? Verblüffender Fakt über ${c} #${n}`,
    fallbackText: c => `Dieser Fakt über ${c} zeigt einen versteckten Mechanismus, eine enorme Größenordnung oder eine unerwartete Verbindung.`,
  },
  tr: {
    back: 'Faktlara dön',
    chip: 'Biliyor muydun?',
    heading: c => `${c} faktları`,
    subtitle: (p, pages, count, total) => `Sadece akıl almaz faktlar — sayfa ${p}/${pages}. ${total} konudan ${count} konu gösteriliyor.`,
    previous: 'Önceki',
    next: 'Sonraki',
    fallbackTitle: (c, n) => `Biliyor muydun? ${c} hakkında akıl almaz fakt #${n}`,
    fallbackText: c => `${c} hakkındaki bu fakt gizli bir mekanizmayı, büyük bir ölçeği veya beklenmedik bir bağlantıyı gösterir.`,
  },
  fr: {
    back: 'Retour aux faits',
    chip: 'Le saviez-vous ?',
    heading: c => `Faits sur ${c}`,
    subtitle: (p, pages, count, total) => `Uniquement des faits étonnants — page ${p} sur ${pages}. ${count} sujets affichés sur ${total}.`,
    previous: 'Précédent',
    next: 'Suivant',
    fallbackTitle: (c, n) => `Le saviez-vous ? Fait étonnant sur ${c} #${n}`,
    fallbackText: c => `Ce fait sur ${c} révèle un mécanisme caché, une grande échelle ou un lien inattendu.`,
  },
  es: {
    back: 'Volver a hechos',
    chip: '¿Sabías que?',
    heading: c => `Hechos sobre ${c}`,
    subtitle: (p, pages, count, total) => `Solo hechos sorprendentes — página ${p} de ${pages}. Mostrando ${count} temas de ${total}.`,
    previous: 'Anterior',
    next: 'Siguiente',
    fallbackTitle: (c, n) => `¿Sabías que? Hecho sorprendente sobre ${c} #${n}`,
    fallbackText: c => `Este hecho sobre ${c} revela un mecanismo oculto, una gran escala o una conexión inesperada.`,
  },
  zh: {
    back: '返回事实',
    chip: '你知道吗？',
    heading: c => `${c}事实`,
    subtitle: (p, pages, count, total) => `只看令人震惊的事实 — 第 ${p} 页，共 ${pages} 页。显示 ${count} 个主题，共 ${total} 个。`,
    previous: '上一页',
    next: '下一页',
    fallbackTitle: (c, n) => `你知道吗？关于${c}的惊人事实 #${n}`,
    fallbackText: c => `这个关于${c}的事实揭示了隐藏机制、巨大尺度或意想不到的联系。`,
  },
  ar: {
    back: 'العودة إلى الحقائق',
    chip: 'هل تعلم؟',
    heading: c => `حقائق عن ${c}`,
    subtitle: (p, pages, count, total) => `حقائق مذهلة فقط — صفحة ${p} من ${pages}. يتم عرض ${count} مواضيع من ${total}.`,
    previous: 'السابق',
    next: 'التالي',
    fallbackTitle: (c, n) => `هل تعلم؟ حقيقة مذهلة عن ${c} #${n}`,
    fallbackText: c => `هذه الحقيقة عن ${c} تكشف آلية خفية أو حجماً هائلاً أو ارتباطاً غير متوقع.`,
  },
  ja: {
    back: '事実一覧へ戻る',
    chip: '知っていましたか？',
    heading: c => `${c}の事実`,
    subtitle: (p, pages, count, total) => `驚くような事実だけ — ${p}/${pages}ページ。全${total}件中${count}件を表示中。`,
    previous: '前へ',
    next: '次へ',
    fallbackTitle: (c, n) => `知っていましたか？ ${c}に関する驚きの事実 #${n}`,
    fallbackText: c => `${c}に関するこの事実は、隠れた仕組み、大きなスケール、または意外なつながりを示しています。`,
  },
  it: {
    back: 'Torna ai fatti',
    chip: 'Lo sapevi?',
    heading: c => `Fatti su ${c}`,
    subtitle: (p, pages, count, total) => `Solo fatti sorprendenti — pagina ${p} di ${pages}. Mostrando ${count} argomenti su ${total}.`,
    previous: 'Precedente',
    next: 'Successivo',
    fallbackTitle: (c, n) => `Lo sapevi? Fatto sorprendente su ${c} #${n}`,
    fallbackText: c => `Questo fatto su ${c} mostra un meccanismo nascosto, una scala enorme o una connessione inattesa.`,
  },
  pt: {
    back: 'Voltar aos fatos',
    chip: 'Você sabia?',
    heading: c => `Fatos sobre ${c}`,
    subtitle: (p, pages, count, total) => `Apenas fatos surpreendentes — página ${p} de ${pages}. Mostrando ${count} tópicos de ${total}.`,
    previous: 'Anterior',
    next: 'Próximo',
    fallbackTitle: (c, n) => `Você sabia? Fato surpreendente sobre ${c} #${n}`,
    fallbackText: c => `Este fato sobre ${c} revela um mecanismo oculto, uma grande escala ou uma conexão inesperada.`,
  },
}

const categoryNames: Record<string, Record<SupportedLang, string>> = {
  astronomy: { en: 'astronomy', az: 'astronomiya', ru: 'астрономии', de: 'Astronomie', tr: 'astronomi', fr: 'l’astronomie', es: 'astronomía', zh: '天文学', ar: 'علم الفلك', ja: '天文学', it: 'astronomia', pt: 'astronomia' },
  history: { en: 'history', az: 'tarix', ru: 'истории', de: 'Geschichte', tr: 'tarih', fr: 'l’histoire', es: 'historia', zh: '历史', ar: 'التاريخ', ja: '歴史', it: 'storia', pt: 'história' },
  human: { en: 'the human body and mind', az: 'insan', ru: 'человеке', de: 'den Menschen', tr: 'insan', fr: 'l’être humain', es: 'el ser humano', zh: '人类', ar: 'الإنسان', ja: '人間', it: 'l’essere umano', pt: 'o ser humano' },
  nature: { en: 'nature', az: 'təbiət', ru: 'природе', de: 'Natur', tr: 'doğa', fr: 'la nature', es: 'la naturaleza', zh: '自然', ar: 'الطبيعة', ja: '自然', it: 'la natura', pt: 'a natureza' },
  animals: { en: 'animals', az: 'heyvanlar', ru: 'животных', de: 'Tiere', tr: 'hayvanlar', fr: 'les animaux', es: 'los animales', zh: '动物', ar: 'الحيوانات', ja: '動物', it: 'gli animali', pt: 'os animais' },
  science: { en: 'science', az: 'elm', ru: 'науке', de: 'Wissenschaft', tr: 'bilim', fr: 'la science', es: 'la ciencia', zh: '科学', ar: 'العلوم', ja: '科学', it: 'la scienza', pt: 'a ciência' },
  ocean: { en: 'the ocean', az: 'okean', ru: 'океане', de: 'den Ozean', tr: 'okyanus', fr: 'l’océan', es: 'el océano', zh: '海洋', ar: 'المحيط', ja: '海', it: 'l’oceano', pt: 'o oceano' },
  space: { en: 'space', az: 'kosmos', ru: 'космосе', de: 'den Weltraum', tr: 'uzay', fr: 'l’espace', es: 'el espacio', zh: '太空', ar: 'الفضاء', ja: '宇宙', it: 'lo spazio', pt: 'o espaço' },
  earth: { en: 'Earth', az: 'Yer', ru: 'Земле', de: 'die Erde', tr: 'Dünya', fr: 'la Terre', es: 'la Tierra', zh: '地球', ar: 'الأرض', ja: '地球', it: 'la Terra', pt: 'a Terra' },
  technology: { en: 'technology', az: 'texnologiya', ru: 'технологиях', de: 'Technologie', tr: 'teknoloji', fr: 'la technologie', es: 'la tecnología', zh: '技术', ar: 'التكنولوجيا', ja: '技術', it: 'la tecnologia', pt: 'a tecnologia' },
  psychology: { en: 'psychology', az: 'psixologiya', ru: 'психологии', de: 'Psychologie', tr: 'psikoloji', fr: 'la psychologie', es: 'la psicología', zh: '心理学', ar: 'علم النفس', ja: '心理学', it: 'la psicologia', pt: 'a psicologia' },
  mysteries: { en: 'mysteries', az: 'sirlər', ru: 'тайнах', de: 'Mysterien', tr: 'gizemler', fr: 'les mystères', es: 'los misterios', zh: '谜团', ar: 'الألغاز', ja: '謎', it: 'i misteri', pt: 'os mistérios' },
  'ancient-world': { en: 'the ancient world', az: 'qədim dünya', ru: 'древнем мире', de: 'die antike Welt', tr: 'antik dünya', fr: 'le monde ancien', es: 'el mundo antiguo', zh: '古代世界', ar: 'العالم القديم', ja: '古代世界', it: 'il mondo antico', pt: 'o mundo antigo' },
  'weird-facts': { en: 'weird facts', az: 'qəribə faktlar', ru: 'странных фактах', de: 'seltsame Fakten', tr: 'tuhaf faktlar', fr: 'les faits étranges', es: 'los hechos raros', zh: '奇怪事实', ar: 'الحقائق الغريبة', ja: '奇妙な事実', it: 'i fatti strani', pt: 'os fatos estranhos' },
}

const realTranslations: Record<string, Record<string, Record<string, LocalizedFact>>> = {
  nature: {
    ru: {
      'Some fungi can control insects': { title: 'Некоторые грибы способны управлять поведением насекомых', text: 'Определённые грибы заражают насекомых и меняют их поведение так, чтобы эффективнее распространять споры.' },
      'Trees can send warning signals': { title: 'Деревья могут передавать сигналы тревоги', text: 'Растения реагируют на стресс химическими веществами и могут взаимодействовать через подземные грибные сети.' },
      'Lightning can make glass': { title: 'Молния может превращать песок в стекло', text: 'После удара молнии песок иногда сплавляется в стекловидные трубки, которые называют фульгуритами.' },
      'Carnivorous plants digest animals': { title: 'Хищные растения действительно переваривают животных', text: 'Они развили ловушки, чтобы получать питательные вещества в бедных почвах.' },
      'Seeds can wait for years': { title: 'Семена могут ждать подходящих условий годами', text: 'Некоторые семена долго остаются в состоянии покоя и прорастают только тогда, когда условия становятся благоприятными.' },
    },
    az: {
      'Some fungi can control insects': { title: 'Bəzi göbələklər həşəratların davranışını idarə edə bilir', text: 'Bəzi göbələklər həşəratları yoluxduraraq sporlarını daha effektiv yaymaq üçün onların davranışını dəyişir.' },
      'Trees can send warning signals': { title: 'Ağaclar xəbərdarlıq siqnalları göndərə bilir', text: 'Bitkilər stress zamanı kimyəvi siqnallar buraxa və yeraltı göbələk şəbəkələri ilə əlaqə yarada bilər.' },
      'Lightning can make glass': { title: 'Şimşək qumu şüşəyə çevirə bilər', text: 'Şimşək quma düşəndə yüksək istilik onu fulgurit adlanan şüşəyəbənzər borulara çevirə bilər.' },
      'Carnivorous plants digest animals': { title: 'Ətyeyən bitkilər heyvanları həzm edə bilir', text: 'Bu bitkilər qida maddəsi az olan mühitlərdə yaşamaq üçün tələlər inkişaf etdirib.' },
      'Seeds can wait for years': { title: 'Toxumlar illərlə uyğun şəraiti gözləyə bilər', text: 'Bəzi toxumlar uzun müddət yuxu halında qalır və yalnız şərait uyğun olduqda cücərir.' },
    },
  },
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function normalizeLang(value: string | undefined): SupportedLang {
  const code = (value || 'en').toLowerCase().split('-')[0]
  return SUPPORTED_LANGS.includes(code as SupportedLang) ? (code as SupportedLang) : 'en'
}

function getBaseTitle(title: string) {
  return title.split(' — ')[0]
}

function getVisiblePageNumbers(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages])
  for (let page = currentPage - 2; page <= currentPage + 2; page += 1) {
    if (page >= 1 && page <= totalPages) pages.add(page)
  }
  return Array.from(pages).sort((a, b) => a - b)
}

export default function FactsCategoryClientV2({ id, page }: { id: string; page?: string }) {
  const context = useLang()
  const [localLang, setLocalLang] = useState<SupportedLang>(() => normalizeLang(context.lang))

  useEffect(() => {
    const readLang = () => setLocalLang(normalizeLang(localStorage.getItem('dashboard-lang') || context.lang))
    readLang()
    const interval = window.setInterval(readLang, 500)
    window.addEventListener('storage', readLang)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('storage', readLang)
    }
  }, [context.lang])

  const lang = normalizeLang(localLang)
  const t = dictionaries[lang]
  const category = getFactCategory(id)
  const categoryName = categoryNames[id]?.[lang] || category.title
  const facts = getFactsForCategory(id)
  const totalPages = Math.max(1, Math.ceil(facts.length / FACTS_PER_PAGE))
  const requestedPage = Number(page || '1')
  const currentPage = Number.isFinite(requestedPage) ? Math.min(Math.max(1, Math.floor(requestedPage)), totalPages) : 1
  const startIndex = (currentPage - 1) * FACTS_PER_PAGE
  const paginatedFacts = facts.slice(startIndex, startIndex + FACTS_PER_PAGE)
  const visiblePages = getVisiblePageNumbers(currentPage, totalPages)

  const cards = useMemo(() => paginatedFacts.map((fact, index) => {
    const number = startIndex + index + 1
    const baseTitle = getBaseTitle(fact.title)
    const real = realTranslations[id]?.[lang]?.[baseTitle]
    return {
      number,
      title: lang === 'en' ? fact.title : real?.title || t.fallbackTitle(categoryName, number),
      text: lang === 'en' ? fact.text : real?.text || t.fallbackText(categoryName),
    }
  }), [paginatedFacts, startIndex, id, lang, t, categoryName])

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
              {category.emoji} {t.heading(categoryName)}
            </h1>
            <p className="text-[#9a9aae] text-sm sm:text-base mt-3 leading-7">
              {t.subtitle(currentPage, totalPages, cards.length, facts.length)}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map(card => (
            <article key={card.number} className="rounded-xl border border-white/[0.04] bg-[#0a0a10]/80 p-5 hover:border-indigo-400/25 hover:bg-white/[0.025] transition">
              <div className="inline-flex items-center gap-1.5 text-[11px] text-indigo-200 bg-indigo-500/10 border border-indigo-400/20 rounded-full px-2.5 py-1 mb-4">
                {category.emoji} {t.heading(categoryName)} · #{card.number}
              </div>
              <h2 className="text-white text-lg font-semibold leading-snug">{card.title}</h2>
              <p className="text-[#9a9aae] text-sm leading-6 mt-3">{card.text}</p>
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
