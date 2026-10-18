'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { LEGACY_SOURCE_IDS } from '@/lib/horizonIds'
import { uiAll } from '@/lib/i18n/ui'
import dynamic from 'next/dynamic'
import { ArrowLeft, CloudSun, Film, Newspaper, Plane, Play, BarChart2, BookOpen, Share2, Bitcoin, Heart, HeartPulse, ShoppingBag, Store, PiggyBank } from 'lucide-react'
import Header from '@/components/Header'
import ErrorBoundary from '@/components/ErrorBoundary'
import MobileBottomNav from '@/components/MobileBottomNav'
import Footer from '@/components/Footer'
import { useLang } from '@/lib/LanguageContext'

function WidgetLoader() {
  return (
    <div className="rounded-xl border border-line bg-surface-1/80 p-6">
      <div className="flex items-center gap-3 animate-pulse">
        <div className="w-10 h-10 rounded-lg bg-fg/[0.04]" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-fg/[0.04] rounded w-1/3" />
          <div className="h-2 bg-fg/[0.04] rounded w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <div className="h-8 bg-fg/[0.04] rounded" />
        <div className="h-8 bg-fg/[0.04] rounded" />
        <div className="h-8 bg-fg/[0.04] rounded" />
      </div>
    </div>
  )
}

const WeatherWidget = dynamic(() => import('@/components/WeatherWidget'), { ssr: false, loading: WidgetLoader })
const NewsHub = dynamic(() => import('@/components/news/NewsHub'), { ssr: false, loading: WidgetLoader })
const CryptoWidget = dynamic(() => import('@/components/CryptoWidget'), { ssr: false, loading: WidgetLoader })
const TravelComparisonWidget = dynamic(() => import('@/components/TravelComparisonWidget'), { ssr: false, loading: WidgetLoader })
const ViralWidget = dynamic(() => import('@/components/ViralWidget'), { ssr: false, loading: WidgetLoader })
const EntertainmentWidget = dynamic(() => import('@/components/EntertainmentWidget'), { ssr: false, loading: WidgetLoader })
const SocialWidget = dynamic(() => import('@/components/SocialWidget'), { ssr: false, loading: WidgetLoader })
const StocksWidget = dynamic(() => import('@/components/StocksWidget'), { ssr: false, loading: WidgetLoader })
const EducationWidget = dynamic(() => import('@/components/EducationWidget'), { ssr: false, loading: WidgetLoader })
const AIToolsWidget = dynamic(() => import('@/components/AIToolsWidget'), { ssr: false, loading: WidgetLoader })
const SoftwareWidget = dynamic(() => import('@/components/SoftwareWidget'), { ssr: false, loading: WidgetLoader })
const WomenWidget = dynamic(() => import('@/components/WomenWidget'), { ssr: false, loading: WidgetLoader })
const HealthWidget = dynamic(() => import('@/components/HealthWidget'), { ssr: false, loading: WidgetLoader })
const PlatformsWidget = dynamic(() => import('@/components/PlatformsWidget'), { ssr: false, loading: WidgetLoader })
const ChinesePlatformsWidget = dynamic(() => import('@/components/ChinesePlatformsWidget'), { ssr: false, loading: WidgetLoader })
const GermanyWidget = dynamic(() => import('@/components/GermanyWidget'), { ssr: false, loading: WidgetLoader })
const GermanySavingsWidget = dynamic(() => import('@/components/GermanySavingsWidget'), { ssr: false, loading: WidgetLoader })
const BenefitsWidget = dynamic(() => import('@/components/BenefitsWidget'), { ssr: false, loading: WidgetLoader })
const HorizonBoard = dynamic(() => import('@/components/horizon/HorizonBoard'), { ssr: false, loading: WidgetLoader })

const icons: Record<string, any> = { weather: CloudSun, crypto: Bitcoin, news: Newspaper, travel: Plane, viral: Play, entertainment: Film, social: Share2, stocks: BarChart2, education: BookOpen, markets: BarChart2, aitools: BookOpen, software: BookOpen, women: Heart, health: HeartPulse, shopping: ShoppingBag, platforms: Store, chinese: ShoppingBag, germany: Newspaper, horizon: Newspaper, savings: PiggyBank }

const names: Record<string, Record<string, string>> = {
  az: { weather: 'Hava', horizon: 'Horizon Daily', crypto: 'Kripto Bazarları', news: 'Qlobal Xəbərlər', travel: 'Səyahət', viral: 'Viral Məzmun', entertainment: 'Əyləncə', social: 'Sosial Trendlər', stocks: 'Səhm Bazarları', education: 'Təhsil', markets: 'Bazarlar', aitools: 'AI Alətlər', software: 'Proqramlar', women: 'Qadınlar', health: 'Sağlamlıq', shopping: 'Alış-veriş', platforms: 'Platformalar 🇩🇪', chinese: 'Çin Platformaları 🇨🇳', germany: 'Almaniyada Həyat 🇩🇪' },
  en: { weather: 'Weather', horizon: 'Horizon Daily', crypto: 'Crypto Markets', news: 'Global News', travel: 'Travel', viral: 'Viral Content', entertainment: 'Entertainment', social: 'Social Trends', stocks: 'Stocks', education: 'Education', markets: 'Markets', aitools: 'AI Tools', software: 'Software', women: 'Women', health: 'Health', shopping: 'Shopping', platforms: 'Platforms 🇩🇪', chinese: 'Chinese Platforms 🇨🇳', germany: 'Life in Germany 🇩🇪' },
  ru: { weather: 'Погода', horizon: 'Horizon Daily', crypto: 'Крипто рынки', news: 'Мировые новости', travel: 'Путешествия', viral: 'Вирусный контент', entertainment: 'Развлечения', social: 'Социальные тренды', stocks: 'Акции', education: 'Образование', markets: 'Рынки', aitools: 'ИИ Инструменты', software: 'Софт', women: 'Женщинам', health: 'Здоровье', shopping: 'Покупки', platforms: 'Платформы 🇩🇪', chinese: 'Китайские 🇨🇳', germany: 'Жизнь в Германии 🇩🇪' },
  tr: { weather: 'Hava', horizon: 'Horizon Daily', crypto: 'Kripto', news: 'Haberler', travel: 'Seyahat', viral: 'Viral', entertainment: 'Eğlence', social: 'Sosyal', stocks: 'Hisseler', education: 'Eğitim', markets: 'Piyasalar', aitools: 'YZ Araçları', software: 'Yazılım', women: 'Kadınlar', health: 'Sağlık', shopping: 'Alışveriş', platforms: 'Platformlar 🇩🇪', chinese: 'Çin 🇨🇳', germany: 'Almanya 🇩🇪' },
  de: { weather: 'Wetter', horizon: 'Horizon Daily', crypto: 'Krypto', news: 'Nachrichten', travel: 'Reisen', viral: 'Viral', entertainment: 'Unterhaltung', social: 'Sozial', stocks: 'Aktien', education: 'Lernen', markets: 'Märkte', aitools: 'KI-Tools', software: 'Software', women: 'Frauen', health: 'Gesundheit', shopping: 'Einkaufen', platforms: 'Plattformen 🇩🇪', chinese: 'Chinesisch 🇨🇳', germany: 'Leben in DE 🇩🇪' },
  fr: { weather: 'Météo', horizon: 'Horizon Daily', crypto: 'Crypto', news: 'Actualités', travel: 'Voyages', viral: 'Viral', entertainment: 'Divertissement', social: 'Social', stocks: 'Actions', education: 'Apprendre', markets: 'Marchés', aitools: 'Outils IA', software: 'Logiciels', women: 'Femmes', health: 'Santé', shopping: 'Shopping', platforms: 'Plateformes 🇩🇪', chinese: 'Chinois 🇨🇳', germany: 'Allemagne 🇩🇪' },
  es: { weather: 'Clima', horizon: 'Horizon Daily', crypto: 'Cripto', news: 'Noticias', travel: 'Viajes', viral: 'Viral', entertainment: 'Entretenimiento', social: 'Social', stocks: 'Acciones', education: 'Aprender', markets: 'Mercados', aitools: 'Herramientas IA', software: 'Software', women: 'Mujeres', health: 'Salud', shopping: 'Compras', platforms: 'Plataformas 🇩🇪', chinese: 'Chino 🇨🇳', germany: 'Alemania 🇩🇪' },
}

const subKeyMap: Record<string, string> = {
  top:'subTop',war:'subWar',politics:'subPolitics',economy:'subEconomy',ai:'subAI',industry:'subIndustry',social:'subSocial',
  tech:'subTech',science:'subScience',sports:'subSports',health:'subHealth',
  'crypto-top':'subBitcoin','stocks-top':'subGainers',
  anime:'subCartoons',gaming:'subMovies',
  'flight-hotel':'subFlightHotel',flight:'subFlight',hotel:'subHotel','last-minute':'subLastMinute',
  movies:'subMovies',series:'subSeries',cartoons:'subCartoons',upcoming:'subUpcoming',
  youtube:'subYouTube',music:'subMusic',shorts:'subShorts',trending:'subTrending',
  bitcoin:'subBitcoin',ethereum:'subEthereum','fear-greed':'subFearGreed',
  'large-transfers':'subLargeTransfers',wallets:'subWallets',exchanges:'subExchanges',
  current:'subCurrent',hourly:'subHourly',weekly:'subWeekly',
  gainers:'subGainers',losers:'subLosers',
  math:'subMath',physics:'subPhysics',
  chemistry:'subChemistry',biology:'subBiology',anatomy:'subBiology',astronomy:'subAstronomy',languages:'subLanguages',
  engineering:'subEngineering',automation:'subAutomation',electrical:'subElectrical',mechanical:'subMechanical',
  courses:'subCourses',
  instagram:'subInstagram',tiktok:'subTiktok',x:'subX',facebook:'subFacebook',
  chatbots:'subChatbots','image-gen':'subImageGen','video-gen':'subVideoGen',writing:'subWritingAI',coding:'subCodingAI','free-tools':'subFreeTools',
  android:'subAndroid',ios:'subIOS',windows:'subWindows',mac:'subMac','browser-ext':'subExtensions',
  beauty:'subBeauty',diet:'subDiet',fitness:'subFitness',parenting:'subParenting',fashion:'subFashion',wellness:'subWellness',
  all:'subAll',electronics:'subElectronics',grocery:'subGrocery',pharmacy:'subPharmacy',auto:'subAuto',home:'subHome',
  general:'subGeneral',clothes:'subClothes',pharma:'subPharma',food:'subFood',autoparts:'subAutoparts',furniture:'subFurniture',international:'subInternational',
  benefits:'subBenefits',
}

const localSubLabels: Record<string, Record<string, string>> = {
  savings: { en: 'Savings Apps', az: 'Qənaət App-ları', ru: 'Экономия', de: 'Spar-Apps', tr: 'Tasarruf App’leri', fr: 'Applis d’économies', es: 'Apps de ahorro', zh: '省钱应用', ar: 'تطبيقات التوفير', ja: '節約アプリ', it: 'App di risparmio', pt: 'Apps de economia' },
  pharmacy: { en: 'Pharmacy', az: 'Aptek', ru: 'Аптека', de: 'Apotheke', tr: 'Eczane', fr: 'Pharmacie', es: 'Farmacia', zh: '药店', ar: 'صيدلية', ja: '薬局', it: 'Farmacia', pt: 'Farmácia' },
  symptoms: { en: 'Symptoms & Info', az: 'Simptomlar', ru: 'Симптомы', de: 'Symptome', tr: 'Belirtiler', fr: 'Symptômes & infos', es: 'Síntomas e información', zh: '症状与信息', ar: 'الأعراض والمعلومات', ja: '症状と情報', it: 'Sintomi e info', pt: 'Sintomas e informações' },
  insurance: { en: 'Insurance', az: 'Sığorta', ru: 'Страхование', de: 'Versicherung', tr: 'Sigorta', fr: 'Assurance', es: 'Seguros', zh: '保险', ar: 'التأمين', ja: '保険', it: 'Assicurazione', pt: 'Seguros' },
}

// Region sub-tabs share the /news labels
for (const r of ['world', 'azerbaijan', 'caucasus', 'europe', 'mideast', 'asia', 'africa', 'americas', 'local'] as const) localSubLabels[r] = uiAll(`news.${r}`)
if (!localSubLabels.all) localSubLabels.all = uiAll('common.all')

const submenuMap: Record<string, string[]> = {
  weather: ['current', 'hourly', 'weekly'],
  crypto: ['top', 'bitcoin', 'ethereum', 'fear-greed', 'benefits'],
  news: ['top', 'world', 'azerbaijan', 'caucasus', 'europe', 'mideast', 'asia', 'africa', 'americas', 'local', 'war', 'politics', 'economy', 'tech', 'ai', 'science', 'sports', 'health', 'industry'],
  markets: ['crypto-top', 'bitcoin', 'ethereum', 'fear-greed', 'stocks-top', 'gainers', 'losers', 'benefits'],
  travel: ['flight-hotel', 'flight', 'hotel', 'last-minute', 'benefits'],
  viral: ['youtube', 'tiktok', 'instagram', 'music', 'shorts', 'trending', 'benefits'],
  entertainment: ['movies', 'series', 'anime', 'gaming', 'upcoming', 'cartoons', 'benefits'],
  social: ['instagram', 'tiktok', 'x', 'facebook', 'trending'],
  stocks: ['top', 'gainers', 'losers', 'tech'],
  education: ['science', 'math', 'physics', 'chemistry', 'biology', 'astronomy', 'languages', 'engineering', 'automation', 'electrical', 'mechanical', 'courses', 'benefits'],
  aitools: ['chatbots', 'image-gen', 'video-gen', 'writing', 'coding', 'free-tools', 'benefits'],
  software: ['android', 'ios', 'windows', 'mac', 'browser-ext', 'benefits'],
  women: ['beauty', 'diet', 'fitness', 'parenting', 'fashion', 'benefits'],
  health: ['pharmacy', 'symptoms', 'insurance', 'fitness', 'benefits'],
  shopping: ['all', 'electronics', 'fashion', 'grocery', 'pharmacy', 'auto', 'home', 'benefits'],
  platforms: ['general', 'clothes', 'pharma', 'food', 'electronics', 'autoparts', 'furniture', 'international', 'benefits'],
  chinese: ['all', 'general', 'fashion', 'electronics', 'home', 'kids', 'hobby', 'benefits'],
  germany: ['behoerden', 'wohnung', 'bildung', 'arbeit', 'aenderungen', 'tools', 'savings', 'auto', 'familie', 'miete', 'gesundheit', 'versicherung', 'rechte', 'deutsch', 'benefits'],
}

const newsCat: Record<string, string> = { top: 'top', war: 'war', politics: 'politics', economy: 'economy', tech: 'technology', ai: 'ai', science: 'science', sports: 'sports', health: 'health', industry: 'industry', social: 'social', world: 'world', azerbaijan: 'azerbaijan', caucasus: 'caucasus', europe: 'europe', mideast: 'mideast', asia: 'asia', africa: 'africa', americas: 'americas', local: 'local' }

const educationMap: Record<string, { mode: 'science' | 'engineering'; subject?: string }> = {
  science: { mode: 'science', subject: 'physics' },
  math: { mode: 'science', subject: 'math' },
  geometry: { mode: 'science', subject: 'geometry' },
  physics: { mode: 'science', subject: 'physics' },
  chemistry: { mode: 'science', subject: 'chemistry' },
  biology: { mode: 'science', subject: 'biology' },
  anatomy: { mode: 'science', subject: 'anatomy' },
  astronomy: { mode: 'science', subject: 'astronomy' },
  languages: { mode: 'science', subject: 'languages' },
  engineering: { mode: 'engineering' },
  automation: { mode: 'engineering', subject: 'automation' },
  electrical: { mode: 'engineering', subject: 'electrical' },
  mechanical: { mode: 'engineering', subject: 'mechanical' },
  courses: { mode: 'science', subject: 'physics' },
}

function Content({ main, sub }: { main: string; sub: string }) {
  try {
    if (sub === 'benefits') {
      const sectionKey = main === 'crypto' ? 'markets' : main
      return <BenefitsWidget section={sectionKey} />
    }

    if (main === 'weather') return <WeatherWidget />
    if (main === 'crypto') return <CryptoWidget defaultExpanded />
    if (main === 'markets' && ['crypto-top', 'bitcoin', 'ethereum', 'fear-greed'].includes(sub)) return <CryptoWidget defaultExpanded />
    if (main === 'markets' && ['stocks-top', 'gainers', 'losers'].includes(sub)) return <StocksWidget defaultExpanded />
    if (main === 'news') return <NewsHub embedded initialCategory={newsCat[sub] || 'top'} />
    if (main === 'travel') return <TravelComparisonWidget defaultExpanded />
    if (main === 'viral') return <ViralWidget defaultExpanded />
    if (main === 'entertainment') return <EntertainmentWidget />
    if (main === 'social') return <SocialWidget defaultExpanded initialPlatform={sub} />
    if (main === 'stocks') return <StocksWidget defaultExpanded />
    if (main === 'aitools') return <AIToolsWidget defaultExpanded initialCategory={sub === 'chatbots' ? 'chatbots' : sub === 'image-gen' ? 'image' : sub === 'video-gen' ? 'video' : sub === 'writing' ? 'writing' : sub === 'coding' ? 'coding' : 'all'} />
    if (main === 'software') return <SoftwareWidget defaultExpanded initialPlatform={sub === 'android' ? 'android' : sub === 'ios' ? 'ios' : sub === 'windows' ? 'windows' : sub === 'mac' ? 'mac' : sub === 'browser-ext' ? 'extensions' : 'all'} />
    if (main === 'women') return <WomenWidget initialCategory={sub || 'all'} />
    if (main === 'health') return <HealthWidget initialCategory={sub || 'all'} />
    if (main === 'shopping') return <PlatformsWidget initialCategory={sub || 'all'} />
    if (main === 'platforms') return <PlatformsWidget initialCategory={sub || 'all'} />
    if (main === 'chinese') return <ChinesePlatformsWidget initialCategory={sub || 'all'} />
    if (main === 'germany' && sub === 'savings') return <GermanySavingsWidget />
    if (main === 'germany') return <GermanyWidget initialTab={sub || 'behoerden'} />
    if (main === 'horizon') return <HorizonBoard initialSource={LEGACY_SOURCE_IDS[sub] || sub || 'all'} />
    if (main === 'education') {
      const eduConfig = educationMap[sub] || { mode: 'science' as const, subject: 'physics' }
      return <EducationWidget defaultExpanded initialMode={eduConfig.mode} initialSubject={eduConfig.subject} />
    }
    return <NewsHub embedded />
  } catch (err) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
        <p className="text-red-400 text-sm">Widget render error</p>
        <button onClick={() => window.location.reload()} className="mt-3 px-4 py-2 rounded-lg bg-fg/[0.06] text-ink-1 text-sm">Reload</button>
      </div>
    )
  }
}

export default function SectionPage() {
  const params = useParams()
  const main = String(params.main || 'news')
  const sub = String(params.sub || 'top')
  const { lang, tr } = useLang()
  const Icon = icons[main] || Newspaper
  const title = (names[lang] || names.en)[main] || main
  const subs = submenuMap[main] || []

  const getSubLabel = (s: string) => {
    if (localSubLabels[s]) return localSubLabels[s][lang] || localSubLabels[s].en
    const key = subKeyMap[s]
    if (key && tr && tr[key]) return tr[key]
    return s
  }

  return (
    <div className="min-h-screen relative z-[1] bg-surface-0">
      <Header />

      <div className="border-b border-line bg-surface-1/90 backdrop-blur-xl sticky top-14 z-30">
        <div className="max-w-screen-2xl mx-auto px-5">
          <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-thin">
            {subs.map(s => (
              <Link
                key={s}
                href={`/section/${main}/${s}`}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  s === sub
                    ? 'bg-fg/[0.08] text-ink-1'
                    : 'text-ink-4 hover:text-ink-1 hover:bg-fg/[0.03]'
                }`}
              >
              {getSubLabel(s)}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <main id="main-content" className="max-w-screen-2xl mx-auto px-5 py-6">
        <div className="flex items-center gap-3 mb-6 animate-slide-up">
          <Link href="/" className="w-10 h-10 rounded-xl bg-fg/[0.04] border border-line flex items-center justify-center hover:bg-fg/[0.08] hover:border-indigo-500/20 transition-all">
            <ArrowLeft className="w-5 h-5 text-ink-1/80" />
          </Link>
          <div className="section-icon bg-indigo-500/10 border border-indigo-500/20">
            <Icon className="w-5 h-5 text-ink-1/80" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text-static">{title}</h1>
            <p className="text-xs text-ink-4">{getSubLabel(sub)}</p>
          </div>
        </div>

        <ErrorBoundary>
          <Content main={main} sub={sub} />
        </ErrorBoundary>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}
