'use client'
import { useEffect } from 'react'
import Header from '@/components/Header'
import MarketTicker from '@/components/MarketTicker'
import { useLang } from '@/lib/LanguageContext'
import { createClient } from '@/lib/supabase'

export default function HomePage() {
  const { lang } = useLang()

  useEffect(() => {
    const init = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) fetch('/api/pageview', { method: 'POST' })
      } catch {}
    }
    init()
  }, [])

  const greeting = {
    en: { hello: 'Welcome back', sub: 'Use the menu above to explore sections.' },
    az: { hello: 'Xoş gəldiniz', sub: 'Bölmələrə keçmək üçün yuxarıdakı menyu istifadə edin.' },
    ru: { hello: 'Добро пожаловать', sub: 'Используйте меню выше для навигации.' },
  }
  const g = greeting[lang as keyof typeof greeting] || greeting.en

  return (
    <div className="min-h-screen relative">
      <Header />
      <MarketTicker />

      <main className="max-w-screen-2xl mx-auto px-5 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            {g.hello}
          </h1>
          <p className="text-[#6b6b80] text-base">
            {g.sub}
          </p>
        </div>
      </main>
    </div>
  )
}
