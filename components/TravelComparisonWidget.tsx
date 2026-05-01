'use client'
import { useMemo, useState } from 'react'
import { BadgePercent, ChevronDown, ExternalLink, Hotel, Minus, Plane, Plus, Search, Sparkles } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

type Mode = 'package' | 'flight' | 'hotel'
type TripType = 'oneway' | 'round'

const copy: Record<string, any> = {
  en: { title: 'Travel Price Search', sub: 'Only cheap flight, hotel and package comparison sites', package: 'Flight + Hotel', flight: 'Flight only', hotel: 'Hotel only', one: 'One-way', round: 'Round-trip', from: 'From airport / city', to: 'To airport / city', hotelPlace: 'Hotel country / city', hotelName: 'Hotel name optional', depart: 'Departure / check-in', ret: 'Return / check-out', adults: 'Adults', children: 'Children', show: 'Show cheapest comparison sites', compare: 'Open these sites and compare where it is cheapest', cheapest: 'Cheap comparison sites', note: 'Live prices appear after opening the provider. The dashboard sends your route, dates and hotel search where possible.' },
  az: { title: 'Səyahət Qiymət Axtarışı', sub: 'Yalnız ucuz uçuş, otel və paket müqayisə saytları', package: 'Uçuş + Otel', flight: 'Yalnız uçuş', hotel: 'Yalnız otel', one: 'Tək istiqamət', round: 'Gediş-gəliş', from: 'Haradan aeroport / şəhər', to: 'Haraya aeroport / şəhər', hotelPlace: 'Otel ölkəsi / şəhəri', hotelName: 'Otel adı istəyə bağlı', depart: 'Gediş / giriş', ret: 'Gəliş / çıxış', adults: 'Böyüklər', children: 'Uşaqlar', show: 'Ən ucuz müqayisə saytlarını göstər', compare: 'Bu saytları aç və harada ucuz olduğunu müqayisə et', cheapest: 'Ucuz qiymət müqayisə saytları', note: 'Canlı qiymətlər provider açıldıqdan sonra görünür. Dashboard mümkün olan yerdə marşrut, tarix və otel axtarışını göndərir.' },
  ru: { title: 'Поиск цен на поездки', sub: 'Только сайты сравнения дешевых рейсов, отелей и пакетов', package: 'Рейс + Отель', flight: 'Только рейс', hotel: 'Только отель', one: 'В одну сторону', round: 'Туда-обратно', from: 'Откуда аэропорт / город', to: 'Куда аэропорт / город', hotelPlace: 'Страна / город отеля', hotelName: 'Название отеля необязательно', depart: 'Вылет / заезд', ret: 'Возврат / выезд', adults: 'Взрослые', children: 'Дети', show: 'Показать сайты сравнения цен', compare: 'Открой эти сайты и сравни, где дешевле', cheapest: 'Сайты сравнения дешевых цен', note: 'Цены показываются на сайтах после открытия. Dashboard передает маршрут, даты и отель, где это возможно.' },
  de: { title: 'Reisepreis-Suche', sub: 'Nur günstige Vergleichsportale für Flug, Hotel und Paket', package: 'Flug + Hotel', flight: 'Nur Flug', hotel: 'Nur Hotel', one: 'Einfach', round: 'Hin und zurück', from: 'Ab Flughafen / Stadt', to: 'Ziel Flughafen / Stadt', hotelPlace: 'Hotel-Land / Stadt', hotelName: 'Hotelname optional', depart: 'Abflug / Check-in', ret: 'Rückflug / Check-out', adults: 'Erwachsene', children: 'Kinder', show: 'Günstige Vergleichsportale anzeigen', compare: 'Diese Seiten öffnen und vergleichen, wo es günstiger ist', cheapest: 'Günstige Vergleichsportale', note: 'Live-Preise erscheinen nach dem Öffnen der Anbieter. Das Dashboard übergibt Route, Datum und Hotelsuche soweit möglich.' },
  tr: { title: 'Seyahat Fiyat Arama', sub: 'Sadece ucuz uçuş, otel ve paket karşılaştırma siteleri', package: 'Uçuş + Otel', flight: 'Sadece uçuş', hotel: 'Sadece otel', one: 'Tek yön', round: 'Gidiş-dönüş', from: 'Nereden havaalanı / şehir', to: 'Nereye havaalanı / şehir', hotelPlace: 'Otel ülkesi / şehri', hotelName: 'Otel adı isteğe bağlı', depart: 'Gidiş / giriş', ret: 'Dönüş / çıkış', adults: 'Yetişkinler', children: 'Çocuklar', show: 'En ucuz karşılaştırma sitelerini göster', compare: 'Bu siteleri aç ve nerede ucuz olduğunu karşılaştır', cheapest: 'Ucuz fiyat karşılaştırma siteleri', note: 'Canlı fiyatlar site açıldıktan sonra görünür. Dashboard mümkün olan yerde rota, tarih ve otel aramasını gönderir.' },
}

function enc(v: string) { return encodeURIComponent(v.trim()) }
function yymmdd(date: string) { if (!date) return ''; const [y, m, d] = date.split('-'); return `${y.slice(2)}${m}${d}` }
function code(value: string) { const m = value.match(/\(([A-Za-z]{3})\)/); if (m) return m[1].toUpperCase(); const clean = value.trim().toUpperCase(); return /^[A-Z]{3}$/.test(clean) ? clean : clean.slice(0, 3) }

export default function TravelComparisonWidget({ defaultExpanded = false }: { defaultExpanded?: boolean }) {
  const { lang } = useLang()
  const t = copy[lang] || copy.en
  const [collapsed, setCollapsed] = useState(!defaultExpanded)
  const [mode, setMode] = useState<Mode>('package')
  const [tripType, setTripType] = useState<TripType>('round')
  const [from, setFrom] = useState('Frankfurt (FRA)')
  const [to, setTo] = useState('Mallorca (PMI)')
  const [hotelPlace, setHotelPlace] = useState('Mallorca')
  const [hotelName, setHotelName] = useState('')
  const [depart, setDepart] = useState('')
  const [ret, setRet] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [show, setShow] = useState(false)

  const links = useMemo(() => {
    const f = code(from)
    const d = code(to)
    const qFlight = enc(`${from} to ${to} ${depart} ${tripType === 'round' ? ret : 'one way'}`)
    const hq = enc(`${hotelName ? hotelName + ' ' : ''}${hotelPlace}`)
    const depShort = yymmdd(depart)
    const retShort = yymmdd(ret)
    const kayakDates = tripType === 'round' && ret ? `${depart}/${ret}` : depart
    return {
      check24Package: `https://urlaub.check24.de/suche/pauschalreisen?destination=${hq}`,
      check24Flights: `https://fluege.check24.de/search?from=${enc(from)}&to=${enc(to)}`,
      check24Hotels: `https://hotel.check24.de/search?destination=${hq}`,
      booking: `https://www.booking.com/searchresults.html?ss=${hq}&checkin=${depart}&checkout=${ret || depart}&group_adults=${adults}&group_children=${children}&order=price`,
      googleFlights: `https://www.google.com/travel/flights?q=${qFlight}`,
      googleHotels: `https://www.google.com/travel/hotels?q=${enc(`${hq} hotels ${depart} ${ret || depart}`)}`,
      skyscanner: depShort ? `https://www.skyscanner.net/transport/flights/${f.toLowerCase()}/${d.toLowerCase()}/${depShort}/${tripType === 'round' ? retShort : ''}/?adultsv2=${adults}&childrenv2=${children}&cabinclass=economy&rtn=${tripType === 'round' ? 1 : 0}` : 'https://www.skyscanner.net/flights',
      kayak: `https://www.kayak.com/flights/${f}-${d}/${kayakDates}/${adults}adults${children ? `/${children}children` : ''}?sort=price_a`,
      momondo: `https://www.momondo.com/flight-search/${f}-${d}/${kayakDates}/${adults}adults?sort=price_a`,
      expediaPackage: `https://www.expedia.com/Packages-Search?destination=${hq}&startDate=${depart}&endDate=${ret || depart}&adults=${adults}`,
      expediaHotel: `https://www.expedia.com/Hotel-Search?destination=${hq}&startDate=${depart}&endDate=${ret || depart}&adults=${adults}&sort=PRICE_LOW_TO_HIGH`,
      trivago: `https://www.trivago.com/en-US/srl?search=${hq}`,
      lastminute: `https://www.lastminute.de/search?searchText=${hq}`,
    }
  }, [adults, children, depart, from, hotelName, hotelPlace, ret, to, tripType])

  const providers = useMemo(() => {
    const packageSites = [
      { name: 'CHECK24 Pauschalreisen', url: links.check24Package, icon: Sparkles, desc: 'Flight + hotel package comparison' },
      { name: 'Expedia Flight + Hotel', url: links.expediaPackage, icon: Sparkles, desc: 'Package deals' },
      { name: 'Lastminute.de', url: links.lastminute, icon: BadgePercent, desc: 'Last minute package deals' },
      { name: 'Booking', url: links.booking, icon: Hotel, desc: 'Hotels sorted by price' },
    ]
    const flightSites = [
      { name: 'CHECK24 Flüge', url: links.check24Flights, icon: Plane, desc: `${from} → ${to}` },
      { name: 'Google Flights', url: links.googleFlights, icon: Plane, desc: `${from} → ${to}` },
      { name: 'Skyscanner', url: links.skyscanner, icon: Plane, desc: 'Flight price comparison' },
      { name: 'Kayak', url: links.kayak, icon: Plane, desc: 'Sorted by cheapest' },
      { name: 'Momondo', url: links.momondo, icon: Plane, desc: 'Sorted by cheapest' },
    ]
    const hotelSites = [
      { name: 'CHECK24 Hotels', url: links.check24Hotels, icon: Hotel, desc: hotelName || hotelPlace },
      { name: 'Booking', url: links.booking, icon: Hotel, desc: hotelName || hotelPlace },
      { name: 'Google Hotels', url: links.googleHotels, icon: Hotel, desc: hotelName || hotelPlace },
      { name: 'Expedia Hotels', url: links.expediaHotel, icon: Hotel, desc: 'Sorted by price' },
      { name: 'Trivago', url: links.trivago, icon: Hotel, desc: 'Hotel price comparison' },
    ]
    if (mode === 'flight') return flightSites
    if (mode === 'hotel') return hotelSites
    return packageSites
  }, [from, hotelName, hotelPlace, links, mode, to])

  return <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
    <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between cursor-pointer hover:bg-gray-800/20" onClick={() => setCollapsed(c => !c)}>
      <div className="flex items-center gap-2"><div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"><Plane className="w-4 h-4 text-cyan-300" /></div><div><h2 className="text-white font-semibold text-sm">{t.title}</h2><p className="text-gray-500 text-xs">{t.sub}</p></div></div>
      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
    </div>
    {collapsed ? <div className="px-5 py-3 flex flex-wrap gap-2"><span className="px-2.5 py-1 rounded-lg bg-gray-800 text-gray-400 text-xs border border-gray-700">CHECK24</span><span className="px-2.5 py-1 rounded-lg bg-gray-800 text-gray-400 text-xs border border-gray-700">Booking</span><span className="px-2.5 py-1 rounded-lg bg-gray-800 text-gray-400 text-xs border border-gray-700">Skyscanner</span><span className="px-2.5 py-1 rounded-lg bg-gray-800 text-gray-400 text-xs border border-gray-700">Google Flights/Hotels</span></div> : <div className="p-5 space-y-4">
      <div className="grid grid-cols-3 gap-2">{[{ id: 'package', label: t.package, icon: Sparkles }, { id: 'flight', label: t.flight, icon: Plane }, { id: 'hotel', label: t.hotel, icon: Hotel }].map((x: any) => { const Icon = x.icon; return <button key={x.id} onClick={() => { setMode(x.id); setShow(false) }} className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium ${mode === x.id ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-200' : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:text-white'}`}><Icon className="w-3.5 h-3.5" />{x.label}</button> })}</div>
      {mode !== 'hotel' && <div className="grid grid-cols-2 gap-2"><button onClick={() => setTripType('oneway')} className={`rounded-lg border px-3 py-2 text-xs ${tripType === 'oneway' ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-200' : 'border-gray-700 bg-gray-800 text-gray-400'}`}>{t.one}</button><button onClick={() => setTripType('round')} className={`rounded-lg border px-3 py-2 text-xs ${tripType === 'round' ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-200' : 'border-gray-700 bg-gray-800 text-gray-400'}`}>{t.round}</button></div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {mode !== 'hotel' && <><Input label={t.from} value={from} setValue={setFrom} placeholder="Frankfurt or FRA" /><Input label={t.to} value={to} setValue={setTo} placeholder="Mallorca or PMI" /></>}
        {mode !== 'flight' && <><Input label={t.hotelPlace} value={hotelPlace} setValue={setHotelPlace} placeholder="Mallorca, Paris, Baku..." /><Input label={t.hotelName} value={hotelName} setValue={setHotelName} placeholder="Hilton, Riu, Radisson..." /></>}
      </div>
      <div className="grid grid-cols-2 gap-3"><Input type="date" label={t.depart} value={depart} setValue={setDepart} /><Input type="date" label={t.ret} value={ret} setValue={setRet} /></div>
      <div className="grid grid-cols-2 gap-2"><Counter label={t.adults} value={adults} minus={() => setAdults(v => Math.max(1, v - 1))} plus={() => setAdults(v => Math.min(9, v + 1))} /><Counter label={t.children} value={children} minus={() => setChildren(v => Math.max(0, v - 1))} plus={() => setChildren(v => Math.min(9, v + 1))} /></div>
      <button onClick={() => setShow(true)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2"><Search className="w-4 h-4" />{t.show}</button>
      {show && <div><div className="mb-2"><p className="text-white text-sm font-semibold">{t.cheapest}</p><p className="text-gray-500 text-xs">{t.compare}</p></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{providers.map((p: any) => { const Icon = p.icon; return <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-2 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 group"><span className="flex items-center gap-2 text-white text-xs font-medium group-hover:text-cyan-300"><Icon className="w-3.5 h-3.5" /><span><span className="block">{p.name}</span><span className="block text-gray-500 font-normal mt-0.5">{p.desc}</span></span></span><ExternalLink className="w-3.5 h-3.5 text-gray-600" /></a> })}</div><p className="mt-2 text-[11px] text-gray-600">{t.note}</p></div>}
    </div>}
  </div>
}

function Input({ label, value, setValue, placeholder, type = 'text' }: { label: string; value: string; setValue: (v: string) => void; placeholder?: string; type?: string }) { return <label className="text-gray-500 text-xs block">{label}<input type={type} value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500" /></label> }
function Counter({ label, value, minus, plus }: { label: string; value: number; minus: () => void; plus: () => void }) { return <div className="flex items-center justify-between rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"><span className="text-white text-xs">{label}</span><div className="flex items-center gap-2"><button onClick={minus} className="p-1 rounded bg-gray-700 text-gray-300"><Minus className="w-3 h-3" /></button><span className="text-white text-sm w-4 text-center">{value}</span><button onClick={plus} className="p-1 rounded bg-gray-700 text-gray-300"><Plus className="w-3 h-3" /></button></div></div> }
