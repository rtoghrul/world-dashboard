'use client'
import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const COPY: Record<'title' | 'body' | 'reload', Record<string, string>> = {
  title: { en: 'Something went wrong', az: 'Nəsə səhv getdi', ru: 'Что-то пошло не так', de: 'Etwas ist schiefgelaufen', tr: 'Bir şeyler ters gitti', fr: 'Un problème est survenu', es: 'Algo salió mal', zh: '出了点问题', ar: 'حدث خطأ ما', ja: '問題が発生しました', it: 'Qualcosa è andato storto', pt: 'Algo deu errado' },
  body: { en: 'This section encountered an error. Try reloading.', az: 'Bu bölmədə xəta baş verdi. Səhifəni yeniləyin.', ru: 'В этом разделе произошла ошибка. Попробуйте перезагрузить.', de: 'In diesem Bereich ist ein Fehler aufgetreten. Bitte neu laden.', tr: 'Bu bölümde bir hata oluştu. Sayfayı yenilemeyi deneyin.', fr: 'Cette section a rencontré une erreur. Essayez de recharger.', es: 'Esta sección tuvo un error. Prueba a recargar.', zh: '此栏目出错了，请尝试重新加载。', ar: 'حدث خطأ في هذا القسم. حاول إعادة التحميل.', ja: 'このセクションでエラーが発生しました。再読み込みしてください。', it: 'Questa sezione ha riscontrato un errore. Prova a ricaricare.', pt: 'Esta seção encontrou um erro. Tente recarregar.' },
  reload: { en: 'Reload', az: 'Yenilə', ru: 'Перезагрузить', de: 'Neu laden', tr: 'Yenile', fr: 'Recharger', es: 'Recargar', zh: '重新加载', ar: 'إعادة التحميل', ja: '再読み込み', it: 'Ricarica', pt: 'Recarregar' },
}

function ErrorFallback({ message }: { message?: string }) {
  const { lang } = useLang()
  const c = (k: keyof typeof COPY) => COPY[k][lang] || COPY[k].en
  return (
    <div role="alert" className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-400" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold text-ink-1 mb-2">{c('title')}</h2>
      <p className="text-sm text-ink-3 mb-6 max-w-md">{message || c('body')}</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-fg/[0.06] border border-line-strong text-sm text-ink-1 hover:bg-fg/[0.1] transition"
      >
        <RefreshCw className="w-4 h-4" aria-hidden="true" />
        {c('reload')}
      </button>
    </div>
  )
}

interface Props {
  children: ReactNode
  fallbackMessage?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback message={this.props.fallbackMessage} />
    }

    return this.props.children
  }
}
