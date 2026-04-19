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
    if (!navigator.geolocation) { setStatus('error'); return }
    setStatus('loading')
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { latitude: lat, longitude: lon } = coords

          const [geoRes, wxRes] = await Promise.all([
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

          const geo = await geoRes.json()
          const wx = await wxRes.json()

          const city = geo?.address?.city || geo?.address?.town || geo?.address?.village || geo?.address?.county || '—'
          const cur = wx.current
          const daily: DayForecast[] = wx.daily.time.map((date: string, i: number) => ({
            date,
            code: wx.daily.weathercode[i],
            max: Math.round(wx.daily.temperature_2m_max[i]),
            min: Math.round(wx.daily.temperature_2m_min[i]),
            rain: wx.daily.precipitation_probability_max[i],
          }))

          setWeather({
            city,
            temp: Math.round(cur.temperature_2m),
            code: cur.weathercode,
            wind: Math.round(cur.windspeed_10m),
            humidity: cur.relativehumidity_2m,
            daily,
          })
          setStatus('idle')
        } catch {
          setStatus('error')
        }
      },
      () => setStatus('error')
    )
  }, [lang])

  const locale = LOCALE_MAP[lang] || 'en-US'

  if (status === 'loading') {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl px-4 py-2.5 shadow-2xl flex items-center gap-2 animate-pulse">
          <span className="text-gray-500 text-xs">{tr.detectingLocation}</span>
        </div>
      </div>
    )
  }

  if (status === 'error' || !weather) return null

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Expanded weekly panel */}
      {open && (
        <div className="mb-2 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-72 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">{weatherIcon(weather.code)}</span>
              <div>
                <p className="text-white text-sm font-semibold">{weather.city}</p>
                <p className="text-gray-400 text-xs">{tr.weeklyForecast}</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current details */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800">
            <span className="text-3xl font-bold text-white">{weather.temp}°C</span>
            <div className="flex flex-col items-end gap-1 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Wind className="w-3 h-3" /> {weather.wind} km/h</span>
              <span className="flex items-center gap-1"><Droplets className="w-3 h-3" /> {weather.humidity}%</span>
            </div>
          </div>

          {/* 7-day forecast */}
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

      {/* Collapsed pill */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 bg-gray-900 border border-gray-700 hover:border-gray-500 rounded-2xl px-4 py-2.5 shadow-2xl transition group"
      >
        <span className="text-xl">{weatherIcon(weather.code)}</span>
        <div className="text-left">
          <p className="text-white text-sm font-semibold leading-none">{weather.temp}°C</p>
          <p className="text-gray-400 text-xs mt-0.5">{weather.city}</p>
        </div>
        <ChevronUp className={`w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300 transition-transform duration-200 ${open ? '' : 'rotate-180'}`} />
      </button>
    </div>
  )
}
