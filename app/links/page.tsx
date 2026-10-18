import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import LinksHub from '@/components/links/LinksHub'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata('/links', 'Useful Links', 'Hand-picked official Azerbaijani e-services, everyday tools, learning, developer, travel, money, health, science and privacy links, plus every news publisher we use.')

export default function LinksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="max-w-screen-xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-10 flex-1">
        <LinksHub />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}
