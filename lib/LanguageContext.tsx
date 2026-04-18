'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import t, { Lang, LANGUAGES } from './translations'

type LanguageContextType = {
  lang: Lang
  setLang: (l: Lang) => void
  tr: typeof t[Lang]
  dir: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  tr: t['en'],
  dir: 'ltr',
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('dashboard-lang') as Lang
    if (saved && t[saved]) setLangState(saved)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('dashboard-lang', l)
  }

  const langConfig = LANGUAGES.find(l => l.code === lang)
  const dir = langConfig?.dir === 'rtl' ? 'rtl' : 'ltr'

  return (
    <LanguageContext.Provider value={{ lang, setLang, tr: t[lang], dir }}>
      <div dir={dir}>{children}</div>
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
