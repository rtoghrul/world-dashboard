import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/register', 'Create account', 'Create a World Dashboard account.', { robots: { index: false, follow: true } })

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
