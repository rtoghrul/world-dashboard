'use client'

import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, LocateFixed, MapPin, RefreshCw, Search } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'

type Cat = { id: string; e: string; n: string; q: string[] }
type Osm = { type: string; id: number; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> }
type Place = { id: string; name: string; e: string; cat: string; lat: number; lon: number; d: number; tags?: Record<string, string> }

const START = { lat: 50.1109, lon: 8.6821 }
const radii = [1, 2, 3, 5, 10, 15, 25, 50]
const endpoints = ['https://overpass.kumi.systems/api/interpreter', 'https://overpass-api.de/api/interpreter']
const cats: Cat[] = [
  { id: 'family', e: '🎡', n: 'Ailə üçün əyləncə', q: ['tourism=theme_park', 'tourism=zoo', 'leisure=playground', 'leisure=amusement_arcade'] },
  { id: 'restaurant', e: '🍽️', n: 'Restoranlar', q: ['amenity=restaurant', 'amenity=cafe', 'amenity=fast_food'] },
  { id: 'grocery', e: '🛒', n: 'Market / grocery', q: ['shop=supermarket', 'shop=convenience', 'shop=grocery'] },
  { id: 'wash', e: '🚿', n: 'Avto yuma', q: ['amenity=car_wash'] },
  { id: 'mechanic', e: '🔧', n: 'Avto usta', q: ['shop=car_repair', 'shop=tyres', 'craft=mechanic'] },
  { id: 'fuel', e: '⛽', n: 'Gas station', q: ['amenity=fuel'] },
  { id: 'mall', e: '🛍️', n: 'Ticarət mərkəzləri', q: ['shop=mall', 'building=retail'] },
  { id: 'hotel', e: '🏨', n: 'Hotel', q: ['tourism=hotel', 'tourism=guest_house', 'tourism=hostel'] },
  { id: 'school', e: '🏫', n: 'Məktəb', q: ['amenity=school'] },
  { id: 'kindergarten', e: '🧸', n: 'Bağça', q: ['amenity=kindergarten', 'amenity=childcare'] },
  { id: 'park', e: '🌳', n: 'Parklar', q: ['leisure=park', 'leisure=garden'] },
  { id: 'pool', e: '🏊', n: 'Basseyn', q: ['leisure=swimming_pool', 'amenity=swimming_pool', 'sport=swimming'] },
  { id: 'thermal', e: '♨️', n: 'Thermo bad / spa', q: ['amenity=public_bath', 'leisure=spa', 'tourism=spa', 'leisure=water_park'] },
  { id: 'attraction', e: '📍', n: 'Attractions', q: ['tourism=attraction', 'tourism=museum', 'historic'] },
  { id: 'bar', e: '🍻', n: 'Bars', q: ['amenity=bar', 'amenity=pub', 'amenity=biergarten'] },
  { id: 'atm', e: '🏧', n: 'ATMs', q: ['amenity=atm', 'amenity=bank'] },
  { id: 'rental', e: '🚗', n: 'Car rental', q: ['amenity=car_rental'] },
  { id: 'parking', e: '🅿️', n: 'Parking', q: ['amenity=parking', 'amenity=parking_entrance'] },
  { id: 'mail', e: '✉️', n: 'Mail / poçt', q: ['amenity=post_office', 'amenity=post_box'] },
  { id: 'shipping', e: '📦', n: 'Shipping', q: ['amenity=parcel_locker', 'shop=shipping'] },
  { id: 'hospital', e: '🏥', n: 'Hospitals', q: ['amenity=hospital', 'amenity=clinic'] },
  { id: 'praxis', e: '🩺', n: 'Praxis / doctor', q: ['amenity=doctors', 'amenity=dentist', 'healthcare=doctor'] },
  { id: 'garden', e: '🪴', n: 'Home & garden', q: ['shop=garden_centre', 'shop=doityourself', 'shop=hardware'] },
  { id: 'furniture', e: '🛋️', n: 'Furniture', q: ['shop=furniture'] },
]

function dist(aLat: number, aLon: number, bLat: number, bLon: number) { const r = 6371, dLat = (bLat - aLat) * Math.PI / 180, dLon = (bLon - aLon) * Math.PI / 180; const x = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * Math.PI / 180) * Math.cos(bLat * Math.PI / 180) * Math.sin(dLon / 2) ** 2; return 2 * r * Math.asin(Math.sqrt(x)) }
function filter(q: string) { const [k, v] = q.split('='); return v ? `[${k}="${v}"]` : `[${k}]` }
function match(q: string, tags?: Record<string, string>) { if (!tags) return false; const [k, v] = q.split('='); return v ? tags[k] === v : k in tags }
function buildQuery(selected: Cat[], radius: number, lat: number, lon: number) { const r = Math.round(radius * 1000); const lines = selected.flatMap(c => c.q.flatMap(q => [`node(around:${r},${lat},${lon})${filter(q)};`, `way(around:${r},${lat},${lon})${filter(q)};`, `relation(around:${r},${lat},${lon})${filter(q)};`])).join(''); return `[out:json][timeout:35];(${lines});out center tags 120;` }

export default function NearbyPage() {
  const [radius, setRadius] = useState(5)
  const [selected, setSelected] = useState(['family', 'restaurant', 'grocery', 'park'])
  const [loc, setLoc] = useState<{ lat: number; lon: number } | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const selectedCats = useMemo(() => cats.filter(c => selected.includes(c.id)), [selected])

  async function load(at = loc || START) {
    if (!selectedCats.length) { setMsg('Ən azı 1 kateqoriya seç.'); return }
    setLoading(true); setMsg('Searching...')
    const q = buildQuery(selectedCats, radius, at.lat, at.lon)
    try {
      let data: { elements?: Osm[] } | null = null
      for (const url of endpoints) {
        try {
          const res = await fetch(url, { method: 'POST', body: new URLSearchParams({ data: q }) })
          if (res.ok) { data = await res.json(); break }
        } catch {}
      }
      if (!data) throw new Error('all endpoints failed')
      const out = (data.elements || []).map(e => {
        const lat = e.lat ?? e.center?.lat, lon = e.lon ?? e.center?.lon
        if (!lat || !lon) return null
        const cat = selectedCats.find(c => c.q.some(x => match(x, e.tags))) || selectedCats[0]
        return { id: `${e.type}-${e.id}`, name: e.tags?.name || e.tags?.brand || cat.n, e: cat.e, cat: cat.n, lat, lon, d: dist(at.lat, at.lon, lat, lon), tags: e.tags }
      }).filter((p: Place | null): p is Place => !!p && p.d <= radius).sort((a, b) => a.d - b.d).slice(0, 80)
      setPlaces(out); setMsg(out.length ? `${out.length} yer tapıldı.` : 'Heç nə tapılmadı. Radiusu artır və ya daha çox kateqoriya seç.')
    } catch { setMsg('API busy/bloklandı. Yenidən yoxla və ya radiusu azald.') }
    finally { setLoading(false) }
  }

  function useMyLocation() {
    setMsg('Location alınır...')
    if (!navigator.geolocation) { setLoc(START); load(START); return }
    navigator.geolocation.getCurrentPosition(p => { const next = { lat: p.coords.latitude, lon: p.coords.longitude }; setLoc(next); load(next) }, () => { setLoc(START); setMsg('Location icazəsi yoxdur. Frankfurt default açıldı.'); load(START) }, { enableHighAccuracy: true, timeout: 12000 })
  }

  const center = loc || START
  const latD = Math.max(0.01, radius / 110.574) * 1.25
  const lonD = Math.max(0.01, radius / (111.32 * Math.cos(center.lat * Math.PI / 180))) * 1.25
  const map = `https://www.openstreetmap.org/export/embed.html?bbox=${center.lon - lonD}%2C${center.lat - latD}%2C${center.lon + lonD}%2C${center.lat + latD}&layer=mapnik&marker=${center.lat}%2C${center.lon}`
  const pin = (p: Place): CSSProperties => { const x = 50 + (((p.lon - center.lon) * 111.32 * Math.cos(center.lat * Math.PI / 180)) / radius) * 42; const y = 50 - (((p.lat - center.lat) * 110.574) / radius) * 42; return { left: `${Math.max(7, Math.min(93, x))}%`, top: `${Math.max(7, Math.min(93, y))}%` } }

  return <div className="min-h-screen relative z-[1] w-full"><Header /><main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full"><Link href="/" className="inline-flex items-center gap-2 text-xs text-indigo-300 hover:text-indigo-200 mb-4"><ArrowLeft className="w-4 h-4" />Back to dashboard</Link><section className="rounded-2xl border border-white/[0.06] bg-[#0a0a10]/80 p-4 sm:p-6 mb-5"><div className="flex flex-col lg:flex-row justify-between gap-4"><div className="flex gap-3"><div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-400/20 flex items-center justify-center"><MapPin className="w-5 h-5 text-indigo-300" /></div><div><h1 className="text-2xl sm:text-3xl font-bold text-white">Nearby Places</h1><p className="text-sm text-[#8b8b9e]">Radius {radius} km · diameter {radius * 2} km</p></div></div><div className="flex flex-wrap gap-2"><button onClick={useMyLocation} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm"><LocateFixed className="w-4 h-4" />Use my location & search</button><button onClick={() => load()} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium disabled:opacity-60">{loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}Search</button></div></div>{msg && <p className="mt-4 text-xs text-emerald-300">{msg}</p>}</section><div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-5"><aside className="space-y-5"><div className="rounded-2xl border border-white/[0.06] bg-[#0a0a10]/80 p-4"><h2 className="text-white font-semibold text-sm mb-3">Radius</h2><div className="grid grid-cols-4 gap-2">{radii.map(r => <button key={r} onClick={() => setRadius(r)} className={`px-3 py-2 rounded-xl text-sm border ${radius === r ? 'bg-indigo-500 text-white border-indigo-300/40' : 'bg-white/[0.03] text-[#d8d8e8] border-white/[0.06]'}`}>{r} km</button>)}</div></div><div className="rounded-2xl border border-white/[0.06] bg-[#0a0a10]/80 p-4"><div className="flex justify-between mb-3"><h2 className="text-white font-semibold text-sm">Categories</h2><div className="flex gap-2"><button onClick={() => setSelected(cats.map(c => c.id))} className="text-[11px] text-indigo-300">All</button><button onClick={() => setSelected([])} className="text-[11px] text-[#8b8b9e]">Clear</button></div></div><div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2 max-h-[520px] overflow-y-auto pr-1">{cats.map(c => { const on = selected.includes(c.id); return <button key={c.id} onClick={() => setSelected(s => on ? s.filter(x => x !== c.id) : [...s, c.id])} className={`text-left px-3 py-2 rounded-xl border text-sm ${on ? 'bg-indigo-500/15 border-indigo-400/30 text-white' : 'bg-white/[0.02] border-white/[0.05] text-[#d8d8e8]'}`}><span className="mr-2">{c.e}</span>{c.n}</button> })}</div></div></aside><section className="space-y-5"><div className="rounded-2xl border border-white/[0.06] bg-[#0a0a10]/80 overflow-hidden"><div className="relative h-[520px] bg-[#101018]"><iframe title="Nearby map" src={map} className="absolute inset-0 w-full h-full opacity-80" /><div className="absolute inset-0 pointer-events-none"><div className="absolute left-1/2 top-1/2 w-[84%] max-w-[460px] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-emerald-300 bg-emerald-400/10 shadow-[0_0_90px_rgba(16,185,129,0.45)]" /><div className="absolute left-1/2 top-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 border-4 border-white shadow-xl" />{places.map(p => <div key={p.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={pin(p)}><div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-500 border-2 border-white shadow-xl text-sm">{p.e}</div></div>)}</div><div className="absolute left-4 bottom-4 rounded-xl bg-[#050509]/90 border border-white/[0.08] px-3 py-2 text-xs text-white">Radius: {radius} km · Diameter: {radius * 2} km · Results: {places.length}</div></div></div><div className="rounded-2xl border border-white/[0.06] bg-[#0a0a10]/80 p-4"><h2 className="text-white font-semibold mb-4">Results</h2>{places.length === 0 ? <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-6 text-center"><p className="text-white text-sm font-medium">No places loaded yet.</p><p className="text-[#8b8b9e] text-xs mt-1">Press “Use my location & search”.</p></div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{places.map(p => <div key={p.id} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3"><p className="text-white text-sm font-medium line-clamp-1">{p.e} {p.name}</p><p className="text-[#8b8b9e] text-xs mt-1">{p.cat} · {p.d.toFixed(2)} km away</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name} ${p.lat},${p.lon}`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-300 hover:text-indigo-200 mt-3">Open in Google Maps <ExternalLink className="w-3 h-3" /></a></div>)}</div>}</div></section></div></main><Footer /><MobileBottomNav /></div>
}
