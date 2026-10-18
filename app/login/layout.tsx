import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/login', 'Sign in', 'Sign in to World Dashboard.', { robots: { index: false, follow: true } })

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
