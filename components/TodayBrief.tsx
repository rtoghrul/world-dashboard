'use client'
import { useState } from 'react'
import Link from 'next/link'
import { BarChart2, Bitcoin, BookOpen, ChevronDown, CloudSun, Film, Globe2, Newspaper, Plane, Play, Share2, Sparkles, WalletCards } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const labels: Record<string, any> = {
  en: { title:'Today Overview', sub:'All dashboard sections in one place. Open one section at a time.', open:'Open page', weather:'Weather', crypto:'Crypto Markets', whale:'Whale Activity', news:'Global News', travel:'Travel Deals', viral:'Viral Content', cinema:'Movies & Series', social:'Social Trends', stocks:'Stocks', education:'Education' },
  az: { title:'Bugünkü İcmal', sub:'Saytdakı bütün bölmələr bir yerdə. Birinə basanda o biri bağlanır.', open:'Səhifəni aç', weather:'Hava', crypto:'Kripto Bazarları', whale:'Balina Aktivliyi', news:'Qlobal Xəbərlər', travel:'Səyahət Qiymət Axtarışı', viral:'Viral Məzmun', cinema:'Kino və Seriallar', social:'Sosial Trendlər', stocks:'Səhm Bazarları', education:'Təhsil' },
  ru: { title:'Сегодняшний обзор', sub:'Все разделы сайта в одном месте. Открывается только один блок.', open:'Открыть страницу', weather:'Погода', crypto:'Крипто рынки', whale:'Активность китов', news:'Мировые новости', travel:'Поиск путешествий', viral:'Вирусный контент', cinema:'Кино и сериалы', social:'Социальные тренды', stocks:'Фондовые рынки', education:'Образование' },
  de: { title:'Tagesübersicht', sub:'Alle Dashboard-Bereiche an einem Ort. Immer nur ein Bereich ist geöffnet.', open:'Seite öffnen', weather:'Wetter', crypto:'Krypto-Märkte', whale:'Whale-Aktivität', news:'Globale Nachrichten', travel:'Reisepreise', viral:'Virale Inhalte', cinema:'Filme & Serien', social:'Social Trends', stocks:'Aktienmärkte', education:'Bildung' },
  tr: { title:'Bugünkü Özet', sub:'Tüm dashboard bölümleri tek yerde. Aynı anda sadece biri açılır.', open:'Sayfayı aç', weather:'Hava', crypto:'Kripto Piyasaları', whale:'Balina Aktivitesi', news:'Global Haberler', travel:'Seyahat Fiyatları', viral:'Viral İçerik', cinema:'Film ve Diziler', social:'Sosyal Trendler', stocks:'Hisse Piyasaları', education:'Eğitim' },
}

export const dashboardSections = [
  { id:'weather', icon:CloudSun, key:'weather', text:'Local weather, temperature, wind and humidity.', subs:['current','hourly','weekly'] },
  { id:'crypto', icon:Bitcoin, key:'crypto', text:'Bitcoin, Ethereum, market cap and fear & greed signals.', subs:['top','bitcoin','ethereum','fear-greed'] },
  { id:'whale', icon:WalletCards, key:'whale', text:'Large wallet transfers, exchange inflows and wallet tracking.', subs:['large-transfers','wallets','exchanges'] },
  { id:'news', icon:Newspaper, key:'news', text:'Top, war, politics, economy, AI, industry and social news.', subs:['top','war','politics','economy','ai','industry','social'] },
  { id:'travel', icon:Plane, key:'travel', text:'Flight, hotel, packages and last-minute travel comparison.', subs:['flight-hotel','flight','hotel','last-minute'] },
  { id:'viral', icon:Play, key:'viral', text:'Trending videos, YouTube, TikTok-style and viral signals.', subs:['youtube','music','shorts','trending'] },
  { id:'entertainment', icon:Film, key:'cinema', text:'Movies, series, cartoons, genres, years and catalogue filters.', subs:['movies','series','cartoons','top','upcoming'] },
  { id:'social', icon:Share2, key:'social', text:'Social media trends, platforms and creator signals.', subs:['instagram','tiktok','x','facebook'] },
  { id:'stocks', icon:BarChart2, key:'stocks', text:'US stocks, movers, indexes and company signals.', subs:['top','gainers','losers','tech'] },
  { id:'education', icon:BookOpen, key:'education', text:'Learning, courses, tools and technical topics.', subs:['courses','engineering','ai-tools','cybersecurity'] },
]

export default function TodayBrief() {
  const { lang } = useLang()
  const t = labels[lang] || labels.en
  const [active, setActive] = useState('news')
  return <section className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50"><div className="border-b border-gray-800 px-5 py-4"><div className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2 py-1 text-xs font-medium text-indigo-300"><Sparkles className="h-3.5 w-3.5" />Live dashboard map</div><h2 className="mt-3 text-2xl font-bold text-white">{t.title}</h2><p className="mt-1 text-sm text-gray-400">{t.sub}</p></div><div className="divide-y divide-gray-800">{dashboardSections.map(s=>{const Icon=s.icon; const is=active===s.id; return <div key={s.id}><button onClick={()=>setActive(is?'':s.id)} className={`w-full px-5 py-4 flex items-center justify-between text-left ${is?'bg-gray-800/50':'hover:bg-gray-800/30'}`}><span className="flex items-center gap-3"><span className="w-9 h-9 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center"><Icon className="w-4 h-4 text-purple-300"/></span><span><span className="block text-white font-semibold">{t[s.key]}</span><span className="block text-xs text-gray-500 mt-0.5">{s.text}</span></span></span><ChevronDown className={`w-4 h-4 text-gray-500 ${is?'rotate-180':''}`}/></button>{is&&<div className="px-5 pb-5 pl-[4.25rem]"><div className="flex flex-wrap gap-2 mb-3">{s.subs.map(sub=><Link key={sub} href={`/section/${s.id}/${sub}`} className="px-3 py-1.5 rounded bg-[#252525] border border-[#3a3a3a] hover:bg-blue-700 text-sm text-gray-200">{sub}</Link>)}</div><Link href={`/section/${s.id}/${s.subs[0]}`} className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200">{t.open}</Link></div>}</div>})}</div></section>
}
