'use client'

import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, LocateFixed, MapPin, RefreshCw, Search, SlidersHorizontal } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'
import { useLang } from '@/lib/LanguageContext'

type Category = {
  id: string
  emoji: string
  label: Record<string, string>
  queries: string[]
}

type Place = {
  id: string
  name: string
  category: string
  categoryLabel: string
  lat: number
  lon: number
  distanceKm: number
  tags?: Record<string, string>
}

type OverpassElement = {
  type: string
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}

const radiusOptions = [1, 2, 3, 5, 10, 15, 25, 50]

const categories: Category[] = [
  { id: 'family_fun', emoji: '🎡', label: { en: 'Family fun', az: 'Ailə üçün əyləncə', ru: 'Семейные развлечения' }, queries: ['[tourism="theme_park"]', '[tourism="zoo"]', '[leisure="playground"]', '[leisure="amusement_arcade"]'] },
  { id: 'restaurant', emoji: '🍽️', label: { en: 'Restaurants', az: 'Restoranlar', ru: 'Рестораны' }, queries: ['[amenity="restaurant"]', '[amenity="cafe"]', '[amenity="fast_food"]'] },
  { id: 'grocery', emoji: '🛒', label: { en: 'Market / grocery', az: 'Market / grocery', ru: 'Продукты' }, queries: ['[shop="supermarket"]', '[shop="convenience"]', '[shop="grocery"]'] },
  { id: 'car_wash', emoji: '🚿', label: { en: 'Car wash', az: 'Avto yuma', ru: 'Автомойка' }, queries: ['[amenity="car_wash"]'] },
  { id: 'car_repair', emoji: '🔧', label: { en: 'Auto mechanic', az: 'Avto mühəndis / usta', ru: 'Автосервис' }, queries: ['[shop="car_repair"]', '[shop="tyres"]', '[craft="mechanic"]'] },
  { id: 'fuel', emoji: '⛽', label: { en: 'Gas station', az: 'Yanacaqdoldurma', ru: 'АЗС' }, queries: ['[amenity="fuel"]'] },
  { id: 'shopping', emoji: '🛍️', label: { en: 'Shopping centers', az: 'Ticarət mərkəzləri', ru: 'ТЦ' }, queries: ['[shop="mall"]', '[building="retail"]'] },
  { id: 'hotel', emoji: '🏨', label: { en: 'Hotels', az: 'Hotellər', ru: 'Отели' }, queries: ['[tourism="hotel"]', '[tourism="guest_house"]', '[tourism="hostel"]'] },
  { id: 'school', emoji: '🏫', label: { en: 'Schools', az: 'Məktəblər', ru: 'Школы' }, queries: ['[amenity="school"]'] },
  { id: 'kindergarten', emoji: '🧸', label: { en: 'Kindergarten', az: 'Bağça', ru: 'Детский сад' }, queries: ['[amenity="kindergarten"]', '[amenity="childcare"]'] },
  { id: 'parks', emoji: '🌳', label: { en: 'Parks', az: 'Parklar', ru: 'Парки' }, queries: ['[leisure="park"]', '[leisure="garden"]'] },
  { id: 'pool', emoji: '🏊', label: { en: 'Swimming pools', az: 'Basseyn', ru: 'Бассейны' }, queries: ['[leisure="swimming_pool"]', '[amenity="swimming_pool"]', '[sport="swimming"]'] },
  { id: 'thermal', emoji: '♨️', label: { en: 'Thermal bath / spa', az: 'Thermo bad / spa', ru: 'Термы / спа' }, queries: ['[amenity="public_bath"]', '[leisure="spa"]', '[tourism="spa"]', '[leisure="water_park"]'] },
  { id: 'attractions', emoji: '📍', label: { en: 'Attractions', az: 'Attractions', ru: 'Достопримечательности' }, queries: ['[tourism="attraction"]', '[tourism="museum"]', '[historic]'] },
  { id: 'bars', emoji: '🍻', label: { en: 'Bars', az: 'Barlar', ru: 'Бары' }, queries: ['[amenity="bar"]', '[amenity="pub"]', '[amenity="biergarten"]'] },
  { id: 'atm', emoji: '🏧', label: { en: 'ATMs', az: 'ATM-lər', ru: 'Банкоматы' }, queries: ['[amenity="atm"]', '[amenity="bank"]'] },
  { id: 'car_rental', emoji: '🚗', label: { en: 'Car rental', az: 'Avtomobil icarəsi', ru: 'Прокат авто' }, queries: ['[amenity="car_rental"]'] },
  { id: 'parking', emoji: '🅿️', label: { en: 'Parking', az: 'Parking', ru: 'Парковка' }, queries: ['[amenity="parking"]', '[amenity="parking_entrance"]'] },
  { id: 'mail', emoji: '✉️', label: { en: 'Mail', az: 'Poçt', ru: 'Почта' }, queries: ['[amenity="post_office"]', '[amenity="post_box"]'] },
  { id: 'shipping', emoji: '📦', label: { en: 'Shipping', az: 'Shipping / paket', ru: 'Доставка / посылки' }, queries: ['[amenity="parcel_locker"]', '[shop="shipping"]', '[brand="DHL"]', '[brand="UPS"]'] },
  { id: 'hospital', emoji: '🏥', label: { en: 'Hospitals', az: 'Xəstəxanalar', ru: 'Больницы' }, queries: ['[amenity="hospital"]', '[amenity="clinic"]'] },
  { id: 'praxis', emoji: '🩺', label: { en: 'Praxis / doctors', az: 'Praxis / həkim', ru: 'Врачи / Praxis' }, queries: ['[amenity="doctors"]', '[amenity="dentist"]', '[healthcare="doctor"]'] },
  { id: 'home_garden', emoji: '🪴', label: { en: 'Home & garden stuff', az: 'Ev və bağ məhsulları', ru: 'Дом и сад' }, queries: ['[shop="garden_centre"]', '[shop="doityourself"]', '[shop="hardware"]'] },
  { id: 'furniture', emoji: '🛋️', label: { en: 'Furniture', az: 'Mebel', ru: 'Мебель' }, queries: ['[shop="furniture"]'] },
]

function localLabel(label: Record<string, string>, lang: string) {
  return label[lang] || label.en
}

function distanceKm(aLat: number, aLon: number, bLat: number, bLon: number) {
  const r = 6371
  const dLat = ((bLat - aLat) * Math.PI) / 180
  const dLon = ((bLon - aLon) * Math.PI) / 180
  const lat1 = (aLat * Math.PI) / 180
  const lat2 = (bLat * Math.PI) / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return 2 * r * Math.asin(Math.sqrt(h))
}

function buildOverpassQuery(selected: Category[], radiusKm: number, lat: number, lon: number) {
  const radiusMeters = Math.round(radiusKm * 1000)
  const lines = selected.flatMap(category =>
    category.queries.flatMap(selector => [
      `node(around:${radiusMeters},${lat},${lon})${selector};`,
      `way(around:${radiusMeters},${lat},${lon})${selector};`,
      `relation(around:${radiusMeters},${lat},${lon})${selector};`,
    ])
  )

  return `[out:json][timeout:25];(${lines.join('')});out center tags 80;`
}

export default function NearbyPage() {
  const { lang } = useLang()
  const [radiusKm, setRadiusKm] = useState(5)
  const [selectedIds, setSelectedIds] = useState<string[]>(['family_fun', 'restaurant', 'grocery', 'parks'])
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedCategories = useMemo(
    () => categories.filter(category => selectedIds.includes(category.id)),
    [selectedIds]
  )

  const toggleCategory = (id: string) => {
    setSelectedIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  }

  const findLocation = () => {
    setError('')
    if (!navigator.geolocation) {
      setError('Your browser does not support geolocation.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        setLocation({ lat: position.coords.latitude, lon: position.coords.longitude })
      },
      () => setError('Location permission was denied. Please allow location access and try again.'),
      { enableHighAccuracy: true, timeout: 15000 }
    )
  }

  const searchNearby = async () => {
    if (!location) {
      findLocation()
      return
    }

    if (selectedCategories.length === 0) {
      setError('Please select at least one category.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: new URLSearchParams({ data: buildOverpassQuery(selectedCategories, radiusKm, location.lat, location.lon) }),
      })

      if (!response.ok) throw new Error('Overpass request failed')

      const data = await response.json()
      const mapped: Place[] = (data.elements as OverpassElement[])
        .map(element => {
          const lat = element.lat ?? element.center?.lat
          const lon = element.lon ?? element.center?.lon
          if (!lat || !lon) return null

          const matchedCategory = selectedCategories.find(category =>
            category.queries.some(selector => {
              const match = selector.match(/\[([^=\]]+)(?:="?([^"\]]+)"?)?\]/)
              if (!match || !element.tags) return false
              const [, key, value] = match
              return value ? element.tags[key] === value : key in element.tags
            })
          ) || selectedCategories[0]

          const name = element.tags?.name || element.tags?.brand || localLabel(matchedCategory.label, lang)

          return {
            id: `${element.type}-${element.id}`,
            name,
            category: matchedCategory.id,
            categoryLabel: `${matchedCategory.emoji} ${localLabel(matchedCategory.label, lang)}`,
            lat,
            lon,
            distanceKm: distanceKm(location.lat, location.lon, lat, lon),
            tags: element.tags,
          }
        })
        .filter(Boolean)
        .filter((place: Place) => place.distanceKm <= radiusKm)
        .sort((a: Place, b: Place) => a.distanceKm - b.distanceKm)
        .slice(0, 80)

      setPlaces(mapped as Place[])
    } catch {
      setError('Could not load nearby places. Try again or reduce selected categories/radius.')
    } finally {
      setLoading(false)
    }
  }

  const mapUrl = location
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${location.lon - 0.08}%2C${location.lat - 0.05}%2C${location.lon + 0.08}%2C${location.lat + 0.05}&layer=mapnik&marker=${location.lat}%2C${location.lon}`
    : 'https://www.openstreetmap.org/export/embed.html?bbox=8.55%2C50.07%2C8.77%2C50.18&layer=mapnik'

  const markerStyle = (place: Place): CSSProperties => {
    if (!location) return { left: '50%', top: '50%' }
    const eastKm = (place.lon - location.lon) * 111.32 * Math.cos((location.lat * Math.PI) / 180)
    const northKm = (place.lat - location.lat) * 110.574
    const x = 50 + (eastKm / radiusKm) * 45
    const y = 50 - (northKm / radiusKm) * 45
    return { left: `${Math.max(4, Math.min(96, x))}%`, top: `${Math.max(4, Math.min(96, y))}%` }
  }

  return (
    <div className="min-h-screen relative z-[1] w-full">
      <Header />
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-indigo-300 hover:text-indigo-200 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>

        <section className="rounded-2xl border border-white/[0.06] bg-[#0a0a10]/80 p-4 sm:p-6 mb-5 overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-400/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">Nearby Places</h1>
                  <p className="text-sm text-[#8b8b9e]">Choose km radius and categories. The circle shows your selected distance in every direction.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={findLocation} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm hover:bg-white/[0.08] transition">
                <LocateFixed className="w-4 h-4" /> Use my location
              </button>
              <button onClick={searchNearby} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-400 disabled:opacity-60 transition">
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Search nearby
              </button>
            </div>
          </div>

          {location && (
            <p className="mt-4 text-xs text-emerald-300">Location ready: {location.lat.toFixed(5)}, {location.lon.toFixed(5)}</p>
          )}
          {error && <p className="mt-4 text-xs text-red-300">{error}</p>}
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-5">
          <aside className="space-y-5">
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a10]/80 p-4">
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal className="w-4 h-4 text-indigo-300" />
                <h2 className="text-white font-semibold text-sm">Radius</h2>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {radiusOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => setRadiusKm(option)}
                    className={`px-3 py-2 rounded-xl text-sm border transition ${radiusKm === option ? 'bg-indigo-500 text-white border-indigo-300/40' : 'bg-white/[0.03] text-[#d8d8e8] border-white/[0.06] hover:bg-white/[0.06]'}`}
                  >
                    {option} km
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#8b8b9e] mt-3">Circle diameter on map: {radiusKm * 2} km.</p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a10]/80 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-semibold text-sm">Categories</h2>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedIds(categories.map(item => item.id))} className="text-[11px] text-indigo-300 hover:text-indigo-200">All</button>
                  <button onClick={() => setSelectedIds([])} className="text-[11px] text-[#8b8b9e] hover:text-white">Clear</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2 max-h-[520px] overflow-y-auto pr-1">
                {categories.map(category => {
                  const selected = selectedIds.includes(category.id)
                  return (
                    <button
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={`text-left px-3 py-2 rounded-xl border text-sm transition ${selected ? 'bg-indigo-500/15 border-indigo-400/30 text-white' : 'bg-white/[0.02] border-white/[0.05] text-[#d8d8e8] hover:bg-white/[0.05]'}`}
                    >
                      <span className="mr-2">{category.emoji}</span>
                      {localLabel(category.label, lang)}
                    </button>
                  )
                })}
              </div>
            </div>
          </aside>

          <section className="space-y-5">
            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a10]/80 overflow-hidden">
              <div className="relative h-[460px] bg-[#101018]">
                <iframe title="Nearby map" src={mapUrl} className="absolute inset-0 w-full h-full opacity-70" />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute left-1/2 top-1/2 w-[90%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-indigo-300/80 bg-indigo-500/10 shadow-[0_0_80px_rgba(99,102,241,0.35)]" />
                  <div className="absolute left-1/2 top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 border-2 border-white shadow-lg" />
                  {places.map(place => (
                    <div key={place.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={markerStyle(place)} title={place.name}>
                      <div className="w-3 h-3 rounded-full bg-rose-400 border border-white shadow-lg" />
                    </div>
                  ))}
                </div>
                <div className="absolute left-4 bottom-4 rounded-xl bg-[#050509]/80 border border-white/[0.08] px-3 py-2 text-xs text-white backdrop-blur">
                  Radius: {radiusKm} km · Diameter: {radiusKm * 2} km · Results: {places.length}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a10]/80 p-4">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-white font-semibold">Results</h2>
                <span className="text-xs text-[#8b8b9e]">Nearest first</span>
              </div>

              {places.length === 0 ? (
                <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-6 text-center">
                  <p className="text-white text-sm font-medium">No places loaded yet.</p>
                  <p className="text-[#8b8b9e] text-xs mt-1">Click “Use my location”, choose categories and press “Search nearby”.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {places.map(place => {
                    const mapsQuery = encodeURIComponent(`${place.name} ${place.categoryLabel} near ${place.lat},${place.lon}`)
                    return (
                      <div key={place.id} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                        <p className="text-white text-sm font-medium line-clamp-1">{place.name}</p>
                        <p className="text-[#8b8b9e] text-xs mt-1">{place.categoryLabel} · {place.distanceKm.toFixed(2)} km away</p>
                        {place.tags?.['addr:street'] && (
                          <p className="text-[#6b6b80] text-[11px] mt-1 line-clamp-1">{place.tags['addr:street']} {place.tags['addr:housenumber'] || ''}</p>
                        )}
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-indigo-300 hover:text-indigo-200 mt-3"
                        >
                          Open in Google Maps <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}
