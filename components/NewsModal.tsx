'use client'
import { useEffect, useRef } from 'react'
import { useLang } from '@/lib/LanguageContext'
import { ui } from '@/lib/i18n/ui'
import { X, ExternalLink } from 'lucide-react'

export type ModalItem = {
  title: string
  link: string
  pubDate: string
  description: string
  thumbnail: string | null
  source: string
}

export default function NewsModal({ item, onClose }: { item: ModalItem; onClose: () => void }) {
  const { lang } = useLang()
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => opener?.focus?.()
  }, [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="news-modal-title"
        className="bg-surface-1 border border-line-strong rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {item.thumbnail && (
          <img loading="lazy" decoding="async"
            src={item.thumbnail}
            alt=""
            className="w-full h-44 object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        )}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 id="news-modal-title" className="text-ink-1 font-semibold text-sm leading-snug">{item.title}</h2>
            <button ref={closeRef} onClick={onClose} aria-label="Close" className="text-ink-3 hover:text-ink-1 transition flex-shrink-0">
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <p className="text-ink-3 text-xs leading-relaxed mb-4">{item.description || '—'}</p>
          <div className="flex items-center gap-2 text-ink-3 text-xs mb-4">
            <span>{item.source}</span>
            {item.pubDate && (
              <>
                <span>·</span>
                <span>{new Date(item.pubDate).toLocaleDateString(lang === 'zh' ? 'zh-CN' : lang)}</span>
              </>
            )}
          </div>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 transition rounded-xl text-white text-xs font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            {ui('news.readAt', lang)} {item.source}
          </a>
        </div>
      </div>
    </div>
  )
}
