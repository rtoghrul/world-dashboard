'use client'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Sun, Moon, Monitor, Palette } from 'lucide-react'
import { useTheme, AccentColor, Theme } from '@/lib/ThemeContext'

export default function ThemeToggle() {
  const { theme, setTheme, accent, setAccent, accentColors } = useTheme()
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [rect, setRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (open && btnRef.current) {
      setRect(btnRef.current.getBoundingClientRect())
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    const timer = setTimeout(() => document.addEventListener('click', close), 10)
    return () => { clearTimeout(timer); document.removeEventListener('click', close) }
  }, [open])

  const themes: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'auto', icon: Monitor, label: 'Auto' },
  ]

  const accents: AccentColor[] = ['indigo', 'violet', 'rose', 'emerald', 'amber', 'cyan', 'blue']

  const Icon = theme === 'light' ? Sun : theme === 'auto' ? Monitor : Moon

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-white/[0.05] transition text-[#8b8b9e] hover:text-white"
        title="Theme"
      >
        <Palette className="w-4 h-4" />
      </button>

      {open && rect && createPortal(
        <div
          className="fixed z-[99999]"
          style={{ top: rect.bottom + 8, right: window.innerWidth - rect.right }}
          onClick={e => e.stopPropagation()}
        >
          <div className="w-56 bg-[#0f0f1a] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-3 border-b border-white/[0.05]">
              <p className="text-[10px] uppercase tracking-wider text-[#4a4a5e] font-medium mb-2">Theme</p>
              <div className="flex gap-1">
                {themes.map(t => {
                  const TIcon = t.icon
                  return (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition ${
                        theme === t.value
                          ? 'bg-white/[0.08] text-white'
                          : 'text-[#8b8b9e] hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <TIcon className="w-3.5 h-3.5" />
                      {t.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="p-3">
              <p className="text-[10px] uppercase tracking-wider text-[#4a4a5e] font-medium mb-2">Accent Color</p>
              <div className="flex gap-2 flex-wrap">
                {accents.map(a => (
                  <button
                    key={a}
                    onClick={() => setAccent(a)}
                    className={`w-7 h-7 rounded-full transition-all ${
                      accent === a ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0f0f1a] scale-110' : 'hover:scale-110'
                    }`}
                    style={{ background: accentColors[a].primary }}
                    title={a}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
