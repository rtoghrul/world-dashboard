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

export default function FactsCategoryPage({ params }: { params: { id: string } }) {
  const category = getFactCategory(params.id)
  const facts = getFactsForCategory(params.id)

  return (
    <div className="min-h-screen relative z-[1] w-full pb-20 md:pb-0">
      <Header />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition mb-5">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to dashboard
          </Link>

          <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a10]/80 overflow-hidden p-5 sm:p-7 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.08] via-purple-500/[0.03] to-transparent pointer-events-none" />
            <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-indigo-200 mb-4">
                  <Sparkles className="w-3.5 h-3.5" /> Did you know?
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  {category.emoji} {category.title} Facts
                </h1>
                <p className="text-[#9a9aae] text-sm sm:text-base mt-2 max-w-2xl">
                  Only mind-blowing facts — short, surprising, and perfect for curiosity content.
                </p>
              </div>
              <div className="text-xs text-[#7b7b90]">
                {facts.length} facts · Updated collection
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <aside className="lg:col-span-1">
            <div className="rounded-xl border border-white/[0.04] bg-[#0a0a10]/80 p-3 sticky top-20">
              <h2 className="text-white font-semibold text-sm px-2 py-2">Facts categories</h2>
              <div className="space-y-1 mt-1">
                {factCategories.map(item => {
                  const active = item.id === params.id
                  return (
                    <Link
                      key={item.id}
                      href={`/section/facts/${item.id}`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                        active ? 'bg-indigo-500/15 text-indigo-200 border border-indigo-400/20' : 'text-[#8b8b9e] hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <span>{item.emoji}</span>
                      <span>{item.title}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </aside>

          <section className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {facts.map((fact, index) => (
                <article
                  key={`${fact.title}-${index}`}
                  className="group rounded-xl border border-white/[0.04] bg-[#0a0a10]/80 p-5 hover:border-indigo-400/25 hover:bg-white/[0.025] transition"
                >
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-indigo-200 bg-indigo-500/10 border border-indigo-400/20 rounded-full px-2.5 py-1">
                      {category.emoji} {fact.category}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#5f5f74]">Mind blowing</span>
                  </div>
                  <h3 className="text-white text-lg font-semibold leading-snug group-hover:text-indigo-100 transition">
                    {fact.title}
                  </h3>
                  <p className="text-[#9a9aae] text-sm leading-6 mt-3">
                    {fact.text}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}
