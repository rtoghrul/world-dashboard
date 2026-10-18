import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/crypto', 'Crypto Markets', 'Live cryptocurrency prices, market cap, 24h changes and charts for the top coins.')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
