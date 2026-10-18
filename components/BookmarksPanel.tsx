'use client'
import { timeAgo } from '@/lib/i18n/ui'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Bookmark, BookmarkCheck, X, ExternalLink, Trash2, Clock } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'Reading List', az: 'Oxu Siyahısı', ru: 'Список чтения', de: 'Leseliste', tr: 'Okuma Listesi', fr: 'Liste de lecture', es: 'Lista de lectura', it: 'Lista di lettura', pt: 'Lista de leitura', zh: '阅读列表', ar: 'قائمة القراءة', ja: 'リーディングリスト' },
  empty: { en: 'No saved articles yet', az: 'Hələ saxlanmış məqalə yoxdur', ru: 'Пока нет сохранённых статей', de: 'Noch keine gespeicherten Artikel', tr: 'Henüz kayıtlı makale yok', fr: 'Aucun article enregistré', es: 'Aún no hay artículos guardados', it: 'Nessun articolo salvato', pt: 'Nenhum artigo salvo', zh: '暂无已保存文章', ar: 'لا توجد مقالات محفوظة بعد', ja: '保存された記事はありません' },
  hint: { en: 'Click the bookmark icon on any article', az: 'Hər hansı məqalədə əlfəcin ikonuna klikləyin', ru: 'Нажмите значок закладки в любой статье', de: 'Klicken Sie auf das Lesezeichen-Symbol', tr: 'Herhangi bir makalede yer imi simgesine tıklayın', fr: 'Cliquez sur l\'icône favori d\'un article', es: 'Haz clic en el icono de marcador', it: 'Clicca l\'icona segnalibro', pt: 'Clique no ícone de favorito', zh: '点击任意文章的书签图标', ar: 'انقر على أيقونة الإشارة في أي مقال', ja: '記事のブックマークアイコンをクリック' },
}

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
    <button onClick={toggle} className="p-1 rounded hover:bg-fg/[0.05] transition" title={saved ? 'Remove bookmark' : 'Save for later'}>
      {saved ? <BookmarkCheck className="w-3.5 h-3.5 text-indigo-400" /> : <Bookmark className="w-3.5 h-3.5 text-ink-4" />}
    </button>
  )
}

export default function BookmarksPanel() {
  const { lang } = useLang()
  const c = (k: string) => COPY[k]?.[lang] || COPY[k]?.en || k
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



  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-fg/[0.05] transition text-ink-3 hover:text-ink-1 relative"
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
            className="relative w-80 max-w-full h-full bg-surface-1 border-l border-line shadow-2xl animate-slide-in-right overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-line">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-indigo-400" />
            <h2 className="text-ink-1 font-semibold text-sm">{c('title')}</h2>
                <span className="text-[10px] text-ink-4">{bookmarks.length} saved</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-fg/[0.05] text-ink-4">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {bookmarks.length === 0 ? (
                <div className="p-8 text-center">
                  <Bookmark className="w-8 h-8 text-ink-4 mx-auto mb-3" />
              <p className="text-ink-3 text-xs">{c('empty')}</p>
              <p className="text-ink-4 text-[10px] mt-1">{c('hint')}</p>
                </div>
              ) : (
                <div className="divide-y divide-line">
                  {bookmarks.map(b => (
                    <div key={b.id} className="p-3 hover:bg-fg/[0.02] transition group">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <a href={b.url} target="_blank" rel="noopener" className="text-ink-1 text-xs font-medium hover:text-indigo-300 transition line-clamp-2">
                            {b.title}
                          </a>
                          <div className="flex items-center gap-2 mt-1">
                            {b.source && <span className="text-[10px] text-ink-4">{b.source}</span>}
                            <span className="text-[10px] text-ink-4 flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" /> <span suppressHydrationWarning>{timeAgo(new Date(b.savedAt).toISOString(), lang)}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          <a href={b.url} target="_blank" rel="noopener" className="p-1 rounded hover:bg-fg/[0.05]">
                            <ExternalLink className="w-3 h-3 text-ink-4" />
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
