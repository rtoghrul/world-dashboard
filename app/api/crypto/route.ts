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
    return NextResponse.json({ error: 'Failed to fetch crypto data' }, { status: 500 })
  }
}
