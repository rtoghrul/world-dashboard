'use client'
import Link from 'next/link'
import { Newspaper, Bitcoin, Film, Zap, Download, GraduationCap, Plane, Cloud, ShoppingBag, Globe2, Sparkles, TrendingUp, MapPin } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const quickActions = [
  { icon: MapPin, label: { en: 'Nearby', az: 'Yaxınlıqda', ru: 'Рядом' }, href: '/nearby', color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/20' },
  { icon: TrendingUp, label: { en: 'Trending', az: 'Trend' }, href: '/section/viral/trending', color: 'from-rose-500/20 to-pink-500/20 border-rose-500/20' },
  { icon: Sparkles, label: { en: 'AI Tools', az: 'AI Alətlər' }, href: '/section/aitools/chatbots', color: 'from-purple-500/20 to-violet-500/20 border-purple-500/20' },
  { icon: Bitcoin, label: { en: 'Crypto', az: 'Kripto' }, href: '/section/markets/crypto-top', color: 'from-amber-500/20 to-orange-500/20 border-amber-500/20' },
  { icon: Newspaper, label: { en: 'News', az: 'Xəbərlər' }, href: '/section/news/top', color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/20' },
  { icon: Film, label: { en: 'Movies', az: 'Filmlər' }, href: '/section/entertainment/movies', color: 'from-indigo-500/20 to-blue-500/20 border-indigo-500/20' },
  { icon: Zap, label: { en: 'YouTube', az: 'YouTube' }, href: '/section/viral/youtube', color: 'from-red-500/20 to-rose-500/20 border-red-500/20' },
  { icon: Download, label: { en: 'Software', az: 'Proqram' }, href: '/section/software/android', color: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/20' },
  { icon: GraduationCap, label: { en: 'Learn', az: 'Təhsil' }, href: '/section/education/courses', color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/20' },
  { icon: Plane, label: { en: 'Travel', az: 'Səyahət' }, href: '/section/travel/flight', color: 'from-sky-500/20 to-blue-500/20 border-sky-500/20' },
  { icon: Cloud, label: { en: 'Weather', az: 'Hava' }, href: '/section/weather/current', color: 'from-slate-500/20 to-gray-500/20 border-slate-500/20' },
  { icon: ShoppingBag, label: { en: 'Women', az: 'Qadınlar' }, href: '/section/women/beauty', color: 'from-pink-500/20 to-fuchsia-500/20 border-pink-500/20' },
  { icon: Globe2, label: { en: 'Germany', az: 'Almaniya' }, href: '/section/germany/behoerden', color: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/20' },
]

export default function QuickActions() {
  const { lang } = useLang()

  return (
    <div className="border-b border-white/[0.03] bg-[#07070b]/50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-thin">
          {quickActions.map(action => {
            const Icon = action.icon
            return (
              <Link
                key={action.href}
                href={action.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r ${action.color} border border-white/[0.04] hover:border-white/[0.1] transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0`}
              >
                <Icon className="w-3.5 h-3.5 text-white/80" />
                <span className="text-[11px] text-white/90 font-medium whitespace-nowrap">
                  {action.label[lang as keyof typeof action.label] || action.label.en}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
