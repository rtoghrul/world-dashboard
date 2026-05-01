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
import { useLang } from '@/lib/LanguageContext'
import t from '@/lib/translations'

const icons: Record<string, any> = { weather: CloudSun, crypto: Bitcoin, whale: WalletCards, news: Newspaper, travel: Plane, viral: Play, entertainment: Film, social: Share2, stocks: BarChart2, education: BookOpen }

const names: Record<string, Record<string, string>> = {
  az: { weather: 'Hava', crypto: 'Kripto Bazarları', whale: 'Balina Aktivliyi', news: 'Qlobal Xəbərlər', travel: 'Səyahət', viral: 'Viral Məzmun', entertainment: 'Kino və Seriallar', social: 'Sosial Trendlər', stocks: 'Səhm Bazarları', education: 'Təhsil' },
  en: { weather: 'Weather', crypto: 'Crypto Markets', whale: 'Whale Activity', news: 'Global News', travel: 'Travel', viral: 'Viral Content', entertainment: 'Movies & Series', social: 'Social Trends', stocks: 'Stocks', education: 'Education' },
  ru: { weather: 'Погода', crypto: 'Крипто рынки', whale: 'Активность китов', news: 'Мировые новости', travel: 'Путешествия', viral: 'Вирусный контент', entertainment: 'Кино и сериалы', social: 'Социальные тренды', stocks: 'Акции', education: 'Образование' }
}

// Map sub-tab slugs to translation keys (sub + PascalCase)
const subKeyMap: Record<string, string> = {
  top:'subTop',war:'subWar',politics:'subPolitics',economy:'subEconomy',ai:'subAI',industry:'subIndustry',social:'subSocial',
  'flight-hotel':'subFlightHotel',flight:'subFlight',hotel:'subHotel','last-minute':'subLastMinute',
  movies:'subMovies',series:'subSeries',cartoons:'subCartoons',upcoming:'subUpcoming',
  youtube:'subYouTube',music:'subMusic',shorts:'subShorts',trending:'subTrending',
  bitcoin:'subBitcoin',ethereum:'subEthereum','fear-greed':'subFearGreed',
  'large-transfers':'subLargeTransfers',wallets:'subWallets',exchanges:'subExchanges',
  current:'subCurrent',hourly:'subHourly',weekly:'subWeekly',
  gainers:'subGainers',losers:'subLosers',tech:'subTech',
  science:'subScience',math:'subMath',geometry:'subMath',physics:'subPhysics',
  chemistry:'subChemistry',biology:'subBiology',anatomy:'subBiology',astronomy:'subAstronomy',languages:'subLanguages',
  engineering:'subEngineering',automation:'subAutomation',electrical:'subElectrical',mechanical:'subMechanical',
  courses:'subCourses',
  instagram:'subInstagram',tiktok:'subTiktok',x:'subX',facebook:'subFacebook',
}

const submenuMap: Record<string, string[]> = {
  weather: ['current', 'hourly', 'weekly'],
  crypto: ['top', 'bitcoin', 'ethereum', 'fear-greed'],
  whale: ['large-transfers', 'wallets', 'exchanges'],
  news: ['top', 'war', 'politics', 'economy', 'ai', 'industry', 'social'],
  travel: ['flight-hotel', 'flight', 'hotel', 'last-minute'],
  viral: ['youtube', 'music', 'shorts', 'trending'],
  entertainment: ['movies', 'series', 'cartoons', 'upcoming'],
  social: ['instagram', 'tiktok', 'x', 'facebook'],
  stocks: ['top', 'gainers', 'losers', 'tech'],
  education: ['science', 'math', 'physics', 'chemistry', 'biology', 'astronomy', 'languages', 'engineering', 'automation', 'electrical', 'mechanical', 'courses'],
}

const newsCat: Record<string, string> = { top: 'top', war: 'war', politics: 'politics', economy: 'economy', ai: 'ai', industry: 'technology', social: 'social' }

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
  if (main === 'whale') return <WhaleWidget defaultExpanded />
  if (main === 'news') return <NewsWidget defaultExpanded initialTab={newsCat[sub] || 'top'} />
  if (main === 'travel') return <TravelComparisonWidget defaultExpanded />
  if (main === 'viral') return <ViralWidget defaultExpanded />
  if (main === 'entertainment') return <EntertainmentWidget />
  if (main === 'social') return <SocialWidget defaultExpanded />
  if (main === 'stocks') return <StocksWidget defaultExpanded />
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
