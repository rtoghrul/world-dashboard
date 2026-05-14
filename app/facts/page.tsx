import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import { factCategories } from '@/lib/facts'

export const metadata = {
  title: 'Facts — Mind-Blowing Facts',
  description: 'Mind-blowing facts about astronomy, history, human body, nature, animals, science, ocean, space, earth, technology, psychology and mysteries.',
}

export default function FactsShortcutPage() {
  return (
    <div className="min-h-screen relative z-[1] w-full pb-20 md:pb-0">
      <Header />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition mb-5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to dashboard
        </Link>

        <section className="rounded-2xl border border-white/[0.06] bg-[#0a0a10]/80 overflow-hidden p-5 sm:p-8 relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.08] via-purple-500/[0.03] to-transparent pointer-events-none" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-indigo-200 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Mind-blowing facts only
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">Facts</h1>
            <p className="text-[#9a9aae] text-sm sm:text-base mt-3 leading-7">
              Choose a category and discover short, surprising facts about the universe, nature, humans, animals, history, technology, mysteries and more.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {factCategories.map(category => (
            <Link
              key={category.id}
              href={`/facts/${category.id}`}
              className="group rounded-xl border border-white/[0.04] bg-[#0a0a10]/80 p-5 hover:border-indigo-400/25 hover:bg-white/[0.025] transition"
            >
              <div className="text-3xl mb-4">{category.emoji}</div>
              <h2 className="text-white text-lg font-semibold group-hover:text-indigo-100 transition">{category.title}</h2>
              <p className="text-[#8b8b9e] text-sm leading-6 mt-2">{category.description}</p>
              <span className="inline-flex mt-4 text-xs text-indigo-400 group-hover:text-indigo-300">Open facts →</span>
            </Link>
          ))}
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}
