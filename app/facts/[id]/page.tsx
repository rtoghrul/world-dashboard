import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import { factCategories, getFactCategory, getFactsForCategory } from '@/lib/facts'

export function generateStaticParams() {
  return factCategories.map(category => ({ id: category.id }))
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const category = getFactCategory(params.id)
  return {
    title: `${category.title} Facts — Mind-Blowing Facts`,
    description: category.description,
  }
}

export default function DirectFactsCategoryPage({ params }: { params: { id: string } }) {
  const category = getFactCategory(params.id)
  const facts = getFactsForCategory(params.id)

  return (
    <div className="min-h-screen relative z-[1] w-full pb-20 md:pb-0">
      <Header />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <Link href="/facts" className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition mb-5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to facts
        </Link>

        <section className="rounded-2xl border border-white/[0.06] bg-[#0a0a10]/80 overflow-hidden p-5 sm:p-8 relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.08] via-purple-500/[0.03] to-transparent pointer-events-none" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-indigo-200 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Did you know?
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              {category.emoji} {category.title} Facts
            </h1>
            <p className="text-[#9a9aae] text-sm sm:text-base mt-3 leading-7">
              Only mind-blowing facts — short, surprising, and perfect for curiosity content.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facts.map((fact, index) => (
            <article
              key={`${fact.title}-${index}`}
              className="rounded-xl border border-white/[0.04] bg-[#0a0a10]/80 p-5 hover:border-indigo-400/25 hover:bg-white/[0.025] transition"
            >
              <div className="inline-flex items-center gap-1.5 text-[11px] text-indigo-200 bg-indigo-500/10 border border-indigo-400/20 rounded-full px-2.5 py-1 mb-4">
                {category.emoji} {fact.category}
              </div>
              <h2 className="text-white text-lg font-semibold leading-snug">{fact.title}</h2>
              <p className="text-[#9a9aae] text-sm leading-6 mt-3">{fact.text}</p>
            </article>
          ))}
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}
