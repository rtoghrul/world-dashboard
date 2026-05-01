'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Clock, CloudSun, Film, Newspaper, Plane, Play, WalletCards, BarChart2, BookOpen, Share2, Bitcoin } from 'lucide-react'
import Header from '@/components/Header'
import WeatherWidget from '@/components/WeatherWidget'
import NewsWidget from '@/components/NewsWidget'
import CryptoWidget from '@/components/CryptoWidget'
import WhaleWidget from '@/components/WhaleWidget'
import TravelComparisonWidget from '@/components/TravelComparisonWidget'
import ViralWidget from '@/components/ViralWidget'
import EntertainmentWidget from '@/components/EntertainmentWidget'
import SocialWidget from '@/components/SocialWidget'
import StocksWidget from '@/components/StocksWidget'
import EducationWidget from '@/components/EducationWidget'
import AIToolsWidget from '@/components/AIToolsWidget'
import SoftwareWidget from '@/components/SoftwareWidget'
import { useLang } from '@/lib/LanguageContext'
import t from '@/lib/translations'

const icons: Record<string, any> = { weather: CloudSun, crypto: Bitcoin, whale: WalletCards, news: Newspaper, travel: Plane, viral: Play, entertainment: Film, social: Share2, stocks: BarChart2, education: BookOpen, markets: BarChart2, aitools: BookOpen, software: BookOpen }

const names: Record<string, Record<string, string>> = {
  az: { weather: 'Hava', crypto: 'Kripto Bazarları', whale: 'Balina Aktivliyi', news: 'Qlobal Xəbərlər', travel: 'Səyahət', viral: 'Viral Məzmun', entertainment: 'Əyləncə', social: 'Sosial Trendlər', stocks: 'Səhm Bazarları', education: 'Təhsil', markets: 'Bazarlar', aitools: 'AI Alətlər', software: 'Proqramlar' },
  en: { weather: 'Weather', crypto: 'Crypto Markets', whale: 'Whale Activity', news: 'Global News', travel: 'Travel', viral: 'Viral Content', entertainment: 'Entertainment', social: 'Social Trends', stocks: 'Stocks', education: 'Education', markets: 'Markets', aitools: 'AI Tools', software: 'Software' },
  ru: { weather: 'Погода', crypto: 'Крипто рынки', whale: 'Активность китов', news: 'Мировые новости', travel: 'Путешествия', viral: 'Вирусный контент', entertainment: 'Развлечения', social: 'Социальные тренды', stocks: 'Акции', education: 'Образование', markets: 'Рынки', aitools: 'ИИ Инструменты', software: 'Софт' },
  tr: { weather: 'Hava', crypto: 'Kripto', whale: 'Balina', news: 'Haberler', travel: 'Seyahat', viral: 'Viral', entertainment: 'Eğlence', social: 'Sosyal', stocks: 'Hisseler', education: 'Eğitim', markets: 'Piyasalar', aitools: 'YZ Araçları', software: 'Yazılım' },
  de: { weather: 'Wetter', crypto: 'Krypto', whale: 'Wale', news: 'Nachrichten', travel: 'Reisen', viral: 'Viral', entertainment: 'Unterhaltung', social: 'Sozial', stocks: 'Aktien', education: 'Lernen', markets: 'Märkte', aitools: 'KI-Tools', software: 'Software' },
  fr: { weather: 'Météo', crypto: 'Crypto', whale: 'Baleines', news: 'Actualités', travel: 'Voyages', viral: 'Viral', entertainment: 'Divertissement', social: 'Social', stocks: 'Actions', education: 'Apprendre', markets: 'Marchés', aitools: 'Outils IA', software: 'Logiciels' },
  es: { weather: 'Clima', crypto: 'Cripto', whale: 'Ballenas', news: 'Noticias', travel: 'Viajes', viral: 'Viral', entertainment: 'Entretenimiento', social: 'Social', stocks: 'Acciones', education: 'Aprender', markets: 'Mercados', aitools: 'Herramientas IA', software: 'Software' },
}

// Map sub-tab slugs to translation keys (sub + PascalCase)
const subKeyMap: Record<string, string> = {
  top:'subTop',war:'subWar',politics:'subPolitics',economy:'subEconomy',ai:'subAI',industry:'subIndustry',social:'subSocial',
  tech:'subTech',science:'subScience',sports:'subSports',health:'subHealth',
  'crypto-top':'subBitcoin',whale:'subLargeTransfers','stocks-top':'subGainers',
  anime:'subCartoons',gaming:'subMovies',
  'flight-hotel':'subFlightHotel',flight:'subFlight',hotel:'subHotel','last-minute':'subLastMinute',
  movies:'subMovies',series:'subSeries',cartoons:'subCartoons',upcoming:'subUpcoming',
  youtube:'subYouTube',music:'subMusic',shorts:'subShorts',trending:'subTrending',
  bitcoin:'subBitcoin',ethereum:'subEthereum','fear-greed':'subFearGreed',
  'large-transfers':'subLargeTransfers',wallets:'subWallets',exchanges:'subExchanges',
  current:'subCurrent',hourly:'subHourly',weekly:'subWeekly',
  gainers:'subGainers',losers:'subLosers',tech:'subTech',
  science:'subScience',math:'subMath',physics:'subPhysics',
  chemistry:'subChemistry',biology:'subBiology',anatomy:'subBiology',astronomy:'subAstronomy',languages:'subLanguages',
  engineering:'subEngineering',automation:'subAutomation',electrical:'subElectrical',mechanical:'subMechanical',
  courses:'subCourses',
  instagram:'subInstagram',tiktok:'subTiktok',x:'subX',facebook:'subFacebook',
  chatbots:'subAI','image-gen':'subAI','video-gen':'subAI',writing:'subAI',coding:'subAI','free-tools':'subAI',
  android:'subTech',ios:'subTech',windows:'subTech',mac:'subTech','browser-ext':'subTech',
}

const submenuMap: Record<string, string[]> = {
  weather: ['current', 'hourly', 'weekly'],
  crypto: ['top', 'bitcoin', 'ethereum', 'fear-greed'],
  whale: ['large-transfers', 'wallets', 'exchanges'],
  news: ['top', 'war', 'politics', 'economy', 'tech', 'ai', 'science', 'sports', 'health', 'industry'],
  markets: ['crypto-top', 'bitcoin', 'ethereum', 'fear-greed', 'whale', 'stocks-top', 'gainers', 'losers'],
  travel: ['flight-hotel', 'flight', 'hotel', 'last-minute'],
  viral: ['youtube', 'tiktok', 'instagram', 'music', 'shorts', 'trending'],
  entertainment: ['movies', 'series', 'anime', 'gaming', 'upcoming', 'cartoons'],
  social: ['instagram', 'tiktok', 'x', 'facebook', 'trending'],
  stocks: ['top', 'gainers', 'losers', 'tech'],
  education: ['science', 'math', 'physics', 'chemistry', 'biology', 'astronomy', 'languages', 'engineering', 'automation', 'electrical', 'mechanical', 'courses'],
  aitools: ['chatbots', 'image-gen', 'video-gen', 'writing', 'coding', 'free-tools'],
  software: ['android', 'ios', 'windows', 'mac', 'browser-ext'],
}

const newsCat: Record<string, string> = { top: 'top', war: 'war', politics: 'politics', economy: 'economy', tech: 'technology', ai: 'ai', science: 'science', sports: 'sports', health: 'health', industry: 'technology', social: 'social' }

// Education sub → mode + subject mapping
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
  if (main === 'weather') return <WeatherWidget />
  if (main === 'crypto') return <CryptoWidget defaultExpanded />
  if (main === 'markets' && ['crypto-top', 'bitcoin', 'ethereum', 'fear-greed'].includes(sub)) return <CryptoWidget defaultExpanded />
  if (main === 'markets' && sub === 'whale') return <WhaleWidget defaultExpanded />
  if (main === 'markets' && ['stocks-top', 'gainers', 'losers'].includes(sub)) return <StocksWidget defaultExpanded />
  if (main === 'whale') return <WhaleWidget defaultExpanded />
  if (main === 'news') return <NewsWidget defaultExpanded initialTab={newsCat[sub] || 'top'} />
  if (main === 'travel') return <TravelComparisonWidget defaultExpanded />
  if (main === 'viral') return <ViralWidget defaultExpanded />
  if (main === 'entertainment') return <EntertainmentWidget />
  if (main === 'social') return <SocialWidget defaultExpanded />
  if (main === 'stocks') return <StocksWidget defaultExpanded />
  if (main === 'aitools') return <AIToolsWidget defaultExpanded initialCategory={sub === 'chatbots' ? 'chatbots' : sub === 'image-gen' ? 'image' : sub === 'video-gen' ? 'video' : sub === 'writing' ? 'writing' : sub === 'coding' ? 'coding' : 'all'} />
  if (main === 'software') return <SoftwareWidget defaultExpanded initialPlatform={sub === 'android' ? 'android' : sub === 'ios' ? 'ios' : sub === 'windows' ? 'windows' : sub === 'mac' ? 'mac' : sub === 'browser-ext' ? 'extensions' : 'all'} />
  if (main === 'education') {
    const eduConfig = educationMap[sub] || { mode: 'science', subject: 'physics' }
    return <EducationWidget defaultExpanded initialMode={eduConfig.mode} initialSubject={eduConfig.subject} />
  }
  return <NewsWidget defaultExpanded />
}

export default function SectionPage() {
  const params = useParams()
  const main = String(params.main || 'news')
  const sub = String(params.sub || 'top')
  const { lang, tr } = useLang()
  const Icon = icons[main] || Newspaper
  const title = (names[lang] || names.en)[main] || main
  const subs = submenuMap[main] || []

  // Helper to get translated sub-tab label
  const getSubLabel = (s: string) => tr[subKeyMap[s] || ''] || s

  return (
    <div className="min-h-screen">
      <Header />

      {/* Sub-navigation tabs */}
      <div className="border-b border-white/[0.04] bg-[#07070b]/80 backdrop-blur-sm sticky top-14 z-30">
        <div className="max-w-screen-2xl mx-auto px-5">
          <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
            {subs.map(s => (
              <Link
                key={s}
                href={`/section/${main}/${s}`}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  s === sub
                    ? 'bg-white/[0.08] text-white'
                    : 'text-[#6b6b80] hover:text-white hover:bg-white/[0.03]'
                }`}
              >
              {getSubLabel(s)}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Full page content */}
      <main className="max-w-screen-2xl mx-auto px-5 py-6">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] transition">
            <ArrowLeft className="w-5 h-5 text-white/80" />
          </Link>
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
            <Icon className="w-5 h-5 text-white/80" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{title}</h1>
            <p className="text-xs text-[#6b6b80]">{getSubLabel(sub)}</p>
          </div>
        </div>

        {/* Widget content - full width */}
        <Content main={main} sub={sub} />
      </main>
    </div>
  )
}
