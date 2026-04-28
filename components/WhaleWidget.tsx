'use client'
import useSWR from 'swr'
import { useState } from 'react'
import { TrendingUp, TrendingDown, ExternalLink, ChevronDown, Wallet, ArrowRightLeft, Eye } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'
import { formatNum, Coin } from './CryptoWidget'
import { Market, parseOutcomes } from './PolymarketWidget'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type WhaleTx = {
  id: string
  chain: string
  symbol: string
  amount: number
  usdValue: number
  fromWallet: string
  toWallet: string
  txUrl: string
  fromUrl: string
  toUrl: string
  direction: string
  time: string
}

const copy: Record<string, any> = {
  en: { live: 'Live whale wallet transfers', wallet: 'Wallet', from: 'From', to: 'To', watch: 'Watch wallet', tx: 'Transaction', value: 'Value', noTx: 'No large live transfers right now' },
  az: { live: 'Canlı balina wallet transferləri', wallet: 'Wallet', from: 'Göndərən', to: 'Alan', watch: 'Walleti izlə', tx: 'Tranzaksiya', value: 'Dəyər', noTx: 'Hazırda böyük canlı transfer tapılmadı' },
  ru: { live: 'Крупные live-переводы кошельков', wallet: 'Кошелёк', from: 'От', to: 'Кому', watch: 'Следить за кошельком', tx: 'Транзакция', value: 'Сумма', noTx: 'Сейчас крупных live-переводов нет' },
  de: { live: 'Live Whale-Wallet-Transfers', wallet: 'Wallet', from: 'Von', to: 'An', watch: 'Wallet verfolgen', tx: 'Transaktion', value: 'Wert', noTx: 'Aktuell keine großen Live-Transfers' },
  tr: { live: 'Canlı balina cüzdan transferleri', wallet: 'Cüzdan', from: 'Kimden', to: 'Kime', watch: 'Cüzdanı izle', tx: 'İşlem', value: 'Değer', noTx: 'Şu anda büyük canlı transfer yok' },
}

function shortWallet(value: string) {
  if (!value || value === 'Unknown') return 'Unknown'
  return `${value.slice(0, 8)}...${value.slice(-6)}`
}

function money(value: number) {
  if (!Number.isFinite(value)) return '$0'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: value >= 1000000 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(value)
}

export default function WhaleWidget() {
  const { tr, lang } = useLang()
  const t = copy[lang] || copy.en
  const [collapsed, setCollapsed] = useState(true)

  const { data: cryptoData } = useSWR<Coin[]>('/api/crypto?per_page=50&page=1', fetcher, { refreshInterval: 60000 })
  const { data: polyData } = useSWR<Market[]>('/api/polymarket?limit=20', fetcher, { refreshInterval: 120000 })
  const { data: whaleData, isLoading: whaleLoading } = useSWR<WhaleTx[]>('/api/whales', fetcher, { refreshInterval: 120000 })

  const liveWhales = Array.isArray(whaleData) ? whaleData : []

  const topMovers = Array.isArray(cryptoData)
    ? [...cryptoData].sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h)).slice(0, 5)
    : []

  const topVolume = Array.isArray(cryptoData)
    ? [...cryptoData].sort((a, b) => b.market_cap - a.market_cap).slice(0, 5)
    : []

  const whaleBets = Array.isArray(polyData)
    ? [...polyData].filter(m => m.question && m.volume).sort((a, b) => (b.volume || 0) - (a.volume || 0)).slice(0, 5)
    : []

  const topMover = topMovers[0]
  const topWhale = liveWhales[0]

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="px-5 py-3 flex items-center justify-between border-b border-gray-800 cursor-pointer select-none hover:bg-gray-800/20 transition" onClick={() => setCollapsed(c => !c)}>
        <div>
          <h2 className="text-white font-semibold text-sm">🐋 {tr.whaleActivity}</h2>
          <p className="text-gray-500 text-xs">{tr.whaleDesc}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} />
      </div>

      {collapsed && (
        <div className="px-5 py-3 flex items-center gap-3">
          {topWhale ? (
            <>
              <Wallet className="w-5 h-5 text-cyan-300 flex-shrink-0" />
              <span className="text-white text-sm font-medium">{topWhale.symbol} {topWhale.amount.toFixed(2)}</span>
              <span className="text-gray-400 text-sm">{money(topWhale.usdValue)}</span>
              <a href={topWhale.txUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-300 text-xs hover:text-cyan-200">{t.tx}</a>
            </>
          ) : topMover ? (
            <>
              <img src={topMover.image} alt={topMover.name} className="w-6 h-6 rounded-full flex-shrink-0" />
              <span className="text-white text-sm font-medium">{topMover.symbol.toUpperCase()}</span>
              <span className="text-gray-400 text-sm">${topMover.current_price.toLocaleString()}</span>
              <span className={`text-xs font-semibold flex items-center gap-0.5 ${topMover.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {topMover.price_change_percentage_24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(topMover.price_change_percentage_24h).toFixed(1)}%
              </span>
            </>
          ) : <div className="h-4 bg-gray-800 rounded w-48 animate-pulse" />}
        </div>
      )}

      {!collapsed && (
        <div className="p-4 space-y-4">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-cyan-500/20 flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-sm flex items-center gap-2"><Wallet className="w-4 h-4 text-cyan-300" />{t.live}</h3>
                <p className="text-gray-500 text-xs">Bitcoin mempool · explorer links · wallet tracking</p>
              </div>
            </div>
            <div className="divide-y divide-cyan-500/10">
              {whaleLoading && Array.from({ length: 3 }).map((_, i) => <div key={i} className="px-4 py-3 animate-pulse"><div className="h-3 bg-gray-800 rounded w-2/3 mb-2" /><div className="h-2 bg-gray-800 rounded w-full" /></div>)}
              {!whaleLoading && liveWhales.length === 0 && <div className="px-4 py-4 text-gray-500 text-sm">{t.noTx}</div>}
              {liveWhales.map(tx => (
                <div key={tx.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="text-white text-sm font-semibold">{tx.amount.toFixed(3)} {tx.symbol} · {money(tx.usdValue)}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{new Date(tx.time).toLocaleString()}</div>
                    </div>
                    <a href={tx.txUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 text-xs flex items-center gap-1"><ExternalLink className="w-3 h-3" />{t.tx}</a>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="rounded-lg bg-gray-800/50 border border-gray-700/50 p-2">
                      <p className="text-gray-500 text-[11px] mb-1">{t.from}</p>
                      <p className="text-white text-xs font-mono break-all">{shortWallet(tx.fromWallet)}</p>
                      {tx.fromUrl && <a href={tx.fromUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-cyan-300 text-[11px] hover:text-cyan-200"><Eye className="w-3 h-3" />{t.watch}</a>}
                    </div>
                    <div className="rounded-lg bg-gray-800/50 border border-gray-700/50 p-2">
                      <p className="text-gray-500 text-[11px] mb-1">{t.to}</p>
                      <p className="text-white text-xs font-mono break-all">{shortWallet(tx.toWallet)}</p>
                      {tx.toUrl && <a href={tx.toUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-cyan-300 text-[11px] hover:text-cyan-200"><Eye className="w-3 h-3" />{t.watch}</a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-700/50"><h3 className="text-white font-semibold text-sm">🐋 {tr.bigMovers}</h3><p className="text-gray-500 text-xs">Top 24h % {tr.change24h}</p></div>
              <div className="divide-y divide-gray-700/30">{topMovers.map(coin => { const up = coin.price_change_percentage_24h >= 0; return <div key={coin.id} className="px-4 py-2.5 flex items-center justify-between"><div className="flex items-center gap-2"><img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" /><div><div className="text-white text-xs font-medium">{coin.symbol.toUpperCase()}</div><div className="text-gray-500 text-xs">${coin.current_price.toLocaleString()}</div></div></div><span className={`text-xs font-bold flex items-center gap-0.5 ${up ? 'text-emerald-400' : 'text-red-400'}`}>{up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{Math.abs(coin.price_change_percentage_24h).toFixed(1)}%</span></div> })}</div>
            </div>

            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-700/50"><h3 className="text-white font-semibold text-sm">💰 Top {tr.volume}</h3><p className="text-gray-500 text-xs">{tr.marketCap} leaders</p></div>
              <div className="divide-y divide-gray-700/30">{topVolume.map(coin => <div key={coin.id} className="px-4 py-2.5 flex items-center justify-between"><div className="flex items-center gap-2"><img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" /><div><div className="text-white text-xs font-medium">{coin.symbol.toUpperCase()}</div><div className="text-gray-500 text-xs">${coin.current_price.toLocaleString()}</div></div></div><span className="text-gray-300 text-xs font-mono">{formatNum(coin.market_cap)}</span></div>)}</div>
            </div>

            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-700/50"><h3 className="text-white font-semibold text-sm">🎯 {tr.largeBets}</h3><p className="text-gray-500 text-xs">Polymarket high {tr.volume}</p></div>
              <div className="divide-y divide-gray-700/30">{whaleBets.map(market => { const odds = parseOutcomes(market); const vol = market.volume ? formatNum(market.volume) : '—'; return <div key={market.id} className="px-4 py-2.5"><div className="flex items-start justify-between gap-1 mb-1"><p className="text-white text-xs line-clamp-2 flex-1">{market.question}</p><a href={`https://polymarket.com/event/${market.slug || market.id}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-400 flex-shrink-0"><ExternalLink className="w-3 h-3" /></a></div><div className="flex items-center justify-between">{odds && <span className="text-emerald-400 text-xs">{tr.yes} {odds.yes}%</span>}<span className="text-gray-500 text-xs">{tr.volume}: {vol}</span></div></div> })}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
