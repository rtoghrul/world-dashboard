import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/LanguageContext'
import { ThemeProvider } from '@/lib/ThemeContext'
import AIAssistant from '@/components/AIAssistant'
import CommandPalette from '@/components/CommandPalette'
import KeyboardShortcuts from '@/components/KeyboardShortcuts'
import ScrollProgress from '@/components/ScrollProgress'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'World Dashboard',
  description: 'Real-time global intelligence — Crypto, News, Stocks, Entertainment & more',
  manifest: '/manifest.json',
  themeColor: '#6366f1',
  icons: {
    icon: '/api/icon?size=32',
    apple: '/api/icon?size=180',
  },
  openGraph: {
    title: 'World Dashboard',
    description: 'Real-time global intelligence — Crypto, News, Stocks, Entertainment & more',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/api/icon?size=180" />
      </head>
      <body className={`${inter.className} bg-gray-950 min-h-screen`}>
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <AIAssistant />
            <CommandPalette />
            <KeyboardShortcuts />
            <ScrollProgress />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
