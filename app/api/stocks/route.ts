import { NextResponse } from 'next/server'
import { STOCK_GROUPS } from '@/lib/stockGroups'

export const revalidate = 60

const SHORT_NAMES: Record<string, string> = {
  '^GSPC': 'S&P 500', '^IXIC': 'NASDAQ', '^DJI': 'Dow Jones', '^RUT': 'Russell 2000',
  '^VIX': 'VIX', '^FTSE': 'FTSE 100', '^GDAXI': 'DAX', '^N225': 'Nikkei 225',
  'AAPL': 'Apple', 'MSFT': 'Microsoft', 'NVDA': 'NVIDIA', 'GOOG': 'Alphabet',
  'META': 'Meta', 'AMZN': 'Amazon', 'AMD': 'AMD', 'INTC': 'Intel',
  'CRM': 'Salesforce', 'ORCL': 'Oracle', 'NFLX': 'Netflix', 'ADBE': 'Adobe',
  'JPM': 'JPMorgan', 'BAC': 'Bank of America', 'GS': 'Goldman Sachs',
  'MS': 'Morgan Stanley', 'WFC': 'Wells Fargo', 'C': 'Citigroup',
  'BLK': 'BlackRock', 'V': 'Visa', 'MA': 'Mastercard', 'PYPL': 'PayPal',
  'TSLA': 'Tesla', 'RIVN': 'Rivian', 'NIO': 'NIO', 'XOM': 'ExxonMobil',
  'CVX': 'Chevron', 'ENPH': 'Enphase', 'NEE': 'NextEra Energy', 'BE': 'Bloom Energy',
  'COIN': 'Coinbase', 'MSTR': 'MicroStrategy', 'MARA': 'MARA Holdings',
  'RIOT': 'Riot Platforms', 'HUT': 'Hut 8', 'SQ': 'Block (SQ)',
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
  return { symbol, name: SHORT_NAMES[symbol] ?? symbol, price, change, changePercent }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const group = searchParams.get('group')
  const symbols = group && STOCK_GROUPS[group]
    ? STOCK_GROUPS[group].symbols
    : [...STOCK_GROUPS.indices.symbols, ...STOCK_GROUPS.tech.symbols]

  try {
    const results = await Promise.allSettled(symbols.map(fetchQuote))
    const quotes = results
      .filter(r => r.status === 'fulfilled')
      .map(r => (r as PromiseFulfilledResult<Awaited<ReturnType<typeof fetchQuote>>>).value)
    return NextResponse.json(quotes)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 })
  }
}
