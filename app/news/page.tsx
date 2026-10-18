import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import NewsHub from '@/components/news/NewsHub'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata('/news', 'World News', 'Live headlines from free, trusted sources by region (Azerbaijan, Caucasus, Europe, Middle East, Asia, Africa, Americas) and topic, plus news in your own language.')

export default function NewsPage({ searchParams }: { searchParams?: { category?: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="max-w-screen-xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-10 flex-1">
        <NewsHub initialCategory={searchParams?.category} />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}
