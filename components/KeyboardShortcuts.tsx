'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Keyboard } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'Keyboard Shortcuts', az: 'Klaviatura qısayolları', ru: 'Горячие клавиши', de: 'Tastenkürzel', tr: 'Klavye kısayolları', fr: 'Raccourcis clavier', es: 'Atajos de teclado', it: 'Scorciatoie da tastiera', pt: 'Atalhos de teclado', zh: '键盘快捷键', ar: 'اختصارات لوحة المفاتيح', ja: 'キーボードショートカット' },
  press: { en: 'Press {k} to toggle this panel', az: 'Paneli açmaq üçün {k} basın', ru: 'Нажмите {k}, чтобы переключить панель', de: 'Drücken Sie {k}, um das Panel umzuschalten', tr: 'Paneli açmak için {k} tuşuna basın', fr: 'Appuyez sur {k} pour basculer ce panneau', es: 'Pulsa {k} para alternar este panel', it: 'Premi {k} per attivare questo pannello', pt: 'Pressione {k} para alternar este painel', zh: '按 {k} 切换此面板', ar: 'اضغط {k} لتبديل هذه اللوحة', ja: '{k} でこのパネルを切り替え' },
  cmdPalette: { en: 'Open Command Palette', az: 'Komanda panelini aç', ru: 'Открыть палитру команд', de: 'Befehlspalette öffnen', tr: 'Komut paletini aç', fr: 'Ouvrir la palette de commandes', es: 'Abrir paleta de comandos', it: 'Apri tavolozza comandi', pt: 'Abrir paleta de comandos', zh: '打开命令面板', ar: 'فتح لوحة الأوامر', ja: 'コマンドパレットを開く' },
  bookmarks: { en: 'Toggle Bookmarks', az: 'Əlfəcinləri aç/bağla', ru: 'Показать закладки', de: 'Lesezeichen umschalten', tr: 'Yer imlerini aç/kapat', fr: 'Afficher les favoris', es: 'Alternar marcadores', it: 'Mostra segnalibri', pt: 'Alternar favoritos', zh: '切换书签', ar: 'تبديل الإشارات المرجعية', ja: 'ブックマーク切替' },
  shortcuts: { en: 'Keyboard Shortcuts', az: 'Klaviatura qısayolları', ru: 'Горячие клавиши', de: 'Tastenkürzel', tr: 'Klavye kısayolları', fr: 'Raccourcis clavier', es: 'Atajos de teclado', it: 'Scorciatoie da tastiera', pt: 'Atalhos de teclado', zh: '键盘快捷键', ar: 'اختصارات لوحة المفاتيح', ja: 'キーボードショートカット' },
  close: { en: 'Close any panel', az: 'İstənilən paneli bağla', ru: 'Закрыть любую панель', de: 'Panel schließen', tr: 'Paneli kapat', fr: 'Fermer le panneau', es: 'Cerrar cualquier panel', it: 'Chiudi il pannello', pt: 'Fechar qualquer painel', zh: '关闭任意面板', ar: 'إغلاق أي لوحة', ja: 'パネルを閉じる' },
  focus: { en: 'Focus Mode', az: 'Fokus rejimi', ru: 'Режим фокуса', de: 'Fokusmodus', tr: 'Odak modu', fr: 'Mode focus', es: 'Modo enfoque', it: 'Modalità focus', pt: 'Modo foco', zh: '专注模式', ar: 'وضع التركيز', ja: 'フォーカスモード' },
  home: { en: 'Go to Home', az: 'Ana səhifəyə keç', ru: 'На главную', de: 'Zur Startseite', tr: 'Ana sayfaya git', fr: 'Aller à l\'accueil', es: 'Ir al inicio', it: 'Vai alla home', pt: 'Ir para o início', zh: '前往首页', ar: 'الذهاب إلى الرئيسية', ja: 'ホームへ' },
  news: { en: 'Go to News', az: 'Xəbərlərə keç', ru: 'К новостям', de: 'Zu Nachrichten', tr: 'Haberlere git', fr: 'Aller aux actualités', es: 'Ir a noticias', it: 'Vai alle notizie', pt: 'Ir para notícias', zh: '前往新闻', ar: 'الذهاب إلى الأخبار', ja: 'ニュースへ' },
  crypto: { en: 'Go to Crypto', az: 'Kriptoya keç', ru: 'К криптовалютам', de: 'Zu Krypto', tr: 'Kriptoya git', fr: 'Aller aux cryptos', es: 'Ir a cripto', it: 'Vai a cripto', pt: 'Ir para cripto', zh: '前往加密货币', ar: 'الذهاب إلى العملات', ja: '暗号資産へ' },
  stocks: { en: 'Go to Stocks', az: 'Səhmlərə keç', ru: 'К акциям', de: 'Zu Aktien', tr: 'Hisselere git', fr: 'Aller aux actions', es: 'Ir a acciones', it: 'Vai alle azioni', pt: 'Ir para ações', zh: '前往股票', ar: 'الذهاب إلى الأسهم', ja: '株式へ' },
  movies: { en: 'Go to Movies', az: 'Filmlərə keç', ru: 'К фильмам', de: 'Zu Filmen', tr: 'Filmlere git', fr: 'Aller aux films', es: 'Ir a películas', it: 'Vai ai film', pt: 'Ir para filmes', zh: '前往电影', ar: 'الذهاب إلى الأفلام', ja: '映画へ' },
}

const shortcuts = [
  { keys: ['⌘', 'K'], desc: 'cmdPalette' },
  { keys: ['⌘', '⇧', 'B'], desc: 'bookmarks' },
  { keys: ['?'], desc: 'shortcuts' },
  { keys: ['Esc'], desc: 'close' },
  { keys: ['⌘', '/'], desc: 'focus' },
  { keys: ['G', 'H'], desc: 'home' },
  { keys: ['G', 'N'], desc: 'news' },
  { keys: ['G', 'C'], desc: 'crypto' },
  { keys: ['G', 'S'], desc: 'stocks' },
  { keys: ['G', 'M'], desc: 'movies' },
]

export default function KeyboardShortcuts() {
  const { lang } = useLang()
  const c = (k: string) => COPY[k]?.[lang] || COPY[k]?.en || k
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
            <h2 className="text-white font-semibold text-sm">{c('title')}</h2>
          </div>
          <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/[0.05] text-[#4a4a5e]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2 px-1">
              <span className="text-[#8b8b9e] text-xs">{c(s.desc)}</span>
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
          <p className="text-[10px] text-[#4a4a5e]">
            {c('press').split('{k}').map((part, idx, arr) => (
              <span key={idx}>
                {part}
                {idx < arr.length - 1 && <kbd className="px-1.5 py-0.5 bg-white/[0.05] rounded text-[9px] text-[#8b8b9e]">?</kbd>}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>,
    document.body
  )
}
