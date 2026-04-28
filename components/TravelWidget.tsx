'use client'
import { useEffect, useMemo, useState } from 'react'
import { BadgePercent, Bus, CalendarDays, ChevronDown, ExternalLink, Hotel, MapPinned, Minus, Plane, Plus, Search, Sparkles, Train } from 'lucide-react'

type Mode = 'package' | 'flight' | 'hotel' | 'transport'
type TripType = 'oneway' | 'round'
type Airport = { label: string; city: string; code: string; country: string }

const fallbackAirports: Airport[] = [
  { label: 'Frankfurt Main', city: 'Frankfurt', code: 'FRA', country: 'Germany' },
  { label: 'Baku Heydar Aliyev', city: 'Baku', code: 'GYD', country: 'Azerbaijan' },
  { label: 'Istanbul Airport', city: 'Istanbul', code: 'IST', country: 'Türkiye' },
  { label: 'Istanbul Sabiha Gokcen', city: 'Istanbul', code: 'SAW', country: 'Türkiye' },
  { label: 'Paris Charles de Gaulle', city: 'Paris', code: 'CDG', country: 'France' },
  { label: 'London Heathrow', city: 'London', code: 'LHR', country: 'United Kingdom' },
  { label: 'Rome Fiumicino', city: 'Rome', code: 'FCO', country: 'Italy' },
  { label: 'Barcelona El Prat', city: 'Barcelona', code: 'BCN', country: 'Spain' },
  { label: 'Palma de Mallorca', city: 'Mallorca', code: 'PMI', country: 'Spain' },
  { label: 'Vienna', city: 'Vienna', code: 'VIE', country: 'Austria' },
  { label: 'Prague', city: 'Prague', code: 'PRG', country: 'Czechia' },
  { label: 'Dubai', city: 'Dubai', code: 'DXB', country: 'UAE' },
  { label: 'Amsterdam Schiphol', city: 'Amsterdam', code: 'AMS', country: 'Netherlands' },
  { label: 'Brussels', city: 'Brussels', code: 'BRU', country: 'Belgium' },
]

const deals = [
  { name: 'Urlaubspiraten', tag: 'Last minute', url: 'https://www.urlaubspiraten.de/', desc: 'Cheap holidays, packages and mistake fares' },
  { name: 'Travel-Dealz', tag: 'Flight deals', url: 'https://travel-dealz.de/', desc: 'Cheap flights from Germany' },
  { name: 'Google Flights Explore', tag: 'Map search', url: 'https://www.google.com/travel/explore', desc: 'Find cheapest countries by map' },
  { name: 'Skyscanner Explore', tag: 'Explore', url: 'https://www.skyscanner.net/flights', desc: 'Open search and compare destinations' },
  { name: 'Lastminute.de', tag: 'Package', url: 'https://www.lastminute.de/', desc: 'Flight + hotel and city breaks' },
  { name: 'Secret Escapes', tag: 'Hotel sale', url: 'https://www.secretescapes.de/', desc: 'Discounted hotels and holidays' },
]

const quick = ['Mallorca', 'Istanbul', 'Rome', 'Barcelona', 'Prague', 'Vienna', 'Paris', 'Baku']

function parseCsvLine(line: string) {
  const out: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') inQuotes = !inQuotes
    else if (ch === ',' && !inQuotes) { out.push(cur); cur = '' }
    else cur += ch
  }
  out.push(cur)
  return out.map(v => v.replace(/^"|"$/g, '').trim())
}

function optionValue(a: Airport) {
  return `${a.city} (${a.code})`
}

function resolveAirport(value: string, airports: Airport[], fallback: Airport): Airport {
  const raw = value.trim()
  const clean = raw.toLowerCase()
  const codeFromBrackets = raw.match(/\(([A-Za-z]{3})\)/)?.[1]?.toUpperCase()
  const found = airports.find(a =>
    a.code.toLowerCase() === clean ||
    a.code === codeFromBrackets ||
    a.city.toLowerCase() === clean ||
    a.label.toLowerCase() === clean ||
    optionValue(a).toLowerCase() === clean
  )
  if (found) return found
  if (/^[a-zA-Z]{3}$/.test(raw)) return { label: raw.toUpperCase(), city: raw.toUpperCase(), code: raw.toUpperCase(), country: 'Custom IATA' }
  return fallback
}

function yymmdd(date: string) {
  if (!date) return ''
  const [y, m, d] = date.split('-')
  return `${y.slice(2)}${m}${d}`
}

function AirportInput({ id, label, value, onChange, placeholder, airports, loading }: { id: string; label: string; value: string; onChange: (value: string) => void; placeholder: string; airports: Airport[]; loading: boolean }) {
  const suggestions = airports.filter(a => {
    const q = value.trim().toLowerCase()
    if (!q) return ['FRA', 'GYD', 'IST', 'SAW', 'CDG', 'LHR', 'DXB', 'BCN', 'FCO', 'VIE'].includes(a.code)
    return a.city.toLowerCase().includes(q) || a.code.toLowerCase().includes(q) || a.label.toLowerCase().includes(q) || a.country.toLowerCase().includes(q)
  }).slice(0, 25)

  return (
    <label className="text-gray-500 text-xs relative">
      {label}
      <input
        list={`${id}-list`}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500"
      />
      <datalist id={`${id}-list`}>
        {suggestions.map(a => <option key={`${id}-${a.code}-${a.label}`} value={optionValue(a)}>{a.label} · {a.country}</option>)}
      </datalist>
      <span className="mt-1 block text-[10px] text-gray-600">{loading ? 'Loading global airport list...' : `${airports.length.toLocaleString()} airports available + manual IATA code`}</span>
    </label>
  )
}

export default function TravelWidget() {
  const [airports, setAirports] = useState<Airport[]>(fallbackAirports)
  const [airportLoading, setAirportLoading] = useState(false)
  const [collapsed, setCollapsed] = useState(true)
  const [mode, setMode] = useState<Mode>('package')
  const [tripType, setTripType] = useState<TripType>('round')
  const [from, setFrom] = useState('Frankfurt')
  const [to, setTo] = useState('Baku')
  const [depart, setDepart] = useState('')
  const [ret, setRet] = useState('')
  const [adults, setAdults] = useState(1)
  const [childAges, setChildAges] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    let cancelled = false
    const loadAirports = async () => {
      setAirportLoading(true)
      try {
        const res = await fetch('https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat')
        const text = await res.text()
        const parsed = text.split('\n').map(parseCsvLine).map(cols => ({
          label: cols[1],
          city: cols[2],
          country: cols[3],
          code: cols[4],
        })).filter(a => a.code && a.code !== '\\N' && /^[A-Z0-9]{3}$/.test(a.code) && a.city && a.label)
        const map = new Map<string, Airport>()
        ;[...fallbackAirports, ...parsed].forEach(a => map.set(`${a.code}-${a.label}`, a))
        if (!cancelled) setAirports(Array.from(map.values()).sort((a, b) => a.city.localeCompare(b.city)))
      } catch {
        if (!cancelled) setAirports(fallbackAirports)
      } finally {
        if (!cancelled) setAirportLoading(false)
      }
    }
    loadAirports()
    return () => { cancelled = true }
  }, [])

  const fromAirport = resolveAirport(from, airports, fallbackAirports[0])
  const toAirport = resolveAirport(to, airports, fallbackAirports[1])
  const totalPeople = adults + childAges.length

  const handleDepartChange = (value: string) => {
    setDepart(value)
    if (tripType === 'round' && !ret) setRet(value)
  }

  const handleTripTypeChange = (value: TripType) => {
    setTripType(value)
    if (value === 'oneway') setRet('')
    if (value === 'round' && depart && !ret) setRet(depart)
  }

  const addChild = () => setChildAges(prev => [...prev, 5])
  const removeChild = () => setChildAges(prev => prev.slice(0, -1))
  const updateChildAge = (index: number, age: number) => setChildAges(prev => prev.map((item, i) => (i === index ? age : item)))

  const links = useMemo(() => {
    const fCode = fromAirport.code.toUpperCase()
    const tCode = toAirport.code.toUpperCase()
    const fCodeLower = fCode.toLowerCase()
    const tCodeLower = tCode.toLowerCase()
    const fCity = encodeURIComponent(fromAirport.city)
    const tCity = encodeURIComponent(toAirport.city)
    const flightQuery = encodeURIComponent(`${fCode} to ${tCode} ${depart}${tripType === 'round' && ret ? ` return ${ret}` : ' one way'}`)
    const hotelQuery = encodeURIComponent(`${toAirport.city} hotels ${depart} ${ret || depart}`)
    const skyDepart = yymmdd(depart)
    const skyReturn = tripType === 'round' ? yymmdd(ret) : ''
    const kayakDates = tripType === 'round' && ret ? `${depart}/${ret}` : depart

    return {
      googleFlights: `https://www.google.com/travel/flights?q=${flightQuery}`,
      googleExplore: 'https://www.google.com/travel/explore',
      skyscanner: skyDepart ? `https://www.skyscanner.net/transport/flights/${fCodeLower}/${tCodeLower}/${skyDepart}/${skyReturn}/?adultsv2=${adults}&childrenv2=${childAges.join('|')}&cabinclass=economy&rtn=${tripType === 'round' ? 1 : 0}` : `https://www.skyscanner.net/transport/flights/${fCodeLower}/${tCodeLower}/`,
      kayak: `https://www.kayak.com/flights/${fCode}-${tCode}/${kayakDates}/${adults}adults${childAges.length ? `/${childAges.length}children` : ''}?sort=price_a`,
      momondo: `https://www.momondo.com/flight-search/${fCode}-${tCode}/${kayakDates}/${adults}adults?sort=price_a`,
      booking: `https://www.booking.com/searchresults.html?ss=${tCity}&checkin=${depart}&checkout=${ret || depart}&group_adults=${adults}&group_children=${childAges.length}&order=price`,
      expedia: `https://www.expedia.com/Hotel-Search?destination=${tCity}&startDate=${depart}&endDate=${ret || depart}&adults=${adults}&sort=PRICE_LOW_TO_HIGH`,
      googleHotels: `https://www.google.com/travel/hotels?q=${hotelQuery}`,
      rome2rio: `https://www.rome2rio.com/map/${fCity}/${tCity}`,
      omio: `https://www.omio.com/search-frontend/results/L/${fCity}/${tCity}/${depart}`,
      trainline: `https://www.thetrainline.com/search?origin=${fCity}&destination=${tCity}&outwardDate=${depart}`,
      flixbus: `https://global.flixbus.com/search?from=${fCity}&to=${tCity}&departureDate=${depart}&adult=${adults}&children=${childAges.length}`,
    }
  }, [adults, childAges, depart, fromAirport, ret, toAirport, tripType])

  const marketplaceLinks = [
    { name: 'Google Flights', url: links.googleFlights, icon: Plane, desc: `${fromAirport.code} → ${toAirport.code}; calendar often shows cheapest days` },
    { name: 'Skyscanner', url: links.skyscanner, icon: Plane, desc: `${fromAirport.code} → ${toAirport.code}; IATA route search` },
    { name: 'Kayak', url: links.kayak, icon: Plane, desc: `${fromAirport.code} → ${toAirport.code}; sort by cheapest` },
    { name: 'Momondo', url: links.momondo, icon: Plane, desc: `${fromAirport.code} → ${toAirport.code}; secondary price compare` },
    { name: 'Google Explore', url: links.googleExplore, icon: MapPinned, desc: 'Use when destination is flexible' },
    { name: 'Booking', url: links.booking, icon: Hotel, desc: `${toAirport.city} hotels sorted by price` },
    { name: 'Expedia', url: links.expedia, icon: Hotel, desc: 'Hotels and package options' },
    { name: 'Rome2Rio', url: links.rome2rio, icon: MapPinned, desc: 'Flight, train, bus and car comparison' },
  ]

  const visibleMarketplaceLinks = marketplaceLinks.filter(link => {
    if (mode === 'flight') return ['Google Flights', 'Skyscanner', 'Kayak', 'Momondo', 'Google Explore', 'Rome2Rio'].includes(link.name)
    if (mode === 'hotel') return ['Booking', 'Expedia'].includes(link.name)
    if (mode === 'transport') return ['Rome2Rio'].includes(link.name)
    return true
  })

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between cursor-pointer select-none hover:bg-gray-800/20 transition" onClick={() => setCollapsed(c => !c)}>
        <div className="flex items-center gap-2"><div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"><Plane className="w-4 h-4 text-cyan-300" /></div><div><h2 className="text-white font-semibold text-sm">Travel Deals</h2><p className="text-gray-500 text-xs">Flight · hotel · train · bus · last minute</p></div></div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
      </div>

      {collapsed ? (
        <div className="px-5 py-3 flex flex-wrap gap-2"><span className="px-2.5 py-1 rounded-lg bg-gray-800 text-gray-400 text-xs border border-gray-700">✈️ {fromAirport.code} → {toAirport.code}</span><span className="px-2.5 py-1 rounded-lg bg-gray-800 text-gray-400 text-xs border border-gray-700">🌍 Global airports</span><span className="px-2.5 py-1 rounded-lg bg-gray-800 text-gray-400 text-xs border border-gray-700">🚆 Train / bus</span><span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 text-xs border border-purple-500/20">🔥 Last minute</span></div>
      ) : (
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{[{ id: 'package' as Mode, label: 'Flight + Hotel', icon: Sparkles }, { id: 'flight' as Mode, label: 'Flight only', icon: Plane }, { id: 'hotel' as Mode, label: 'Hotel only', icon: Hotel }, { id: 'transport' as Mode, label: 'Transport', icon: Train }].map(x => { const Icon = x.icon; return <button key={x.id} onClick={() => setMode(x.id)} className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${mode === x.id ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-200' : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'}`}><Icon className="w-3.5 h-3.5" />{x.label}</button> })}</div>

          <div className="bg-gray-950 rounded-xl p-4 border border-gray-800">
            {(mode === 'package' || mode === 'flight') && <div className="grid grid-cols-2 gap-2 mb-3"><button onClick={() => handleTripTypeChange('oneway')} className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${tripType === 'oneway' ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-200' : 'border-gray-700 bg-gray-800/50 text-gray-400'}`}>One-way</button><button onClick={() => handleTripTypeChange('round')} className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${tripType === 'round' ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-200' : 'border-gray-700 bg-gray-800/50 text-gray-400'}`}>Round-trip</button></div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3"><AirportInput id="from-airport" label="From airport / IATA" value={from} onChange={setFrom} placeholder="Frankfurt or FRA" airports={airports} loading={airportLoading} /><AirportInput id="to-airport" label="Destination airport / IATA" value={to} onChange={setTo} placeholder="Baku or GYD" airports={airports} loading={airportLoading} /></div>
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 mb-3"><p className="text-cyan-200 text-xs">Matched route: <b>{fromAirport.code}</b> → <b>{toAirport.code}</b>. Type city, airport name, country, or direct IATA code.</p></div>
            <div className={`grid gap-3 mb-3 ${tripType === 'round' || mode === 'hotel' || mode === 'package' ? 'grid-cols-2' : 'grid-cols-1'}`}><div><label className="text-gray-500 text-xs mb-1 block">Departure</label><input type="date" value={depart} onChange={e => handleDepartChange(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" /></div>{(tripType === 'round' || mode === 'hotel' || mode === 'package') && <div><label className="text-gray-500 text-xs mb-1 block">Return / checkout</label><input type="date" value={ret} onChange={e => setRet(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" /></div>}</div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-3 mb-3"><p className="text-gray-400 text-xs font-medium mb-2">Travellers</p><div className="grid grid-cols-2 gap-2 mb-2"><div className="flex items-center justify-between rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"><span className="text-white text-xs">Adults</span><div className="flex items-center gap-2"><button onClick={() => setAdults(a => Math.max(1, a - 1))} className="p-1 rounded bg-gray-700 text-gray-300"><Minus className="w-3 h-3" /></button><span className="text-white text-sm w-4 text-center">{adults}</span><button onClick={() => setAdults(a => Math.min(9, a + 1))} className="p-1 rounded bg-gray-700 text-gray-300"><Plus className="w-3 h-3" /></button></div></div><div className="flex items-center justify-between rounded-lg bg-gray-800 border border-gray-700 px-3 py-2"><span className="text-white text-xs">Children</span><div className="flex items-center gap-2"><button onClick={removeChild} className="p-1 rounded bg-gray-700 text-gray-300"><Minus className="w-3 h-3" /></button><span className="text-white text-sm w-4 text-center">{childAges.length}</span><button onClick={addChild} className="p-1 rounded bg-gray-700 text-gray-300"><Plus className="w-3 h-3" /></button></div></div></div>{childAges.length > 0 && <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{childAges.map((age, index) => <label key={index} className="text-gray-500 text-xs">Child {index + 1} age<select value={age} onChange={e => updateChildAge(index, Number(e.target.value))} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-white text-xs focus:outline-none focus:border-cyan-500">{Array.from({ length: 18 }, (_, i) => i).map(value => <option key={value} value={value}>{value}</option>)}</select></label>)}</div>}<p className="text-gray-600 text-[11px] mt-2">Total: {totalPeople} traveller{totalPeople === 1 ? '' : 's'}</p></div>
            <button onClick={() => setShowResults(true)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2"><Search className="w-4 h-4" /> Show cheapest search options</button>
          </div>

          {showResults && <div><p className="text-gray-500 text-xs mb-2">Open several marketplaces and compare the lowest price</p><div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{visibleMarketplaceLinks.map(link => { const Icon = link.icon; return <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-2 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 transition group"><span className="flex items-center gap-2 text-white text-xs font-medium group-hover:text-cyan-300"><Icon className="w-3.5 h-3.5" /><span><span className="block">{link.name}</span><span className="block text-gray-500 font-normal mt-0.5">{link.desc}</span></span></span><ExternalLink className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" /></a> })}</div></div>}
          <div><p className="text-gray-500 text-xs mb-2">Transport by distance</p><div className="grid grid-cols-1 sm:grid-cols-3 gap-2">{[[Train, 'Trainline', links.trainline], [Bus, 'FlixBus', links.flixbus], [MapPinned, 'Omio / mixed', links.omio]].map(([Icon, name, url]: any) => <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition"><span className="flex items-center gap-2 text-white text-xs"><Icon className="w-3.5 h-3.5 text-emerald-300" />{name}</span><ExternalLink className="w-3.5 h-3.5 text-gray-600" /></a>)}</div></div>
          <div><div className="flex items-center gap-2 mb-2"><BadgePercent className="w-4 h-4 text-purple-300" /><p className="text-white text-sm font-semibold">Today’s discounted & last minute travel</p></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{deals.map(d => <a key={d.url} href={d.url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition group"><span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-300 border border-purple-500/20 mb-1"><CalendarDays className="w-3 h-3" />{d.tag}</span><div className="text-white text-xs font-semibold group-hover:text-purple-200">{d.name}</div><div className="text-gray-500 text-xs mt-0.5">{d.desc}</div></a>)}</div></div>
          <div className="flex flex-wrap gap-2">{quick.map(city => <button key={city} onClick={() => setTo(city)} className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs transition border border-gray-700 hover:border-gray-500">{city}</button>)}</div>
        </div>
      )}
    </div>
  )
}
