'use client'
import { RefreshCw, Globe, Zap } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'
import LanguagePicker from '@/components/LanguagePicker'

export default function Header({ onRefresh }: { onRefresh?: () => void }) {
  const { tr } = useLang()

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/[0.04]">
      <div className="max-w-screen-2xl mx-auto px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Globe className="w-4.5 h-4.5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-white font-semibold text-base tracking-tight leading-none flex items-center gap-2">
              {tr.title}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="live-dot" />
                <span className="text-[10px] font-medium text-emerald-400">LIVE</span>
              </span>
            </h1>
            <p className="text-[#6b6b80] text-[11px] mt-0.5 font-medium">{tr.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="p-2 rounded-lg text-[#6b6b80] hover:text-white hover:bg-white/[0.04] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
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
