import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata('/savings', 'Food Savings & Sharing', 'Apps and services for discounted food, restaurant deals and food sharing.')

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
