'use client'
import Link from 'next/link'
import { BarChart2, Bitcoin, BookOpen, CloudSun, Film, Newspaper, Plane, Play, Share2, Sparkles, WalletCards } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const labels: Record<string, any> = {
  en: { title:'Today Overview', sub:'All dashboard sections in a compact overview.', open:'Open', weather:'Weather', crypto:'Crypto Markets', whale:'Whale Activity', news:'Global News', travel:'Travel Deals', viral:'Viral Content', cinema:'Movies & Series', social:'Social Trends', stocks:'Stocks', education:'Education' },
  az: { title:'Bugünkü İcmal', sub:'Saytdakı bütün bölmələr kompakt icmalda.', open:'Aç', weather:'Hava', crypto:'Kripto Bazarları', whale:'Balina Aktivliyi', news:'Qlobal Xəbərlər', travel:'Səyahət Qiymət Axtarışı', viral:'Viral Məzmun', cinema:'Kino və Seriallar', social:'Sosial Trendlər', stocks:'Səhm Bazarları', education:'Təhsil' },
  ru: { title:'Сегодняшний обзор', sub:'Все разделы сайта в компактном обзоре.', open:'Открыть', weather:'Погода', crypto:'Крипто рынки', whale:'Активность китов', news:'Мировые новости', travel:'Поиск путешествий', viral:'Вирусный контент', cinema:'Кино и сериалы', social:'Социальные тренды', stocks:'Фондовые рынки', education:'Образование' },
  de: { title:'Tagesübersicht', sub:'Alle Dashboard-Bereiche kompakt zusammengefasst.', open:'Öffnen', weather:'Wetter', crypto:'Krypto-Märkte', whale:'Whale-Aktivität', news:'Globale Nachrichten', travel:'Reisepreise', viral:'Virale Inhalte', cinema:'Filme & Serien', social:'Social Trends', stocks:'Aktienmärkte', education:'Bildung' },
  tr: { title:'Bugünkü Özet', sub:'Tüm dashboard bölümleri kompakt görünümde.', open:'Aç', weather:'Hava', crypto:'Kripto Piyasaları', whale:'Balina Aktivitesi', news:'Global Haberler', travel:'Seyahat Fiyatları', viral:'Viral İçerik', cinema:'Film ve Diziler', social:'Sosyal Trendler', stocks:'Hisse Piyasaları', education:'Eğitim' },
}

export const dashboardSections = [
  { id:'weather', icon:CloudSun, key:'weather', text:'Temperature, wind and humidity.', subs:['current','hourly','weekly'] },
  { id:'crypto', icon:Bitcoin, key:'crypto', text:'BTC, ETH and market signals.', subs:['top','bitcoin','ethereum','fear-greed'] },
  { id:'whale', icon:WalletCards, key:'whale', text:'Large transfers and wallets.', subs:['large-transfers','wallets','exchanges'] },
  { id:'news', icon:Newspaper, key:'news', text:'Top, war, politics, economy, AI.', subs:['top','war','politics','economy','ai','industry','social'] },
  { id:'travel', icon:Plane, key:'travel', text:'Flight, hotel and last minute.', subs:['flight-hotel','flight','hotel','last-minute'] },
  { id:'viral', icon:Play, key:'viral', text:'Trending video signals.', subs:['youtube','music','shorts','trending'] },
  { id:'entertainment', icon:Film, key:'cinema', text:'Movies, series and cartoons.', subs:['movies','series','cartoons','top','upcoming'] },
  { id:'social', icon:Share2, key:'social', text:'Social media trends.', subs:['instagram','tiktok','x','facebook'] },
  { id:'stocks', icon:BarChart2, key:'stocks', text:'Stocks and market movers.', subs:['top','gainers','losers','tech'] },
  { id:'education', icon:BookOpen, key:'education', text:'Courses and tools.', subs:['courses','engineering','ai-tools','cybersecurity'] },
]

export default function TodayBrief() {
  const { lang } = useLang()
  const t = labels[lang] || labels.en
  return <section className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50"><div className="border-b border-gray-800 px-5 py-4"><div className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2 py-1 text-xs font-medium text-indigo-300"><Sparkles className="h-3.5 w-3.5" />Live dashboard map</div><h2 className="mt-3 text-2xl font-bold text-white">{t.title}</h2><p className="mt-1 text-sm text-gray-400">{t.sub}</p></div><div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 p-4">{dashboardSections.map(s=>{const Icon=s.icon; return <div key={s.id} className="rounded-xl border border-gray-800 bg-gray-900/70 p-4 min-w-0"><div className="flex items-start gap-3"><span className="w-9 h-9 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center shrink-0"><Icon className="w-4 h-4 text-purple-300"/></span><div className="min-w-0"><h3 className="text-white font-semibold truncate">{t[s.key]}</h3><p className="text-xs text-gray-500 mt-1 line-clamp-2">{s.text}</p></div></div><div className="mt-3 flex flex-wrap gap-1.5">{s.subs.slice(0,3).map(sub=><Link key={sub} href={`/section/${s.id}/${sub}`} className="px-2 py-1 rounded bg-[#252525] border border-[#3a3a3a] hover:bg-blue-700 text-[11px] text-gray-200">{sub}</Link>)}</div><Link href={`/section/${s.id}/${s.subs[0]}`} className="mt-3 inline-block text-xs text-blue-300 hover:text-blue-200">{t.open}</Link></div>})}</div></section>
}
