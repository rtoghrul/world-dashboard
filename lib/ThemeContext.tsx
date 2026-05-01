'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'dark' | 'light' | 'auto'
type AccentColor = 'indigo' | 'violet' | 'rose' | 'emerald' | 'amber' | 'cyan' | 'blue'

const accentColors: Record<AccentColor, { primary: string; glow: string; rgb: string }> = {
  indigo: { primary: '#6366f1', glow: 'rgba(99, 102, 241, 0.15)', rgb: '99, 102, 241' },
  violet: { primary: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.15)', rgb: '139, 92, 246' },
  rose: { primary: '#f43f5e', glow: 'rgba(244, 63, 94, 0.15)', rgb: '244, 63, 94' },
  emerald: { primary: '#10b981', glow: 'rgba(16, 185, 129, 0.15)', rgb: '16, 185, 129' },
  amber: { primary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.15)', rgb: '245, 158, 11' },
  cyan: { primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.15)', rgb: '6, 182, 212' },
  blue: { primary: '#3b82f6', glow: 'rgba(59, 130, 246, 0.15)', rgb: '59, 130, 246' },
}

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'dark' | 'light'
  accent: AccentColor
  setTheme: (t: Theme) => void
  setAccent: (a: AccentColor) => void
  accentColors: typeof accentColors
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  resolvedTheme: 'dark',
  accent: 'indigo',
  setTheme: () => {},
  setAccent: () => {},
  accentColors,
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [accent, setAccentState] = useState<AccentColor>('indigo')
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('wd-theme') as Theme | null
    const savedAccent = localStorage.getItem('wd-accent') as AccentColor | null
    if (saved) setThemeState(saved)
    if (savedAccent) setAccentState(savedAccent)
  }, [])

  useEffect(() => {
    let resolved: 'dark' | 'light' = 'dark'
    if (theme === 'light') resolved = 'light'
    else if (theme === 'auto') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    setResolvedTheme(resolved)

    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(resolved)
    root.style.setProperty('--accent-primary', accentColors[accent].primary)
    root.style.setProperty('--accent-glow', accentColors[accent].glow)
    root.style.setProperty('--accent-rgb', accentColors[accent].rgb)
  }, [theme, accent])

  useEffect(() => {
    if (theme === 'auto') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = (e: MediaQueryListEvent) => setResolvedTheme(e.matches ? 'dark' : 'light')
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [theme])

  const setTheme = (t: Theme) => { setThemeState(t); localStorage.setItem('wd-theme', t) }
  const setAccent = (a: AccentColor) => { setAccentState(a); localStorage.setItem('wd-accent', a) }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, accent, setTheme, setAccent, accentColors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
export type { AccentColor, Theme }
