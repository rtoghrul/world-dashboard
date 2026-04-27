'use client'
import { useMemo, useState } from 'react'
import { BadgePercent, Bus, CalendarDays, ChevronDown, ExternalLink, Hotel, MapPinned, Plane, Search, Sparkles, Train } from 'lucide-react'

type Mode = 'package' | 'flight' | 'hotel' | 'transport'

const deals = [
  { name: 'Urlaubspiraten', tag: 'Last minute', url: 'https://www.urlaubspiraten.de/', desc: 'Cheap holidays, packages and mistake fares' },
  { name: 'Travel-Dealz', tag: 'Flight deals', url: 'https://travel-dealz.de/', desc: 'Cheap flights from Germany' },
  { name: 'Google Flights Explore', tag: 'Map search', url: 'https://www.google.com/travel/explore', desc: 'Find cheapest countries by map' },
  { name: 'Skyscanner Everywhere', tag: 'Explore', url: 'https://www.skyscanner.net/transport/flights/fran/?rtn=1', desc: 'Search cheapest destinations' },
  { name: 'Lastminute.de', tag: 'Package', url: 'https://www.lastminute.de/', desc: 'Flight + hotel and city breaks' },
  { name: 'Secret Escapes', tag: 'Hotel sale', url: 'https://www.secretescapes.de/', desc: 'Discounted hotels and holidays' },
]

const quick = ['Mallorca', 'Istanbul', 'Rome', 'Barcelona', 'Prague', 'Vienna', 'Paris', 'Baku']

export default function TravelWidget() {
  const [collapsed, setCollapsed] = useState(true)
  const [mode, setMode] = useState<Mode>('package')
  const [from, setFrom] = useState('Frankfurt')
  const [to, setTo] = useState('')
  const [depart, setDepart] = useState('')
  const [ret, setRet] = useState('')
  const [people, setPeople] = useState(2)

  const links = useMemo(() => {
    const f = encodeURIComponent(from || 'Frankfurt')
    const t = encodeURIComponent(to || 'Everywhere')
    return {
      googleFlights: `https://www.google.com/travel/flights?q=Flights%20from%20${f}%20to%20${t}%20${depart}`,
      skyscanner: `https://www.skyscanner.net/transport/flights/${f}/${t}/${depart}/${ret}/?adults=${people}`,
      kayak: `https://www.kayak.com/flights/${f}-${t}/${depart}/${ret}/${people}adults?sort=bestflight_a`,
      booking: `https://www.booking.com/searchresults.html?ss=${t}&checkin=${depart}&checkout=${ret}&group_adults=${people}&order=price`,
      expedia: `https://www.expedia.com/Hotel-Search?destination=${t}&startDate=${depart}&endDate=${ret}&adults=${people}&sort=PRICE_LOW_TO_HIGH`,
      rome2rio: `https://www.rome2rio.com/map/${f}/${t}`,
      omio: `https://www.omio.com/search-frontend/results/L/${f}/${t}/${depart}`,
      trainline: `https://www.thetrainline.com/search?origin=${f}&destination=${t}&outwardDate=${depart}`,
      flixbus: `https://global.flixbus.com/search?departureCity=${f}&arrivalCity=${t}&rideDate=${depart}&adult=${people}`,
    }
  }, [depart, from, people, ret, to])

  const openMainSearch = () => {
    if (mode === 'hotel') window.open(links.booking, '_blank')
    else if (mode === 'transport') window.open(links.rome2rio, '_blank')
    else window.open(links.skyscanner, '_blank')
  }

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between cursor-pointer select-none hover:bg-gray-800/20 transition" onClick={() => setCollapsed(c => !c)}>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"><Plane className="w-4 h-4 text-cyan-300" /></div>
          <div>
            <h2 className="text-white font-semibold text-sm">Travel Deals</h2>
            <p className="text-gray-500 text-xs">Flight · hotel · train · bus · last minute</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
      </div>

      {collapsed ? (
        <div className="px-5 py-3 flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-gray-800 text-gray-400 text-xs border border-gray-700">✈️ Cheapest flights</span>
          <span className="px-2.5 py-1 rounded-lg bg-gray-800 text-gray-400 text-xs border border-gray-700">🏨 Hotels</span>
          <span className="px-2.5 py-1 rounded-lg bg-gray-800 text-gray-400 text-xs border border-gray-700">🚆 Train / bus</span>
          <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 text-xs border border-purple-500/20">🔥 Last minute</span>
        </div>
      ) : (
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'package' as Mode, label: 'Flight + Hotel', icon: Sparkles },
              { id: 'flight' as Mode, label: 'Flight only', icon: Plane },
              { id: 'hotel' as Mode, label: 'Hotel only', icon: Hotel },
              { id: 'transport' as Mode, label: 'Transport', icon: Train },
            ].map(x => {
              const Icon = x.icon
              return <button key={x.id} onClick={() => setMode(x.id)} className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${mode === x.id ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-200' : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'}`}><Icon className="w-3.5 h-3.5" />{x.label}</button>
            })}
          </div>

          <div className="bg-gray-950 rounded-xl p-4 border border-gray-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div><label className="text-gray-500 text-xs mb-1 block">From</label><input value={from} onChange={e => setFrom(e.target.value)} placeholder="Frankfurt" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500" /></div>
              <div><label className="text-gray-500 text-xs mb-1 block">Destination</label><input value={to} onChange={e => setTo(e.target.value)} placeholder="Everywhere, Rome, Istanbul..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500" /></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
              <div><label className="text-gray-500 text-xs mb-1 block">Departure</label><input type="date" value={depart} onChange={e => setDepart(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" /></div>
              <div><label className="text-gray-500 text-xs mb-1 block">Return</label><input type="date" value={ret} onChange={e => setRet(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" /></div>
              <div className="col-span-2 sm:col-span-1"><label className="text-gray-500 text-xs mb-1 block">Travellers</label><input type="number" min={1} max={9} value={people} onChange={e => setPeople(Math.max(1, Number(e.target.value) || 1))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" /></div>
            </div>
            <button onClick={openMainSearch} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg text-sm transition flex items-center justify-center gap-2"><Search className="w-4 h-4" /> Find cheapest offers</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              ['Google Flights', links.googleFlights, Plane], ['Skyscanner', links.skyscanner, Plane], ['Kayak', links.kayak, Plane], ['Booking', links.booking, Hotel], ['Expedia', links.expedia, Hotel], ['Rome2Rio', links.rome2rio, MapPinned],
            ].map(([name, url, Icon]: any) => <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-2 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 transition group"><span className="flex items-center gap-2 text-white text-xs font-medium group-hover:text-cyan-300"><Icon className="w-3.5 h-3.5" />{name}</span><ExternalLink className="w-3.5 h-3.5 text-gray-600" /></a>)}
          </div>

          <div>
            <p className="text-gray-500 text-xs mb-2">Transport by distance</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[[Train, 'Trainline', links.trainline], [Bus, 'FlixBus', links.flixbus], [MapPinned, 'Omio / mixed', links.omio]].map(([Icon, name, url]: any) => <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition"><span className="flex items-center gap-2 text-white text-xs"><Icon className="w-3.5 h-3.5 text-emerald-300" />{name}</span><ExternalLink className="w-3.5 h-3.5 text-gray-600" /></a>)}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2"><BadgePercent className="w-4 h-4 text-purple-300" /><p className="text-white text-sm font-semibold">Today’s discounted & last minute travel</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {deals.map(d => <a key={d.url} href={d.url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition group"><span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-300 border border-purple-500/20 mb-1"><CalendarDays className="w-3 h-3" />{d.tag}</span><div className="text-white text-xs font-semibold group-hover:text-purple-200">{d.name}</div><div className="text-gray-500 text-xs mt-0.5">{d.desc}</div></a>)}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {quick.map(city => <button key={city} onClick={() => setTo(city)} className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs transition border border-gray-700 hover:border-gray-500">{city}</button>)}
          </div>
        </div>
      )}
    </div>
  )
}
