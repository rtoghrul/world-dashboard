'use client'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Bookmark, BookmarkCheck, X, ExternalLink, Trash2, Clock } from 'lucide-react'

export interface BookmarkItem {
  id: string
  title: string
  url: string
  source?: string
  savedAt: number
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('wd-bookmarks')
    if (saved) setBookmarks(JSON.parse(saved))
  }, [])

  const save = (items: BookmarkItem[]) => {
    setBookmarks(items)
    localStorage.setItem('wd-bookmarks', JSON.stringify(items))
  }

  const addBookmark = (title: string, url: string, source?: string) => {
    if (bookmarks.some(b => b.url === url)) return
    const item: BookmarkItem = { id: Date.now().toString(), title, url, source, savedAt: Date.now() }
    save([item, ...bookmarks])
  }

  const removeBookmark = (id: string) => {
    save(bookmarks.filter(b => b.id !== id))
  }

  const isBookmarked = (url: string) => bookmarks.some(b => b.url === url)

  return { bookmarks, addBookmark, removeBookmark, isBookmarked }
}

export function BookmarkButton({ title, url, source }: { title: string; url: string; source?: string }) {
  const { addBookmark, removeBookmark, isBookmarked, bookmarks } = useBookmarks()
  const saved = isBookmarked(url)

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (saved) {
      const item = bookmarks.find(b => b.url === url)
      if (item) removeBookmark(item.id)
    } else {
      addBookmark(title, url, source)
    }
  }

  return (
    <button onClick={toggle} className="p-1 rounded hover:bg-white/[0.05] transition" title={saved ? 'Remove bookmark' : 'Save for later'}>
      {saved ? <BookmarkCheck className="w-3.5 h-3.5 text-indigo-400" /> : <Bookmark className="w-3.5 h-3.5 text-[#4a4a5e]" />}
    </button>
  )
}

export default function BookmarksPanel() {
  const [open, setOpen] = useState(false)
  const { bookmarks, removeBookmark } = useBookmarks()
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'b' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault()
        setOpen(o => !o)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-white/[0.05] transition text-[#8b8b9e] hover:text-white relative"
        title="Bookmarks (⌘⇧B)"
      >
        <Bookmark className="w-4 h-4" />
        {bookmarks.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-indigo-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">
            {bookmarks.length > 9 ? '9+' : bookmarks.length}
          </span>
        )}
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[99998] flex justify-end" onClick={() => setOpen(false)}>
          <div className="fixed inset-0 bg-black/40" />
          <div
            className="relative w-80 max-w-full h-full bg-[#0a0a12] border-l border-white/[0.06] shadow-2xl animate-slide-in-right overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-indigo-400" />
                <h2 className="text-white font-semibold text-sm">Reading List</h2>
                <span className="text-[10px] text-[#4a4a5e]">{bookmarks.length} saved</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/[0.05] text-[#4a4a5e]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {bookmarks.length === 0 ? (
                <div className="p-8 text-center">
                  <Bookmark className="w-8 h-8 text-[#4a4a5e] mx-auto mb-3" />
                  <p className="text-[#8b8b9e] text-xs">No saved articles yet</p>
                  <p className="text-[#4a4a5e] text-[10px] mt-1">Click the bookmark icon on any article</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.03]">
                  {bookmarks.map(b => (
                    <div key={b.id} className="p-3 hover:bg-white/[0.02] transition group">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <a href={b.url} target="_blank" rel="noopener" className="text-white text-xs font-medium hover:text-indigo-300 transition line-clamp-2">
                            {b.title}
                          </a>
                          <div className="flex items-center gap-2 mt-1">
                            {b.source && <span className="text-[10px] text-[#4a4a5e]">{b.source}</span>}
                            <span className="text-[10px] text-[#4a4a5e] flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" /> {timeAgo(b.savedAt)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          <a href={b.url} target="_blank" rel="noopener" className="p-1 rounded hover:bg-white/[0.05]">
                            <ExternalLink className="w-3 h-3 text-[#4a4a5e]" />
                          </a>
                          <button onClick={() => removeBookmark(b.id)} className="p-1 rounded hover:bg-red-500/10">
                            <Trash2 className="w-3 h-3 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
