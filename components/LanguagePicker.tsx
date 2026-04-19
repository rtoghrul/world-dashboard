'use client'
import { useEffect, useMemo, useState } from 'react'
import { Globe } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'
import { LANGUAGES, Lang } from '@/lib/translations'

export default function LanguagePicker({ align = 'right' }: { align?: 'left' | 'right' }) {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)

  const current = useMemo(() => LANGUAGES.find(l => l.code === lang), [lang])
  const menuAlign = align === 'left' ? 'left-0' : 'right-0'

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      if (!t) return
      if (t.closest('[data-langpicker-root]')) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  return (
    <div className="relative" data-langpicker-root>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        aria-label="Change Language"
        aria-expanded={open}
      >
        <Globe className="w-4 h-4" aria-hidden="true" />
        <span aria-hidden="true">{current?.flag}</span>
        <span className="hidden sm:inline">{current?.label}</span>
      </button>

      {open && (
        <div className={`absolute ${menuAlign} mt-2 w-56 rounded-xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden z-50`}>
          <div className="p-1 grid grid-cols-2 gap-1 max-h-64 overflow-y-auto">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                type="button"
                onClick={() => { setLang(l.code as Lang); setOpen(false) }}
                className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  lang === l.code
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span aria-hidden="true">{l.flag}</span>
                <span className="truncate">{l.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
