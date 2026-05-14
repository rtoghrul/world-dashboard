'use client'

import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import { factCategories, getFactCategory, getFactsForCategory } from '@/lib/facts'
import { useLang } from '@/lib/LanguageContext'

const FACTS_PER_PAGE = 5

type LangText = Record<string, string>

const ui: Record<string, Record<string, string>> = {
  en: {
    back: 'Back to facts', didYouKnow: 'Did you know?', subtitle: 'Only mind-blowing facts', page: 'page', of: 'of', showing: 'Showing', topicsFrom: 'topics from', total: 'total', previous: 'Previous', next: 'Next', topic: 'Topic', originalTopic: 'Original topic', explanation: 'This is a mind-blowing fact because it reveals a surprising scale, hidden mechanism, or unexpected connection.',
  },
  az: {
    back: 'Faktlara qayıt', didYouKnow: 'Bilirdiniz?', subtitle: 'Yalnız heyrətləndirici faktlar', page: 'səhifə', of: '/', showing: 'Göstərilir', topicsFrom: 'mövzu, ümumi', total: 'mövzu', previous: 'Əvvəlki', next: 'Növbəti', topic: 'Mövzu', originalTopic: 'Orijinal mövzu', explanation: 'Bu heyrətləndirici faktdır, çünki gizli mexanizmi, böyük miqyası və ya gözlənilməz əlaqəni göstərir.',
  },
  ru: {
    back: 'Назад к фактам', didYouKnow: 'Знаете ли вы?', subtitle: 'Только удивительные факты', page: 'страница', of: 'из', showing: 'Показано', topicsFrom: 'тем из', total: 'всего', previous: 'Назад', next: 'Далее', topic: 'Тема', originalTopic: 'Оригинальная тема', explanation: 'Это удивительный факт, потому что он показывает скрытый механизм, огромный масштаб или неожиданную связь.',
  },
  tr: {
    back: 'Faktlara dön', didYouKnow: 'Biliyor muydun?', subtitle: 'Sadece akıl almaz faktlar', page: 'sayfa', of: '/', showing: 'Gösteriliyor', topicsFrom: 'konu, toplam', total: 'konu', previous: 'Önceki', next: 'Sonraki', topic: 'Konu', originalTopic: 'Orijinal konu', explanation: 'Bu akıl almaz bir fakt çünkü gizli mekanizmayı, büyük ölçeği veya beklenmedik bağlantıyı gösterir.',
  },
  de: {
    back: 'Zurück zu Fakten', didYouKnow: 'Wusstest du?', subtitle: 'Nur verblüffende Fakten', page: 'Seite', of: 'von', showing: 'Zeige', topicsFrom: 'Themen von', total: 'gesamt', previous: 'Zurück', next: 'Weiter', topic: 'Thema', originalTopic: 'Originalthema', explanation: 'Das ist ein verblüffender Fakt, weil er einen versteckten Mechanismus, eine enorme Größenordnung oder eine unerwartete Verbindung zeigt.',
  },
  fr: {
    back: 'Retour aux faits', didYouKnow: 'Le saviez-vous ?', subtitle: 'Uniquement des faits étonnants', page: 'page', of: 'sur', showing: 'Affichage', topicsFrom: 'sujets sur', total: 'au total', previous: 'Précédent', next: 'Suivant', topic: 'Sujet', originalTopic: 'Sujet original', explanation: 'C’est un fait étonnant, car il révèle un mécanisme caché, une grande échelle ou un lien inattendu.',
  },
  es: {
    back: 'Volver a hechos', didYouKnow: '¿Sabías que?', subtitle: 'Solo hechos sorprendentes', page: 'página', of: 'de', showing: 'Mostrando', topicsFrom: 'temas de', total: 'total', previous: 'Anterior', next: 'Siguiente', topic: 'Tema', originalTopic: 'Tema original', explanation: 'Es un hecho sorprendente porque revela un mecanismo oculto, una gran escala o una conexión inesperada.',
  },
  it: {
    back: 'Torna ai fatti', didYouKnow: 'Lo sapevi?', subtitle: 'Solo fatti sorprendenti', page: 'pagina', of: 'di', showing: 'Mostrando', topicsFrom: 'argomenti su', total: 'totali', previous: 'Precedente', next: 'Successivo', topic: 'Argomento', originalTopic: 'Argomento originale', explanation: 'È un fatto sorprendente perché mostra un meccanismo nascosto, una scala enorme o una connessione inattesa.',
  },
  pt: {
    back: 'Voltar aos fatos', didYouKnow: 'Você sabia?', subtitle: 'Apenas fatos surpreendentes', page: 'página', of: 'de', showing: 'Mostrando', topicsFrom: 'tópicos de', total: 'total', previous: 'Anterior', next: 'Próximo', topic: 'Tópico', originalTopic: 'Tópico original', explanation: 'É um fato surpreendente porque revela um mecanismo oculto, uma grande escala ou uma conexão inesperada.',
  },
  zh: {
    back: '返回事实', didYouKnow: '你知道吗？', subtitle: '只看令人震惊的事实', page: '第', of: '页 / 共', showing: '显示', topicsFrom: '个主题，共', total: '个', previous: '上一页', next: '下一页', topic: '主题', originalTopic: '原始主题', explanation: '这是一个令人震惊的事实，因为它揭示了隐藏机制、巨大尺度或意想不到的联系。',
  },
  ja: {
    back: '事実一覧へ戻る', didYouKnow: '知っていましたか？', subtitle: '驚くような事実だけ', page: 'ページ', of: '/', showing: '表示中', topicsFrom: '件 / 全', total: '件', previous: '前へ', next: '次へ', topic: 'トピック', originalTopic: '元のトピック', explanation: 'これは隠れた仕組み、大きなスケール、または意外なつながりを示す驚くべき事実です。',
  },
  ar: {
    back: 'العودة إلى الحقائق', didYouKnow: 'هل تعلم؟', subtitle: 'حقائق مذهلة فقط', page: 'صفحة', of: 'من', showing: 'عرض', topicsFrom: 'مواضيع من', total: 'الإجمالي', previous: 'السابق', next: 'التالي', topic: 'موضوع', originalTopic: 'الموضوع الأصلي', explanation: 'هذه حقيقة مذهلة لأنها تكشف آلية خفية أو حجماً هائلاً أو ارتباطاً غير متوقع.',
  },
}

const categoryNames: Record<string, LangText> = {
  astronomy: { en: 'Astronomy', az: 'Astronomiya', ru: 'Астрономия', tr: 'Astronomi', de: 'Astronomie', fr: 'Astronomie', es: 'Astronomía', it: 'Astronomia', pt: 'Astronomia', zh: '天文学', ja: '天文学', ar: 'علم الفلك' },
  history: { en: 'History', az: 'Tarix', ru: 'История', tr: 'Tarih', de: 'Geschichte', fr: 'Histoire', es: 'Historia', it: 'Storia', pt: 'História', zh: '历史', ja: '歴史', ar: 'التاريخ' },
  human: { en: 'Human', az: 'İnsan', ru: 'Человек', tr: 'İnsan', de: 'Mensch', fr: 'Humain', es: 'Humano', it: 'Umano', pt: 'Humano', zh: '人类', ja: '人間', ar: 'الإنسان' },
  nature: { en: 'Nature', az: 'Təbiət', ru: 'Природа', tr: 'Doğa', de: 'Natur', fr: 'Nature', es: 'Naturaleza', it: 'Natura', pt: 'Natureza', zh: '自然', ja: '自然', ar: 'الطبيعة' },
  animals: { en: 'Animals', az: 'Heyvanlar', ru: 'Животные', tr: 'Hayvanlar', de: 'Tiere', fr: 'Animaux', es: 'Animales', it: 'Animali', pt: 'Animais', zh: '动物', ja: '動物', ar: 'الحيوانات' },
  science: { en: 'Science', az: 'Elm', ru: 'Наука', tr: 'Bilim', de: 'Wissenschaft', fr: 'Science', es: 'Ciencia', it: 'Scienza', pt: 'Ciência', zh: '科学', ja: '科学', ar: 'العلوم' },
  ocean: { en: 'Ocean', az: 'Okean', ru: 'Океан', tr: 'Okyanus', de: 'Ozean', fr: 'Océan', es: 'Océano', it: 'Oceano', pt: 'Oceano', zh: '海洋', ja: '海', ar: 'المحيط' },
  space: { en: 'Space', az: 'Kosmos', ru: 'Космос', tr: 'Uzay', de: 'Weltraum', fr: 'Espace', es: 'Espacio', it: 'Spazio', pt: 'Espaço', zh: '太空', ja: '宇宙', ar: 'الفضاء' },
  earth: { en: 'Earth', az: 'Yer', ru: 'Земля', tr: 'Dünya', de: 'Erde', fr: 'Terre', es: 'Tierra', it: 'Terra', pt: 'Terra', zh: '地球', ja: '地球', ar: 'الأرض' },
  technology: { en: 'Technology', az: 'Texnologiya', ru: 'Технологии', tr: 'Teknoloji', de: 'Technologie', fr: 'Technologie', es: 'Tecnología', it: 'Tecnologia', pt: 'Tecnologia', zh: '技术', ja: '技術', ar: 'التكنولوجيا' },
  psychology: { en: 'Psychology', az: 'Psixologiya', ru: 'Психология', tr: 'Psikoloji', de: 'Psychologie', fr: 'Psychologie', es: 'Psicología', it: 'Psicologia', pt: 'Psicologia', zh: '心理学', ja: '心理学', ar: 'علم النفس' },
  mysteries: { en: 'Mysteries', az: 'Sirlər', ru: 'Тайны', tr: 'Gizemler', de: 'Mysterien', fr: 'Mystères', es: 'Misterios', it: 'Misteri', pt: 'Mistérios', zh: '谜团', ja: '謎', ar: 'الألغاز' },
  'ancient-world': { en: 'Ancient World', az: 'Qədim dünya', ru: 'Древний мир', tr: 'Antik Dünya', de: 'Antike Welt', fr: 'Monde ancien', es: 'Mundo antiguo', it: 'Mondo antico', pt: 'Mundo antigo', zh: '古代世界', ja: '古代世界', ar: 'العالم القديم' },
  'weird-facts': { en: 'Weird Facts', az: 'Qəribə faktlar', ru: 'Странные факты', tr: 'Tuhaf Faktlar', de: 'Seltsame Fakten', fr: 'Faits étranges', es: 'Hechos raros', it: 'Fatti strani', pt: 'Fatos estranhos', zh: '奇怪事实', ja: '奇妙な事実', ar: 'حقائق غريبة' },
}

const angleTranslations: Record<string, LangText> = {
  'Did you know?': { en: 'Did you know?', az: 'Bilirdiniz?', ru: 'Знаете ли вы?', tr: 'Biliyor muydun?', de: 'Wusstest du?', fr: 'Le saviez-vous ?', es: '¿Sabías que?', it: 'Lo sapevi?', pt: 'Você sabia?', zh: '你知道吗？', ja: '知っていましたか？', ar: 'هل تعلم؟' },
  'Mind-blowing angle': { en: 'Mind-blowing angle', az: 'Heyrətləndirici baxış', ru: 'Удивительный ракурс', tr: 'Akıl almaz açı', de: 'Verblüffender Blickwinkel', fr: 'Angle étonnant', es: 'Ángulo sorprendente', it: 'Angolo sorprendente', pt: 'Ângulo surpreendente', zh: '震撼角度', ja: '驚きの視点', ar: 'زاوية مذهلة' },
  'Shorts idea': { en: 'Shorts idea', az: 'Shorts ideyası', ru: 'Идея для Shorts', tr: 'Shorts fikri', de: 'Shorts-Idee', fr: 'Idée Shorts', es: 'Idea para Shorts', it: 'Idea Shorts', pt: 'Ideia para Shorts', zh: '短视频创意', ja: 'Shorts案', ar: 'فكرة شورتس' },
  'Deep fact': { en: 'Deep fact', az: 'Dərin fakt', ru: 'Глубокий факт', tr: 'Derin fakt', de: 'Tiefer Fakt', fr: 'Fait profond', es: 'Hecho profundo', it: 'Fatto profondo', pt: 'Fato profundo', zh: '深层事实', ja: '深い事実', ar: 'حقيقة عميقة' },
  'Visual hook': { en: 'Visual hook', az: 'Vizual hook', ru: 'Визуальный хук', tr: 'Görsel kanca', de: 'Visueller Hook', fr: 'Accroche visuelle', es: 'Gancho visual', it: 'Hook visivo', pt: 'Gancho visual', zh: '视觉钩子', ja: '視覚的フック', ar: 'خطاف بصري' },
}

function getText(dictionary: Record<string, string>, lang: string) {
  return dictionary[lang] || dictionary.en
}

function localizeFactTitle(title: string, lang: string) {
  if (lang === 'en') return title
  const [topic, angle] = title.split(' — ')
  const translatedAngle = angleTranslations[angle] ? getText(angleTranslations[angle], lang) : angle
  return `${translatedAngle}: ${topic}`
}

function getVisiblePageNumbers(currentPage: number, totalPages: number) {
  const pages = new Set<number>()
  pages.add(1)
  pages.add(totalPages)

  for (let page = currentPage - 2; page <= currentPage + 2; page += 1) {
    if (page >= 1 && page <= totalPages) pages.add(page)
  }

  return Array.from(pages).sort((a, b) => a - b)
}

export default function FactsCategoryClient({ id, page }: { id: string; page?: string }) {
  const { lang } = useLang()
  const t = ui[lang] || ui.en
  const category = getFactCategory(id)
  const localizedCategoryName = getText(categoryNames[id] || { en: category.title }, lang)
  const facts = getFactsForCategory(id)
  const totalPages = Math.max(1, Math.ceil(facts.length / FACTS_PER_PAGE))
  const requestedPage = Number(page || '1')
  const currentPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(1, Math.floor(requestedPage)), totalPages)
    : 1
  const startIndex = (currentPage - 1) * FACTS_PER_PAGE
  const paginatedFacts = facts.slice(startIndex, startIndex + FACTS_PER_PAGE)
  const visiblePages = getVisiblePageNumbers(currentPage, totalPages)

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
              <Sparkles className="w-3.5 h-3.5" /> {t.didYouKnow}
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              {category.emoji} {localizedCategoryName} Facts
            </h1>
            <p className="text-[#9a9aae] text-sm sm:text-base mt-3 leading-7">
              {t.subtitle} — {t.page} {currentPage} {t.of} {totalPages}. {t.showing} {paginatedFacts.length} {t.topicsFrom} {facts.length} {t.total}.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedFacts.map((fact, index) => (
            <article
              key={`${fact.title}-${startIndex + index}`}
              className="rounded-xl border border-white/[0.04] bg-[#0a0a10]/80 p-5 hover:border-indigo-400/25 hover:bg-white/[0.025] transition"
            >
              <div className="inline-flex items-center gap-1.5 text-[11px] text-indigo-200 bg-indigo-500/10 border border-indigo-400/20 rounded-full px-2.5 py-1 mb-4">
                {category.emoji} {localizedCategoryName} · #{startIndex + index + 1}
              </div>
              <h2 className="text-white text-lg font-semibold leading-snug">{localizeFactTitle(fact.title, lang)}</h2>
              {lang !== 'en' && (
                <p className="text-[#6f6f82] text-xs leading-5 mt-2">
                  {t.originalTopic}: {fact.title.split(' — ')[0]}
                </p>
              )}
              <p className="text-[#9a9aae] text-sm leading-6 mt-3">
                {lang === 'en' ? fact.text : t.explanation}
              </p>
            </article>
          ))}
        </section>

        <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Facts pagination">
          <Link
            href={`/facts/${id}?page=${Math.max(1, currentPage - 1)}`}
            className={`rounded-lg border px-3 py-2 text-sm transition ${
              currentPage === 1
                ? 'pointer-events-none border-white/[0.04] text-[#4a4a5e]'
                : 'border-white/[0.08] text-[#c7c7d8] hover:border-indigo-400/30 hover:text-white'
            }`}
          >
            {t.previous}
          </Link>

          {visiblePages.map((pageNumber, index) => {
            const previousPage = visiblePages[index - 1]
            const showDots = previousPage && pageNumber - previousPage > 1

            return (
              <span key={pageNumber} className="flex items-center gap-2">
                {showDots && <span className="text-[#6b6b80]">...</span>}
                <Link
                  href={`/facts/${id}?page=${pageNumber}`}
                  className={`rounded-lg border px-3 py-2 text-sm transition ${
                    currentPage === pageNumber
                      ? 'border-indigo-400/40 bg-indigo-500/15 text-indigo-100'
                      : 'border-white/[0.08] text-[#c7c7d8] hover:border-indigo-400/30 hover:text-white'
                  }`}
                >
                  {pageNumber}
                </Link>
              </span>
            )
          })}

          <Link
            href={`/facts/${id}?page=${Math.min(totalPages, currentPage + 1)}`}
            className={`rounded-lg border px-3 py-2 text-sm transition ${
              currentPage === totalPages
                ? 'pointer-events-none border-white/[0.04] text-[#4a4a5e]'
                : 'border-white/[0.08] text-[#c7c7d8] hover:border-indigo-400/30 hover:text-white'
            }`}
          >
            {t.next}
          </Link>
        </nav>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}
