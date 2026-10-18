'use client'
import { fearGreedLabel } from '@/lib/fearGreed'
import useSWR from 'swr'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { Coin, formatNum } from './CryptoWidget'
import { useLang } from '@/lib/LanguageContext'

const LABELS: Record<string, Record<string, string>> = {
  markets: { en: 'Markets', az: 'Bazarlar', ru: 'Рынки', tr: 'Piyasalar', de: 'Märkte', fr: 'Marchés', es: 'Mercados', zh: '市场', ar: 'أسواق', ja: '市場', it: 'Mercati', pt: 'Mercados' },
}

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
  if (value === null) return 'text-ink-4'
  if (value <= 25) return 'text-red-400'
  if (value <= 45) return 'text-orange-400'
  if (value <= 55) return 'text-yellow-400'
  if (value <= 75) return 'text-lime-400'
  return 'text-emerald-400'
}

function StatItem({ label, value, sub, up }: { label: string; value: string; sub?: string; up?: boolean }) {
  return (
    <div className="flex items-center gap-2 flex-shrink-0 px-3 border-r border-line last:border-0">
      <span className="text-ink-4 text-[10px] uppercase tracking-wider">{label}</span>
      <span className="text-ink-1 text-xs font-medium font-mono">{value}</span>
      {sub !== undefined && up !== undefined && (
        <span className={`text-[10px] flex items-center gap-0.5 font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
          {up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
          {sub}
        </span>
      )}
    </div>
  )
}

export default function MarketTicker() {
  const { lang } = useLang()
  const { data: market } = useSWR<MarketData>('/api/market', fetcher, { refreshInterval: 300000 })
  const { data: coins } = useSWR<Coin[]>('/api/crypto', fetcher, { refreshInterval: 60000 })

  const coinList = Array.isArray(coins) ? coins : []
  const btc = coinList.find(c => c.id === 'bitcoin')
  const eth = coinList.find(c => c.id === 'ethereum')
  const sol = coinList.find(c => c.id === 'solana')
  const bnb = coinList.find(c => c.id === 'binancecoin')
  const xrp = coinList.find(c => c.id === 'ripple')

  if (!market && !btc) return null

  const capUp = (market?.market_cap_change_24h ?? 0) >= 0

  const renderCoin = (coin: Coin | undefined, label: string) => {
    if (!coin) return null
    return (
      <StatItem
        label={label}
        value={`$${coin.current_price.toLocaleString()}`}
        sub={`${Math.abs(coin.price_change_percentage_24h).toFixed(2)}%`}
        up={coin.price_change_percentage_24h >= 0}
      />
    )
  }

  return (
    <div className="border-b border-line bg-surface-0">
      <div className="max-w-screen-2xl mx-auto px-5">
        <div className="flex items-center gap-0 py-2 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1.5 mr-3 flex-shrink-0">
            <div className="live-dot" />
            <span className="text-ink-4 text-[10px] font-semibold uppercase tracking-wider">{LABELS.markets[lang] || 'Markets'}</span>
          </div>

          {market?.total_market_cap && (
            <StatItem
              label="MCap"
              value={formatNum(market.total_market_cap)}
              sub={market.market_cap_change_24h !== null ? `${Math.abs(market.market_cap_change_24h).toFixed(1)}%` : undefined}
              up={capUp}
            />
          )}

          {renderCoin(btc, 'BTC')}
          {renderCoin(eth, 'ETH')}
          {renderCoin(sol, 'SOL')}
          {renderCoin(bnb, 'BNB')}
          {renderCoin(xrp, 'XRP')}

          {market?.btc_dominance !== null && market?.btc_dominance !== undefined && (
            <StatItem label="BTC.D" value={`${market.btc_dominance.toFixed(1)}%`} />
          )}

          {market?.fear_greed !== null && market?.fear_greed !== undefined && (
            <div className="flex items-center gap-2 flex-shrink-0 px-3">
              <span className="text-ink-4 text-[10px] uppercase tracking-wider">F&amp;G</span>
              <span className={`text-xs font-bold ${fngColor(market.fear_greed)}`}>
                {market.fear_greed}
              </span>
              <span className="text-ink-4 text-[10px]">{fearGreedLabel(market.fear_greed_label, lang)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
