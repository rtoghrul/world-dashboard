'use client'
import { useState } from 'react'
import { Plane, ExternalLink, ChevronDown } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

export default function FlightsWidget() {
  const { tr } = useLang()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [collapsed, setCollapsed] = useState(true)

  const handleSearch = () => {
    window.open(`https://www.google.com/flights#flt=${from}.${to}.${date || ''}`, '_blank')
  }

  const quickLinks = [
    { label: 'FlightRadar24', url: 'https://www.flightradar24.com', desc: 'Live global radar' },
    { label: 'FlightAware', url: 'https://flightaware.com', desc: 'Flight tracking' },
    { label: 'Google Flights', url: 'https://www.google.com/flights', desc: 'Search & compare' },
    { label: 'Skyscanner', url: 'https://www.skyscanner.com', desc: 'Best prices' },
    { label: 'Kayak', url: 'https://www.kayak.com', desc: 'Compare flights' },
    { label: 'Momondo', url: 'https://www.momondo.com', desc: 'Cheap flights' },
  ]

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-3 border-b border-gray-800 flex items-center justify-between cursor-pointer select-none hover:bg-gray-800/20 transition"
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center gap-2">
          <Plane className="w-4 h-4 text-cyan-400" />
          <div>
            <h2 className="text-white font-semibold text-sm">{tr.flights}</h2>
            <p className="text-gray-500 text-xs">{tr.flightsDesc}</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} />
      </div>

      {/* Collapsed preview */}
      {collapsed && (
        <div className="px-5 py-3 flex items-center gap-3">
          <Plane className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <span className="text-gray-400 text-xs">FlightRadar24 · Google Flights · Skyscanner & more</span>
        </div>
      )}

      {/* Expanded content */}
      {!collapsed && (
        <div className="p-5">
          <div className="bg-gray-950 rounded-xl p-4 mb-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-gray-500 text-xs mb-1 block">{tr.departure}</label>
                <input
                  type="text"
                  value={from}
                  onChange={e => setFrom(e.target.value)}
                  placeholder="LHR, JFK..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs mb-1 block">{tr.destination}</label>
                <input
                  type="text"
                  value={to}
                  onChange={e => setTo(e.target.value)}
                  placeholder="DXB, CDG..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 mb-3"
            />
            <button
              onClick={handleSearch}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg text-sm transition flex items-center justify-center gap-2"
            >
              <Plane className="w-4 h-4" />
              {tr.searchFlights}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map(link => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 transition group"
              >
                <div>
                  <div className="text-white text-sm font-medium group-hover:text-cyan-300 transition">{link.label}</div>
                  <div className="text-gray-500 text-xs">{link.desc}</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400" />
              </a>
            ))}
          </div>

          <div className="mt-4 rounded-xl overflow-hidden border border-gray-700">
            <iframe
              src="https://www.flightradar24.com/simple"
              className="w-full h-64"
              frameBorder="0"
              title="Flight Radar"
            />
          </div>
        </div>
      )}
    </div>
  )
}
