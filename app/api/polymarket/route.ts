import { NextResponse } from 'next/server'

export const revalidate = 120

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const limit = searchParams.get('limit') || '12'
  const offset = searchParams.get('offset') || '0'

  try {
    const res = await fetch(
      `https://gamma-api.polymarket.com/markets?limit=${limit}&offset=${offset}&order=volume&ascending=false&active=true&closed=false`,
      { next: { revalidate: 120 } }
    )
    if (!res.ok) throw new Error('Polymarket error')
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch Polymarket data' }, { status: 500 })
  }
}
