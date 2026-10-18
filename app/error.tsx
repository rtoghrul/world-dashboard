'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const COPY: Record<'title' | 'body' | 'retry' | 'home' | 'ref', Record<string, string>> = {
  title: { en: 'Something went wrong', az: 'Nəsə səhv getdi', ru: 'Что-то пошло не так', de: 'Etwas ist schiefgelaufen', tr: 'Bir şeyler ters gitti', fr: 'Un problème est survenu', es: 'Algo salió mal', zh: '出了点问题', ar: 'حدث خطأ ما', ja: '問題が発生しました', it: 'Qualcosa è andato storto', pt: 'Algo deu errado' },
  body: { en: 'This part of the dashboard couldn’t load. Please try again in a moment.', az: 'Panelin bu hissəsi yüklənmədi. Bir az sonra yenidən cəhd edin.', ru: 'Не удалось загрузить эту часть панели. Попробуйте ещё раз чуть позже.', de: 'Dieser Teil des Dashboards konnte nicht geladen werden. Bitte versuchen Sie es gleich noch einmal.', tr: 'Panelin bu bölümü yüklenemedi. Lütfen birazdan tekrar deneyin.', fr: 'Cette partie du tableau de bord n’a pas pu se charger. Réessayez dans un instant.', es: 'Esta parte del panel no se pudo cargar. Vuelve a intentarlo en un momento.', zh: '此部分无法加载，请稍后重试。', ar: 'تعذر تحميل هذا الجزء من اللوحة. يرجى المحاولة مرة أخرى بعد قليل.', ja: 'このページを読み込めませんでした。しばらくしてからもう一度お試しください。', it: 'Non è stato possibile caricare questa parte della dashboard. Riprova tra poco.', pt: 'Não foi possível carregar esta parte do painel. Tente novamente em instantes.' },
  retry: { en: 'Try again', az: 'Yenidən cəhd et', ru: 'Повторить', de: 'Erneut versuchen', tr: 'Tekrar dene', fr: 'Réessayer', es: 'Reintentar', zh: '重试', ar: 'أعد المحاولة', ja: '再試行', it: 'Riprova', pt: 'Tentar novamente' },
  home: { en: 'Back to dashboard', az: 'Panelə qayıt', ru: 'На главную', de: 'Zurück zum Dashboard', tr: 'Panele dön', fr: 'Retour au tableau de bord', es: 'Volver al panel', zh: '返回首页', ar: 'العودة إلى اللوحة', ja: 'ダッシュボードに戻る', it: 'Torna alla dashboard', pt: 'Voltar ao painel' },
  ref: { en: 'Reference', az: 'İstinad', ru: 'Код', de: 'Referenz', tr: 'Referans', fr: 'Référence', es: 'Referencia', zh: '参考编号', ar: 'المرجع', ja: '参照コード', it: 'Riferimento', pt: 'Referência' },
}

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { lang } = useLang()
  const c = (k: keyof typeof COPY) => COPY[k][lang] || COPY[k].en

  useEffect(() => {
    // Details go to the console/logs only; visitors never see raw error messages or stack traces.
    console.error('App error:', error)
  }, [error])

  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center bg-[#050507] p-6">
      <div className="max-w-md w-full text-center" role="alert">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">{c('title')}</h1>
        <p className="text-sm text-[#a0a0b0] mb-6">{c('body')}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-medium hover:bg-indigo-500/30 transition"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            {c('retry')}
          </button>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.08] text-[#c0c0d0] text-sm font-medium hover:text-white hover:bg-white/[0.04] transition">
            <Home className="w-4 h-4" aria-hidden="true" />
            {c('home')}
          </Link>
        </div>
        {error.digest && (
          <p className="mt-6 text-[11px] text-[#8b8b9e]">{c('ref')}: <code>{error.digest}</code></p>
        )}
      </div>
    </main>
  )
}
