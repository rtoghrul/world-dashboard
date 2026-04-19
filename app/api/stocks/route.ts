import { NextResponse } from 'next/server'

export const revalidate = 60

const SYMBOLS = [
  '^GSPC',
  '^IXIC',
  '^DJI',
  'AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GOOG', 'META',
]

const SHORT_NAMES: Record<string, string> = {
  '^GSPC': 'S&P 500',
  '^IXIC': 'NASDAQ',
  '^DJI': 'Dow Jones',
  'AAPL': 'Apple',
  'MSFT': 'Microsoft',
  'NVDA': 'NVIDIA',
  'TSLA': 'Tesla',
  'AMZN': 'Amazon',
  'GOOG': 'Alphabet',
  'META': 'Meta',
}

async function fetchQuote(symbol: string) {
  const encoded = encodeURIComponent(symbol)
  const res = await fetch(
    `https://query2.finance.yahoo.com/v8/finance/chart/${encoded}?range=1d&interval=1d`,
    { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 60 } }
  )
  if (!res.ok) throw new Error(`Failed: ${symbol}`)
  const data = await res.json()
  const meta = data?.chart?.result?.[0]?.meta
  if (!meta) throw new Error(`No meta: ${symbol}`)

  const price: number = meta.regularMarketPrice
  const prev: number = meta.previousClose ?? meta.chartPreviousClose ?? price
  const change = price - prev
  const changePercent = prev ? (change / prev) * 100 : 0

  return {
    symbol,
    name: SHORT_NAMES[symbol] ?? symbol,
    price,
    change,
    changePercent,
  }
}

export async function GET() {
  try {
    const results = await Promise.allSettled(SYMBOLS.map(fetchQuote))
    const quotes = results
      .filter(r => r.status === 'fulfilled')
      .map(r => (r as PromiseFulfilledResult<ReturnType<typeof fetchQuote> extends Promise<infer T> ? T : never>).value)

    return NextResponse.json(quotes)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 })
  }
}
