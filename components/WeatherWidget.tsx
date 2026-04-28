'use client'
import { useEffect, useState } from 'react'
import { Wind, Droplets, X, ChevronUp } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const LOCALE_MAP: Record<string, string> = {
  en: 'en-US', az: 'az-AZ', ru: 'ru-RU', de: 'de-DE', tr: 'tr-TR',
  fr: 'fr-FR', es: 'es-ES', zh: 'zh-CN', ar: 'ar-SA', ja: 'ja-JP',
  it: 'it-IT', pt: 'pt-PT',
}

function weatherIcon(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 2) return '🌤️'
  if (code === 3) return '☁️'
  if (code <= 48) return '🌫️'
  if (code <= 57) return '🌦️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '❄️'
  if (code <= 82) return '🌦️'
  if (code <= 86) return '🌨️'
  return '⛈️'
}

type DayForecast = {
  date: string
  code: number
  max: number
  min: number
  rain: number
}

type Weather = {
  city: string
  temp: number
  code: number
  wind: number
  humidity: number
  daily: DayForecast[]
}

export default function WeatherWidget() {
  const { tr, lang } = useLang()
  const [weather, setWeather] = useState<Weather | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setStatus('loading')

    async function fetchWeather(lat: number, lon: number, city?: string) {
      const [geoRes, wxRes] = await Promise.all([
        city ? Promise.resolve(null) :
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=${lang}`, {
            headers: { 'User-Agent': 'WorldDashboard/1.0' },
          }),
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,windspeed_10m,relativehumidity_2m,weathercode` +
          `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
          `&timezone=auto&forecast_days=7`
        ),
      ])
      const geo = geoRes ? await geoRes.json() : null
      const wx = await wxRes.json()
      const resolvedCity = city || geo?.address?.city || geo?.address?.town || geo?.address?.village || geo?.address?.county || '—'
      const cur = wx.current
      const daily: DayForecast[] = wx.daily.time.map((date: string, i: number) => ({
        date,
        code: wx.daily.weathercode[i],
        max: Math.round(wx.daily.temperature_2m_max[i]),
        min: Math.round(wx.daily.temperature_2m_min[i]),
        rain: wx.daily.precipitation_probability_max[i],
      }))
      setWeather({ city: resolvedCity, temp: Math.round(cur.temperature_2m), code: cur.weathercode, wind: Math.round(cur.windspeed_10m), humidity: cur.relativehumidity_2m, daily })
      setStatus('idle')
    }

    async function tryIpLocation() {
      try {
        const res = await fetch('https://ipapi.co/json/')
        const d = await res.json()
        if (d.latitude && d.longitude) {
          await fetchWeather(d.latitude, d.longitude, d.city)
        } else setStatus('error')
      } catch { setStatus('error') }
    }

    if (!navigator.geolocation) { tryIpLocation(); return }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try { await fetchWeather(coords.latitude, coords.longitude) }
        catch { setStatus('error') }
      },
      () => tryIpLocation(),
      { timeout: 8000 }
    )
  }, [lang])

  const locale = LOCALE_MAP[lang] || 'en-US'

  if (status === 'loading') {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2 animate-pulse">
        <span className="text-lg">📍</span>
        <span className="text-gray-500 text-xs">{tr.detectingLocation}</span>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2">
        <span className="text-lg">📍</span>
        <span className="text-gray-400 text-xs">{tr.locationError}</span>
      </div>
    )
  }

  if (!weather) return null

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-800/40 transition text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl">{weatherIcon(weather.code)}</span>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold leading-none">{tr.weather}: {weather.temp}°C</p>
            <p className="text-gray-400 text-xs mt-1 truncate">{weather.city} · {tr.wind} {weather.wind} km/h · {tr.humidity} {weather.humidity}%</p>
          </div>
        </div>
        <ChevronUp className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? '' : 'rotate-180'}`} />
      </button>

      {open && (
        <div className="border-t border-gray-800">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <div>
              <p className="text-white text-sm font-semibold">{weather.city}</p>
              <p className="text-gray-400 text-xs">{tr.weeklyForecast}</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800">
            <span className="text-3xl font-bold text-white">{weather.temp}°C</span>
            <div className="flex flex-col items-end gap-1 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Wind className="w-3 h-3" /> {weather.wind} km/h</span>
              <span className="flex items-center gap-1"><Droplets className="w-3 h-3" /> {weather.humidity}%</span>
            </div>
          </div>

          <div className="divide-y divide-gray-800/50">
            {weather.daily.map((day, i) => {
              const dateObj = new Date(day.date + 'T12:00:00')
              const label = i === 0
                ? new Date().toLocaleDateString(locale, { weekday: 'short' })
                : dateObj.toLocaleDateString(locale, { weekday: 'short' })
              return (
                <div key={day.date} className="flex items-center justify-between px-4 py-2 hover:bg-gray-800/30 transition">
                  <span className="text-gray-400 text-xs w-10">{label}</span>
                  <span className="text-lg">{weatherIcon(day.code)}</span>
                  <div className="flex items-center gap-2 text-xs">
                    {day.rain > 0 && <span className="text-blue-400">💧{day.rain}%</span>}
                    <span className="text-white font-medium">{day.max}°</span>
                    <span className="text-gray-500">{day.min}°</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
