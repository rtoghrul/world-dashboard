'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BarChart2, Bitcoin, BookOpen, ChevronRight, CloudSun, Eye, EyeOff, Film, Globe, Menu, Newspaper, Plane, Play, Search, Settings2, Share2, Star, TrendingUp, WalletCards, X, Zap } from 'lucide-react'
import Header from '@/components/Header'
import MarketTicker from '@/components/MarketTicker'
import TodayBrief from '@/components/TodayBrief'
import { useLang } from '@/lib/LanguageContext'
import { createClient } from '@/lib/supabase'

const submenuMap: Record<string, string[]> = { weather:['current','hourly','weekly'], crypto:['top','bitcoin','ethereum','fear-greed'], whale:['large-transfers','wallets','exchanges'], news:['top','war','politics','economy','ai','industry','social'], travel:['flight-hotel','flight','hotel','last-minute'], viral:['youtube','music','shorts','trending'], entertainment:['movies','series','cartoons','top','upcoming'], social:['instagram','tiktok','x','facebook'], stocks:['top','gainers','losers','tech'], education:['courses','engineering','ai-tools','cybersecurity'] }
const subLabels: Record<string, Record<string,string>> = { az:{current:'İndi',hourly:'Saatlıq',weekly:'Həftəlik',top:'Top',bitcoin:'Bitcoin',ethereum:'Ethereum','fear-greed':'Fear & Greed','large-transfers':'Böyük transferlər',wallets:'Wallets',exchanges:'Birjalar',war:'Müharibə',politics:'Siyasət',economy:'İqtisadiyyat',ai:'AI',industry:'Sənaye',social:'Sosial','flight-hotel':'Uçuş + Otel',flight:'Uçuş',hotel:'Otel','last-minute':'Son dəqiqə',youtube:'YouTube',music:'Musiqi',shorts:'Shorts',trending:'Trend',movies:'Kinolar',series:'Seriallar',cartoons:'Multfilmlər',upcoming:'Gözlənilənlər',instagram:'Instagram',tiktok:'TikTok',x:'X',facebook:'Facebook',gainers:'Qalxanlar',losers:'Düşənlər',tech:'Texnologiya',courses:'Kurslar',engineering:'Mühəndislik','ai-tools':'AI alətləri',cybersecurity:'Kibertəhlükəsizlik'}, ru:{current:'Сейчас',hourly:'По часам',weekly:'Неделя',top:'Топ',bitcoin:'Bitcoin',ethereum:'Ethereum','fear-greed':'Fear & Greed','large-transfers':'Крупные переводы',wallets:'Кошельки',exchanges:'Биржи',war:'Война',politics:'Политика',economy:'Экономика',ai:'AI',industry:'Индустрия',social:'Соцсети','flight-hotel':'Рейс + Отель',flight:'Рейс',hotel:'Отель','last-minute':'Last minute',youtube:'YouTube',music:'Музыка',shorts:'Shorts',trending:'Тренды',movies:'Фильмы',series:'Сериалы',cartoons:'Мультфильмы',upcoming:'Ожидаемые',instagram:'Instagram',tiktok:'TikTok',x:'X',facebook:'Facebook',gainers:'Рост',losers:'Падение',tech:'Технологии',courses:'Курсы',engineering:'Инженерия','ai-tools':'AI инструменты',cybersecurity:'Кибербезопасность'}, en:{current:'Current',hourly:'Hourly',weekly:'Weekly',top:'Top',bitcoin:'Bitcoin',ethereum:'Ethereum','fear-greed':'Fear & Greed','large-transfers':'Large transfers',wallets:'Wallets',exchanges:'Exchanges',war:'War',politics:'Politics',economy:'Economy',ai:'AI',industry:'Industry',social:'Social','flight-hotel':'Flight + Hotel',flight:'Flight',hotel:'Hotel','last-minute':'Last minute',youtube:'YouTube',music:'Music',shorts:'Shorts',trending:'Trending',movies:'Movies',series:'Series',cartoons:'Cartoons',upcoming:'Upcoming',instagram:'Instagram',tiktok:'TikTok',x:'X',facebook:'Facebook',gainers:'Gainers',losers:'Losers',tech:'Tech',courses:'Courses',engineering:'Engineering','ai-tools':'AI tools',cybersecurity:'Cybersecurity'} }

const sectionMeta: Record<string, { icon: any; gradient: string; description: Record<string,string> }> = {
  weather: { icon: CloudSun, gradient: 'from-sky-500/20 to-blue-600/20', description: { en: 'Real-time forecasts & alerts', az: 'Canlı proqnoz və xəbərdarlıqlar', ru: 'Прогноз погоды в реальном времени' } },
  crypto: { icon: Bitcoin, gradient: 'from-amber-500/20 to-orange-600/20', description: { en: 'Live prices & market data', az: 'Canlı qiymətlər və bazar', ru: 'Курсы криптовалют' } },
  whale: { icon: WalletCards, gradient: 'from-cyan-500/20 to-teal-600/20', description: { en: 'Track large transactions', az: 'Böyük əməliyyatları izlə', ru: 'Отслеживание крупных транзакций' } },
  news: { icon: Newspaper, gradient: 'from-rose-500/20 to-pink-600/20', description: { en: 'Breaking news worldwide', az: 'Son xəbərlər dünyadan', ru: 'Последние мировые новости' } },
  travel: { icon: Plane, gradient: 'from-indigo-500/20 to-violet-600/20', description: { en: 'Flights, hotels & deals', az: 'Uçuş, otel və endirimlər', ru: 'Авиабилеты, отели и скидки' } },
  viral: { icon: Play, gradient: 'from-red-500/20 to-rose-600/20', description: { en: 'Trending videos & content', az: 'Trend videolar və məzmun', ru: 'Вирусный контент и видео' } },
  entertainment: { icon: Film, gradient: 'from-purple-500/20 to-fuchsia-600/20', description: { en: 'Movies, series & more', az: 'Film, serial və daha çox', ru: 'Фильмы, сериалы и многое другое' } },
  social: { icon: Share2, gradient: 'from-blue-500/20 to-indigo-600/20', description: { en: 'Social media trends', az: 'Sosial media trendləri', ru: 'Тренды соцсетей' } },
  stocks: { icon: BarChart2, gradient: 'from-emerald-500/20 to-green-600/20', description: { en: 'Markets & stock data', az: 'Bazarlar və səhm məlumatları', ru: 'Рынки и данные по акциям' } },
  education: { icon: BookOpen, gradient: 'from-yellow-500/20 to-amber-600/20', description: { en: 'Learn & grow your skills', az: 'Öyrən və inkişaf et', ru: 'Обучение и развитие навыков' } },
}

function subLabel(lang:string,key:string){return (subLabels[lang]||subLabels.en)[key]||key}

export default function HomePage(){
  const {tr,lang}=useLang(); const router=useRouter()
  const [mobileOpen,setMobileOpen]=useState(false)
  const [isAdmin,setIsAdmin]=useState(false)
  const [searchOpen,setSearchOpen]=useState(false)
  const [searchQuery,setSearchQuery]=useState('')
  const searchRef=useRef<HTMLInputElement>(null)
  const [sectionPrefs,setSectionPrefs]=useState<{pinned:string[];hidden:string[]}>({pinned:[],hidden:[]})

  const sections=useMemo(()=>[
    {id:'weather',label:tr.weather},{id:'crypto',label:tr.crypto},{id:'whale',label:tr.whaleActivity},
    {id:'news',label:tr.news},{id:'travel',label:lang==='az'?'Səyahət':lang==='ru'?'Путешествия':'Travel'},
    {id:'viral',label:tr.viral},{id:'entertainment',label:lang==='az'?'Kino və Seriallar':lang==='ru'?'Кино и сериалы':'Movies & Series'},
    {id:'social',label:tr.social},{id:'stocks',label:tr.stocks},{id:'education',label:tr.education}
  ],[tr,lang])

  useEffect(()=>{try{const raw=localStorage.getItem('dashboard-section-prefs');if(raw){const p=JSON.parse(raw);setSectionPrefs({pinned:Array.isArray(p.pinned)?p.pinned:[],hidden:Array.isArray(p.hidden)?p.hidden:[]})}}catch{}},[])

  const normalizedSearch=searchQuery.trim().toLowerCase()
  const visibleSections=useMemo(()=>{
    const hiddenSet=new Set(sectionPrefs.hidden)
    let base=sections.filter(s=>!hiddenSet.has(s.id))
    if(normalizedSearch)base=base.filter(s=>s.label.toLowerCase().includes(normalizedSearch)||s.id.includes(normalizedSearch))
    const pinnedSet=new Set(sectionPrefs.pinned)
    return[...base.filter(s=>pinnedSet.has(s.id)),...base.filter(s=>!pinnedSet.has(s.id))]
  },[normalizedSearch,sectionPrefs,sections])

  const openSearch=()=>{setSearchOpen(true);setTimeout(()=>searchRef.current?.focus(),50)}
  const closeSearch=()=>{setSearchOpen(false);setSearchQuery('')}
  const handleLogout=async()=>{try{const supabase=createClient();await supabase.auth.signOut()}catch{};router.push('/login')}

  useEffect(()=>{const init=async()=>{try{const supabase=createClient();const {data:{user}}=await supabase.auth.getUser();if(user){setIsAdmin(user.email==='eagleeye385@gmail.com');fetch('/api/pageview',{method:'POST'})}}catch{}};init()},[])

  return (
    <div className="min-h-screen relative">
      <Header/>
      <MarketTicker/>

      {/* Navigation Bar */}
      <nav className="sticky top-[57px] z-40 glass border-b border-white/[0.03]">
        <div className="max-w-screen-2xl mx-auto px-5">
          <div className="flex items-center justify-between py-2.5 gap-3">
            <button onClick={()=>setMobileOpen(true)} className="lg:hidden p-2 rounded-lg text-[#6b6b80] hover:text-white hover:bg-white/[0.04] transition">
              <Menu className="w-4 h-4"/>
            </button>

            <div className="hidden lg:flex items-center gap-1 flex-1 overflow-x-auto">
              {visibleSections.map(section => {
                const meta = sectionMeta[section.id]
                const Icon = meta?.icon || Star
                return (
                  <Link key={section.id} href={`/section/${section.id}/${submenuMap[section.id]?.[0]||'top'}`} className="nav-pill inline-flex items-center gap-1.5 shrink-0">
                    <Icon className="w-3.5 h-3.5 opacity-70"/>{section.label}
                  </Link>
                )
              })}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {searchOpen ? (
                <div className="flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/[0.06] px-3 py-1.5">
                  <Search className="w-3.5 h-3.5 text-[#6b6b80]"/>
                  <input ref={searchRef} type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder={`${tr.search}…`} className="bg-transparent text-white text-xs outline-none w-36 placeholder:text-[#4a4a5e]"/>
                  <button onClick={closeSearch} className="text-[#6b6b80] hover:text-white"><X className="w-3.5 h-3.5"/></button>
                </div>
              ) : (
                <button onClick={openSearch} className="p-2 rounded-lg text-[#6b6b80] hover:text-white hover:bg-white/[0.04] transition"><Search className="w-4 h-4"/></button>
              )}
              {isAdmin && <Link href="/admin" className="px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Admin</Link>}
              <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg text-xs text-[#6b6b80] hover:text-white hover:bg-white/[0.04] transition">{tr.logout}</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={()=>setMobileOpen(false)}/>
          <div className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-[#0a0a0f] border-r border-white/[0.04] p-5 overflow-auto animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold text-sm">Dashboard</h2>
              <button onClick={()=>setMobileOpen(false)} className="p-2 text-[#6b6b80] hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <div className="space-y-2">
              {visibleSections.map(s => {
                const meta = sectionMeta[s.id]
                const Icon = meta?.icon || Star
                return (
                  <Link key={s.id} onClick={()=>setMobileOpen(false)} href={`/section/${s.id}/${submenuMap[s.id]?.[0]||'top'}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition group">
                    <div className={`section-icon bg-gradient-to-br ${meta?.gradient || 'from-gray-500/20 to-gray-600/20'} border border-white/[0.06]`}>
                      <Icon className="w-4.5 h-4.5 text-white/80"/>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{s.label}</p>
                      <p className="text-[#4a4a5e] text-[11px]">{meta?.description?.[lang] || meta?.description?.en || ''}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-screen-2xl mx-auto px-5 py-8 space-y-8 relative z-10">
        <TodayBrief/>

        {/* Section Grid */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-semibold text-lg tracking-tight">{lang==='az'?'Bölmələr':lang==='ru'?'Разделы':'Explore'}</h2>
              <p className="text-[#4a4a5e] text-xs mt-0.5">{lang==='az'?'Bütün kateqoriyalar bir baxışda':lang==='ru'?'Все категории':'All categories at a glance'}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="live-dot"/>
              <span className="text-[10px] text-[#6b6b80] font-medium uppercase tracking-wider">Real-time</span>
            </div>
          </div>

          <div className="dashboard-grid">
            {visibleSections.map((s, i) => {
              const meta = sectionMeta[s.id]
              const Icon = meta?.icon || Star
              const first = submenuMap[s.id]?.[0] || 'top'
              const subs = submenuMap[s.id]?.slice(0, 4) || []
              return (
                <Link key={s.id} href={`/section/${s.id}/${first}`} className="section-card group opacity-0 animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${meta?.gradient || ''} blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`}/>
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`section-icon bg-gradient-to-br ${meta?.gradient || 'from-gray-500/20 to-gray-600/20'} border border-white/[0.06]`}>
                        <Icon className="w-5 h-5 text-white/90"/>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#3a3a4e] group-hover:text-white/50 group-hover:translate-x-0.5 transition-all"/>
                    </div>
                    <h3 className="text-white font-semibold text-sm mb-1">{s.label}</h3>
                    <p className="text-[#4a4a5e] text-[11px] leading-relaxed mb-4">{meta?.description?.[lang] || meta?.description?.en || ''}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {subs.map(sub => (
                        <span key={sub} className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.04] text-[10px] text-[#6b6b80] font-medium">{subLabel(lang, sub)}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <footer className="text-center py-8 border-t border-white/[0.03]">
          <p className="text-[#3a3a4e] text-xs font-medium">World Dashboard · Built with <span className="text-indigo-400/60">◆</span> precision</p>
        </footer>
      </main>
    </div>
  )
}
