'use client'
import { useState } from 'react'
import { useLang } from '@/lib/LanguageContext'
import { ExternalLink, Star, Truck, ShieldCheck, Clock, Package, Shirt, Cpu, Home, Baby, Gamepad2, Wrench } from 'lucide-react'

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'Chinese Platforms 🇨🇳→🇩🇪', az: 'Çin Platformaları 🇨🇳→🇩🇪', ru: 'Китайские платформы 🇨🇳→🇩🇪', de: 'Chinesische Plattformen 🇨🇳→🇩🇪', tr: 'Çin Platformları 🇨🇳→🇩🇪' },
  subtitle: { en: 'Ships to Germany • Prices incl. EU customs', az: 'Almaniyaya çatdırılır • Qiymətlərə gömrük daxildir', ru: 'Доставка в Германию • Цены с таможней ЕС', de: 'Lieferung nach Deutschland • Preise inkl. EU-Zoll', tr: 'Almanya\u2019ya gönderim • Fiyatlar AB gümrük dahil' },
  delivery: { en: 'Delivery', az: 'Çatdırılma', ru: 'Доставка', de: 'Lieferung', tr: 'Teslimat' },
  warehouse: { en: 'EU Warehouse', az: 'AB Anbarı', ru: 'Склад в ЕС', de: 'EU-Lager', tr: 'AB Deposu' },
  days: { en: 'days', az: 'gün', ru: 'дней', de: 'Tage', tr: 'gün' },
}

const categories = [
  { id: 'all', label: { en: 'All', az: 'Hamısı', de: 'Alle', ru: 'Все', tr: 'Tümü' }, icon: Package },
  { id: 'general', label: { en: 'General', az: 'Ümumi', de: 'Allgemein', ru: 'Общие', tr: 'Genel' }, icon: Package },
  { id: 'fashion', label: { en: 'Fashion', az: 'Moda', de: 'Mode', ru: 'Мода', tr: 'Moda' }, icon: Shirt },
  { id: 'electronics', label: { en: 'Electronics', az: 'Elektronika', de: 'Elektronik', ru: 'Электроника', tr: 'Elektronik' }, icon: Cpu },
  { id: 'home', label: { en: 'Home & Garden', az: 'Ev & Bağ', de: 'Haus & Garten', ru: 'Дом и сад', tr: 'Ev & Bahçe' }, icon: Home },
  { id: 'kids', label: { en: 'Kids & Baby', az: 'Uşaq', de: 'Kinder', ru: 'Дети', tr: 'Çocuk' }, icon: Baby },
  { id: 'hobby', label: { en: 'Hobby & Tools', az: 'Hobbi & Alətlər', de: 'Hobby & Werkzeug', ru: 'Хобби', tr: 'Hobi' }, icon: Wrench },
]

interface Platform {
  name: string
  category: string
  url: string
  desc: Record<string, string>
  deliveryDays: string
  hasEUWarehouse: boolean
  rating: number
  popular?: boolean
  freeShipping?: string
  highlight?: boolean
}

const platforms: Platform[] = [
  // General
  { name: 'AliExpress', category: 'general', url: 'https://aliexpress.com', desc: { en: 'World\u2019s largest Chinese marketplace, 150M+ products', az: 'Dünyanın ən böyük Çin bazarı, 150M+ məhsul', de: 'Größter chinesischer Marktplatz, 150M+ Produkte', ru: 'Крупнейший китайский маркетплейс, 150M+ товаров' }, deliveryDays: '7-15', hasEUWarehouse: true, rating: 4.6, popular: true, freeShipping: 'Most items', highlight: true },
  { name: 'Temu', category: 'general', url: 'https://temu.com', desc: { en: 'Ultra-low prices, gamified shopping, fast EU delivery', az: 'Ultra-aşağı qiymətlər, sürətli AB çatdırılma', de: 'Ultra-günstig, gamifiziertes Shopping, schnelle EU-Lieferung', ru: 'Сверхнизкие цены, быстрая доставка в ЕС' }, deliveryDays: '5-12', hasEUWarehouse: true, rating: 4.3, popular: true, freeShipping: 'Most items', highlight: true },
  { name: 'Wish', category: 'general', url: 'https://wish.com', desc: { en: 'Budget marketplace, fun finds, variable quality', az: 'Büdcə bazarı, maraqlı tapıntılar', de: 'Budget-Marktplatz, lustige Funde', ru: 'Бюджетный маркетплейс, интересные находки' }, deliveryDays: '10-25', hasEUWarehouse: false, rating: 3.8, freeShipping: 'Select items' },
  { name: 'DHgate', category: 'general', url: 'https://dhgate.com', desc: { en: 'Wholesale prices for individuals, bulk discounts', az: 'Topdan qiymətlər, kütləvi endirimlər', de: 'Großhandelspreise für Einzelpersonen', ru: 'Оптовые цены для частных лиц' }, deliveryDays: '10-20', hasEUWarehouse: false, rating: 4.1, freeShipping: '2+ items' },
  { name: 'Banggood', category: 'general', url: 'https://banggood.com', desc: { en: 'Electronics, gadgets & outdoor, EU warehouse', az: 'Elektronika, qadjetlər, AB anbarı', de: 'Elektronik, Gadgets & Outdoor, EU-Lager', ru: 'Электроника, гаджеты, склад в ЕС' }, deliveryDays: '3-10', hasEUWarehouse: true, rating: 4.4, popular: true, highlight: true },
  { name: 'LightInTheBox', category: 'general', url: 'https://lightinthebox.com', desc: { en: 'Fashion, electronics, home at factory prices', az: 'Moda, elektronika, ev fabrik qiymətinə', de: 'Mode, Elektronik, Haus zu Fabrikpreisen', ru: 'Мода, электроника, дом по заводским ценам' }, deliveryDays: '8-18', hasEUWarehouse: false, rating: 4.0 },
  { name: 'Made-in-China', category: 'general', url: 'https://made-in-china.com', desc: { en: 'B2B platform, factory direct, bulk orders', az: 'B2B platforma, fabrikdən birbaşa', de: 'B2B-Plattform, Fabrikdirekt, Großbestellungen', ru: 'B2B платформа, напрямую с завода' }, deliveryDays: '15-30', hasEUWarehouse: false, rating: 4.2 },
  // Fashion
  { name: 'SHEIN', category: 'fashion', url: 'https://shein.com', desc: { en: 'Fast fashion #1, 10K+ new items daily, EU returns', az: 'Fast fashion №1, gündəlik 10K+ yeni məhsul', de: 'Fast Fashion #1, 10K+ neue Artikel täglich, EU-Retoure', ru: 'Fast fashion №1, 10K+ новинок ежедневно' }, deliveryDays: '5-8', hasEUWarehouse: true, rating: 4.5, popular: true, freeShipping: '29€+', highlight: true },
  { name: 'Zaful', category: 'fashion', url: 'https://zaful.com', desc: { en: 'Trendy swimwear, casual wear, youth fashion', az: 'Trend mayo, gənclər modası', de: 'Trendige Bademode, Casual Wear, Jugendmode', ru: 'Модные купальники, молодёжная мода' }, deliveryDays: '8-15', hasEUWarehouse: false, rating: 4.0 },
  { name: 'Romwe', category: 'fashion', url: 'https://romwe.com', desc: { en: 'SHEIN sister brand, edgy & alternative fashion', az: 'SHEIN qardaş brendi, alternativ moda', de: 'SHEIN-Schwestermarke, kantige Mode', ru: 'Бренд SHEIN, альтернативная мода' }, deliveryDays: '5-10', hasEUWarehouse: true, rating: 4.2, freeShipping: '29€+' },
  { name: 'YesStyle', category: 'fashion', url: 'https://yesstyle.com', desc: { en: 'K-beauty & Asian fashion, curated quality', az: 'K-beauty və Asiya modası, seçilmiş keyfiyyət', de: 'K-Beauty & asiatische Mode, kuratiert', ru: 'K-beauty и азиатская мода, отборное качество' }, deliveryDays: '7-14', hasEUWarehouse: true, rating: 4.5, popular: true },
  { name: 'Cider', category: 'fashion', url: 'https://shopcider.com', desc: { en: 'Gen-Z fashion, sustainable claims, trendy', az: 'Gen-Z moda, davamlı, trend', de: 'Gen-Z Mode, Nachhaltigkeitsanspruch, trendy', ru: 'Мода Gen-Z, тренды' }, deliveryDays: '7-12', hasEUWarehouse: true, rating: 4.3 },
  { name: 'Urbanic', category: 'fashion', url: 'https://urbanic.com', desc: { en: 'Trendy women\u2019s fashion, plus size friendly', az: 'Trend qadın modası, böyük bədən', de: 'Trendige Damenmode, Plus-Size-freundlich', ru: 'Модная женская одежда, большие размеры' }, deliveryDays: '8-15', hasEUWarehouse: false, rating: 4.1 },
  // Electronics
  { name: 'Xiaomi Store', category: 'electronics', url: 'https://mi.com/de', desc: { en: 'Official Xiaomi DE store, phones, smart home, IoT', az: 'Rəsmi Xiaomi DE mağazası, telefonlar, smart ev', de: 'Offizieller Xiaomi DE Store, Handys, Smart Home', ru: 'Официальный Xiaomi DE, телефоны, умный дом' }, deliveryDays: '2-5', hasEUWarehouse: true, rating: 4.8, popular: true, freeShipping: 'All orders', highlight: true },
  { name: 'Geekbuying', category: 'electronics', url: 'https://geekbuying.com', desc: { en: 'E-bikes, robots, 3D printers, EU warehouse', az: 'E-velosiped, robotlar, 3D printer, AB anbarı', de: 'E-Bikes, Roboter, 3D-Drucker, EU-Lager', ru: 'Электровелосипеды, роботы, 3D-принтеры' }, deliveryDays: '3-7', hasEUWarehouse: true, rating: 4.5, popular: true, highlight: true },
  { name: 'TomTop', category: 'electronics', url: 'https://tomtop.com', desc: { en: 'Gadgets, drones, cameras, EU fast shipping', az: 'Qadjetlər, dronlar, kameralar, AB sürətli', de: 'Gadgets, Drohnen, Kameras, EU-Schnellversand', ru: 'Гаджеты, дроны, камеры, быстрая доставка' }, deliveryDays: '3-8', hasEUWarehouse: true, rating: 4.3 },
  { name: 'Anker (via Amazon.de)', category: 'electronics', url: 'https://amazon.de/anker', desc: { en: 'Premium chargers, cables, power banks (Chinese brand)', az: 'Premium şarj cihazları, kabellər (Çin brendi)', de: 'Premium-Ladegeräte, Kabel, Powerbanks', ru: 'Премиум зарядки, кабели, повербанки' }, deliveryDays: '1-2', hasEUWarehouse: true, rating: 4.9, popular: true },
  { name: 'UGREEN', category: 'electronics', url: 'https://ugreen.com', desc: { en: 'USB hubs, chargers, audio accessories', az: 'USB hab, şarj, audio aksesuarlar', de: 'USB-Hubs, Ladegeräte, Audio-Zubehör', ru: 'USB-хабы, зарядки, аудио-аксессуары' }, deliveryDays: '2-5', hasEUWarehouse: true, rating: 4.7 },
  // Home & Garden
  { name: 'AliExpress Home', category: 'home', url: 'https://aliexpress.com/category/home-garden.html', desc: { en: 'Home decor, kitchen, bathroom, garden tools', az: 'Ev dekoru, mətbəx, hamam, bağ alətləri', de: 'Wohndeko, Küche, Bad, Gartenwerkzeug', ru: 'Декор, кухня, ванная, садовые инструменты' }, deliveryDays: '7-15', hasEUWarehouse: true, rating: 4.4 },
  { name: 'Temu Home', category: 'home', url: 'https://temu.com/home-garden.html', desc: { en: 'Budget home essentials, storage, lighting', az: 'Büdcə ev əsasları, saxlama, işıqlandırma', de: 'Budget-Haushalt, Aufbewahrung, Beleuchtung', ru: 'Бюджетные товары для дома' }, deliveryDays: '5-12', hasEUWarehouse: true, rating: 4.2, freeShipping: 'Most items' },
  { name: 'Dreame (Robot vacuums)', category: 'home', url: 'https://dreametech.com', desc: { en: 'Premium robot vacuums, mops, EU service', az: 'Premium robot tozsoran, AB servisi', de: 'Premium-Saugroboter, EU-Service', ru: 'Премиум робот-пылесосы, сервис в ЕС' }, deliveryDays: '2-5', hasEUWarehouse: true, rating: 4.7, popular: true, highlight: true },
  { name: 'Roborock', category: 'home', url: 'https://roborock.com/de', desc: { en: 'Top-rated robot vacuums, German support', az: 'Ən yaxşı robot tozsoranlar, Alman dəstəyi', de: 'Top-bewertete Saugroboter, deutscher Support', ru: 'Лучшие робот-пылесосы, поддержка на немецком' }, deliveryDays: '2-4', hasEUWarehouse: true, rating: 4.8, popular: true },
  // Kids
  { name: 'PatPat', category: 'kids', url: 'https://patpat.com', desc: { en: 'Affordable kids & baby clothing, cute designs', az: 'Əlçatan uşaq geyimləri, şirin dizaynlar', de: 'Günstige Kinder- & Babykleidung, süße Designs', ru: 'Доступная детская одежда, милые дизайны' }, deliveryDays: '7-14', hasEUWarehouse: true, rating: 4.4, popular: true, freeShipping: '39€+' },
  { name: 'Temu Kids', category: 'kids', url: 'https://temu.com/kids.html', desc: { en: 'Budget toys, kids accessories, school supplies', az: 'Büdcə oyuncaqlar, uşaq aksesuarları', de: 'Budget-Spielzeug, Kinder-Zubehör, Schulsachen', ru: 'Бюджетные игрушки, аксессуары для детей' }, deliveryDays: '5-12', hasEUWarehouse: true, rating: 4.1 },
  { name: 'AliExpress Kids', category: 'kids', url: 'https://aliexpress.com/category/kids.html', desc: { en: 'Kids clothing, educational toys, baby gear', az: 'Uşaq geyimi, təhsil oyuncaqları', de: 'Kinderkleidung, Lernspielzeug, Babyausstattung', ru: 'Детская одежда, развивающие игрушки' }, deliveryDays: '7-15', hasEUWarehouse: true, rating: 4.3 },
  // Hobby & Tools
  { name: 'Banggood Hobby', category: 'hobby', url: 'https://banggood.com/rc-toys.html', desc: { en: 'RC cars, drones, 3D printing, Arduino, DIY', az: 'RC maşınlar, dronlar, 3D çap, Arduino, DIY', de: 'RC-Autos, Drohnen, 3D-Druck, Arduino, DIY', ru: 'RC-машинки, дроны, 3D-печать, Arduino' }, deliveryDays: '3-10', hasEUWarehouse: true, rating: 4.5, popular: true },
  { name: 'AliExpress Tools', category: 'hobby', url: 'https://aliexpress.com/category/tools.html', desc: { en: 'Hand tools, power tools, measuring instruments', az: 'Əl alətləri, elektrik alətləri, ölçü cihazları', de: 'Handwerkzeuge, Elektrowerkzeuge, Messgeräte', ru: 'Ручные и электроинструменты, измерители' }, deliveryDays: '7-15', hasEUWarehouse: true, rating: 4.4 },
  { name: 'Creality (3D Printers)', category: 'hobby', url: 'https://creality.com', desc: { en: 'World\u2019s #1 consumer 3D printers, EU support', az: 'Dünyanın №1 3D printerləri, AB dəstəyi', de: 'Weltweit #1 Consumer-3D-Drucker, EU-Support', ru: 'Лучшие 3D-принтеры для дома, поддержка ЕС' }, deliveryDays: '3-7', hasEUWarehouse: true, rating: 4.6, popular: true, highlight: true },
]

export default function ChinesePlatformsWidget({ initialCategory }: { initialCategory?: string }) {
  const { lang } = useLang()
  const [tab, setTab] = useState(initialCategory || 'all')
  const [expanded, setExpanded] = useState(false)
  const t = (k: string) => COPY[k]?.[lang] || COPY[k]?.en || k

  const filtered = tab === 'all' ? platforms : platforms.filter(p => p.category === tab)
  const display = expanded ? filtered : filtered.slice(0, 9)

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="text-xl">🇨🇳</span>
          {t('title')}
        </h2>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t('subtitle')}</p>

      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {categories.map(c => {
          const Icon = c.icon
          return (
            <button key={c.id} onClick={() => setTab(c.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${tab === c.id ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
              <Icon className="w-3.5 h-3.5" />
              {c.label[lang] || c.label.en}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {display.map((p, i) => (
          <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
            className={`group block p-3 rounded-lg border transition-all bg-white dark:bg-gray-800/50 ${p.highlight ? 'border-red-200 dark:border-red-800/50 hover:border-red-400 dark:hover:border-red-600' : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700'} hover:shadow-md`}>
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-sm group-hover:text-red-600 dark:group-hover:text-red-400 flex items-center gap-1.5">
                {p.name}
                {p.popular && <span className="text-[10px]">🔥</span>}
              </h3>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{p.desc[lang] || p.desc.en}</p>
            <div className="flex items-center justify-between flex-wrap gap-1">
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                  <Truck className="w-2.5 h-2.5" />
                  {p.deliveryDays} {t('days')}
                </span>
                {p.hasEUWarehouse && (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    EU
                  </span>
                )}
                {p.freeShipping && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300">
                    Free: {p.freeShipping}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-0.5 text-[10px] text-amber-500">
                <Star className="w-3 h-3 fill-current" />
                {p.rating}
              </div>
            </div>
          </a>
        ))}
      </div>

      {filtered.length > 9 && (
        <button onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
          {expanded ? '\u25b2 Show less' : `\u25bc Show all (${filtered.length})`}
        </button>
      )}
    </div>
  )
}
