import { NextResponse } from 'next/server'

export const revalidate = 60

const SYMBOLS = [
  '^GSPC',   // S&P 500
  '^IXIC',   // NASDAQ
  '^DJI',    // Dow Jones
  'AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GOOG', 'META',
]

export async function GET() {
  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${SYMBOLS.join(',')}&fields=symbol,shortName,regularMarketPrice,regularMarketChangePercent,regularMarketChange,regularMarketPreviousClose`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error('Yahoo Finance error')
    const data = await res.json()
    const quotes = data?.quoteResponse?.result ?? []
    return NextResponse.json(quotes.map((q: Record<string, unknown>) => ({
      symbol: q.symbol,
      name: q.shortName,
      price: q.regularMarketPrice,
      change: q.regularMarketChange,
      changePercent: q.regularMarketChangePercent,
    })))
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 })
  }
}
