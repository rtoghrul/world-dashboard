import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/benefits', 'Benefits Hub', 'Subsidies, discounts, free tools and earning tips in one place, with a tracker for what you have claimed.')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
