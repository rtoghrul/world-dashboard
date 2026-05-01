'use client'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { Wind, Droplets, MapPin, ChevronDown, ChevronUp } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const LOCATIONS = [
  { id: 'auto', name: 'Auto', country: '', lat: 0, lon: 0, tz: '' },
  { id: 'baku', name: 'Baku', country: 'AZ', lat: 40.41, lon: 49.87, tz: 'Asia/Baku' },
  { id: 'istanbul', name: 'Istanbul', country: 'TR', lat: 41.01, lon: 28.98, tz: 'Europe/Istanbul' },
  { id: 'frankfurt', name: 'Frankfurt', country: 'DE', lat: 50.11, lon: 8.68, tz: 'Europe/Berlin' },
  { id: 'berlin', name: 'Berlin', country: 'DE', lat: 52.52, lon: 13.41, tz: 'Europe/Berlin' },
  { id: 'munich', name: 'Munich', country: 'DE', lat: 48.14, lon: 11.58, tz: 'Europe/Berlin' },
  { id: 'london', name: 'London', country: 'UK', lat: 51.51, lon: -0.13, tz: 'Europe/London' },
  { id: 'paris', name: 'Paris', country: 'FR', lat: 48.86, lon: 2.35, tz: 'Europe/Paris' },
  { id: 'moscow', name: 'Moscow', country: 'RU', lat: 55.76, lon: 37.62, tz: 'Europe/Moscow' },
  { id: 'dubai', name: 'Dubai', country: 'AE', lat: 25.20, lon: 55.27, tz: 'Asia/Dubai' },
  { id: 'newyork', name: 'New York', country: 'US', lat: 40.71, lon: -74.01, tz: 'America/New_York' },
  { id: 'tokyo', name: 'Tokyo', country: 'JP', lat: 35.68, lon: 139.69, tz: 'Asia/Tokyo' },
  { id: 'antalya', name: 'Antalya', country: 'TR', lat: 36.90, lon: 30.69, tz: 'Europe/Istanbul' },
  { id: 'tbilisi', name: 'Tbilisi', country: 'GE', lat: 41.72, lon: 44.79, tz: 'Asia/Tbilisi' },
  { id: 'rome', name: 'Rome', country: 'IT', lat: 41.90, lon: 12.50, tz: 'Europe/Rome' },
  { id: 'madrid', name: 'Madrid', country: 'ES', lat: 40.42, lon: -3.70, tz: 'Europe/Madrid' },
  { id: 'vienna', name: 'Vienna', country: 'AT', lat: 48.21, lon: 16.37, tz: 'Europe/Vienna' },
  { id: 'cairo', name: 'Cairo', country: 'EG', lat: 30.04, lon: 31.24, tz: 'Africa/Cairo' },
  { id: 'bangkok', name: 'Bangkok', country: 'TH', lat: 13.76, lon: 100.50, tz: 'Asia/Bangkok' },
  { id: 'amsterdam', name: 'Amsterdam', country: 'NL', lat: 52.37, lon: 4.90, tz: 'Europe/Amsterdam' },
]

function icon(code: number): string {
  if (code === 0) return '\u2600\ufe0f'
  if (code <= 2) return '\ud83c\udf24\ufe0f'
  if (code === 3) return '\u2601\ufe0f'
  if (code <= 48) return '\ud83c\udf2b\ufe0f'
  if (code <= 57) return '\ud83c\udf26\ufe0f'
  if (code <= 67) return '\ud83c\udf27\ufe0f'
  if (code <= 77) return '\u2744\ufe0f'
  if (code <= 82) return '\ud83c\udf26\ufe0f'
  if (code <= 86) return '\ud83c\udf28\ufe0f'
  return '\u26c8\ufe0f'
}

function desc(code: number, lang: string): string {
  const map: Record<string, Record<string, string>> = {
    clear: { az: 'A\u00e7\u0131q', en: 'Clear', ru: '\u042f\u0441\u043d\u043e', tr: 'A\u00e7\u0131k', de: 'Klar' },
    partlyCloudy: { az: 'Az buludlu', en: 'Partly cloudy', ru: '\u041e\u0431\u043b\u0430\u0447\u043d\u043e', tr: 'Par\u00e7al\u0131 bulutlu', de: 'Teilweise bew\u00f6lkt' },
    cloudy: { az: 'Buludlu', en: 'Cloudy', ru: '\u041f\u0430\u0441\u043c\u0443\u0440\u043d\u043e', tr: 'Bulutlu', de: 'Bew\u00f6lkt' },
    fog: { az: 'Dumanl\u0131', en: 'Foggy', ru: '\u0422\u0443\u043c\u0430\u043d', tr: 'Sisli', de: 'Neblig' },
    rain: { az: 'Ya\u011f\u0131\u015fl\u0131', en: 'Rainy', ru: '\u0414\u043e\u0436\u0434\u044c', tr: 'Ya\u011fmurlu', de: 'Regnerisch' },
    snow: { az: 'Qarl\u0131', en: 'Snowy', ru: '\u0421\u043d\u0435\u0433', tr: 'Karl\u0131', de: 'Schnee' },
    storm: { az: 'F\u0131rt\u0131nal\u0131', en: 'Stormy', ru: '\u0413\u0440\u043e\u0437\u0430', tr: 'F\u0131rt\u0131nal\u0131', de: 'St\u00fcrmisch' },
  }
  let key = 'clear'
  if (code <= 0) key = 'clear'
  else if (code <= 2) key = 'partlyCloudy'
  else if (code === 3) key = 'cloudy'
  else if (code <= 48) key = 'fog'
  else if (code <= 67) key = 'rain'
  else if (code <= 86) key = 'snow'
  else key = 'storm'
  return map[key]?.[lang] || map[key]?.en || 'Clear'
}

type HourData = { time: string; temp: number; code: number }
type DayData = { date: string; code: number; max: number; min: number }
type WData = { city: string; tz: string; temp: number; code: number; wind: number; humidity: number; hourly: HourData[]; daily: DayData[] }

export default function WeatherWidget() {
  const { lang } = useLang()
  const [w, setW] = useState<WData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [tab, setTab] = useState<'hours' | 'days'>('hours')
  const [locId, setLocId] = useState('auto')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [time, setTime] = useState('')

  const loc = useMemo(() => LOCATIONS.find(l => l.id === locId) || LOCATIONS[0], [locId])
  const tz = w?.tz || loc.tz || 'UTC'

  useEffect(() => {
    const tick = () => {
      try {
        setTime(new Date().toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit' }))
      } catch { setTime('') }
    }
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [tz])

  const fetchW = useCallback(async (lat: number, lon: number, city?: string) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code` +
        `&hourly=temperature_2m,weather_code` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
        `&timezone=auto&forecast_days=7&forecast_hours=12`
      )
      const d = await res.json()
      const cur = d.current
      setW({
        city: city || '...',
        tz: d.timezone || 'UTC',
        temp: Math.round(cur?.temperature_2m ?? cur?.temperature ?? 0),
        code: cur?.weather_code ?? cur?.weathercode ?? 0,
        wind: Math.round(cur?.wind_speed_10m ?? cur?.windspeed_10m ?? 0),
        humidity: cur?.relative_humidity_2m ?? cur?.relativehumidity_2m ?? 0,
        hourly: (d.hourly?.time || []).slice(0, 12).map((t: string, i: number) => ({
          time: t, temp: Math.round(d.hourly.temperature_2m[i]),
          code: d.hourly.weather_code?.[i] ?? d.hourly.weathercode?.[i] ?? 0,
        })),
        daily: (d.daily?.time || []).map((date: string, i: number) => ({
          date, code: d.daily.weather_code?.[i] ?? d.daily.weathercode?.[i] ?? 0,
          max: Math.round(d.daily.temperature_2m_max[i]),
          min: Math.round(d.daily.temperature_2m_min[i]),
        })),
      })
      setLoading(false)
    } catch { setLoading(false) }
  }, [])

  useEffect(() => {
    setLoading(true)
    if (locId !== 'auto') {
      fetchW(loc.lat, loc.lon, loc.name)
      return
    }
    if (!navigator.geolocation) {
      fetch('https://ipapi.co/json/').then(r => r.json()).then(d => {
        if (d.latitude) fetchW(d.latitude, d.longitude, d.city || 'Unknown')
        else setLoading(false)
      }).catch(() => setLoading(false))
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`, { headers: { 'User-Agent': 'WD/1' } })
          .then(r => r.json())
          .then(g => fetchW(coords.latitude, coords.longitude, g?.address?.city || g?.address?.town || 'Unknown'))
          .catch(() => fetchW(coords.latitude, coords.longitude, 'Unknown'))
      },
      () => {
        fetch('https://ipapi.co/json/').then(r => r.json()).then(d => {
          if (d.latitude) fetchW(d.latitude, d.longitude, d.city || 'Unknown')
          else setLoading(false)
        }).catch(() => setLoading(false))
      },
      { timeout: 5000 }
    )
  }, [locId, fetchW, loc.lat, loc.lon, loc.name])

  if (loading && !w) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-800" />
          <div className="flex-1 space-y-2"><div className="h-3 bg-gray-800 rounded w-24" /><div className="h-2 bg-gray-800 rounded w-16" /></div>
        </div>
      </div>
    )
  }
  if (!w) return null

  const locale = lang === 'az' ? 'az-AZ' : lang === 'ru' ? 'ru-RU' : lang === 'tr' ? 'tr-TR' : lang === 'de' ? 'de-DE' : 'en-US'

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Collapsed header */}
      <button onClick={() => setExpanded(e => !e)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800/40 transition text-left">
        <span className="text-3xl leading-none">{icon(w.code)}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-white text-xl font-bold">{w.temp}\u00b0</span>
            <span className="text-gray-400 text-xs">{desc(w.code, lang)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 text-[11px] mt-0.5">
            <MapPin className="w-3 h-3" />
            <span>{w.city}</span>
            {time && <><span>\u00b7</span><span>{time}</span></>}
          </div>
        </div>
        <div className="flex items-center gap-3 text-gray-500 text-[11px]">
          <span className="flex items-center gap-1"><Wind className="w-3 h-3" />{w.wind}</span>
          <span className="flex items-center gap-1"><Droplets className="w-3 h-3" />{w.humidity}%</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-800">
          {/* Location selector */}
          <div className="px-4 py-2.5 flex items-center justify-between">
            <div className="relative">
              <button onClick={() => setPickerOpen(p => !p)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs text-gray-300 hover:text-white hover:border-gray-600 transition">
                <MapPin className="w-3 h-3" />
                {locId === 'auto' ? `Auto (${w.city})` : loc.name}
                <ChevronUp className={`w-3 h-3 transition ${pickerOpen ? '' : 'rotate-180'}`} />
              </button>
              {pickerOpen && (
                <div className="absolute top-full left-0 mt-1 z-20 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-2 grid grid-cols-2 gap-1 w-64 max-h-60 overflow-y-auto">
                  {LOCATIONS.map(l => (
                    <button key={l.id} onClick={() => { setLocId(l.id); setPickerOpen(false) }}
                      className={`text-left px-2 py-1.5 rounded text-xs transition ${locId === l.id ? 'bg-blue-500/20 text-blue-300' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                      {l.name} {l.country && <span className="text-gray-600">{l.country}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Tab toggle */}
            <div className="flex gap-1 bg-gray-800 rounded-lg p-0.5">
              <button onClick={() => setTab('hours')} className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${tab === 'hours' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>12h</button>
              <button onClick={() => setTab('days')} className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${tab === 'days' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>7d</button>
            </div>
          </div>

          {/* Hourly */}
          {tab === 'hours' && (
            <div className="overflow-x-auto border-t border-gray-800/50">
              <div className="flex px-2 py-3 gap-0.5 min-w-max">
                {w.hourly.map((h, i) => {
                  const hr = new Date(h.time).toLocaleTimeString(locale, { timeZone: tz, hour: '2-digit', minute: '2-digit' })
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 w-14 py-1.5 rounded-lg hover:bg-gray-800/50">
                      <span className="text-gray-500 text-[10px]">{hr}</span>
                      <span className="text-lg leading-none">{icon(h.code)}</span>
                      <span className="text-white text-xs font-medium">{h.temp}\u00b0</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Daily */}
          {tab === 'days' && (
            <div className="border-t border-gray-800/50">
              {w.daily.map((day, i) => {
                const d = new Date(day.date + 'T12:00:00')
                const label = i === 0 ? (lang === 'az' ? 'Bu g\u00fcn' : lang === 'ru' ? '\u0421\u0435\u0433\u043e\u0434\u043d\u044f' : lang === 'tr' ? 'Bug\u00fcn' : lang === 'de' ? 'Heute' : 'Today') : d.toLocaleDateString(locale, { weekday: 'short' })
                return (
                  <div key={day.date} className="flex items-center px-4 py-2 hover:bg-gray-800/30 transition">
                    <span className="text-gray-400 text-xs w-12">{label}</span>
                    <span className="text-base w-8 text-center">{icon(day.code)}</span>
                    <div className="flex-1 mx-3">
                      <div className="h-1 rounded-full bg-gray-800 relative overflow-hidden">
                        <div className="absolute inset-y-0 bg-gradient-to-r from-blue-500 to-orange-400 rounded-full" style={{ left: '10%', right: '10%' }} />
                      </div>
                    </div>
                    <span className="text-gray-500 text-xs w-8 text-right">{day.min}\u00b0</span>
                    <span className="text-white text-xs font-medium w-8 text-right">{day.max}\u00b0</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
