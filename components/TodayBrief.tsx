'use client'
import Link from 'next/link'
import { Bitcoin, Film, Newspaper, Plane, Sparkles } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const labels: Record<string, any> = {
  en: { title:'Today Highlights', sub:'Only the most useful quick sections.', open:'Open', news:'Global News', crypto:'Crypto Markets', travel:'Cheap Travel', cinema:'Movies & Series' },
  az: { title:'Bugünkü Maraqlı İcmal', sub:'Yalnız ən faydalı qısa bölmələr.', open:'Aç', news:'Qlobal Xəbərlər', crypto:'Kripto Bazarları', travel:'Ucuz Səyahət', cinema:'Kino və Seriallar' },
  ru: { title:'Главное сегодня', sub:'Только самые полезные быстрые разделы.', open:'Открыть', news:'Мировые новости', crypto:'Крипто рынки', travel:'Дешевые поездки', cinema:'Кино и сериалы' },
  de: { title:'Highlights heute', sub:'Nur die wichtigsten Schnellbereiche.', open:'Öffnen', news:'Globale Nachrichten', crypto:'Krypto-Märkte', travel:'Günstige Reisen', cinema:'Filme & Serien' },
  tr: { title:'Bugünün Öne Çıkanları', sub:'Sadece en faydalı hızlı bölümler.', open:'Aç', news:'Global Haberler', crypto:'Kripto Piyasaları', travel:'Ucuz Seyahat', cinema:'Film ve Diziler' },
}

export const dashboardSections = [
  { id:'news', icon:Newspaper, key:'news', text:'Top, war, politics, economy and AI.', subs:['top','war','politics'] },
  { id:'crypto', icon:Bitcoin, key:'crypto', text:'BTC, ETH and fear & greed signals.', subs:['top','bitcoin','fear-greed'] },
  { id:'travel', icon:Plane, key:'travel', text:'Flight, hotel and last minute deals.', subs:['flight-hotel','hotel','last-minute'] },
  { id:'entertainment', icon:Film, key:'cinema', text:'Movies, series, cartoons and upcoming.', subs:['movies','series','cartoons'] },
]

export default function TodayBrief() {
  const { lang } = useLang()
  const t = labels[lang] || labels.en
  return <section className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50"><div className="flex items-center justify-between gap-3 border-b border-gray-800 px-5 py-3"><div><div className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2 py-1 text-xs font-medium text-indigo-300"><Sparkles className="h-3.5 w-3.5" />Quick</div><h2 className="mt-2 text-xl font-bold text-white">{t.title}</h2><p className="mt-0.5 text-xs text-gray-400">{t.sub}</p></div></div><div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 p-4">{dashboardSections.map(s=>{const Icon=s.icon; return <div key={s.id} className="rounded-xl border border-gray-800 bg-gray-900/70 p-4 min-w-0"><div className="flex items-start gap-3"><span className="w-9 h-9 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center shrink-0"><Icon className="w-4 h-4 text-purple-300"/></span><div className="min-w-0"><h3 className="text-white font-semibold truncate">{t[s.key]}</h3><p className="text-xs text-gray-500 mt-1 line-clamp-2">{s.text}</p></div></div><div className="mt-3 flex flex-wrap gap-1.5">{s.subs.map(sub=><Link key={sub} href={`/section/${s.id}/${sub}`} className="px-2 py-1 rounded bg-[#252525] border border-[#3a3a3a] hover:bg-blue-700 text-[11px] text-gray-200">{sub}</Link>)}</div><Link href={`/section/${s.id}/${s.subs[0]}`} className="mt-3 inline-block text-xs text-blue-300 hover:text-blue-200">{t.open}</Link></div>})}</div></section>
}
