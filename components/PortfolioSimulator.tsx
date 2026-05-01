'use client'
import { useState, useEffect } from 'react'
import { Wallet, TrendingUp, TrendingDown, Plus, X, DollarSign } from 'lucide-react'

interface Trade {
  id: string
  coin: string
  type: 'buy' | 'sell'
  amount: number
  price: number
  timestamp: number
}

interface SimState {
  balance: number
  holdings: Record<string, number>
  trades: Trade[]
  startBalance: number
}

const COINS = ['bitcoin', 'ethereum', 'solana', 'cardano', 'dogecoin']

export default function PortfolioSimulator() {
  const [state, setState] = useState<SimState>({ balance: 100000, holdings: {}, trades: [], startBalance: 100000 })
  const [prices, setPrices] = useState<Record<string, number>>({})
  const [showTrade, setShowTrade] = useState(false)
  const [tradeCoin, setTradeCoin] = useState('bitcoin')
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [tradeAmount, setTradeAmount] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('wd-paper-trading')
    if (saved) setState(JSON.parse(saved))
  }, [])

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${COINS.join(',')}&vs_currencies=usd`)
        const data = await res.json()
        const p: Record<string, number> = {}
        Object.entries(data).forEach(([k, v]: [string, any]) => { p[k] = v.usd })
        setPrices(p)
      } catch {}
    }
    fetchPrices()
    const interval = setInterval(fetchPrices, 30000)
    return () => clearInterval(interval)
  }, [])

  const save = (s: SimState) => {
    setState(s)
    localStorage.setItem('wd-paper-trading', JSON.stringify(s))
  }

  const executeTrade = () => {
    const usdAmount = parseFloat(tradeAmount)
    if (!usdAmount || usdAmount <= 0 || !prices[tradeCoin]) return

    const price = prices[tradeCoin]
    const coinAmount = usdAmount / price

    if (tradeType === 'buy') {
      if (usdAmount > state.balance) return
      const newHoldings = { ...state.holdings, [tradeCoin]: (state.holdings[tradeCoin] || 0) + coinAmount }
      const trade: Trade = { id: Date.now().toString(), coin: tradeCoin, type: 'buy', amount: coinAmount, price, timestamp: Date.now() }
      save({ ...state, balance: state.balance - usdAmount, holdings: newHoldings, trades: [trade, ...state.trades] })
    } else {
      if (!state.holdings[tradeCoin] || state.holdings[tradeCoin] < coinAmount) return
      const newHoldings = { ...state.holdings, [tradeCoin]: state.holdings[tradeCoin] - coinAmount }
      if (newHoldings[tradeCoin] < 0.000001) delete newHoldings[tradeCoin]
      const trade: Trade = { id: Date.now().toString(), coin: tradeCoin, type: 'sell', amount: coinAmount, price, timestamp: Date.now() }
      save({ ...state, balance: state.balance + usdAmount, holdings: newHoldings, trades: [trade, ...state.trades] })
    }
    setTradeAmount('')
    setShowTrade(false)
  }

  const totalValue = state.balance + Object.entries(state.holdings).reduce((sum, [coin, amount]) => sum + (prices[coin] || 0) * amount, 0)
  const pnl = totalValue - state.startBalance
  const pnlPct = ((pnl / state.startBalance) * 100).toFixed(2)

  const resetSim = () => {
    save({ balance: 100000, holdings: {}, trades: [], startBalance: 100000 })
  }

  return (
    <div className="rounded-xl border border-white/[0.04] bg-[#0a0a10]/80 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-cyan-400" />
          <h3 className="text-white font-semibold text-sm">Paper Trading</h3>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-medium">SIM</span>
        </div>
        <button onClick={() => setShowTrade(!showTrade)} className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Portfolio value */}
      <div className="mb-3">
        <p className="text-white text-xl font-bold font-mono">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        <p className={`text-xs font-medium flex items-center gap-1 ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {pnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {pnl >= 0 ? '+' : ''}{pnlPct}% (${Math.abs(pnl).toLocaleString(undefined, { maximumFractionDigits: 0 })})
        </p>
        <p className="text-[10px] text-[#4a4a5e] mt-1">Cash: ${state.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
      </div>

      {/* Holdings */}
      {Object.entries(state.holdings).length > 0 && (
        <div className="space-y-1.5 mb-3">
          {Object.entries(state.holdings).map(([coin, amount]) => (
            <div key={coin} className="flex items-center justify-between py-1">
              <span className="text-white text-xs capitalize">{coin}</span>
              <div className="text-right">
                <span className="text-white text-xs font-mono">${((prices[coin] || 0) * amount).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                <span className="text-[10px] text-[#4a4a5e] ml-2">{amount.toFixed(4)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trade form */}
      {showTrade && (
        <div className="border-t border-white/[0.04] pt-3 mt-2 space-y-2">
          <div className="flex gap-1">
            <button onClick={() => setTradeType('buy')} className={`flex-1 py-1.5 rounded text-[10px] font-medium ${tradeType === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.03] text-[#8b8b9e]'}`}>Buy</button>
            <button onClick={() => setTradeType('sell')} className={`flex-1 py-1.5 rounded text-[10px] font-medium ${tradeType === 'sell' ? 'bg-red-500/20 text-red-400' : 'bg-white/[0.03] text-[#8b8b9e]'}`}>Sell</button>
          </div>
          <select value={tradeCoin} onChange={e => setTradeCoin(e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-white capitalize">
            {COINS.map(c => <option key={c} value={c}>{c} (${prices[c]?.toLocaleString() || '...'})</option>)}
          </select>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#4a4a5e]" />
              <input
                type="number"
                value={tradeAmount}
                onChange={e => setTradeAmount(e.target.value)}
                placeholder="USD amount"
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg pl-6 pr-3 py-2 text-xs text-white placeholder-[#4a4a5e]"
              />
            </div>
            <button onClick={executeTrade} className={`px-4 py-2 rounded-lg text-xs font-medium ${tradeType === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              {tradeType === 'buy' ? 'Buy' : 'Sell'}
            </button>
          </div>
        </div>
      )}

      {/* Recent trades */}
      {state.trades.length > 0 && (
        <div className="border-t border-white/[0.04] pt-2 mt-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] text-[#4a4a5e]">Recent trades</p>
            <button onClick={resetSim} className="text-[9px] text-red-400 hover:text-red-300">Reset</button>
          </div>
          {state.trades.slice(0, 3).map(t => (
            <div key={t.id} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-1">
                <span className={`text-[9px] px-1 rounded ${t.type === 'buy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{t.type}</span>
                <span className="text-[10px] text-white capitalize">{t.coin}</span>
              </div>
              <span className="text-[10px] text-[#4a4a5e]">${(t.amount * t.price).toFixed(0)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
