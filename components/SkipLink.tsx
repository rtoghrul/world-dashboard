'use client'
import { useLang } from '@/lib/LanguageContext'

const LABEL: Record<string, string> = { en: 'Skip to content', az: 'Məzmuna keç', ru: 'Перейти к содержимому', de: 'Zum Inhalt springen', tr: 'İçeriğe geç', fr: 'Aller au contenu', es: 'Saltar al contenido', zh: '跳到正文', ar: 'انتقل إلى المحتوى', ja: '本文へスキップ', it: 'Vai al contenuto', pt: 'Ir para o conteúdo' }

// First focusable element on every page: lets keyboard and screen-reader users bypass the header.
export default function SkipLink() {
  const { lang } = useLang()
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100000] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-indigo-600 focus:text-white focus:text-sm focus:font-medium"
    >
      {LABEL[lang] || LABEL.en}
    </a>
  )
}
