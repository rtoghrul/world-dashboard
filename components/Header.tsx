'use client'
import { RefreshCw } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'
import LanguagePicker from '@/components/LanguagePicker'

export default function Header({ onRefresh }: { onRefresh?: () => void }) {
  const { tr } = useLang()

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
          <LanguagePicker />
        </div>
      </div>
    </header>
  )
}
