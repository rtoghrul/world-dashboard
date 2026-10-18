import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/nearby', 'Nearby Places', 'Find useful places around you on a map.')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
