import { NextResponse } from 'next/server'

export const revalidate = 300

// Binance fallback: map CoinGecko coin ids + day ranges to klines params
const SYMBOLS: Record<string, string> = {
  bitcoin: 'BTCUSDT',
  ethereum: 'ETHUSDT',
  solana: 'SOLUSDT',
  binancecoin: 'BNBUSDT',
  ripple: 'XRPUSDT',
  cardano: 'ADAUSDT',
  dogecoin: 'DOGEUSDT',
}

function klinesParams(days: number): { interval: string; limit: number } {
  if (days <= 1) return { interval: '30m', limit: 48 }
  if (days <= 7) return { interval: '2h', limit: 84 }
  if (days <= 30) return { interval: '8h', limit: 90 }
  if (days <= 90) return { interval: '1d', limit: 90 }
  return { interval: '1w', limit: 52 }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const coin = searchParams.get('coin') || 'bitcoin'
  const days = Math.max(1, Number(searchParams.get('days') || '7'))

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(coin)}/market_chart?vs_currency=usd&days=${days}`,
      { next: { revalidate: 300 } }
    )
    if (!res.ok) throw new Error('CoinGecko error')
    const data = await res.json()
    if (!Array.isArray(data?.prices)) throw new Error('Bad payload')
    return NextResponse.json({ prices: data.prices })
  } catch {
    // CoinGecko rate-limits the free tier — fall back to Binance klines
    try {
      const symbol = SYMBOLS[coin]
      if (!symbol) throw new Error('No Binance symbol')
      const { interval, limit } = klinesParams(days)
      const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
        { next: { revalidate: 300 } }
      )
      if (!res.ok) throw new Error('Binance error')
      const rows = await res.json()
      const prices = (Array.isArray(rows) ? rows : []).map((k: any[]) => [k[0], Number(k[4])])
      return NextResponse.json({ prices })
    } catch {
      return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 })
    }
  }
}
