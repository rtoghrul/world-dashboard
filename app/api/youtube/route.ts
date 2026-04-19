import { NextResponse } from 'next/server'

export const revalidate = 3600

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const regionCode = searchParams.get('region') || 'US'
  const maxResults = searchParams.get('maxResults') || '12'
  const category = searchParams.get('category') || ''
  const apiKey = process.env.YOUTUBE_API_KEY

  if (!apiKey) return NextResponse.json({ error: 'No API key' }, { status: 500 })

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

    const res = await fetch(
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
    return NextResponse.json({ error: 'Failed to fetch YouTube data' }, { status: 500 })
  }
}
