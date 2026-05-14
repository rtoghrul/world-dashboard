'use client'

import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import { getFactCategory, getFactsForCategory } from '@/lib/facts'
import { useLang } from '@/lib/LanguageContext'

const FACTS_PER_PAGE = 5

type LangText = Record<string, string>
type LocalizedFact = { title: string; text: string }

type UiText = {
  back: string
  didYouKnow: string
  subtitle: string
  page: string
  of: string
  showing: string
  topicsFrom: string
  total: string
  previous: string
  next: string
  heading: (category: string) => string
  fallbackTitle: (category: string, number: number) => string
  fallbackText: (category: string) => string
}

const ui: Record<string, UiText> = {
  en: {
    back: 'Back to facts', didYouKnow: 'Did you know?', subtitle: 'Only mind-blowing facts', page: 'page', of: 'of', showing: 'Showing', topicsFrom: 'topics from', total: 'total', previous: 'Previous', next: 'Next',
    heading: category => `${category} Facts`,
    fallbackTitle: (category, number) => `Did you know? A mind-blowing fact about ${category} #${number}`,
    fallbackText: category => `This fact about ${category} reveals a surprising scale, hidden mechanism, or unexpected connection that sounds unbelievable at first.`,
  },
  az: {
    back: 'Faktlara qayıt', didYouKnow: 'Bilirdiniz?', subtitle: 'Yalnız heyrətləndirici faktlar', page: 'səhifə', of: '/', showing: 'Göstərilir', topicsFrom: 'mövzu, ümumi', total: 'mövzu', previous: 'Əvvəlki', next: 'Növbəti',
    heading: category => `${category} faktları`,
    fallbackTitle: (category, number) => `Bilirdiniz? ${category} haqqında heyrətləndirici fakt #${number}`,
    fallbackText: category => `${category} haqqında bu fakt gizli mexanizmi, böyük miqyası və ya gözlənilməz əlaqəni göstərdiyi üçün maraqlıdır.`,
  },
  ru: {
    back: 'Назад к фактам', didYouKnow: 'Знаете ли вы?', subtitle: 'Только удивительные факты', page: 'страница', of: 'из', showing: 'Показано', topicsFrom: 'тем из', total: 'всего', previous: 'Назад', next: 'Далее',
    heading: category => `Факты о ${category}`,
    fallbackTitle: (category, number) => `Знаете ли вы? Удивительный факт о ${category} #${number}`,
    fallbackText: category => `Этот факт о ${category} раскрывает скрытый механизм, огромный масштаб или неожиданную связь, которая сначала кажется невероятной.`,
  },
  tr: {
    back: 'Faktlara dön', didYouKnow: 'Biliyor muydun?', subtitle: 'Sadece akıl almaz faktlar', page: 'sayfa', of: '/', showing: 'Gösteriliyor', topicsFrom: 'konu, toplam', total: 'konu', previous: 'Önceki', next: 'Sonraki',
    heading: category => `${category} faktları`,
    fallbackTitle: (category, number) => `Biliyor muydun? ${category} hakkında akıl almaz fakt #${number}`,
    fallbackText: category => `${category} hakkındaki bu fakt gizli bir mekanizmayı, büyük bir ölçeği veya beklenmedik bir bağlantıyı gösterir.`,
  },
  de: {
    back: 'Zurück zu Fakten', didYouKnow: 'Wusstest du?', subtitle: 'Nur verblüffende Fakten', page: 'Seite', of: 'von', showing: 'Zeige', topicsFrom: 'Themen von', total: 'gesamt', previous: 'Zurück', next: 'Weiter',
    heading: category => `Fakten über ${category}`,
    fallbackTitle: (category, number) => `Wusstest du? Verblüffender Fakt über ${category} #${number}`,
    fallbackText: category => `Dieser Fakt über ${category} zeigt einen versteckten Mechanismus, eine enorme Größenordnung oder eine unerwartete Verbindung.`,
  },
  fr: {
    back: 'Retour aux faits', didYouKnow: 'Le saviez-vous ?', subtitle: 'Uniquement des faits étonnants', page: 'page', of: 'sur', showing: 'Affichage', topicsFrom: 'sujets sur', total: 'au total', previous: 'Précédent', next: 'Suivant',
    heading: category => `Faits sur ${category}`,
    fallbackTitle: (category, number) => `Le saviez-vous ? Fait étonnant sur ${category} #${number}`,
    fallbackText: category => `Ce fait sur ${category} révèle un mécanisme caché, une grande échelle ou un lien inattendu.`,
  },
  es: {
    back: 'Volver a hechos', didYouKnow: '¿Sabías que?', subtitle: 'Solo hechos sorprendentes', page: 'página', of: 'de', showing: 'Mostrando', topicsFrom: 'temas de', total: 'total', previous: 'Anterior', next: 'Siguiente',
    heading: category => `Hechos sobre ${category}`,
    fallbackTitle: (category, number) => `¿Sabías que? Hecho sorprendente sobre ${category} #${number}`,
    fallbackText: category => `Este hecho sobre ${category} revela un mecanismo oculto, una gran escala o una conexión inesperada.`,
  },
  it: {
    back: 'Torna ai fatti', didYouKnow: 'Lo sapevi?', subtitle: 'Solo fatti sorprendenti', page: 'pagina', of: 'di', showing: 'Mostrando', topicsFrom: 'argomenti su', total: 'totali', previous: 'Precedente', next: 'Successivo',
    heading: category => `Fatti su ${category}`,
    fallbackTitle: (category, number) => `Lo sapevi? Fatto sorprendente su ${category} #${number}`,
    fallbackText: category => `Questo fatto su ${category} mostra un meccanismo nascosto, una scala enorme o una connessione inattesa.`,
  },
  pt: {
    back: 'Voltar aos fatos', didYouKnow: 'Você sabia?', subtitle: 'Apenas fatos surpreendentes', page: 'página', of: 'de', showing: 'Mostrando', topicsFrom: 'tópicos de', total: 'total', previous: 'Anterior', next: 'Próximo',
    heading: category => `Fatos sobre ${category}`,
    fallbackTitle: (category, number) => `Você sabia? Fato surpreendente sobre ${category} #${number}`,
    fallbackText: category => `Este fato sobre ${category} revela um mecanismo oculto, uma grande escala ou uma conexão inesperada.`,
  },
  zh: {
    back: '返回事实', didYouKnow: '你知道吗？', subtitle: '只看令人震惊的事实', page: '第', of: '页 / 共', showing: '显示', topicsFrom: '个主题，共', total: '个', previous: '上一页', next: '下一页',
    heading: category => `${category}事实`,
    fallbackTitle: (category, number) => `你知道吗？关于${category}的惊人事实 #${number}`,
    fallbackText: category => `这个关于${category}的事实揭示了隐藏机制、巨大尺度或意想不到的联系。`,
  },
  ja: {
    back: '事実一覧へ戻る', didYouKnow: '知っていましたか？', subtitle: '驚くような事実だけ', page: 'ページ', of: '/', showing: '表示中', topicsFrom: '件 / 全', total: '件', previous: '前へ', next: '次へ',
    heading: category => `${category}の事実`,
    fallbackTitle: (category, number) => `知っていましたか？ ${category}に関する驚きの事実 #${number}`,
    fallbackText: category => `${category}に関するこの事実は、隠れた仕組み、大きなスケール、または意外なつながりを示しています。`,
  },
  ar: {
    back: 'العودة إلى الحقائق', didYouKnow: 'هل تعلم؟', subtitle: 'حقائق مذهلة فقط', page: 'صفحة', of: 'من', showing: 'عرض', topicsFrom: 'مواضيع من', total: 'الإجمالي', previous: 'السابق', next: 'التالي',
    heading: category => `حقائق عن ${category}`,
    fallbackTitle: (category, number) => `هل تعلم؟ حقيقة مذهلة عن ${category} #${number}`,
    fallbackText: category => `هذه الحقيقة عن ${category} تكشف آلية خفية أو حجماً هائلاً أو ارتباطاً غير متوقع.`,
  },
}

const categoryNames: Record<string, LangText> = {
  astronomy: { en: 'astronomy', az: 'astronomiya', ru: 'астрономии', tr: 'astronomi', de: 'Astronomie', fr: 'l’astronomie', es: 'astronomía', it: 'astronomia', pt: 'astronomia', zh: '天文学', ja: '天文学', ar: 'علم الفلك' },
  history: { en: 'history', az: 'tarix', ru: 'истории', tr: 'tarih', de: 'Geschichte', fr: 'l’histoire', es: 'historia', it: 'storia', pt: 'história', zh: '历史', ja: '歴史', ar: 'التاريخ' },
  human: { en: 'the human body and mind', az: 'insan', ru: 'человеке', tr: 'insan', de: 'den Menschen', fr: 'l’être humain', es: 'el ser humano', it: 'l’essere umano', pt: 'o ser humano', zh: '人类', ja: '人間', ar: 'الإنسان' },
  nature: { en: 'nature', az: 'təbiət', ru: 'природе', tr: 'doğa', de: 'Natur', fr: 'la nature', es: 'la naturaleza', it: 'la natura', pt: 'a natureza', zh: '自然', ja: '自然', ar: 'الطبيعة' },
  animals: { en: 'animals', az: 'heyvanlar', ru: 'животных', tr: 'hayvanlar', de: 'Tiere', fr: 'les animaux', es: 'los animales', it: 'gli animali', pt: 'os animais', zh: '动物', ja: '動物', ar: 'الحيوانات' },
  science: { en: 'science', az: 'elm', ru: 'науке', tr: 'bilim', de: 'Wissenschaft', fr: 'la science', es: 'la ciencia', it: 'la scienza', pt: 'a ciência', zh: '科学', ja: '科学', ar: 'العلوم' },
  ocean: { en: 'the ocean', az: 'okean', ru: 'океане', tr: 'okyanus', de: 'den Ozean', fr: 'l’océan', es: 'el océano', it: 'l’oceano', pt: 'o oceano', zh: '海洋', ja: '海', ar: 'المحيط' },
  space: { en: 'space', az: 'kosmos', ru: 'космосе', tr: 'uzay', de: 'den Weltraum', fr: 'l’espace', es: 'el espacio', it: 'lo spazio', pt: 'o espaço', zh: '太空', ja: '宇宙', ar: 'الفضاء' },
  earth: { en: 'Earth', az: 'Yer', ru: 'Земле', tr: 'Dünya', de: 'die Erde', fr: 'la Terre', es: 'la Tierra', it: 'la Terra', pt: 'a Terra', zh: '地球', ja: '地球', ar: 'الأرض' },
  technology: { en: 'technology', az: 'texnologiya', ru: 'технологиях', tr: 'teknoloji', de: 'Technologie', fr: 'la technologie', es: 'la tecnología', it: 'la tecnologia', pt: 'a tecnologia', zh: '技术', ja: '技術', ar: 'التكنولوجيا' },
  psychology: { en: 'psychology', az: 'psixologiya', ru: 'психологии', tr: 'psikoloji', de: 'Psychologie', fr: 'la psychologie', es: 'la psicología', it: 'la psicologia', pt: 'a psicologia', zh: '心理学', ja: '心理学', ar: 'علم النفس' },
  mysteries: { en: 'mysteries', az: 'sirlər', ru: 'тайнах', tr: 'gizemler', de: 'Mysterien', fr: 'les mystères', es: 'los misterios', it: 'i misteri', pt: 'os mistérios', zh: '谜团', ja: '謎', ar: 'الألغاز' },
  'ancient-world': { en: 'the ancient world', az: 'qədim dünya', ru: 'древнем мире', tr: 'antik dünya', de: 'die antike Welt', fr: 'le monde ancien', es: 'el mundo antiguo', it: 'il mondo antico', pt: 'o mundo antigo', zh: '古代世界', ja: '古代世界', ar: 'العالم القديم' },
  'weird-facts': { en: 'weird facts', az: 'qəribə faktlar', ru: 'странных фактах', tr: 'tuhaf faktlar', de: 'seltsame Fakten', fr: 'les faits étranges', es: 'los hechos raros', it: 'i fatti strani', pt: 'os fatos estranhos', zh: '奇怪事实', ja: '奇妙な事実', ar: 'الحقائق الغريبة' },
}

const factTranslations: Record<string, Record<string, LocalizedFact>> = {
  ru: {
    'Some fungi can control insects': { title: 'Некоторые грибы способны управлять поведением насекомых', text: 'Определённые виды грибов заражают насекомых и меняют их поведение так, чтобы эффективнее распространять споры.' },
    'Trees can send warning signals': { title: 'Деревья могут передавать сигналы тревоги', text: 'Растения способны реагировать на стресс химическими сигналами, а также взаимодействовать через подземные грибные сети.' },
    'Lightning can make glass': { title: 'Молния может превращать песок в стекло', text: 'Когда молния ударяет в песок, высокая температура может сплавить его в стекловидные трубки — фульгуриты.' },
    'Carnivorous plants digest animals': { title: 'Хищные растения действительно переваривают животных', text: 'Такие растения развили ловушки, чтобы получать питательные вещества в бедных почвах.' },
    'Seeds can wait for years': { title: 'Семена могут ждать подходящих условий годами', text: 'Некоторые семена остаются в состоянии покоя очень долго и прорастают только тогда, когда среда становится благоприятной.' },
    'Deserts can bloom suddenly': { title: 'Пустыни могут внезапно покрываться цветами', text: 'После редких дождей в пустынях иногда быстро появляются целые волны цветения и жизни.' },
    'Coral reefs are living cities': { title: 'Коралловые рифы похожи на живые города', text: 'Они поддерживают огромные сообщества животных, водорослей и микроорганизмов.' },
    'Forests can move over time': { title: 'Леса могут медленно перемещаться', text: 'Изменение климата и распространение семян постепенно сдвигают границы лесов.' },
    'Some plants communicate through scent': { title: 'Некоторые растения общаются с помощью запахов', text: 'Химические сигналы могут предупреждать соседние растения или привлекать защитников.' },
    'Fire can help ecosystems': { title: 'Огонь иногда помогает экосистемам', text: 'Некоторым растениям нужен пожар, чтобы раскрыть семена или освободить место для роста.' },
    'Mangroves protect coastlines': { title: 'Мангровые леса защищают берега', text: 'Их корни ослабляют волны и создают укрытия для молодой морской жизни.' },
    'Giant kelp grows fast': { title: 'Гигантская ламинария растёт очень быстро', text: 'Подводные леса ламинарии могут стремительно расширяться при подходящих условиях.' },
    'Peatlands store huge carbon': { title: 'Торфяники хранят огромные запасы углерода', text: 'Влажная почва замедляет разложение и удерживает органическое вещество.' },
    'Permafrost preserves ancient material': { title: 'Вечная мерзлота сохраняет древние следы жизни', text: 'Замёрзшая почва может долго хранить растения, животных и микроорганизмы.' },
    'Pollination can be a trick': { title: 'Опыление иногда основано на обмане', text: 'Некоторые цветы имитируют запахи или формы, чтобы привлечь опылителей.' },
    'Rainforests create their own humidity': { title: 'Тропические леса создают собственную влажность', text: 'Растения выделяют водяной пар, который влияет на местную погоду и осадки.' },
    'Living fossils still exist': { title: 'Живые ископаемые существуют до сих пор', text: 'Некоторые современные виды похожи на своих древних родственников из далёкого прошлого.' },
    'Volcanic islands start empty': { title: 'Вулканические острова сначала почти пусты', text: 'Жизнь постепенно заселяет новую лавовую породу шаг за шагом.' },
    'Bioluminescent fungi glow': { title: 'Некоторые грибы светятся в темноте', text: 'Биолюминесцентные грибы создают свет с помощью химических реакций.' },
    'Seasonal cycles guide life': { title: 'Сезоны управляют ритмами живой природы', text: 'Растения и животные реагируют на свет, температуру и время года.' },
  },
  az: {
    'Some fungi can control insects': { title: 'Bəzi göbələklər həşəratların davranışını idarə edə bilir', text: 'Bəzi göbələklər həşəratları yoluxduraraq sporlarını daha effektiv yaymaq üçün onların davranışını dəyişir.' },
    'Trees can send warning signals': { title: 'Ağaclar xəbərdarlıq siqnalları göndərə bilir', text: 'Bitkilər stress zamanı kimyəvi siqnallar buraxa və yeraltı göbələk şəbəkələri vasitəsilə qarşılıqlı təsir göstərə bilər.' },
    'Lightning can make glass': { title: 'Şimşək qumu şüşəyə çevirə bilər', text: 'Şimşək quma düşəndə yüksək istilik onu fulgurit adlanan şüşəyəbənzər borulara çevirə bilər.' },
    'Carnivorous plants digest animals': { title: 'Ətyeyən bitkilər həqiqətən heyvanları həzm edir', text: 'Bu bitkilər qida maddəsi az olan mühitlərdə yaşamaq üçün tələlər inkişaf etdirib.' },
    'Seeds can wait for years': { title: 'Toxumlar illərlə uyğun şəraiti gözləyə bilər', text: 'Bəzi toxumlar uzun müddət yuxu halında qalır və yalnız şərait uyğun olduqda cücərir.' },
  },
}

function getText(dictionary: LangText, lang: string) {
  return dictionary[lang] || dictionary.en
}

function getBaseFactTitle(title: string) {
  return title.split(' — ')[0]
}

function getLocalizedFact(factTitle: string, factText: string, lang: string, categoryName: string, factNumber: number, t: UiText) {
  if (lang === 'en') return { title: factTitle, text: factText }

  const baseTitle = getBaseFactTitle(factTitle)
  const translation = factTranslations[lang]?.[baseTitle]
  if (translation) return translation

  return {
    title: t.fallbackTitle(categoryName, factNumber),
    text: t.fallbackText(categoryName),
  }
}

function getVisiblePageNumbers(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages])
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
  const currentPage = Number.isFinite(requestedPage) ? Math.min(Math.max(1, Math.floor(requestedPage)), totalPages) : 1
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
              {category.emoji} {t.heading(localizedCategoryName)}
            </h1>
            <p className="text-[#9a9aae] text-sm sm:text-base mt-3 leading-7">
              {t.subtitle} — {t.page} {currentPage} {t.of} {totalPages}. {t.showing} {paginatedFacts.length} {t.topicsFrom} {facts.length} {t.total}.
            </p>
          </div>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedFacts.map((fact, index) => {
            const factNumber = startIndex + index + 1
            const localizedFact = getLocalizedFact(fact.title, fact.text, lang, localizedCategoryName, factNumber, t)
            return (
              <article key={`${fact.title}-${factNumber}`} className="rounded-xl border border-white/[0.04] bg-[#0a0a10]/80 p-5 hover:border-indigo-400/25 hover:bg-white/[0.025] transition">
                <div className="inline-flex items-center gap-1.5 text-[11px] text-indigo-200 bg-indigo-500/10 border border-indigo-400/20 rounded-full px-2.5 py-1 mb-4">
                  {category.emoji} {t.heading(localizedCategoryName)} · #{factNumber}
                </div>
                <h2 className="text-white text-lg font-semibold leading-snug">{localizedFact.title}</h2>
                <p className="text-[#9a9aae] text-sm leading-6 mt-3">{localizedFact.text}</p>
              </article>
            )
          })}
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
