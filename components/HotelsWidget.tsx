'use client'
import { useState } from 'react'
import { Building2, ExternalLink, ChevronDown } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

export default function HotelsWidget() {
  const { tr } = useLang()
  const [city, setCity] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [collapsed, setCollapsed] = useState(true)

  const handleBooking = (platform: string) => {
    const urls: Record<string, string> = {
      booking: `https://www.booking.com/search.html?ss=${encodeURIComponent(city)}&checkin=${checkIn}&checkout=${checkOut}`,
      airbnb: `https://www.airbnb.com/s/${encodeURIComponent(city)}/homes?checkin=${checkIn}&checkout=${checkOut}`,
      hotels: `https://www.hotels.com/search.do?destination-id=${encodeURIComponent(city)}&q-check-in=${checkIn}&q-check-out=${checkOut}`,
      expedia: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(city)}&startDate=${checkIn}&endDate=${checkOut}`,
    }
    window.open(urls[platform] || urls.booking, '_blank')
  }

  const platforms = [
    { id: 'booking', name: 'Booking.com', color: 'from-blue-600 to-blue-500' },
    { id: 'airbnb', name: 'Airbnb', color: 'from-rose-600 to-pink-500' },
    { id: 'hotels', name: 'Hotels.com', color: 'from-orange-600 to-amber-500' },
    { id: 'expedia', name: 'Expedia', color: 'from-yellow-600 to-yellow-500' },
  ]

  const popularCities = [
    { name: 'Dubai', emoji: '🇦🇪' },
    { name: 'Paris', emoji: '🇫🇷' },
    { name: 'Tokyo', emoji: '🇯🇵' },
    { name: 'New York', emoji: '🇺🇸' },
    { name: 'London', emoji: '🇬🇧' },
    { name: 'Istanbul', emoji: '🇹🇷' },
    { name: 'Baku', emoji: '🇦🇿' },
    { name: 'Barcelona', emoji: '🇪🇸' },
  ]

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-3 border-b border-gray-800 flex items-center justify-between cursor-pointer select-none hover:bg-gray-800/20 transition"
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-amber-400" />
          <div>
            <h2 className="text-white font-semibold text-sm">{tr.hotels}</h2>
            <p className="text-gray-500 text-xs">{tr.hotelsDesc}</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} />
      </div>

      {/* Collapsed preview */}
      {collapsed && (
        <div className="px-5 py-3 flex items-center gap-2 flex-wrap">
          {popularCities.slice(0, 4).map(c => (
            <span key={c.name} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-800 text-gray-400 text-xs border border-gray-700">
              {c.emoji} {c.name}
            </span>
          ))}
          <span className="text-gray-600 text-xs">& more</span>
        </div>
      )}

      {/* Expanded content */}
      {!collapsed && (
        <div className="p-5">
          <div className="bg-gray-950 rounded-xl p-4 mb-4">
            <div className="mb-3">
              <label className="text-gray-500 text-xs mb-1 block">{tr.destination}</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Dubai, Paris, Tokyo..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-gray-500 text-xs mb-1 block">{tr.checkIn}</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={e => setCheckIn(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs mb-1 block">{tr.checkOut}</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={e => setCheckOut(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleBooking(p.id)}
                  className={`bg-gradient-to-r ${p.color} text-white text-sm font-medium py-2 px-3 rounded-lg transition hover:opacity-90`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-xs mb-2">Popular destinations</p>
            <div className="flex flex-wrap gap-2">
              {popularCities.map(c => (
                <button
                  key={c.name}
                  onClick={() => setCity(c.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs transition border border-gray-700 hover:border-gray-500"
                >
                  <span>{c.emoji}</span>
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
