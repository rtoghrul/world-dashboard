import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import { factCategories, getFactCategory, getFactsForCategory } from '@/lib/facts'

const FACTS_PER_PAGE = 5

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

function getVisiblePageNumbers(currentPage: number, totalPages: number) {
  const pages = new Set<number>()
  pages.add(1)
  pages.add(totalPages)

  for (let page = currentPage - 2; page <= currentPage + 2; page += 1) {
    if (page >= 1 && page <= totalPages) pages.add(page)
  }

  return Array.from(pages).sort((a, b) => a - b)
}

export default function DirectFactsCategoryPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams?: { page?: string }
}) {
  const category = getFactCategory(params.id)
  const facts = getFactsForCategory(params.id)
  const totalPages = Math.max(1, Math.ceil(facts.length / FACTS_PER_PAGE))
  const requestedPage = Number(searchParams?.page || '1')
  const currentPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(1, Math.floor(requestedPage)), totalPages)
    : 1
  const startIndex = (currentPage - 1) * FACTS_PER_PAGE
  const paginatedFacts = facts.slice(startIndex, startIndex + FACTS_PER_PAGE)
  const visiblePages = getVisiblePageNumbers(currentPage, totalPages)

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
              Only mind-blowing facts — page {currentPage} of {totalPages}. Showing {paginatedFacts.length} topics from {facts.length} total.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedFacts.map((fact, index) => (
            <article
              key={`${fact.title}-${startIndex + index}`}
              className="rounded-xl border border-white/[0.04] bg-[#0a0a10]/80 p-5 hover:border-indigo-400/25 hover:bg-white/[0.025] transition"
            >
              <div className="inline-flex items-center gap-1.5 text-[11px] text-indigo-200 bg-indigo-500/10 border border-indigo-400/20 rounded-full px-2.5 py-1 mb-4">
                {category.emoji} {fact.category} · #{startIndex + index + 1}
              </div>
              <h2 className="text-white text-lg font-semibold leading-snug">{fact.title}</h2>
              <p className="text-[#9a9aae] text-sm leading-6 mt-3">{fact.text}</p>
            </article>
          ))}
        </section>

        <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Facts pagination">
          <Link
            href={`/facts/${params.id}?page=${Math.max(1, currentPage - 1)}`}
            className={`rounded-lg border px-3 py-2 text-sm transition ${
              currentPage === 1
                ? 'pointer-events-none border-white/[0.04] text-[#4a4a5e]'
                : 'border-white/[0.08] text-[#c7c7d8] hover:border-indigo-400/30 hover:text-white'
            }`}
          >
            Previous
          </Link>

          {visiblePages.map((page, index) => {
            const previousPage = visiblePages[index - 1]
            const showDots = previousPage && page - previousPage > 1

            return (
              <span key={page} className="flex items-center gap-2">
                {showDots && <span className="text-[#6b6b80]">...</span>}
                <Link
                  href={`/facts/${params.id}?page=${page}`}
                  className={`rounded-lg border px-3 py-2 text-sm transition ${
                    currentPage === page
                      ? 'border-indigo-400/40 bg-indigo-500/15 text-indigo-100'
                      : 'border-white/[0.08] text-[#c7c7d8] hover:border-indigo-400/30 hover:text-white'
                  }`}
                >
                  {page}
                </Link>
              </span>
            )
          })}

          <Link
            href={`/facts/${params.id}?page=${Math.min(totalPages, currentPage + 1)}`}
            className={`rounded-lg border px-3 py-2 text-sm transition ${
              currentPage === totalPages
                ? 'pointer-events-none border-white/[0.04] text-[#4a4a5e]'
                : 'border-white/[0.08] text-[#c7c7d8] hover:border-indigo-400/30 hover:text-white'
            }`}
          >
            Next
          </Link>
        </nav>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}
