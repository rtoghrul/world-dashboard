'use client'
import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface PriceChartProps {
  coinId?: string
  coinName?: string
}

const timeRanges = [
  { label: '1D', days: 1 },
  { label: '7D', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '1Y', days: 365 },
]

export default function PriceChart({ coinId = 'bitcoin', coinName = 'Bitcoin' }: PriceChartProps) {
  const [data, setData] = useState<{ time: string; price: number }[]>([])
  const [range, setRange] = useState(7)
  const [loading, setLoading] = useState(true)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [priceChange, setPriceChange] = useState(0)

  useEffect(() => {
    async function fetchChart() {
      setLoading(true)
      try {
        const res = await fetch(`/api/chart?coin=${coinId}&days=${range}`)
        const json = await res.json()

        if (json.prices && Array.isArray(json.prices)) {
          const chartData = json.prices.map((p: [number, number]) => ({
            time: new Date(p[0]).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              ...(range <= 1 ? { hour: '2-digit', minute: '2-digit' } : {}),
            }),
            price: p[1],
          }))
          setData(chartData)

          if (chartData.length > 0) {
            const first = chartData[0].price
            const last = chartData[chartData.length - 1].price
            setCurrentPrice(last)
            setPriceChange(((last - first) / first) * 100)
          }
        }
      } catch {}
      setLoading(false)
    }
    fetchChart()
  }, [coinId, range])

  const isPositive = priceChange >= 0
  const chartColor = isPositive ? '#34d399' : '#f87171'

  return (
    <div className="rounded-2xl bg-[#0a0a10] border border-white/[0.06] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">{coinName} Price</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl font-bold text-white">
              ${currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
            <span className={`text-xs font-medium flex items-center gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </div>
        </div>
        {/* Time range selector */}
        <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-0.5 border border-white/[0.04]">
          {timeRanges.map(r => (
            <button
              key={r.days}
              onClick={() => setRange(r.days)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${range === r.days ? 'bg-white/[0.08] text-white' : 'text-[#6b6b80] hover:text-white'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[200px]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/10 border-t-indigo-400 rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id={`gradient-${coinId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#4a4a5a', fontSize: 10 }}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <YAxis
                domain={['auto', 'auto']}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#4a4a5a', fontSize: 10 }}
                width={60}
                tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(0)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111118',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                }}
                labelStyle={{ color: '#6b6b80', fontSize: 11 }}
                itemStyle={{ color: '#fff', fontSize: 12 }}
                formatter={(value: number) => [`$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, 'Price']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2}
                fill={`url(#gradient-${coinId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
