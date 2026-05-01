'use client'
import { useState, useEffect, useRef } from 'react'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

interface LivePrice {
  symbol: string
  price: number
  change: number
  flash: 'up' | 'down' | null
}

export default function LivePriceTicker() {
  const [prices, setPrices] = useState<LivePrice[]>([
    { symbol: 'BTC', price: 0, change: 0, flash: null },
    { symbol: 'ETH', price: 0, change: 0, flash: null },
    { symbol: 'SOL', price: 0, change: 0, flash: null },
  ])
  const prevPrices = useRef<Record<string, number>>({})

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true')
        const data = await res.json()

        const newPrices: LivePrice[] = [
          { symbol: 'BTC', price: data.bitcoin?.usd || 0, change: data.bitcoin?.usd_24h_change || 0, flash: null },
          { symbol: 'ETH', price: data.ethereum?.usd || 0, change: data.ethereum?.usd_24h_change || 0, flash: null },
          { symbol: 'SOL', price: data.solana?.usd || 0, change: data.solana?.usd_24h_change || 0, flash: null },
        ]

        // Determine flash direction
        newPrices.forEach(p => {
          const prev = prevPrices.current[p.symbol]
          if (prev && p.price !== prev) {
            p.flash = p.price > prev ? 'up' : 'down'
          }
          prevPrices.current[p.symbol] = p.price
        })

        setPrices(newPrices)

        // Clear flash after 1s
        setTimeout(() => {
          setPrices(prev => prev.map(p => ({ ...p, flash: null })))
        }, 1000)
      } catch {}
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-4">
      {prices.map(p => (
        <div
          key={p.symbol}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-300 ${
            p.flash === 'up' ? 'bg-emerald-500/10' :
            p.flash === 'down' ? 'bg-red-500/10' : ''
          }`}
        >
          <span className="text-[10px] text-[#4a4a5e] font-medium">{p.symbol}</span>
          <span className={`text-[11px] font-mono font-medium transition-colors ${
            p.flash === 'up' ? 'text-emerald-400' :
            p.flash === 'down' ? 'text-red-400' : 'text-white'
          }`}>
            ${p.price.toLocaleString(undefined, { maximumFractionDigits: p.price > 100 ? 0 : 2 })}
          </span>
          <span className={`text-[9px] ${p.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {p.change >= 0 ? '+' : ''}{p.change.toFixed(1)}%
          </span>
        </div>
      ))}
      <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
    </div>
  )
}
