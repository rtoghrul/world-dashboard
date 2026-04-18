'use client'
import useSWR from 'swr'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { Coin, formatNum } from './CryptoWidget'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type MarketData = {
  total_market_cap: number | null
  market_cap_change_24h: number | null
  btc_dominance: number | null
  eth_dominance: number | null
  fear_greed: number | null
  fear_greed_label: string | null
}

function fngColor(value: number | null) {
  if (value === null) return 'text-gray-400'
  if (value <= 25) return 'text-red-400'
  if (value <= 45) return 'text-orange-400'
  if (value <= 55) return 'text-yellow-400'
  if (value <= 75) return 'text-lime-400'
  return 'text-emerald-400'
}

function StatItem({ label, value, sub, up }: { label: string; value: string; sub?: string; up?: boolean }) {
  return (
    <div className="flex items-center gap-2 flex-shrink-0 px-4 border-r border-gray-800/60 last:border-0">
      <span className="text-gray-500 text-xs">{label}</span>
      <span className="text-white text-xs font-medium font-mono">{value}</span>
      {sub !== undefined && up !== undefined && (
        <span className={`text-xs flex items-center gap-0.5 ${up ? 'text-emerald-400' : 'text-red-400'}`}>
          {up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
          {sub}
        </span>
      )}
    </div>
  )
}

export default function MarketTicker() {
  const { data: market } = useSWR<MarketData>('/api/market', fetcher, { refreshInterval: 300000 })
  const { data: coins } = useSWR<Coin[]>('/api/crypto', fetcher, { refreshInterval: 60000 })

  const btc = coins?.find(c => c.id === 'bitcoin')
  const eth = coins?.find(c => c.id === 'ethereum')

  if (!market && !btc) return null

  const capUp = (market?.market_cap_change_24h ?? 0) >= 0

  return (
    <div className="bg-gray-950 border-b border-gray-800/50">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex items-center gap-0 py-1.5 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 mr-4 flex-shrink-0">
            <Activity className="w-3 h-3 text-indigo-400" />
            <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">Markets</span>
          </div>

          {market?.total_market_cap && (
            <StatItem
              label="MCap"
              value={formatNum(market.total_market_cap)}
              sub={market.market_cap_change_24h !== null ? `${Math.abs(market.market_cap_change_24h).toFixed(1)}%` : undefined}
              up={capUp}
            />
          )}

          {btc && (
            <StatItem
              label="BTC"
              value={`$${btc.current_price.toLocaleString()}`}
              sub={`${Math.abs(btc.price_change_percentage_24h).toFixed(2)}%`}
              up={btc.price_change_percentage_24h >= 0}
            />
          )}

          {eth && (
            <StatItem
              label="ETH"
              value={`$${eth.current_price.toLocaleString()}`}
              sub={`${Math.abs(eth.price_change_percentage_24h).toFixed(2)}%`}
              up={eth.price_change_percentage_24h >= 0}
            />
          )}

          {market?.btc_dominance !== null && market?.btc_dominance !== undefined && (
            <StatItem label="BTC Dom." value={`${market.btc_dominance.toFixed(1)}%`} />
          )}

          {market?.fear_greed !== null && market?.fear_greed !== undefined && (
            <div className="flex items-center gap-2 flex-shrink-0 px-4">
              <span className="text-gray-500 text-xs">Fear & Greed</span>
              <span className={`text-xs font-bold ${fngColor(market.fear_greed)}`}>
                {market.fear_greed} — {market.fear_greed_label}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
