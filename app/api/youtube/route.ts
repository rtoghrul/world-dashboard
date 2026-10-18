import { NextResponse } from 'next/server'
import { fetchWithTimeout, clampInt } from '@/lib/http'

export const revalidate = 3600

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const regionCode = /^[A-Za-z]{2}$/.test(searchParams.get('region') || '') ? searchParams.get('region')!.toUpperCase() : 'US'
  const maxResults = String(clampInt(searchParams.get('maxResults'), 12, 1, 50))
  const category = searchParams.get('category') || ''
  const apiKey = process.env.YOUTUBE_API_KEY

  if (!apiKey) return NextResponse.json({ error: 'YouTube is not configured' }, { status: 503 })

  try {
    const params = new URLSearchParams({
      part: 'snippet,statistics',
      chart: 'mostPopular',
      regionCode,
      maxResults,
      key: apiKey,
    })

    if (category) {
      params.set('videoCategoryId', category)
    }

    const res = await fetchWithTimeout(
      `https://www.googleapis.com/youtube/v3/videos?${params.toString()}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) throw new Error('YouTube API error')
    const data = await res.json()

    const videos = (data.items || []).map((v: {
      id: string
      snippet: { title: string; channelTitle: string; thumbnails: { medium: { url: string } } }
      statistics: { viewCount: string; likeCount: string }
    }) => ({
      id: v.id,
      title: v.snippet.title,
      channel: v.snippet.channelTitle,
      thumbnail: v.snippet.thumbnails?.medium?.url,
      views: parseInt(v.statistics?.viewCount || '0'),
      likes: parseInt(v.statistics?.likeCount || '0'),
      url: `https://www.youtube.com/watch?v=${v.id}`,
    }))

    return NextResponse.json(videos)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch YouTube data' }, { status: 502 })
  }
}
