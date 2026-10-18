import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/polymarket', 'Prediction Markets', 'The most active Polymarket prediction markets, with live odds and volume.')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
