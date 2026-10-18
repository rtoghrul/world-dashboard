import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/stocks', 'Stock Markets', 'Major indices and top stocks with live prices and daily changes.')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
