'use client'
import { useState } from 'react'
import { useLang } from '@/lib/LanguageContext'
import { Heart, Sparkles, Baby, Dumbbell, Palette, Apple, ExternalLink, Star } from 'lucide-react'

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'Women’s Corner', az: 'Qadınlar Bölməsi', ru: 'Женский раздел', de: 'Frauenbereich', tr: 'Kadınlar Köşesi' },
  subtitle: { en: 'Beauty, health, parenting & lifestyle', az: 'Gözəllik, sağlamlıq, uşaq baxımı', ru: 'Красота, здоровье, материнство', de: 'Schönheit, Gesundheit, Elternschaft', tr: 'Güzellik, sağlık, ebeveynlik' },
}

const tabs = [
  { id: 'all', label: { en: 'All', az: 'Hamısı', de: 'Alle', ru: 'Все', tr: 'Tümü' }, icon: Heart },
  { id: 'beauty', label: { en: 'Beauty', az: 'Gözəllik', de: 'Schönheit', ru: 'Красота', tr: 'Güzellik' }, icon: Sparkles },
  { id: 'diet', label: { en: 'Diet', az: 'Dieta', de: 'Ernährung', ru: 'Диета', tr: 'Diyet' }, icon: Apple },
  { id: 'fitness', label: { en: 'Fitness', az: 'Fitness', de: 'Fitness', ru: 'Фитнес', tr: 'Fitness' }, icon: Dumbbell },
  { id: 'parenting', label: { en: 'Parenting', az: 'Uşaq Baxımı', de: 'Elternschaft', ru: 'Материнство', tr: 'Ebeveynlik' }, icon: Baby },
  { id: 'fashion', label: { en: 'Fashion', az: 'Moda', de: 'Mode', ru: 'Мода', tr: 'Moda' }, icon: Palette },
]

interface WomenItem {
  name: string
  category: string
  desc: Record<string, string>
  url: string
  type: 'app' | 'site' | 'tool' | 'shop'
  rating: number
  popular?: boolean
  free?: boolean
}

const items: WomenItem[] = [
  // Beauty & Cosmetics
  { name: 'Sephora', category: 'beauty', desc: { en: 'Premium beauty products & tutorials', az: 'Premium gözəllik məhsulları', de: 'Premium-Beauty & Tutorials', ru: 'Премиум косметика и туториалы' }, url: 'https://sephora.de', type: 'shop', rating: 4.8, popular: true },
  { name: 'Douglas', category: 'beauty', desc: { en: 'Perfume, makeup, skincare (DE #1)', az: 'Ətir, makiyaj, dəri baxımı (DE №1)', de: 'Parfum, Make-up, Hautpflege (DE #1)', ru: 'Парфюм, макияж, уход (DE №1)' }, url: 'https://douglas.de', type: 'shop', rating: 4.7, popular: true },
  { name: 'Flaconi', category: 'beauty', desc: { en: 'Online perfumery, great deals', az: 'Onlayn ətirxana, əla təkliflər', de: 'Online-Parfümerie, tolle Angebote', ru: 'Онлайн-парфюмерия, выгодно' }, url: 'https://flaconi.de', type: 'shop', rating: 4.6 },
  { name: 'Paula’s Choice', category: 'beauty', desc: { en: 'Science-based skincare, no nonsense', az: 'Elmi əsaslı dəri baxımı', de: 'Wissenschaftlich fundierte Hautpflege', ru: 'Научный уход за кожей' }, url: 'https://paulaschoice.de', type: 'shop', rating: 4.8 },
  { name: 'The Ordinary', category: 'beauty', desc: { en: 'Affordable clinical skincare', az: 'Əlçatan klinik dəri baxımı', de: 'Erschwingliche klinische Pflege', ru: 'Доступный клинический уход' }, url: 'https://theordinary.com', type: 'shop', rating: 4.7, popular: true },
  { name: 'Think Dirty', category: 'beauty', desc: { en: 'Scan cosmetics for toxic ingredients', az: 'Kosmetikada zərərli maddələri yoxla', de: 'Kosmetik auf Giftstoffe prüfen', ru: 'Проверка косметики на токсичность' }, url: 'https://thinkdirtyapp.com', type: 'app', rating: 4.5, free: true },
  { name: 'INCI Beauty', category: 'beauty', desc: { en: 'Ingredient analyzer for skincare', az: 'Dəri baxımı tərkib analizatoru', de: 'Inhaltsstoff-Analyzer', ru: 'Анализ состава косметики' }, url: 'https://incibeauty.com', type: 'app', rating: 4.4, free: true },
  // Diet & Nutrition
  { name: 'MyFitnessPal', category: 'diet', desc: { en: 'Calorie counter & food diary (14M+ foods)', az: 'Kalori sayğacı (14M+ qida)', de: 'Kalorienzähler & Ernährungstagebuch', ru: 'Счётчик калорий и дневник (14M+ продуктов)' }, url: 'https://myfitnesspal.com', type: 'app', rating: 4.7, popular: true, free: true },
  { name: 'Yazio', category: 'diet', desc: { en: 'German calorie tracker + fasting timer', az: 'Alman kalori izləyicisi + oruc taymeri', de: 'Deutscher Kalorien-Tracker + Fasten-Timer', ru: 'Немецкий трекер калорий + таймер поста' }, url: 'https://yazio.com', type: 'app', rating: 4.6, popular: true, free: true },
  { name: 'Lifesum', category: 'diet', desc: { en: 'Personalized meal plans & recipes', az: 'Fərdi yemək planları və reseptlər', de: 'Personalisierte Mahlzeitenpläne', ru: 'Персональные планы питания' }, url: 'https://lifesum.com', type: 'app', rating: 4.5, free: true },
  { name: 'Eat This Much', category: 'diet', desc: { en: 'Auto meal planner based on calories/macros', az: 'Kaloriyə görə avtomatik yemək planı', de: 'Auto-Mahlzeitenplaner nach Kalorien', ru: 'Автоматический планировщик питания' }, url: 'https://eatthismuch.com', type: 'tool', rating: 4.4, free: true },
  { name: 'Foodspring', category: 'diet', desc: { en: 'Premium nutrition & protein (German brand)', az: 'Premium qida və protein (Alman brendi)', de: 'Premium-Nutrition & Protein (deutsch)', ru: 'Премиум-питание (немецкий бренд)' }, url: 'https://foodspring.de', type: 'shop', rating: 4.6 },
  // Fitness
  { name: 'Nike Training Club', category: 'fitness', desc: { en: '200+ free workouts, yoga, HIIT, strength', az: '200+ pulsuz məşq, yoga, HIIT', de: '200+ kostenlose Workouts, Yoga, HIIT', ru: '200+ бесплатных тренировок, йога, HIIT' }, url: 'https://nike.com/ntc-app', type: 'app', rating: 4.8, popular: true, free: true },
  { name: 'Sweat (Kayla Itsines)', category: 'fitness', desc: { en: 'Women’s fitness app, BBG & PWR programs', az: 'Qadın fitness app, BBG & PWR proqramları', de: 'Frauen-Fitness-App, BBG & PWR', ru: 'Женское фитнес-приложение, BBG & PWR' }, url: 'https://sweat.com', type: 'app', rating: 4.7, popular: true },
  { name: 'Freeletics', category: 'fitness', desc: { en: 'AI personal trainer, no equipment needed', az: 'AI şəxsi məşqçi, avadanlıq lazım deyil', de: 'KI-Personal-Trainer, kein Equipment', ru: 'ИИ-тренер, без оборудования' }, url: 'https://freeletics.com', type: 'app', rating: 4.5, free: true },
  { name: 'Down Dog Yoga', category: 'fitness', desc: { en: 'Personalized yoga sessions, never same twice', az: 'Fərdi yoga sessiyaları, heç vaxt eyni deyil', de: 'Personalisierte Yoga-Sessions', ru: 'Персонализированная йога' }, url: 'https://downdogapp.com', type: 'app', rating: 4.9, free: true },
  { name: 'FitOn', category: 'fitness', desc: { en: 'Free celebrity trainer workouts', az: 'Pulsuz məşhur trener məşqləri', de: 'Kostenlose Promi-Trainer-Workouts', ru: 'Бесплатные тренировки от звёзд' }, url: 'https://fitonapp.com', type: 'app', rating: 4.7, free: true },
  // Parenting
  { name: 'BabyCenter', category: 'parenting', desc: { en: 'Pregnancy tracker & baby development', az: 'Hamiləlik izləyicisi və körpə inkişafı', de: 'Schwangerschafts-Tracker & Baby-Entwicklung', ru: 'Трекер беременности и развитие ребёнка' }, url: 'https://babycenter.de', type: 'app', rating: 4.7, popular: true, free: true },
  { name: 'Hipp', category: 'parenting', desc: { en: 'German organic baby food & advice', az: 'Alman orqanik körpə qidası', de: 'Deutsche Bio-Babynahrung & Beratung', ru: 'Немецкое органическое детское питание' }, url: 'https://hipp.de', type: 'shop', rating: 4.6 },
  { name: 'Kinder.de', category: 'parenting', desc: { en: 'German parenting portal, tips & events', az: 'Alman valideynlik portalı, məsləhətlər', de: 'Deutsches Elternportal, Tipps & Events', ru: 'Немецкий портал для родителей' }, url: 'https://kinder.de', type: 'site', rating: 4.3, free: true },
  { name: 'Windeln.de', category: 'parenting', desc: { en: 'Baby products, diapers, toys (DE shop)', az: 'Uşaq məhsulları, bezi, oyuncaqlar', de: 'Babyprodukte, Windeln, Spielzeug', ru: 'Товары для малышей, подгузники' }, url: 'https://windeln.de', type: 'shop', rating: 4.4 },
  { name: 'Pampers Club', category: 'parenting', desc: { en: 'Earn rewards, baby development tracker', az: 'Mükafat qazan, körpə inkişaf izləyicisi', de: 'Prämien sammeln, Baby-Entwicklungs-Tracker', ru: 'Бонусы, трекер развития малыша' }, url: 'https://pampers.de', type: 'app', rating: 4.5, free: true },
  // Fashion
  { name: 'Zalando', category: 'fashion', desc: { en: 'Europe’s #1 fashion, free returns', az: 'Avropanın №1 moda, pulsuz geri qaytarma', de: 'Europas Nr.1 Mode, kostenlose Retoure', ru: 'Мода №1 в Европе, бесплатный возврат' }, url: 'https://zalando.de', type: 'shop', rating: 4.8, popular: true },
  { name: 'About You', category: 'fashion', desc: { en: 'Personalized fashion discovery', az: 'Fərdi moda kəşfi', de: 'Personalisierte Mode-Entdeckung', ru: 'Персонализированный подбор моды' }, url: 'https://aboutyou.de', type: 'shop', rating: 4.7, popular: true },
  { name: 'Pinterest', category: 'fashion', desc: { en: 'Style inspiration & outfit ideas', az: 'Stil ilhamı və geyim ideyaları', de: 'Stil-Inspiration & Outfit-Ideen', ru: 'Стильные идеи и вдохновение' }, url: 'https://pinterest.com', type: 'app', rating: 4.7, free: true },
  { name: 'Vinted', category: 'fashion', desc: { en: 'Buy & sell second-hand fashion', az: 'İkinci əl moda al və sat', de: 'Second-Hand-Mode kaufen & verkaufen', ru: 'Покупка и продажа б/у моды' }, url: 'https://vinted.de', type: 'app', rating: 4.5, popular: true, free: true },
  { name: 'Lookiero', category: 'fashion', desc: { en: 'Personal stylist box delivered to you', az: 'Şəxsi stilist qutusu sizə çatdırılır', de: 'Persönliche Stylist-Box geliefert', ru: 'Персональный стилист, доставка' }, url: 'https://lookiero.de', type: 'shop', rating: 4.3 },
]

export default function WomenWidget({ initialCategory }: { initialCategory?: string }) {
  const { lang } = useLang()
  const [tab, setTab] = useState(initialCategory || 'all')
  const [expanded, setExpanded] = useState(false)

  const filtered = tab === 'all' ? items : items.filter(i => i.category === tab)
  const display = expanded ? filtered : filtered.slice(0, 8)
  const t = (k: string) => COPY[k]?.[lang] || COPY[k]?.en || k

  const typeColors: Record<string, string> = {
    app: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
    shop: 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300',
    tool: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    site: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300',
  }

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500" />
          {t('title')}
        </h2>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t('subtitle')}</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {tabs.map(c => {
          const Icon = c.icon
          return (
            <button key={c.id} onClick={() => setTab(c.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${tab === c.id ? 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
              <Icon className="w-3.5 h-3.5" />
              {c.label[lang] || c.label.en}
            </button>
          )
        })}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {display.map((item, i) => (
          <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
            className="group block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600 hover:shadow-md transition-all bg-white dark:bg-gray-800/50">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-sm group-hover:text-pink-600 dark:group-hover:text-pink-400">{item.name}</h3>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{item.desc[lang] || item.desc.en}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${typeColors[item.type]}`}>
                  {item.type.toUpperCase()}
                </span>
                {item.free && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">FREE</span>}
                {item.popular && <span className="text-[10px]">🔥</span>}
              </div>
              <div className="flex items-center gap-0.5 text-[10px] text-amber-500">
                <Star className="w-3 h-3 fill-current" />
                {item.rating}
              </div>
            </div>
          </a>
        ))}
      </div>

      {filtered.length > 8 && (
        <button onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full py-2 text-xs font-medium text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg transition-colors">
          {expanded ? '▲ Show less' : `▼ Show all (${filtered.length})`}
        </button>
      )}
    </div>
  )
}
