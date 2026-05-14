'use client'

import { useEffect } from 'react'
import { getFactsForCategory } from '@/lib/facts'

const labels: Record<string, string> = {
  en: 'Learn more',
  az: 'Daha ətraflı',
  ru: 'Подробнее',
  de: 'Mehr erfahren',
  tr: 'Daha çox öyrən',
  fr: 'En savoir plus',
  es: 'Más información',
  zh: '了解更多',
  ar: 'اعرف المزيد',
  ja: '詳しく見る',
  it: 'Scopri di più',
  pt: 'Saiba mais',
}

type FactTranslation = { title: string; text: string }

const ruTranslations: Record<string, FactTranslation> = {
  'Cleopatra lived closer to smartphones than pyramids': {
    title: 'Клеопатра жила ближе к эпохе смартфонов, чем к строительству пирамид',
    text: 'Великая пирамида была уже древней во времена Клеопатры, поэтому между ней и пирамидами прошло больше времени, чем между Клеопатрой и современностью.',
  },
  'Oxford University is older than the Aztec Empire': {
    title: 'Оксфордский университет старше империи ацтеков',
    text: 'Обучение в Оксфорде началось раньше, чем сформировалась империя ацтеков.',
  },
  'Roman concrete could self-heal': {
    title: 'Римский бетон мог частично самовосстанавливаться',
    text: 'Некоторые древнеримские бетонные сооружения сохранились тысячелетиями благодаря особому химическому составу материала.',
  },
  'The Silk Road was a network, not one road': {
    title: 'Шёлковый путь был сетью маршрутов, а не одной дорогой',
    text: 'Он соединял множество городов, культур и торговых путей на огромных расстояниях.',
  },
  'Ancient libraries shaped civilization': {
    title: 'Древние библиотеки формировали цивилизацию',
    text: 'В них собирались тексты, карты, научные знания и политические документы, которые помогали сохранять и распространять идеи.',
  },
  'Vikings navigated huge distances': {
    title: 'Викинги проходили огромные расстояния по морю',
    text: 'Они ориентировались по звёздам, береговым признакам, опыту и природным подсказкам.',
  },
  'The printing press changed power': {
    title: 'Печатный станок изменил распределение власти',
    text: 'Массовая печать ускорила развитие науки, политики, религии и образования.',
  },
  'Ancient calendars were advanced': {
    title: 'Древние календари были очень точными',
    text: 'Многие цивилизации тщательно отслеживали сезоны, астрономические циклы и ритуальные даты.',
  },
  'Some old cities are still inhabited': {
    title: 'Некоторые древние города населены до сих пор',
    text: 'Люди могут жить в одном и том же месте на протяжении тысячелетий, постоянно перестраивая город.',
  },
  'The Mongol Empire used a postal relay': {
    title: 'В Монгольской империи существовала система почтовых станций',
    text: 'Быстрая передача сообщений помогала управлять огромной территорией.',
  },
  'Coins are tiny history books': {
    title: 'Монеты — это маленькие книги истории',
    text: 'Они рассказывают о правителях, торговле, символах, языках и экономических системах прошлого.',
  },
  'Ancient shipwrecks preserve trade stories': {
    title: 'Древние кораблекрушения сохраняют историю торговли',
    text: 'Груз, найденный на дне моря, показывает, чем люди торговали и что ценили.',
  },
  'Maps used to mix science and myth': {
    title: 'Старинные карты смешивали науку и мифы',
    text: 'Ранние карты часто объединяли реальные географические знания с воображением и легендами.',
  },
  'The Bronze Age collapse reshaped the world': {
    title: 'Крах бронзового века изменил ход истории',
    text: 'В один период несколько развитых обществ пришли в упадок, что радикально изменило политическую карту древнего мира.',
  },
  'Medieval medicine mixed observation and belief': {
    title: 'Средневековая медицина сочетала наблюдения и верования',
    text: 'Некоторые методы действительно помогали, а другие основывались на ошибочных представлениях о теле и болезнях.',
  },
  'Ancient messages were encrypted': {
    title: 'Древние сообщения уже шифровали',
    text: 'Правители, дипломаты и армии использовали коды задолго до появления компьютеров.',
  },
  'Ice Age humans made art': {
    title: 'Люди ледникового периода создавали искусство',
    text: 'Наскальные рисунки показывают, что у древних людей были сложные символы, культура и воображение.',
  },
  'Forgotten empires changed borders': {
    title: 'Забытые империи меняли границы мира',
    text: 'Некоторые могущественные государства исчезли из массовой памяти, хотя сильно повлияли на историю.',
  },
  'Industrial inventions changed daily life': {
    title: 'Промышленные изобретения изменили повседневную жизнь',
    text: 'Фабрики, двигатели и электричество радикально изменили то, как люди жили и работали.',
  },
  'Archaeology keeps rewriting history': {
    title: 'Археология постоянно переписывает историю',
    text: 'Новые находки могут изменить представления о прошлом и показать, что старые объяснения были неполными.',
  },
  'Some fungi can control insects': {
    title: 'Некоторые грибы способны управлять поведением насекомых',
    text: 'Определённые грибы заражают насекомых и меняют их поведение так, чтобы эффективнее распространять споры.',
  },
  'Trees can send warning signals': {
    title: 'Деревья могут передавать сигналы тревоги',
    text: 'Растения реагируют на стресс химическими веществами и могут взаимодействовать через подземные грибные сети.',
  },
  'Lightning can make glass': {
    title: 'Молния может превращать песок в стекло',
    text: 'После удара молнии песок иногда сплавляется в стекловидные трубки, которые называют фульгуритами.',
  },
  'Carnivorous plants digest animals': {
    title: 'Хищные растения действительно переваривают животных',
    text: 'Они развили ловушки, чтобы получать питательные вещества в бедных почвах.',
  },
  'Seeds can wait for years': {
    title: 'Семена могут ждать подходящих условий годами',
    text: 'Некоторые семена долго остаются в состоянии покоя и прорастают только тогда, когда условия становятся благоприятными.',
  },
}

const azTranslations: Record<string, FactTranslation> = {
  'Cleopatra lived closer to smartphones than pyramids': {
    title: 'Kleopatra smartfonlara piramidalardan daha yaxın dövrdə yaşayıb',
    text: 'Böyük piramida Kleopatranın dövründə artıq çox qədim idi; ona görə Kleopatra ilə piramidalar arasındakı zaman müasir dövrlə arasındakı zamandan daha böyükdür.',
  },
  'Oxford University is older than the Aztec Empire': {
    title: 'Oksford Universiteti Aztek imperiyasından daha qədimdir',
    text: 'Oksfordda tədris Aztek imperiyası yaranmazdan əvvəl başlamışdı.',
  },
  'Roman concrete could self-heal': {
    title: 'Roma betonu qismən özünü bərpa edə bilirdi',
    text: 'Bəzi qədim Roma beton tikililəri xüsusi kimyəvi tərkibinə görə min illərlə davam gətirib.',
  },
  'The Silk Road was a network, not one road': {
    title: 'İpək yolu tək bir yol yox, böyük marşrut şəbəkəsi idi',
    text: 'O, şəhərləri, mədəniyyətləri və ticarət yollarını qitələr boyunca birləşdirirdi.',
  },
  'Ancient libraries shaped civilization': {
    title: 'Qədim kitabxanalar sivilizasiyanı formalaşdırıb',
    text: 'Onlarda mətnlər, xəritələr, elmi biliklər və siyasi sənədlər toplanırdı.',
  },
  'Some fungi can control insects': {
    title: 'Bəzi göbələklər həşəratların davranışını idarə edə bilir',
    text: 'Bəzi göbələklər həşəratları yoluxduraraq sporlarını daha effektiv yaymaq üçün onların davranışını dəyişir.',
  },
  'Trees can send warning signals': {
    title: 'Ağaclar xəbərdarlıq siqnalları göndərə bilir',
    text: 'Bitkilər stress zamanı kimyəvi siqnallar buraxa və yeraltı göbələk şəbəkələri ilə əlaqə yarada bilər.',
  },
}

function lang() {
  return (localStorage.getItem('dashboard-lang') || 'en').toLowerCase().split('-')[0]
}

function translationFor(base: string) {
  const current = lang()
  if (current === 'ru') return ruTranslations[base]
  if (current === 'az') return azTranslations[base]
  return undefined
}

function detailsUrl(base: string, category: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(`${base} ${category} fact explanation source`)}`
}

function updateCards() {
  const pathParts = window.location.pathname.split('/').filter(Boolean)
  const category = pathParts[1] || 'facts'
  if (pathParts[0] !== 'facts') return

  const page = Number(new URLSearchParams(window.location.search).get('page') || '1')
  const facts = getFactsForCategory(category)
  const start = (Math.max(1, page) - 1) * 5
  const currentLang = lang()
  const label = labels[currentLang] || labels.en
  const cards = Array.from(document.querySelectorAll('article')) as HTMLElement[]

  cards.forEach((card, index) => {
    const fact = facts[start + index]
    if (!fact) return

    const base = fact.title.split(' — ')[0]
    const translated = translationFor(base)
    const h2 = card.querySelector('h2')
    const paragraph = card.querySelector('p')

    if (translated && h2) h2.textContent = translated.title
    if (translated && paragraph) paragraph.textContent = translated.text

    const oldLinks = Array.from(card.querySelectorAll('[data-facts-learn-more="true"]'))
    oldLinks.forEach(link => link.remove())

    const link = document.createElement('a')
    link.href = detailsUrl(base, category)
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.dataset.factsLearnMore = 'true'
    link.textContent = `${label} ↗`
    link.className = 'inline-flex items-center gap-1 mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition'
    card.appendChild(link)
  })
}

export default function FactsTranslationFixer() {
  useEffect(() => {
    updateCards()
    const observer = new MutationObserver(updateCards)
    observer.observe(document.body, { childList: true, subtree: true })
    const interval = window.setInterval(updateCards, 400)
    return () => {
      observer.disconnect()
      window.clearInterval(interval)
    }
  }, [])

  return null
}
