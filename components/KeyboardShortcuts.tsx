'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Keyboard } from 'lucide-react'

const shortcuts = [
  { keys: ['⌘', 'K'], desc: 'Open Command Palette' },
  { keys: ['⌘', '⇧', 'B'], desc: 'Toggle Bookmarks' },
  { keys: ['?'], desc: 'Keyboard Shortcuts' },
  { keys: ['Esc'], desc: 'Close any panel' },
  { keys: ['⌘', '/'], desc: 'Focus Mode' },
  { keys: ['G', 'H'], desc: 'Go to Home' },
  { keys: ['G', 'N'], desc: 'Go to News' },
  { keys: ['G', 'C'], desc: 'Go to Crypto' },
  { keys: ['G', 'S'], desc: 'Go to Stocks' },
  { keys: ['G', 'M'], desc: 'Go to Movies' },
]

export default function KeyboardShortcuts() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let lastKey = ''
    let lastTime = 0

    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return

      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setOpen(o => !o)
        return
      }

      const now = Date.now()
      if (e.key === 'Escape') { setOpen(false); return }

      // G+key navigation
      if (lastKey === 'g' && now - lastTime < 1000) {
        switch (e.key) {
          case 'h': window.location.href = '/'; break
          case 'n': window.location.href = '/section/news/top'; break
          case 'c': window.location.href = '/section/crypto/top'; break
          case 's': window.location.href = '/section/stocks/overview'; break
          case 'm': window.location.href = '/section/entertainment/movies'; break
        }
      }
      lastKey = e.key
      lastTime = now
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center" onClick={() => setOpen(false)}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-[420px] max-w-[90vw] bg-[#0f0f1a] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-indigo-400" />
            <h2 className="text-white font-semibold text-sm">Keyboard Shortcuts</h2>
          </div>
          <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/[0.05] text-[#4a4a5e]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2 px-1">
              <span className="text-[#8b8b9e] text-xs">{s.desc}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((k, j) => (
                  <span key={j}>
                    <kbd className="px-2 py-1 bg-white/[0.05] border border-white/[0.08] rounded-md text-[10px] text-white font-mono">
                      {k}
                    </kbd>
                    {j < s.keys.length - 1 && <span className="text-[#4a4a5e] text-[10px] mx-0.5">+</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-white/[0.05] text-center">
          <p className="text-[10px] text-[#4a4a5e]">Press <kbd className="px-1.5 py-0.5 bg-white/[0.05] rounded text-[9px] text-[#8b8b9e]">?</kbd> to toggle this panel</p>
        </div>
      </div>
    </div>,
    document.body
  )
}
