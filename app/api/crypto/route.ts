import { NextResponse } from 'next/server'

export const revalidate = 60

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get('page') || '1'
  const per_page = searchParams.get('per_page') || '20'

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${per_page}&page=${page}&sparkline=true&price_change_percentage=24h`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) throw new Error('CoinGecko error')
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    // CoinGecko free tier rate-limits (429) — fall back to CoinPaprika (keyless)
    try {
      const res = await fetch('https://api.coinpaprika.com/v1/tickers?quotes=USD', { next: { revalidate: 120 } })
      if (!res.ok) throw new Error('CoinPaprika error')
      const tickers = await res.json()
      const start = (Number(page) - 1) * Number(per_page)
      const data = (Array.isArray(tickers) ? tickers : [])
        .filter((t: any) => t.rank > 0)
        .sort((a: any, b: any) => a.rank - b.rank)
        .slice(start, start + Number(per_page))
        .map((t: any) => ({
          id: t.name?.toLowerCase().replace(/\s+/g, '-') || t.id,
          symbol: (t.symbol || '').toLowerCase(),
          name: t.name,
          image: `https://static.coinpaprika.com/coin/${t.id}/logo.png`,
          current_price: t.quotes?.USD?.price ?? 0,
          market_cap: t.quotes?.USD?.market_cap ?? 0,
          market_cap_rank: t.rank,
          price_change_percentage_24h: t.quotes?.USD?.percent_change_24h ?? 0,
          total_volume: t.quotes?.USD?.volume_24h ?? 0,
        }))
      return NextResponse.json(data)
    } catch {
      return NextResponse.json({ error: 'Failed to fetch crypto data' }, { status: 500 })
    }
  }
}
