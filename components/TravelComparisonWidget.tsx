'use client'
import { useMemo, useState, useRef, useEffect } from 'react'
import { BadgePercent, ChevronDown, ExternalLink, Hotel, Minus, Plane, Plus, Search, Sparkles } from 'lucide-react'
import SectionNews from './SectionNews'
import { useLang } from '@/lib/LanguageContext'
import { AIRPORTS, CITIES, type Airport } from '@/lib/airports'

type Mode = 'package' | 'flight' | 'hotel'
type TripType = 'oneway' | 'round'

const copy: Record<string, any> = {
  en: { title: 'Travel Price Search', sub: 'Only cheap flight, hotel and package comparison sites', package: 'Flight + Hotel', flight: 'Flight only', hotel: 'Hotel only', one: 'One-way', round: 'Round-trip', from: 'From airport / city', to: 'To airport / city', hotelPlace: 'Hotel country / city', hotelName: 'Hotel name optional', depart: 'Departure / check-in', ret: 'Return / check-out', adults: 'Adults', children: 'Children', show: 'Show cheapest comparison sites', compare: 'Open these sites and compare where it is cheapest', cheapest: 'Cheap comparison sites', note: 'Live prices appear after opening the provider. The dashboard sends your route, dates and hotel search where possible.' },
  az: { title: 'S\u0259yah\u0259t Qiym\u0259t Axtar\u0131\u015f\u0131', sub: 'Yaln\u0131z ucuz u\u00e7u\u015f, otel v\u0259 paket m\u00fcqayis\u0259 saytlar\u0131', package: 'U\u00e7u\u015f + Otel', flight: 'Yaln\u0131z u\u00e7u\u015f', hotel: 'Yaln\u0131z otel', one: 'T\u0259k istiqam\u0259t', round: 'Gedi\u015f-g\u0259li\u015f', from: 'Haradan aeroport / \u015f\u0259h\u0259r', to: 'Haraya aeroport / \u015f\u0259h\u0259r', hotelPlace: 'Otel \u00f6lk\u0259si / \u015f\u0259h\u0259ri', hotelName: 'Otel ad\u0131 ist\u0259y\u0259 ba\u011fl\u0131', depart: 'Gedi\u015f / giri\u015f', ret: 'G\u0259li\u015f / \u00e7\u0131x\u0131\u015f', adults: 'B\u00f6y\u00fckl\u0259r', children: 'U\u015faqlar', show: '\u018fn ucuz m\u00fcqayis\u0259 saytlar\u0131n\u0131 g\u00f6st\u0259r', compare: 'Bu saytlar\u0131 a\u00e7 v\u0259 harada ucuz oldu\u011funu m\u00fcqayis\u0259 et', cheapest: 'Ucuz qiym\u0259t m\u00fcqayis\u0259 saytlar\u0131', note: 'Canl\u0131 qiym\u0259tl\u0259r provider a\u00e7\u0131ld\u0131qdan sonra g\u00f6r\u00fcn\u00fcr. Dashboard m\u00fcmk\u00fcn olan yerd\u0259 mar\u015frut, tarix v\u0259 otel axtar\u0131\u015f\u0131n\u0131 g\u00f6nd\u0259rir.' },
  ru: { title: '\u041f\u043e\u0438\u0441\u043a \u0446\u0435\u043d \u043d\u0430 \u043f\u043e\u0435\u0437\u0434\u043a\u0438', sub: '\u0422\u043e\u043b\u044c\u043a\u043e \u0441\u0430\u0439\u0442\u044b \u0441\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u044f \u0434\u0435\u0448\u0435\u0432\u044b\u0445 \u0440\u0435\u0439\u0441\u043e\u0432, \u043e\u0442\u0435\u043b\u0435\u0439 \u0438 \u043f\u0430\u043a\u0435\u0442\u043e\u0432', package: '\u0420\u0435\u0439\u0441 + \u041e\u0442\u0435\u043b\u044c', flight: '\u0422\u043e\u043b\u044c\u043a\u043e \u0440\u0435\u0439\u0441', hotel: '\u0422\u043e\u043b\u044c\u043a\u043e \u043e\u0442\u0435\u043b\u044c', one: '\u0412 \u043e\u0434\u043d\u0443 \u0441\u0442\u043e\u0440\u043e\u043d\u0443', round: '\u0422\u0443\u0434\u0430-\u043e\u0431\u0440\u0430\u0442\u043d\u043e', from: '\u041e\u0442\u043a\u0443\u0434\u0430 \u0430\u044d\u0440\u043e\u043f\u043e\u0440\u0442 / \u0433\u043e\u0440\u043e\u0434', to: '\u041a\u0443\u0434\u0430 \u0430\u044d\u0440\u043e\u043f\u043e\u0440\u0442 / \u0433\u043e\u0440\u043e\u0434', hotelPlace: '\u0421\u0442\u0440\u0430\u043d\u0430 / \u0433\u043e\u0440\u043e\u0434 \u043e\u0442\u0435\u043b\u044f', hotelName: '\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u043e\u0442\u0435\u043b\u044f \u043d\u0435\u043e\u0431\u044f\u0437\u0430\u0442\u0435\u043b\u044c\u043d\u043e', depart: '\u0412\u044b\u043b\u0435\u0442 / \u0437\u0430\u0435\u0437\u0434', ret: '\u0412\u043e\u0437\u0432\u0440\u0430\u0442 / \u0432\u044b\u0435\u0437\u0434', adults: '\u0412\u0437\u0440\u043e\u0441\u043b\u044b\u0435', children: '\u0414\u0435\u0442\u0438', show: '\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u0441\u0430\u0439\u0442\u044b \u0441\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u044f \u0446\u0435\u043d', compare: '\u041e\u0442\u043a\u0440\u043e\u0439 \u044d\u0442\u0438 \u0441\u0430\u0439\u0442\u044b \u0438 \u0441\u0440\u0430\u0432\u043d\u0438, \u0433\u0434\u0435 \u0434\u0435\u0448\u0435\u0432\u043b\u0435', cheapest: '\u0421\u0430\u0439\u0442\u044b \u0441\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u044f \u0434\u0435\u0448\u0435\u0432\u044b\u0445 \u0446\u0435\u043d', note: '\u0426\u0435\u043d\u044b \u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u044e\u0442\u0441\u044f \u043d\u0430 \u0441\u0430\u0439\u0442\u0430\u0445 \u043f\u043e\u0441\u043b\u0435 \u043e\u0442\u043a\u0440\u044b\u0442\u0438\u044f. Dashboard \u043f\u0435\u0440\u0435\u0434\u0430\u0435\u0442 \u043c\u0430\u0440\u0448\u0440\u0443\u0442, \u0434\u0430\u0442\u044b \u0438 \u043e\u0442\u0435\u043b\u044c, \u0433\u0434\u0435 \u044d\u0442\u043e \u0432\u043e\u0437\u043c\u043e\u0436\u043d\u043e.' },
  de: { title: 'Reisepreis-Suche', sub: 'Nur g\u00fcnstige Vergleichsportale f\u00fcr Flug, Hotel und Paket', package: 'Flug + Hotel', flight: 'Nur Flug', hotel: 'Nur Hotel', one: 'Einfach', round: 'Hin und zur\u00fcck', from: 'Ab Flughafen / Stadt', to: 'Ziel Flughafen / Stadt', hotelPlace: 'Hotel-Land / Stadt', hotelName: 'Hotelname optional', depart: 'Abflug / Check-in', ret: 'R\u00fcckflug / Check-out', adults: 'Erwachsene', children: 'Kinder', show: 'G\u00fcnstige Vergleichsportale anzeigen', compare: 'Diese Seiten \u00f6ffnen und vergleichen, wo es g\u00fcnstiger ist', cheapest: 'G\u00fcnstige Vergleichsportale', note: 'Live-Preise erscheinen nach dem \u00d6ffnen der Anbieter. Das Dashboard \u00fcbergibt Route, Datum und Hotelsuche soweit m\u00f6glich.' },
  tr: { title: 'Seyahat Fiyat Arama', sub: 'Sadece ucuz u\u00e7u\u015f, otel ve paket kar\u015f\u0131la\u015ft\u0131rma siteleri', package: 'U\u00e7u\u015f + Otel', flight: 'Sadece u\u00e7u\u015f', hotel: 'Sadece otel', one: 'Tek y\u00f6n', round: 'Gidi\u015f-d\u00f6n\u00fc\u015f', from: 'Nereden havaalani / \u015fehir', to: 'Nereye havaalani / \u015fehir', hotelPlace: 'Otel \u00fclkesi / \u015fehri', hotelName: 'Otel ad\u0131 iste\u011fe ba\u011fl\u0131', depart: 'Gidi\u015f / giri\u015f', ret: 'D\u00f6n\u00fc\u015f / \u00e7\u0131k\u0131\u015f', adults: 'Yeti\u015fkinler', children: '\u00c7ocuklar', show: 'En ucuz kar\u015f\u0131la\u015ft\u0131rma sitelerini g\u00f6ster', compare: 'Bu siteleri a\u00e7 ve nerede ucuz oldu\u011funu kar\u015f\u0131la\u015ft\u0131r', cheapest: 'Ucuz fiyat kar\u015f\u0131la\u015ft\u0131rma siteleri', note: 'Canl\u0131 fiyatlar site a\u00e7\u0131ld\u0131ktan sonra g\u00f6r\u00fcn\u00fcr. Dashboard m\u00fcmk\u00fcn olan yerde rota, tarih ve otel aramas\u0131n\u0131 g\u00f6nderir.' },
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
      { name: 'CHECK24 Fl\u00fcge', url: links.check24Flights, icon: Plane, desc: `${from} \u2192 ${to}` },
      { name: 'Google Flights', url: links.googleFlights, icon: Plane, desc: `${from} \u2192 ${to}` },
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
        {mode !== 'hotel' && <><AirportInput label={t.from} value={from} setValue={setFrom} placeholder="Frankfurt or FRA" /><AirportInput label={t.to} value={to} setValue={setTo} placeholder="Mallorca or PMI" /></>}
        {mode !== 'flight' && <><CityInput label={t.hotelPlace} value={hotelPlace} setValue={setHotelPlace} placeholder="Mallorca, Paris, Baku..." /><PlainInput label={t.hotelName} value={hotelName} setValue={setHotelName} placeholder="Hilton, Riu, Radisson..." /></>}
      </div>
      <div className="grid grid-cols-2 gap-3"><PlainInput type="date" label={t.depart} value={depart} setValue={setDepart} /><PlainInput type="date" label={t.ret} value={ret} setValue={setRet} /></div>
      <div className="grid grid-cols-2 gap-2"><Counter label={t.adults} value={adults} minus={() => setAdults(v => Math.max(1, v - 1))} plus={() => setAdults(v => Math.min(9, v + 1))} /><Counter label={t.children} value={children} minus={() => setChildren(v => Math.max(0, v - 1))} plus={() => setChildren(v => Math.min(9, v + 1))} /></div>
      <button onClick={() => setShow(true)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2"><Search className="w-4 h-4" />{t.show}</button>
      {show && <div><div className="mb-2"><p className="text-white text-sm font-semibold">{t.cheapest}</p><p className="text-gray-500 text-xs">{t.compare}</p></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{providers.map((p: any) => { const Icon = p.icon; return <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-2 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 group"><span className="flex items-center gap-2 text-white text-xs font-medium group-hover:text-cyan-300"><Icon className="w-3.5 h-3.5" /><span><span className="block">{p.name}</span><span className="block text-gray-500 font-normal mt-0.5">{p.desc}</span></span></span><ExternalLink className="w-3.5 h-3.5 text-gray-600" /></a> })}</div><p className="mt-2 text-[11px] text-gray-600">{t.note}</p></div>}
      {show && to && <SectionNews section="travel" tab="all" destination={to} accentColor="cyan" darkMode />}
    </div>}
  </div>
}

function AirportInput({ label, value, setValue, placeholder }: { label: string; value: string; setValue: (v: string) => void; placeholder?: string }) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { setQuery(value) }, [value])

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = useMemo(() => {
    if (!query || query === value) return []
    const q = query.toLowerCase()
    return AIRPORTS.filter(a =>
      a.iata.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q)
    ).slice(0, 8)
  }, [query, value])

  const select = (a: Airport) => {
    const formatted = `${a.city} (${a.iata})`
    setQuery(formatted)
    setValue(formatted)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <label className="text-gray-500 text-xs block">{label}
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => { setFocused(true); if (query !== value || filtered.length) setOpen(true) }}
          onBlur={() => { setFocused(false); setTimeout(() => { if (!query) return; if (query !== value) setValue(query) }, 200) }}
          placeholder={placeholder}
          className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500"
        />
      </label>
      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {filtered.map(a => (
            <button key={a.iata} onClick={() => select(a)} className="w-full text-left px-3 py-2 hover:bg-gray-700 flex items-center gap-2 transition">
              <span className="text-cyan-400 font-mono text-xs font-bold w-8">{a.iata}</span>
              <span className="flex-1 min-w-0">
                <span className="text-white text-xs block truncate">{a.city} \u2014 {a.name}</span>
                <span className="text-gray-500 text-[10px]">{a.country}</span>
              </span>
              <Plane className="w-3 h-3 text-gray-600 flex-shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function CityInput({ label, value, setValue, placeholder }: { label: string; value: string; setValue: (v: string) => void; placeholder?: string }) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { setQuery(value) }, [value])

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = useMemo(() => {
    if (!query || query === value) return []
    const q = query.toLowerCase()
    return CITIES.filter(c => c.toLowerCase().includes(q)).slice(0, 8)
  }, [query, value])

  return (
    <div ref={ref} className="relative">
      <label className="text-gray-500 text-xs block">{label}
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => { if (query !== value || filtered.length) setOpen(true) }}
          onBlur={() => { setTimeout(() => { if (query !== value) setValue(query) }, 200) }}
          placeholder={placeholder}
          className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500"
        />
      </label>
      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {filtered.map(c => (
            <button key={c} onClick={() => { setQuery(c); setValue(c); setOpen(false) }} className="w-full text-left px-3 py-2 hover:bg-gray-700 text-white text-xs transition">
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function PlainInput({ label, value, setValue, placeholder, type = 'text' }: { label: string; value: string; setValue: (v: string) => void; placeholder?: string; type?: string }) {
  return <label className="text-gray-500 text-xs block">{label}<input type={type} value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500" /></label>
}

function Counter({ label, value, minus, plus }: { label: string; value: number; minus: () => void; plus: () => void }) {
  return <div className="flex items-center justify-between rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"><span className="text-white text-xs">{label}</span><div className="flex items-center gap-2"><button onClick={minus} className="p-1 rounded bg-gray-700 text-gray-300"><Minus className="w-3 h-3" /></button><span className="text-white text-sm w-4 text-center">{value}</span><button onClick={plus} className="p-1 rounded bg-gray-700 text-gray-300"><Plus className="w-3 h-3" /></button></div></div>
}
