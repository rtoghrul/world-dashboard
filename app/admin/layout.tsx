import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/admin', 'Admin', 'Admin dashboard.', { robots: { index: false, follow: false } })

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
