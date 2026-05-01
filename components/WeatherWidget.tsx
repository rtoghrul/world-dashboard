'use client'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { Wind, Droplets, ChevronUp, ChevronDown, MapPin, Clock, Globe, Thermometer } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'
import SectionNews from './SectionNews'

const LOCALE_MAP: Record<string, string> = {
  en: 'en-US', az: 'az-AZ', ru: 'ru-RU', de: 'de-DE', tr: 'tr-TR',
  fr: 'fr-FR', es: 'es-ES', zh: 'zh-CN', ar: 'ar-SA', ja: 'ja-JP',
  it: 'it-IT', pt: 'pt-PT',
}

const LOCATIONS = [
  { id: 'auto', name: 'Auto (GPS/IP)', country: '', lat: 0, lon: 0, tz: 'Europe/Berlin' },
  { id: 'frankfurt', name: 'Frankfurt', country: 'Germany', lat: 50.11, lon: 8.68, tz: 'Europe/Berlin' },
  { id: 'berlin', name: 'Berlin', country: 'Germany', lat: 52.52, lon: 13.41, tz: 'Europe/Berlin' },
  { id: 'munich', name: 'Munich', country: 'Germany', lat: 48.14, lon: 11.58, tz: 'Europe/Berlin' },
  { id: 'baku', name: 'Baku', country: 'Azerbaijan', lat: 40.41, lon: 49.87, tz: 'Asia/Baku' },
  { id: 'istanbul', name: 'Istanbul', country: 'Turkey', lat: 41.01, lon: 28.98, tz: 'Europe/Istanbul' },
  { id: 'antalya', name: 'Antalya', country: 'Turkey', lat: 36.90, lon: 30.69, tz: 'Europe/Istanbul' },
  { id: 'moscow', name: 'Moscow', country: 'Russia', lat: 55.76, lon: 37.62, tz: 'Europe/Moscow' },
  { id: 'london', name: 'London', country: 'United Kingdom', lat: 51.51, lon: -0.13, tz: 'Europe/London' },
  { id: 'paris', name: 'Paris', country: 'France', lat: 48.86, lon: 2.35, tz: 'Europe/Paris' },
  { id: 'rome', name: 'Rome', country: 'Italy', lat: 41.90, lon: 12.50, tz: 'Europe/Rome' },
  { id: 'madrid', name: 'Madrid', country: 'Spain', lat: 40.42, lon: -3.70, tz: 'Europe/Madrid' },
  { id: 'dubai', name: 'Dubai', country: 'UAE', lat: 25.20, lon: 55.27, tz: 'Asia/Dubai' },
  { id: 'newyork', name: 'New York', country: 'USA', lat: 40.71, lon: -74.01, tz: 'America/New_York' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', lat: 35.68, lon: 139.69, tz: 'Asia/Tokyo' },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', lat: 30.04, lon: 31.24, tz: 'Africa/Cairo' },
  { id: 'tbilisi', name: 'Tbilisi', country: 'Georgia', lat: 41.72, lon: 44.79, tz: 'Asia/Tbilisi' },
  { id: 'vienna', name: 'Vienna', country: 'Austria', lat: 48.21, lon: 16.37, tz: 'Europe/Vienna' },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', lat: 52.37, lon: 4.90, tz: 'Europe/Amsterdam' },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', lat: 13.76, lon: 100.50, tz: 'Asia/Bangkok' },
]

function weatherIcon(code: number): string {
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

type HourForecast = { time: string; temp: number; code: number; rain: number }
type DayForecast = { date: string; code: number; max: number; min: number; rain: number }
type Weather = { city: string; country: string; tz: string; temp: number; code: number; wind: number; humidity: number; daily: DayForecast[]; hourly: HourForecast[] }

export default function WeatherWidget() {
  const { tr, lang } = useLang()
  const [weather, setWeather] = useState<Weather | null>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'hourly' | 'daily'>('hourly')
  const [selectedLocation, setSelectedLocation] = useState('auto')
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  const loc = useMemo(() => LOCATIONS.find(l => l.id === selectedLocation) || LOCATIONS[0], [selectedLocation])

  const tz = weather?.tz || loc.tz || 'Europe/Berlin'

  useEffect(() => {
    const update = () => {
      try {
        const now = new Date()
        setCurrentTime(now.toLocaleTimeString(LOCALE_MAP[lang] || 'en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      } catch { setCurrentTime('') }
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [tz, lang])

  const fetchWeather = useCallback(async (lat: number, lon: number, city?: string, country?: string) => {
    try {
      const [geoRes, wxRes] = await Promise.all([
        city ? Promise.resolve(null) :
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=${lang}`, {
            headers: { 'User-Agent': 'WorldDashboard/1.0' },
          }),
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code` +
          `&hourly=temperature_2m,weather_code,precipitation_probability` +
          `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
          `&timezone=auto&forecast_days=7&forecast_hours=24`
        ),
      ])
      const geo = geoRes ? await geoRes.json() : null
      const wx = await wxRes.json()
      const resolvedCity = city || geo?.address?.city || geo?.address?.town || geo?.address?.village || geo?.address?.county || '\u2014'
      const resolvedCountry = country || geo?.address?.country || ''
      const cur = wx.current
      const daily: DayForecast[] = (wx.daily?.time || []).map((date: string, i: number) => ({
        date,
        code: wx.daily.weather_code?.[i] ?? wx.daily.weathercode?.[i] ?? 0,
        max: Math.round(wx.daily.temperature_2m_max[i]),
        min: Math.round(wx.daily.temperature_2m_min[i]),
        rain: wx.daily.precipitation_probability_max[i] ?? 0,
      }))
      const hourly: HourForecast[] = (wx.hourly?.time || []).slice(0, 24).map((time: string, i: number) => ({
        time,
        temp: Math.round(wx.hourly.temperature_2m[i]),
        code: wx.hourly.weather_code?.[i] ?? wx.hourly.weathercode?.[i] ?? 0,
        rain: wx.hourly.precipitation_probability?.[i] ?? 0,
      }))
      const weatherCode = cur?.weather_code ?? cur?.weathercode ?? 0
      setWeather({
        city: resolvedCity,
        country: resolvedCountry,
        tz: wx.timezone || loc.tz || 'UTC',
        temp: Math.round(cur?.temperature_2m ?? 0),
        code: weatherCode,
        wind: Math.round(cur?.wind_speed_10m ?? cur?.windspeed_10m ?? 0),
        humidity: cur?.relative_humidity_2m ?? cur?.relativehumidity_2m ?? 0,
        daily,
        hourly,
      })
      setLoading(false)
    } catch { setLoading(false) }
  }, [lang, loc.tz])

  useEffect(() => {
    setLoading(true)

    if (selectedLocation !== 'auto') {
      fetchWeather(loc.lat, loc.lon, loc.name, loc.country)
      return
    }

    async function tryIpLocation() {
      try {
        const res = await fetch('https://ipapi.co/json/')
        const d = await res.json()
        if (d.latitude && d.longitude) {
          await fetchWeather(d.latitude, d.longitude, d.city, d.country_name)
        } else setLoading(false)
      } catch { setLoading(false) }
    }

    if (!navigator.geolocation) { tryIpLocation(); return }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => fetchWeather(coords.latitude, coords.longitude),
      () => tryIpLocation(),
      { timeout: 8000 }
    )
  }, [selectedLocation, fetchWeather])

  const locale = LOCALE_MAP[lang] || 'en-US'

  if (loading && !weather) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2 animate-pulse">
        <span className="text-lg">{'\ud83d\udccd'}</span>
        <span className="text-gray-500 text-xs">{tr.detectingLocation || 'Detecting location...'}</span>
      </div>
    )
  }

  if (!weather) return null

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-800/40 transition text-left">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl">{weatherIcon(weather.code)}</span>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold leading-none">{tr.weather || 'Weather'}: {weather.temp}\u00b0C</p>
            <p className="text-gray-400 text-xs mt-1 truncate">{weather.city}{weather.country ? `, ${weather.country}` : ''} \u00b7 {tr.wind || 'Wind'} {weather.wind} km/h \u00b7 {tr.humidity || 'Humidity'} {weather.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentTime && <span className="text-gray-500 text-xs font-mono hidden sm:block">{currentTime}</span>}
          <ChevronUp className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? '' : 'rotate-180'}`} />
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-800">
          {/* Location Selector */}
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm font-medium">{weather.city}</span>
                {weather.country && <span className="text-gray-500 text-xs">{weather.country}</span>}
              </div>
              <button onClick={() => setShowLocationPicker(p => !p)} className="px-2 py-1 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 text-xs hover:text-white hover:border-gray-600 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {selectedLocation === 'auto' ? 'Auto' : loc.name}
                <ChevronDown className={`w-3 h-3 transition ${showLocationPicker ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{currentTime || '--:--:--'}</span>
              <span className="text-gray-600">({tz.replace(/_/g, ' ')})</span>
            </div>
            {showLocationPicker && (
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-52 overflow-y-auto">
                {LOCATIONS.map(l => (
                  <button key={l.id} onClick={() => { setSelectedLocation(l.id); setShowLocationPicker(false) }}
                    className={`px-2 py-1.5 rounded-lg text-xs text-left transition ${selectedLocation === l.id ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300' : 'bg-gray-800 border border-gray-700/50 text-gray-400 hover:text-white hover:border-gray-600'}`}>
                    <span className="block font-medium">{l.name}</span>
                    {l.country && <span className="block text-[10px] text-gray-500 mt-0.5">{l.country}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Current */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{weatherIcon(weather.code)}</span>
              <span className="text-3xl font-bold text-white">{weather.temp}\u00b0C</span>
            </div>
            <div className="flex flex-col items-end gap-1 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Wind className="w-3 h-3" /> {weather.wind} km/h</span>
              <span className="flex items-center gap-1"><Droplets className="w-3 h-3" /> {weather.humidity}%</span>
            </div>
          </div>

          {/* View toggle */}
          <div className="px-4 py-2 border-b border-gray-800 flex gap-2">
            <button onClick={() => setView('hourly')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${view === 'hourly' ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}>
              <Clock className="w-3 h-3 inline mr-1" />Hourly (24h)
            </button>
            <button onClick={() => setView('daily')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${view === 'daily' ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'}`}>
              <Thermometer className="w-3 h-3 inline mr-1" />7 Days
            </button>
          </div>

          {/* Hourly Forecast */}
          {view === 'hourly' && (
            <div className="overflow-x-auto">
              <div className="flex min-w-max px-2 py-3 gap-1">
                {weather.hourly.map((h, i) => {
                  const hour = new Date(h.time).toLocaleTimeString(locale, { timeZone: tz, hour: '2-digit', minute: '2-digit' })
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg hover:bg-gray-800/50 min-w-[52px]">
                      <span className="text-gray-500 text-[10px]">{hour}</span>
                      <span className="text-base">{weatherIcon(h.code)}</span>
                      <span className="text-white text-xs font-medium">{h.temp}\u00b0</span>
                      {h.rain > 0 && <span className="text-blue-400 text-[9px]">{'\ud83d\udca7'}{h.rain}%</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Daily Forecast */}
          {view === 'daily' && (
            <div className="divide-y divide-gray-800/50">
              {weather.daily.map((day, i) => {
                const dateObj = new Date(day.date + 'T12:00:00')
                const label = i === 0
                  ? (tr.today || 'Today')
                  : dateObj.toLocaleDateString(locale, { weekday: 'short', day: 'numeric' })
                return (
                  <div key={day.date} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-800/30 transition">
                    <span className="text-gray-400 text-xs w-16">{label}</span>
                    <span className="text-lg">{weatherIcon(day.code)}</span>
                    <div className="flex items-center gap-3 text-xs">
                      {day.rain > 0 && <span className="text-blue-400">{'\ud83d\udca7'}{day.rain}%</span>}
                      <span className="text-white font-medium w-8 text-right">{day.max}\u00b0</span>
                      <span className="text-gray-500 w-8 text-right">{day.min}\u00b0</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Country-specific weather news */}
          <div className="px-4 pb-3">
            <SectionNews section="weather" tab="all" accentColor="blue" darkMode country={weather.country || weather.city} />
          </div>
        </div>
      )}
    </div>
  )
}
