'use client'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowLeft, Gift } from 'lucide-react'
import Header from '@/components/Header'
import ErrorBoundary from '@/components/ErrorBoundary'
import CommandPalette from '@/components/CommandPalette'
import MobileBottomNav from '@/components/MobileBottomNav'
import Footer from '@/components/Footer'
import { useLang } from '@/lib/LanguageContext'

const BenefitsWidget = dynamic(() => import('@/components/BenefitsWidget'), { ssr: false })

const labels: Record<string, { title: string; subtitle: string }> = {
  en: { title: 'Benefits Hub', subtitle: 'Every subsidy, discount, free tool and money-earning tip in one place' },
  az: { title: 'Faydalar Mərkəzi', subtitle: 'Bütün subsidiyalar, endirimlər, pulsuz alətlər və qazanc məsləhətləri bir yerdə' },
  ru: { title: 'Хаб выгод', subtitle: 'Все субсидии, скидки, бесплатные инструменты и способы заработка в одном месте' },
  de: { title: 'Vorteils-Hub', subtitle: 'Alle Förderungen, Rabatte, Gratis-Tools und Verdienst-Tipps an einem Ort' },
}

export default function BenefitsPage() {
  const { lang } = useLang()
  const t = labels[lang] || labels.en

  return (
    <div className="min-h-screen relative z-[1] bg-gray-950">
      <CommandPalette />
      <Header />

      <main className="max-w-screen-2xl mx-auto px-5 py-6">
        <div className="flex items-center gap-3 mb-6 animate-slide-up">
          <Link href="/" className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] hover:border-amber-500/20 transition-all">
            <ArrowLeft className="w-5 h-5 text-white/80" />
          </Link>
          <div className="section-icon bg-amber-500/10 border border-amber-500/20">
            <Gift className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text-static">{t.title}</h1>
            <p className="text-xs text-[#6b6b80]">{t.subtitle}</p>
          </div>
        </div>

        <ErrorBoundary fallbackMessage="Benefits failed to load. Please try refreshing the page.">
          <BenefitsWidget section="all" />
        </ErrorBoundary>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}
