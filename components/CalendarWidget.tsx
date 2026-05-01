'use client'
import { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Film, Bitcoin, BarChart2, Zap } from 'lucide-react'

interface CalendarEvent {
  date: string
  title: string
  type: 'crypto' | 'earnings' | 'movie' | 'general'
}

const sampleEvents: CalendarEvent[] = [
  { date: '2026-05-01', title: 'Bitcoin ETF Options Expiry', type: 'crypto' },
  { date: '2026-05-02', title: 'Apple Q2 Earnings', type: 'earnings' },
  { date: '2026-05-05', title: 'Ethereum Pectra Upgrade', type: 'crypto' },
  { date: '2026-05-08', title: 'Fed Interest Rate Decision', type: 'general' },
  { date: '2026-05-09', title: 'Mission Impossible 8', type: 'movie' },
  { date: '2026-05-12', title: 'Tesla Q1 Earnings', type: 'earnings' },
  { date: '2026-05-15', title: 'Crypto Futures Expiry', type: 'crypto' },
  { date: '2026-05-20', title: 'NVIDIA Earnings', type: 'earnings' },
  { date: '2026-05-22', title: 'Fantastic Four', type: 'movie' },
  { date: '2026-05-28', title: 'Bitcoin Halving Anniversary', type: 'crypto' },
]

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return sampleEvents.filter(e => e.date === dateStr)
  }

  const typeColors = {
    crypto: 'bg-amber-400',
    earnings: 'bg-emerald-400',
    movie: 'bg-purple-400',
    general: 'bg-blue-400',
  }

  const typeIcons = {
    crypto: Bitcoin,
    earnings: BarChart2,
    movie: Film,
    general: Zap,
  }

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const upcomingEvents = sampleEvents
    .filter(e => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5)

  return (
    <div className="rounded-xl border border-white/[0.04] bg-[#0a0a10]/80 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <h3 className="text-white font-semibold text-sm">Events Calendar</h3>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="p-1 rounded hover:bg-white/[0.05] text-[#4a4a5e]">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] text-[#8b8b9e] min-w-[100px] text-center">{monthNames[month]} {year}</span>
          <button onClick={nextMonth} className="p-1 rounded hover:bg-white/[0.05] text-[#4a4a5e]">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0.5 mb-3">
        {dayNames.map(d => (
          <div key={d} className="text-center text-[9px] text-[#4a4a5e] py-1">{d}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const events = getEventsForDate(day)
          const isToday = dateStr === todayStr
          const isSelected = dateStr === selectedDate

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(dateStr === selectedDate ? null : dateStr)}
              className={`relative p-1.5 rounded-md text-[10px] transition ${
                isToday ? 'bg-indigo-500/20 text-indigo-300 font-bold' :
                isSelected ? 'bg-white/[0.08] text-white' :
                'text-[#8b8b9e] hover:bg-white/[0.04]'
              }`}
            >
              {day}
              {events.length > 0 && (
                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {events.slice(0, 2).map((e, j) => (
                    <span key={j} className={`w-1 h-1 rounded-full ${typeColors[e.type]}`} />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mb-3 px-1">
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-[9px] text-[#4a4a5e] capitalize">{type}</span>
          </div>
        ))}
      </div>

      {/* Upcoming events */}
      <div className="border-t border-white/[0.04] pt-3">
        <p className="text-[10px] text-[#4a4a5e] uppercase tracking-wider mb-2">Upcoming</p>
        <div className="space-y-1.5">
          {upcomingEvents.map((e, i) => {
            const Icon = typeIcons[e.type]
            return (
              <div key={i} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-white/[0.03] transition">
                <div className={`w-5 h-5 rounded flex items-center justify-center ${typeColors[e.type]}/10`}>
                  <Icon className="w-3 h-3" style={{ color: typeColors[e.type].replace('bg-', '').replace('-400', '') }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-[11px] truncate">{e.title}</p>
                </div>
                <span className="text-[9px] text-[#4a4a5e]">{e.date.slice(5)}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
