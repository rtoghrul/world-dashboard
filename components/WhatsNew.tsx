'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Sparkles, X, CheckCircle2 } from 'lucide-react'

const changelog = [
  { version: '2.0', date: '2026-05-01', items: [
    '🎨 Theme Toggle (Dark/Light/Auto + 7 accent colors)',
    '🔥 Trending Now Widget (Google + Reddit)',
    '📅 Events Calendar (crypto, earnings, movies)',
    '🔥 Daily Streak gamification',
    '🧠 Daily Quiz (5 questions/day)',
    '💼 Paper Trading Simulator ($100k virtual)',
    '🔖 Bookmarks / Reading List (⌘⇧B)',
    '⌨️ Keyboard Shortcuts Panel (?)',
    '🎯 Focus Mode (⌘/)',
    '📱 PWA — Install to phone',
    '📊 Scroll progress bar',
    '⬆️ Back to Top button',
    '📸 Share Widget as Image',
    '📰 News Bias Indicator',
    '🎬 Page transitions (Framer Motion)',
  ]},
  { version: '1.0', date: '2026-04-28', items: [
    '🔍 Command Palette (⌘K)',
    '🤖 AI Daily Brief',
    '💰 Portfolio Tracker',
    '🔔 Price Alerts + Notifications',
    '📈 Interactive Price Charts (BTC/ETH)',
    '🌐 10 navigation categories',
    '🌍 Multi-language (EN/AZ/RU)',
    '📱 Mobile responsive with sidebar',
  ]},
]

export default function WhatsNew() {
  const [open, setOpen] = useState(false)
  const [hasNew, setHasNew] = useState(false)

  useEffect(() => {
    const lastSeen = localStorage.getItem('wd-changelog-seen')
    if (lastSeen !== changelog[0].version) setHasNew(true)
  }, [])

  const handleOpen = () => {
    setOpen(true)
    setHasNew(false)
    localStorage.setItem('wd-changelog-seen', changelog[0].version)
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="p-2 rounded-lg hover:bg-white/[0.05] transition text-[#8b8b9e] hover:text-white relative"
        title="What's New"
      >
        <Sparkles className="w-4 h-4" />
        {hasNew && <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />}
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center" onClick={() => setOpen(false)}>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-[440px] max-w-[90vw] max-h-[80vh] bg-[#0f0f1a] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h2 className="text-white font-semibold text-sm">{"What's New"}</h2>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/[0.05] text-[#4a4a5e]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {changelog.map(release => (
                <div key={release.version}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-white px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">v{release.version}</span>
                    <span className="text-[10px] text-[#4a4a5e]">{release.date}</span>
                  </div>
                  <div className="space-y-1.5">
                    {release.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 pl-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="text-[#8b8b9e] text-xs">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
