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
  title: 'World Dashboard — AI Tools, Crypto, News, Software, Entertainment',
  description: 'Your all-in-one hub: AI tools directory, crypto markets, global news, free software downloads, movies, viral content, education and more. Updated in real-time.',
  manifest: '/manifest.json',
  themeColor: '#6366f1',
  icons: {
    icon: '/api/icon?size=32',
    apple: '/api/icon?size=180',
  },
  keywords: ['AI tools', 'free AI', 'crypto', 'bitcoin', 'news', 'free software', 'open source', 'movies', 'stocks', 'entertainment', 'world dashboard', 'Germany platforms', 'online shopping'],
  authors: [{ name: 'World Dashboard' }],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'World Dashboard — AI Tools, Crypto, News, Software, Entertainment',
    description: 'Your all-in-one hub: AI tools, crypto markets, global news, free software, movies, viral content and more.',
    type: 'website',
    url: 'https://world-dashboard-delta-umber.vercel.app',
    siteName: 'World Dashboard',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Dashboard — Everything in One Place',
    description: 'AI Tools, Crypto, News, Free Software, Movies, Stocks — all updated real-time.',
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
        <script dangerouslySetInnerHTML={{ __html: `
          window.addEventListener('error', function(e) {
            if (e.message && (e.message.includes('Loading chunk') || e.message.includes('Failed to fetch'))) { window.location.reload(); }
          });
        `}} />
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
