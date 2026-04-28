import { NextResponse } from 'next/server'

export const revalidate = 3600

type Item = {
  id: string
  type: string
  title: string
  originalTitle: string
  year: string
  image: string
  summary: string
  genres: string[]
  rating: number | null
  url: string
  trailerUrl: string
}

const TYPE_QUERIES: Record<string, string[]> = {
  movie: ['movie popular', 'cinema film', 'netflix movie'],
  series: ['popular tv series', 'drama series', 'netflix series'],
  cartoon: ['animation cartoon', 'kids animation', 'animated series'],
}

function stripHtml(value?: string) {
  return (value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

async function searchTvMaze(query: string, type: string) {
  try {
    const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`, { next: { revalidate: 3600 } })
    const data = await res.json()
    return (Array.isArray(data) ? data : []).map((row: any) => {
      const show = row.show
      return {
        id: `tv-${show.id}`,
        type,
        title: show.name,
        originalTitle: show.name,
        year: show.premiered ? String(show.premiered).slice(0, 4) : '',
        image: show.image?.medium || show.image?.original || '',
        summary: stripHtml(show.summary),
        genres: show.genres || [],
        rating: show.rating?.average || null,
        url: show.officialSite || show.url,
        trailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(show.name + ' official trailer')}`,
      } as Item
    })
  } catch {
    return []
  }
}

async function translate(texts: string[], lang: string) {
  if (!lang || lang === 'en' || texts.length === 0) return texts
  try {
    const res = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' + lang + '&dt=t&q=' + encodeURIComponent(texts.join('\n---\n')))
    const data = await res.json()
    const joined = data?.[0]?.map((x: any) => x?.[0]).join('') || texts.join('\n---\n')
    return joined.split('\n---\n')
  } catch {
    return texts
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'movie'
  const genre = searchParams.get('genre') || ''
  const lang = searchParams.get('lang') || 'en'
  const query = searchParams.get('q') || ''
  const queries = query ? [query] : (TYPE_QUERIES[type] || TYPE_QUERIES.movie)

  const results = (await Promise.all(queries.map(q => searchTvMaze(q, type)))).flat()
  const map = new Map<string, Item>()
  results.forEach(item => map.set(item.id, item))
  let items = Array.from(map.values()).filter(item => item.image)

  if (type === 'cartoon') {
    items = items.filter(item => item.genres.some(g => /animation|children|family|fantasy|comedy/i.test(g)) || /animation|cartoon|kid|child/i.test(item.summary + item.title))
  }
  if (genre) {
    items = items.filter(item => item.genres.some(g => g.toLowerCase() === genre.toLowerCase()))
  }

  items = items.slice(0, 18)

  if (lang !== 'en' && items.length) {
    const titles = await translate(items.map(i => i.title), lang)
    const summaries = await translate(items.map(i => i.summary || ''), lang)
    items = items.map((item, index) => ({ ...item, title: titles[index] || item.title, summary: summaries[index] || item.summary }))
  }

  return NextResponse.json(items)
}
