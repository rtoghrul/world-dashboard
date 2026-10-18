import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import './light-accents.css'
import { LanguageProvider } from '@/lib/LanguageContext'
import { ThemeProvider } from '@/lib/ThemeContext'
import AIAssistant from '@/components/AIAssistant'
import CommandPalette from '@/components/CommandPalette'
import KeyboardShortcuts from '@/components/KeyboardShortcuts'
import ScrollProgress from '@/components/ScrollProgress'
import SkipLink from '@/components/SkipLink'
import { SITE_URL, SITE_NAME } from '@/lib/site'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' })

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#050810' },
    { media: '(prefers-color-scheme: light)', color: '#f4f6fa' },
  ],
}

// Runs before first paint so a saved light/auto theme never flashes dark.
// Mirrors the resolution logic in lib/ThemeContext.tsx (localStorage key 'wd-theme').
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('wd-theme')||'dark';var r=t==='auto'?(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):(t==='light'?'light':'dark');var d=document.documentElement;d.classList.remove('dark','light');d.classList.add(r);}catch(e){}})();`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: { default: 'World Dashboard — AI Tools, Crypto, News, Software, Entertainment', template: '%s | World Dashboard' },
  description: 'Your all-in-one hub: AI tools directory, crypto markets, global news, free software downloads, movies, viral content, education and more. Updated in real-time.',
  manifest: '/manifest.json',
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
    images: [{ url: '/api/og', width: 1200, height: 630 }],
    type: 'website',
    url: '/',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Dashboard — Everything in One Place',
    description: 'AI Tools, Crypto, News, Free Software, Movies, Stocks — all updated real-time.',
    images: ['/api/og'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/api/icon?size=180" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${inter.className} min-h-screen bg-surface-0 text-ink-1`}>
        <ThemeProvider>
          <LanguageProvider>
            <SkipLink />
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
