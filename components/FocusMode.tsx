'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Eye, EyeOff } from 'lucide-react'

export default function FocusMode() {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setActive(a => !a)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (active) {
      document.body.classList.add('focus-mode')
    } else {
      document.body.classList.remove('focus-mode')
    }
  }, [active])

  return (
    <>
      <button
        onClick={() => setActive(!active)}
        className={`p-2 rounded-lg transition ${active ? 'bg-indigo-500/20 text-indigo-400' : 'text-[#8b8b9e] hover:text-white hover:bg-white/[0.05]'}`}
        title="Focus Mode (⌘/)"
      >
        {active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>
      {active && createPortal(
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[99997] px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 backdrop-blur-sm animate-fade-in">
          <p className="text-indigo-300 text-[11px] font-medium flex items-center gap-2">
            <Eye className="w-3 h-3" /> Focus Mode — Press ⌘/ to exit
          </p>
        </div>,
        document.body
      )}
    </>
  )
}
