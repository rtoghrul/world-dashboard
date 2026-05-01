'use client'
import { useState, useEffect } from 'react'
import { Plus, Trash2, TrendingUp, TrendingDown, PieChart, Wallet, X } from 'lucide-react'

interface Holding {
  id: string
  symbol: string
  name: string
  amount: number
  buyPrice: number
}

interface PricedHolding extends Holding {
  currentPrice: number
  change24h: number
  value: number
  pnl: number
  pnlPercent: number
}

export default function PortfolioTracker() {
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [pricedHoldings, setPricedHoldings] = useState<PricedHolding[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newHolding, setNewHolding] = useState({ symbol: '', name: '', amount: '', buyPrice: '' })

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-holdings')
    if (saved) setHoldings(JSON.parse(saved))
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (holdings.length > 0) {
      localStorage.setItem('portfolio-holdings', JSON.stringify(holdings))
    }
  }, [holdings])

  // Fetch current prices
  useEffect(() => {
    if (holdings.length === 0) {
      setPricedHoldings([])
      return
    }

    async function fetchPrices() {
      setLoading(true)
      try {
        const ids = holdings.map(h => h.id).join(',')
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h`)
        const data = await res.json()

        if (Array.isArray(data)) {
          const priced = holdings.map(h => {
            const market = data.find((d: any) => d.id === h.id)
            const currentPrice = market?.current_price || h.buyPrice
            const change24h = market?.price_change_percentage_24h || 0
            const value = h.amount * currentPrice
            const cost = h.amount * h.buyPrice
            const pnl = value - cost
            const pnlPercent = cost > 0 ? (pnl / cost) * 100 : 0
            return { ...h, currentPrice, change24h, value, pnl, pnlPercent }
          })
          setPricedHoldings(priced)
        }
      } catch { }
      setLoading(false)
    }
    fetchPrices()
    const interval = setInterval(fetchPrices, 60000)
    return () => clearInterval(interval)
  }, [holdings])

  const addHolding = () => {
    if (!newHolding.symbol || !newHolding.amount || !newHolding.buyPrice) return
    const holding: Holding = {
      id: newHolding.symbol.toLowerCase(),
      symbol: newHolding.symbol.toUpperCase(),
      name: newHolding.name || newHolding.symbol,
      amount: parseFloat(newHolding.amount),
      buyPrice: parseFloat(newHolding.buyPrice),
    }
    setHoldings(prev => [...prev, holding])
    setNewHolding({ symbol: '', name: '', amount: '', buyPrice: '' })
    setShowAddModal(false)
  }

  const removeHolding = (symbol: string) => {
    const updated = holdings.filter(h => h.symbol !== symbol)
    setHoldings(updated)
    localStorage.setItem('portfolio-holdings', JSON.stringify(updated))
  }

  const totalValue = pricedHoldings.reduce((sum, h) => sum + h.value, 0)
  const totalCost = pricedHoldings.reduce((sum, h) => sum + (h.amount * h.buyPrice), 0)
  const totalPnl = totalValue - totalCost
  const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0

  return (
    <div className="rounded-2xl bg-[#0a0a10] border border-white/[0.06] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-emerald-400" />
          <h2 className="text-white font-semibold text-sm">Portfolio</h2>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20 hover:bg-indigo-500/20 transition"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {/* Summary */}
      {pricedHoldings.length > 0 && (
        <div className="px-5 py-4 border-b border-white/[0.04] bg-white/[0.01]">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-white">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            <span className={`text-sm font-medium flex items-center gap-0.5 ${totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totalPnl >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {totalPnl >= 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}% (${Math.abs(totalPnl).toLocaleString(undefined, { maximumFractionDigits: 2 })})
            </span>
          </div>
          <p className="text-[11px] text-[#5b5b70] mt-1">Total portfolio value • Cost basis: ${totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        </div>
      )}

      {/* Holdings list */}
      <div className="divide-y divide-white/[0.03]">
        {pricedHoldings.length === 0 && (
          <div className="px-5 py-10 text-center">
            <PieChart className="w-8 h-8 text-[#3a3a4a] mx-auto mb-3" />
            <p className="text-sm text-[#6b6b80]">No holdings yet</p>
            <p className="text-xs text-[#4a4a5a] mt-1">Add your crypto to track performance</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20 hover:bg-indigo-500/20 transition"
            >
              <Plus className="w-3.5 h-3.5 inline mr-1" /> Add first holding
            </button>
          </div>
        )}
        {pricedHoldings.map(h => (
          <div key={h.symbol} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-xs font-bold text-amber-400">
              {h.symbol.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white font-medium">{h.symbol}</span>
                <span className="text-[11px] text-[#5b5b70]">{h.amount} coins</span>
              </div>
              <span className="text-[11px] text-[#5b5b70]">Buy: ${h.buyPrice.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <p className="text-sm text-white font-mono">${h.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p className={`text-[10px] font-medium ${h.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {h.pnl >= 0 ? '+' : ''}{h.pnlPercent.toFixed(1)}%
              </p>
            </div>
            <button onClick={() => removeHolding(h.symbol)} className="opacity-0 group-hover:opacity-100 p-1 text-[#5b5b70] hover:text-red-400 transition">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-sm mx-4 rounded-2xl bg-[#0f0f15] border border-white/[0.08] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-sm">Add Holding</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#6b6b80] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-[#6b6b80] mb-1 block">Coin ID (coingecko)</label>
                <input
                  type="text"
                  value={newHolding.symbol}
                  onChange={e => setNewHolding(p => ({ ...p, symbol: e.target.value }))}
                  placeholder="bitcoin, ethereum, solana..."
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm outline-none focus:border-indigo-500/30 placeholder:text-[#4a4a5a]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#6b6b80] mb-1 block">Display Name</label>
                <input
                  type="text"
                  value={newHolding.name}
                  onChange={e => setNewHolding(p => ({ ...p, name: e.target.value }))}
                  placeholder="Bitcoin"
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm outline-none focus:border-indigo-500/30 placeholder:text-[#4a4a5a]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#6b6b80] mb-1 block">Amount</label>
                  <input
                    type="number"
                    value={newHolding.amount}
                    onChange={e => setNewHolding(p => ({ ...p, amount: e.target.value }))}
                    placeholder="0.5"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm outline-none focus:border-indigo-500/30 placeholder:text-[#4a4a5a]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#6b6b80] mb-1 block">Buy Price ($)</label>
                  <input
                    type="number"
                    value={newHolding.buyPrice}
                    onChange={e => setNewHolding(p => ({ ...p, buyPrice: e.target.value }))}
                    placeholder="60000"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm outline-none focus:border-indigo-500/30 placeholder:text-[#4a4a5a]"
                  />
                </div>
              </div>
              <button
                onClick={addHolding}
                className="w-full mt-2 py-2.5 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition"
              >
                Add to Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
