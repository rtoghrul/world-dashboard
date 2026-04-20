'use client'
import { useEffect } from 'react'
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
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {item.thumbnail && (
          <img
            src={item.thumbnail}
            alt=""
            className="w-full h-44 object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        )}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="text-white font-semibold text-sm leading-snug">{item.title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed mb-4">{item.description || '—'}</p>
          <div className="flex items-center gap-2 text-gray-600 text-xs mb-4">
            <span>{item.source}</span>
            {item.pubDate && (
              <>
                <span>·</span>
                <span>{new Date(item.pubDate).toLocaleDateString()}</span>
              </>
            )}
          </div>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 transition rounded-xl text-white text-xs font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Tam oxu (mənbədə)
          </a>
        </div>
      </div>
    </div>
  )
}
