import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/LanguageContext'
import { ThemeProvider } from '@/lib/ThemeContext'
import AIAssistant from '@/components/AIAssistant'
import CommandPalette from '@/components/CommandPalette'
import KeyboardShortcuts from '@/components/KeyboardShortcuts'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'World Dashboard',
  description: 'Real-time global intelligence — Crypto, News, Flights, Hotels, Viral Content',
  manifest: '/manifest.json',
  themeColor: '#050507',
  icons: { icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌍</text></svg>' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${inter.className} bg-gray-950 min-h-screen`}>
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <AIAssistant />
            <CommandPalette />
            <KeyboardShortcuts />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
