'use client'
import Link from 'next/link'
import { ArrowLeft, Cog } from 'lucide-react'
import Header from '@/components/Header'
import TopicNewsWidget from '@/components/TopicNewsWidget'
import { useLang } from '@/lib/LanguageContext'

export default function MechanicalPage() {
  const { tr } = useLang()
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main className="max-w-screen-2xl mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Dashboard
          </Link>
        </div>
        <TopicNewsWidget
          topic="mechanical"
          title={tr.mechanical}
          desc={tr.mechanicalDesc}
          accentClass="text-emerald-300"
          icon={<Cog className="w-4 h-4" aria-hidden="true" />}
          defaultCollapsed={false}
          limit={12}
        />
      </main>
    </div>
  )
}
