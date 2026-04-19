'use client'
import { useState } from 'react'
import { Globe, RefreshCw } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'
import { LANGUAGES, Lang } from '@/lib/translations'

export default function Header({ onRefresh }: { onRefresh?: () => void }) {
  const { lang, setLang, tr } = useLang()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            W
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">{tr.title}</h1>
            <p className="text-gray-400 text-xs">{tr.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              title={tr.refresh}
              aria-label={tr.refresh}
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
            </button>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-expanded={open}
              aria-label="Change Language"
            >
              <Globe className="w-4 h-4" aria-hidden="true" />
              <span>{LANGUAGES.find(l => l.code === lang)?.flag}</span>
              <span className="hidden sm:inline">{LANGUAGES.find(l => l.code === lang)?.label}</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden z-50">
                <div className="p-1 grid grid-cols-2 gap-1 max-h-64 overflow-y-auto">
                  {LANGUAGES.map(l => (
                    <button
                      type="button"
                      key={l.code}
                      onClick={() => { setLang(l.code as Lang); setOpen(false) }}
                      className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition ${
                        lang === l.code
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`}
                    >
                      <span>{l.flag}</span>
                      <span className="truncate">{l.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
