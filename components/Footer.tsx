'use client'
import Link from 'next/link'
import { Globe } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const footerSections = [
  {
    title: { en: 'Markets', az: 'Bazarlar' },
    links: [
      { label: 'Crypto', href: '/section/markets/crypto-top' },
      { label: 'Stocks', href: '/section/markets/stocks-top' },
      { label: 'Bitcoin', href: '/section/markets/bitcoin' },
      { label: 'Ethereum', href: '/section/markets/ethereum' },
    ]
  },
  {
    title: { en: 'Entertainment', az: 'Əyləncə' },
    links: [
      { label: 'Movies', href: '/section/entertainment/movies' },
      { label: 'Series', href: '/section/entertainment/series' },
      { label: 'Anime', href: '/section/entertainment/anime' },
      { label: 'Gaming', href: '/section/entertainment/gaming' },
    ]
  },
  {
    title: { en: 'AI & Tech', az: 'AI & Texno' },
    links: [
      { label: 'AI Chatbots', href: '/section/aitools/chatbots' },
      { label: 'Image Gen', href: '/section/aitools/image-gen' },
      { label: 'Software', href: '/section/software/android' },
      { label: 'Free Courses', href: '/section/education/courses' },
    ]
  },
  {
    title: { en: 'More', az: 'Daha çox' },
    links: [
      { label: 'YouTube', href: '/section/viral/youtube' },
      { label: 'Weather', href: '/section/weather/current' },
      { label: 'Travel', href: '/section/travel/flight' },
      { label: 'Germany 🇩🇪', href: '/section/germany/behoerden' },
    ]
  },
]

export default function Footer() {
  const { lang } = useLang()

  return (
    <footer className="border-t border-white/[0.04] bg-[#050508] mt-12 pb-20 md:pb-0">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {footerSections.map((section, i) => (
            <div key={i}>
              <h4 className="text-white text-xs font-semibold mb-3 uppercase tracking-wider">
                {section.title[lang as keyof typeof section.title] || section.title.en}
              </h4>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[#6b6b80] text-xs hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.04]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Globe className="w-3 h-3 text-white" />
            </div>
            <span className="text-[#6b6b80] text-xs">World Dashboard</span>
          </div>
          <p className="text-[#4a4a5e] text-[10px]">
            © {new Date().getFullYear()} World Dashboard. All data from public APIs. Not financial advice.
          </p>
          <div className="flex items-center gap-3 text-[#4a4a5e] text-[10px]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
