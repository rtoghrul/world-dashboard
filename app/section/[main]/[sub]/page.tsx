'use client'
import useSWR from 'swr'
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

const fetcher = (url: string) => fetch(url).then(r => r.json())

const icons: any = { weather: CloudSun, crypto: Bitcoin, whale: WalletCards, news: Newspaper, travel: Plane, viral: Play, entertainment: Film, social: Share2, stocks: BarChart2, education: BookOpen }

const names: any = {
  az: { weather: 'Hava', crypto: 'Kripto Bazarları', whale: 'Balina Aktivliyi', news: 'Qlobal Xəbərlər', travel: 'Səyahət', viral: 'Viral Məzmun', entertainment: 'Kino və Seriallar', social: 'Sosial Trendlər', stocks: 'Səhm Bazarları', education: 'Təhsil' },
  en: { weather: 'Weather', crypto: 'Crypto Markets', whale: 'Whale Activity', news: 'Global News', travel: 'Travel', viral: 'Viral Content', entertainment: 'Movies & Series', social: 'Social Trends', stocks: 'Stocks', education: 'Education' },
  ru: { weather: 'Погода', crypto: 'Крипто рынки', whale: 'Активность китов', news: 'Мировые новости', travel: 'Путешествия', viral: 'Вирусный контент', entertainment: 'Кино и сериалы', social: 'Социальные тренды', stocks: 'Акции', education: 'Образование' }
}

const subText: any = { top: 'Top', war: 'War', politics: 'Politics', economy: 'Economy', ai: 'AI', industry: 'Industry', social: 'Social', 'flight-hotel': 'Flight + Hotel', flight: 'Flight', hotel: 'Hotel', 'last-minute': 'Last minute', movies: 'Movies', series: 'Series', cartoons: 'Cartoons', upcoming: 'Upcoming', youtube: 'YouTube', music: 'Music', shorts: 'Shorts', trending: 'Trending', bitcoin: 'Bitcoin', ethereum: 'Ethereum', 'fear-greed': 'Fear & Greed', 'large-transfers': 'Large transfers', wallets: 'Wallets', exchanges: 'Exchanges', current: 'Current', hourly: 'Hourly', weekly: 'Weekly', gainers: 'Gainers', losers: 'Losers', tech: 'Tech', courses: 'Courses', engineering: 'Engineering', 'ai-tools': 'AI tools', cybersecurity: 'Cybersecurity', instagram: 'Instagram', tiktok: 'TikTok', x: 'X', facebook: 'Facebook' }

const submenuMap: Record<string, string[]> = { weather: ['current', 'hourly', 'weekly'], crypto: ['top', 'bitcoin', 'ethereum', 'fear-greed'], whale: ['large-transfers', 'wallets', 'exchanges'], news: ['top', 'war', 'politics', 'economy', 'ai', 'industry', 'social'], travel: ['flight-hotel', 'flight', 'hotel', 'last-minute'], viral: ['youtube', 'music', 'shorts', 'trending'], entertainment: ['movies', 'series', 'cartoons', 'upcoming'], social: ['instagram', 'tiktok', 'x', 'facebook'], stocks: ['top', 'gainers', 'losers', 'tech'], education: ['courses', 'engineering', 'ai-tools', 'cybersecurity'] }

const newsCat: any = { top: 'top', war: 'war', politics: 'politics', economy: 'business', ai: 'ai', industry: 'technology', social: 'social' }
const entertainmentType: any = { movies: 'movie', series: 'series', cartoons: 'cartoon', top: 'movie', upcoming: 'movie' }

function Content({ main, sub }: { main: string; sub: string }) {
  if (main === 'weather') return <WeatherWidget />
  if (main === 'crypto') return <CryptoWidget defaultExpanded />
  if (main === 'whale') return <WhaleWidget defaultExpanded />
  if (main === 'news') return <NewsWidget defaultExpanded />
  if (main === 'travel') return <TravelComparisonWidget defaultExpanded />
  if (main === 'viral') return <ViralWidget defaultExpanded />
  if (main === 'entertainment') return <EntertainmentWidget />
  if (main === 'social') return <SocialWidget defaultExpanded />
  if (main === 'stocks') return <StocksWidget defaultExpanded />
  if (main === 'education') return <EducationWidget defaultExpanded />
  return <NewsWidget defaultExpanded />
}

export default function SectionPage() {
  const params = useParams()
  const main = String(params.main || 'news')
  const sub = String(params.sub || 'top')
  const { lang } = useLang()
  const Icon = icons[main] || Newspaper
  const title = (names[lang] || names.en)[main] || main
  const subs = submenuMap[main] || []

  return (
    <div className="min-h-screen">
      <Header />

      {/* Sub-navigation tabs */}
      <div className="border-b border-white/[0.04] bg-[#07070b]/80 backdrop-blur-sm sticky top-14 z-30">
        <div className="max-w-screen-2xl mx-auto px-5">
          <div className="flex items-center gap-1 py-2 overflow-x-auto">
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
                {subText[s] || s}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Full page content */}
      <main className="max-w-screen-2xl mx-auto px-5 py-6">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
            <Icon className="w-5 h-5 text-white/80" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{title}</h1>
            <p className="text-xs text-[#6b6b80]">{subText[sub] || sub}</p>
          </div>
        </div>

        {/* Widget content - full width */}
        <Content main={main} sub={sub} />
      </main>
    </div>
  )
}
