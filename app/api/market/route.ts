import { NextResponse } from 'next/server'

export const revalidate = 300

export async function GET() {
  try {
    const [globalRes, fngRes] = await Promise.all([
      fetch('https://api.coingecko.com/api/v3/global', { next: { revalidate: 300 } }),
      fetch('https://api.alternative.me/fng/', { next: { revalidate: 3600 } }),
    ])

    const [globalData, fngData] = await Promise.all([
      globalRes.ok ? globalRes.json() : null,
      fngRes.ok ? fngRes.json() : null,
    ])

    return NextResponse.json({
      total_market_cap: globalData?.data?.total_market_cap?.usd ?? null,
      market_cap_change_24h: globalData?.data?.market_cap_change_percentage_24h_usd ?? null,
      total_volume: globalData?.data?.total_volume?.usd ?? null,
      btc_dominance: globalData?.data?.market_cap_percentage?.btc ?? null,
      eth_dominance: globalData?.data?.market_cap_percentage?.eth ?? null,
      active_coins: globalData?.data?.active_cryptocurrencies ?? null,
      fear_greed: fngData?.data?.[0]?.value ?? null,
      fear_greed_label: fngData?.data?.[0]?.value_classification ?? null,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 })
  }
}
