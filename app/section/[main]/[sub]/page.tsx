'use client'
import useSWR from 'swr'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Clock, CloudSun, Film, Newspaper, Plane, Play, WalletCards, BarChart2, BookOpen, Share2, Bitcoin } from 'lucide-react'
import Header from '@/components/Header'
import WeatherWidget from '@/components/WeatherWidget'
import NewsWidget from '@/components/NewsWidget'
import CryptoWidget from '@/components/CryptoWidget'
import WhaleWidget from '@/components/WhaleWidget'
import TravelComparisonWidget from '@/components/TravelComparisonWidget'
import ViralWidget from '@/components/ViralWidget'
import EntertainmentWidget from '@/components/EntertainmentWidget'
import SocialWidget from '@/components/SocialWidget'
import StocksWidget from '@/components/StocksWidget'
import EducationWidget from '@/components/EducationWidget'
import { useLang } from '@/lib/LanguageContext'

const fetcher = (url:string)=>fetch(url).then(r=>r.json())
const icons:any={weather:CloudSun,crypto:Bitcoin,whale:WalletCards,news:Newspaper,travel:Plane,viral:Play,entertainment:Film,social:Share2,stocks:BarChart2,education:BookOpen}
const names:any={az:{weather:'Hava',crypto:'Kripto Bazarları',whale:'Balina Aktivliyi',news:'Qlobal Xəbərlər',travel:'Səyahət',viral:'Viral Məzmun',entertainment:'Kino və Seriallar',social:'Sosial Trendlər',stocks:'Səhm Bazarları',education:'Təhsil'},en:{weather:'Weather',crypto:'Crypto Markets',whale:'Whale Activity',news:'Global News',travel:'Travel',viral:'Viral Content',entertainment:'Movies & Series',social:'Social Trends',stocks:'Stocks',education:'Education'},ru:{weather:'Погода',crypto:'Крипто рынки',whale:'Активность китов',news:'Мировые новости',travel:'Путешествия',viral:'Вирусный контент',entertainment:'Кино и сериалы',social:'Социальные тренды',stocks:'Акции',education:'Образование'}}
const subText:any={top:'Top',war:'War',politics:'Politics',economy:'Economy',ai:'AI',industry:'Industry',social:'Social','flight-hotel':'Flight + Hotel',flight:'Flight',hotel:'Hotel','last-minute':'Last minute',movies:'Movies',series:'Series',cartoons:'Cartoons',upcoming:'Upcoming',youtube:'YouTube',music:'Music',shorts:'Shorts',trending:'Trending',bitcoin:'Bitcoin',ethereum:'Ethereum','fear-greed':'Fear & Greed','large-transfers':'Large transfers',wallets:'Wallets',exchanges:'Exchanges',current:'Current',hourly:'Hourly',weekly:'Weekly',gainers:'Gainers',losers:'Losers',tech:'Tech',courses:'Courses',engineering:'Engineering','ai-tools':'AI tools',cybersecurity:'Cybersecurity',instagram:'Instagram',tiktok:'TikTok',x:'X',facebook:'Facebook'}

function MetaBar(){const {data}=useSWR<any>('/api/weather',fetcher,{refreshInterval:300000}); const now=new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit',weekday:'short',day:'2-digit',month:'short'}).format(new Date()); return <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5"><div className="rounded-lg border border-gray-800 bg-gray-900 p-4 flex items-center gap-3"><Clock className="w-5 h-5 text-blue-300"/><div><p className="text-xs text-gray-500">Local time</p><p className="text-white font-semibold">{now}</p></div></div><div className="rounded-lg border border-gray-800 bg-gray-900 p-4 flex items-center gap-3"><CloudSun className="w-5 h-5 text-yellow-300"/><div><p className="text-xs text-gray-500">Weather</p><p className="text-white font-semibold">{data?.temperature ? `${Math.round(data.temperature)}°C · ${data.city||'Frankfurt'}` : 'Frankfurt weather'}</p></div></div></div>}
function Content({main,sub}:{main:string;sub:string}){if(main==='weather')return <WeatherWidget/>; if(main==='crypto')return <CryptoWidget/>; if(main==='whale')return <WhaleWidget/>; if(main==='news')return <NewsWidget/>; if(main==='travel')return <TravelComparisonWidget/>; if(main==='viral')return <ViralWidget/>; if(main==='entertainment')return <EntertainmentWidget/>; if(main==='social')return <SocialWidget/>; if(main==='stocks')return <StocksWidget/>; if(main==='education')return <EducationWidget/>; return <NewsWidget/>}
export default function SectionPage(){const params=useParams(); const main=String(params.main||'news'); const sub=String(params.sub||'top'); const {lang}=useLang(); const Icon=icons[main]||Newspaper; const title=(names[lang]||names.en)[main]||main; return <div className="min-h-screen bg-gray-950"><Header/><main className="max-w-screen-2xl mx-auto px-4 py-6"><Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4"><ArrowLeft className="w-4 h-4"/>Back to dashboard</Link><section className="rounded-2xl border border-gray-800 bg-gray-900/60 overflow-hidden"><div className="border-b border-gray-800 p-5"><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center"><Icon className="w-5 h-5 text-purple-300"/></div><div><h1 className="text-2xl font-bold text-white">{title}</h1><p className="text-gray-400 text-sm">{subText[sub]||sub} · local time and weather included</p></div></div></div><div className="p-5"><MetaBar/><Content main={main} sub={sub}/></div></section></main></div>}
